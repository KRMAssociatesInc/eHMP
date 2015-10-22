package us.vistacore.vxsync.term.load.hmp;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.management.ManagementService;

import org.h2.mvstore.MVMap;
import org.h2.mvstore.MVStore;

import javax.management.MBeanServer;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.util.*;

/**
 * Simple cache utility for storing data in session, request, application scopes or on disk.
 * 
 * For session, request, its stored in the current session (throws an error if there is none)
 * 
 * For application and disk, uses EHCache for for storage.
 * 
 * 2 usage methods:
 * 
 * 1) Use the static methods CacheMgr.store() and CacheMgr.fetch() to fetch/store any cached value
 * - Always returns Objects
 * - Forces you to specify the cache namespace/type for each call
 * 2) create a new instance of CacheMgr (CacheMgr mycache = new CacheMgr<Patient>("PatientCache", CacheType.SESSION))
 * - Generified, so you don't have to do any casting
 * - targeted at one cache namespace/type, much more simple store()/fetch() methods.
 * 
 * Goals:
 * - High performance/throughput (millions of calls/sec)
 * - 
 * 
 * TODO: add some stats collection, add a MBean interface
 * TODO: should probably work on deprecating the static store() and fetch() methods.
 */
public class CacheMgr<T> implements ICacheMgr<T>, Iterable<String> {
	public enum CacheType {
		/**
		 * Stores items as session variables, they are user specific and are lost after the session expires
		 */
		SESSION,

		/**
		 * Stores items as request variables, they are user specific and are lost at the end of the request
		 */
		REQUEST,  

		/**
		 * Similar to application scope variables, stored in memory, shared by all users and are lost when
		 * the server/app is restarted.
		 */
		MEMORY,

		/**
		 * Disk-persisted scope, shared by all users and is durable to disk so it can survive restarts.
		 */
		DISK,
		
		/**
		 * Custom EHCache policy defined in ehcache.xml, throws an error if cacheName is not defined in ehcache.xml
		 */
		CUSTOM,
		
		/**
		 * Same as session, but backed by EHCache instead of session scoped variables.  
		 * Will likely replace SESSION soon.
		 */
		SESSION_MEMORY {@Override
		public String getCacheName(String name) {
			SettingsCache attr = getRequestAttrs();
			return attr.getSessionId() + ":" + name;
		}},
		
		/**
		 * Items are not cached at all, fetch() always returns null
		 */
		NONE,
		
		/**
		 * Uses early release of new H2 key/value storage engine called MVStore.
		 * Disk-persistant, globally shared.  Seems to be a much simplier version of EHCache.
		 */
		MVSTORE;
		
		public String getCacheName(String name) {
			return name;
		}
	}

    // package private so that it can be set in tests
	static File MVSTORE_FILE;

	private static Map<String,MVMap<String,Object>> MVMAPS = new HashMap<>();
	private static CacheManager MANAGER;
	private static Map<String, MVStore> MVSTORES = new HashMap<>();
	 
	private String cacheName;
	private CacheType type;
	
	/**
	 * Creates a new cache manager for working with the specified cache namespace.
	 * 
	 * If CacheType is APPLICATION or DISK, then it will create a new EHCache cache
	 * named cacheName if it does not already exist.  You can fine-tune the cache
	 * properties by creating an entry with the same name in ehcache.xml
	 */
	public CacheMgr(String cacheName, CacheType type) {
		this.cacheName = cacheName;
		this.type = type;
	}
	
	/** 
	 * Implies CacheType == CacheType.MVSTORE, but you can use CacheMgr.createMVStore(...) 
	 * or create your own custom MVStore. 
	 * 
	 * Only the cache named <pre>cacheName</pre> will use this store.
	 */
	public CacheMgr(String cacheName, MVStore store) {
		this.cacheName = cacheName;
		this.type = CacheType.MVSTORE;
		MVSTORES.put(cacheName, store);
	}
	
	/**
	 * Creates a new cache manager (using EHCache) for working with the specified cache namespace.
	 * 
	 * CacheName must exist in ehcache.xml
	 * 
	 * @param cacheName
	 */
	public CacheMgr(String cacheName) {
		this.cacheName = cacheName;
		this.type = CacheType.CUSTOM;
	}
	
	public CacheType getType() {
		return this.type;
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#storeUnlessNull(java.lang.String, T)
	 */
	@Override
	public T storeUnlessNull(String key, T val) {
		if (key != null && val != null) {
			return store(key, val);
		}
		return null;
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#store(java.lang.String, T)
	 */
	@Override
	public T store(String key, T val) {
		return (T) store(this.type.getCacheName(this.cacheName), key, val, this.type, -1);
	}

	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#store(java.lang.String, T, int)
	 */
	@Override
	public T store(String key, T val, int ttlSec) {
		return (T) store(this.type.getCacheName(this.cacheName), key, val, this.type, ttlSec);
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#fetch(java.lang.String)
	 */
	@Override
	public T fetch(String key) {
		return (T) fetch(this.type.getCacheName(this.cacheName), key, this.type);
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#contains(java.lang.String)
	 */
	@Override
	public boolean contains(String key) {
		return contains(this.type.getCacheName(this.cacheName), key, this.type);
	}
	
	public void flush() {
		flush(this.type.getCacheName(this.cacheName), this.type);
	}
	
	public Iterator<String> iterator() {
		return iterate(this.type.getCacheName(this.cacheName), this.type);
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#getSize()
	 */
	@Override
	public int getSize() {
		return getSize(this.type.getCacheName(this.cacheName), this.type);
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#remove(java.lang.String)
	 */
	@Override
	public void remove(String... keys) {
		for (String key : keys) {
			if (key != null) {
				remove(this.type.getCacheName(this.cacheName), key, this.type);
			}
		}
	}
	
	/* (non-Javadoc)
	 * @see gov.va.cpe.vpr.vistasvc.ICacheMgr#removeAll()
	 */
	@Override
	public void removeAll() {
		clearCache(this.type.getCacheName(this.cacheName), this.type);
	}
	
	@Override
	public void close() {
		close(this.type.getCacheName(this.cacheName), this.type);
	}
	
	// static helper methods -------------------------------------------
	
	protected static SettingsCache getRequestAttrs() {
		return SettingsCache.getDefaultAttributes();
	}
	
	/** Returns the opened MVMap from the appropriate MVStore for the specifed cacheName.  Creates it if needed */
	public synchronized static MVMap<String, Object> getMVMap(String cacheName) {
		MVMap<String, Object> ret = MVMAPS.get(cacheName);
		if (ret == null) {
			MVMAPS.put(cacheName, ret = getMVStore(cacheName).openMap(cacheName));
		}
		return ret;
	}
	
	/** returns the MVStore for the specified cacheName.  Creates one in CACHE_DIR if needed */
	public synchronized static MVStore getMVStore(String cacheName) {
		MVStore ret = MVSTORES.get(cacheName);
		// if no store exists for this specific cacheName, use the default (NULL)
		if (ret == null && cacheName != null) {
			ret = MVSTORES.get(null);
		}
		
		// if no default exists, create it
		if (ret == null) {
			// lazy-init cache file
			try {
				if (MVSTORE_FILE == null) MVSTORE_FILE = File.createTempFile("CacheMgr", ".data");
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
	     	MVSTORES.put(null, ret = createMVStore(MVSTORE_FILE));
		}
     	return ret;
	}
	
	/** Create/initalize a default MVStore in the specified directory 
	 * @throws IOException */
	public synchronized static MVStore createMVStore(File cacheFile) {
     	return new MVStore.Builder().fileName(cacheFile.getAbsolutePath()).cacheSize(20).compress().open();
	}
	
	public synchronized static CacheManager getEHCacheManager() {
		// lazy-init
		if (MANAGER == null) {
			MANAGER = CacheManager.create();
			
	        // register MBean
			MBeanServer mBeanServer = ManagementFactory.getPlatformMBeanServer();
			ManagementService.registerMBeans(MANAGER, mBeanServer, true, true, true, true);
		}
		return MANAGER;
	}
	private synchronized static Cache getEHCache(String cacheName, CacheType type) {
		CacheManager mgr = getEHCacheManager();
		cacheName = type.getCacheName(cacheName);
		Cache ret = mgr.getCache(cacheName);
		if (ret == null) {
			// create new cache by cloning from the appropriate cache
			CacheConfiguration config = null;
			if (type == CacheType.CUSTOM) {
				throw new IllegalStateException("CacheName: " + cacheName + ", does not exist in ehcache.xml");
			} else if (type == CacheType.SESSION_MEMORY) {
				config = mgr.getCache("CacheMgrSess").getCacheConfiguration().clone();
			} else if (type == CacheType.DISK) {
				config = mgr.getCache("CacheMgrDisk").getCacheConfiguration().clone();
			} else {
				config = mgr.getCache("CacheMgrMem").getCacheConfiguration().clone();
			}
			config.setName(cacheName);
			ret = new Cache(config);
			mgr.addCache(ret);
		}
		return ret;
	}
	
	// static methods -------------------------------
	
	public static Iterator<String> iterate(String cacheName, CacheType type) {
		if (cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			return Arrays.asList(attr.getAttributeNames(type)).iterator();
		} else if (type == CacheType.MVSTORE) {
			MVMap<String, Object> map = getMVMap(cacheName);
			return map.keyList().iterator();
		} else {
			Cache cache = getEHCache(cacheName, type);
			if (cache != null) return cache.getKeys().iterator();
		}
		return new ArrayList<String>().iterator();
	}
	
	public static Object fetch(String cacheName, String key, CacheType type) {
		if (key == null || cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.NONE) {
			return null;
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			Map<String, Object> cachedVals = (Map<String, Object>) attr.getAttribute(cacheName, type);
			if (cachedVals != null) {
				Long expiresAt = (Long) cachedVals.get(key + "_EXPIRESAT");
				if (expiresAt == null || System.currentTimeMillis() < expiresAt) {
					return cachedVals.get(key);
				}
			}
		} else if (type == CacheType.MVSTORE) {
			MVMap<String, Object> map = getMVMap(cacheName);
			Long expiresAt = (Long) map.get(key + "_EXPIRESAT");
			if (expiresAt == null || System.currentTimeMillis() < expiresAt) {
				return map.get(key);
			}
		} else {
			Cache cache = getEHCache(cacheName, type);
			Element e = cache.get(key);
			return ((e != null) ? e.getObjectValue() : null);
		}
		return null; // not found
	}
	
	public static Object store(String cacheName, String key, Object val, CacheType type) {
		return store(cacheName, key, val, type, -1);
	}
	
	public static Object store(String cacheName, String key, Object val, CacheType type, int ttlSec) {
		if (key == null || cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.NONE) {
			return val;
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			Map<String, Object> cachedVals = (Map<String, Object>) attr.getAttribute(cacheName, type);
			if (cachedVals == null) {
				cachedVals = new WeakHashMap<String, Object>();
			}
			
			cachedVals.put(key, val);
			if (ttlSec > 0) {
				cachedVals.put(key + "_EXPIRESAT", System.currentTimeMillis() + (ttlSec * 1000));
			}
			attr.setAttribute(cacheName, cachedVals, type);
		} else if (type == CacheType.MVSTORE) {
			MVMap<String, Object> map = getMVMap(cacheName);
			map.put(key, val);
			if (ttlSec > 0) {
				map.put(key + "_EXPIRESAT", System.currentTimeMillis() + (ttlSec * 1000));
			}
		} else {
			Cache cache = getEHCache(cacheName, type);
			Element e = new Element(key, val);
			if (ttlSec > 0) {
				e.setTimeToLive(ttlSec);
			}
			cache.put(e);
		}
		return val;
	}
	
	/**
	 * Pushes changes (commit/flush) to the underlying storage.  Not all CacheTypes have any flush() mechanism
	 * (session vars, application vars, etc.).
	 * 
	 * Sometimes this can affect other caches besides the specified cache as well.
	 */
	public static void flush(String cacheName, CacheType type) {
		if (cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.MVSTORE) {
			getMVStore(cacheName).commit();
		} else {
			getEHCache(cacheName, type).flush();
		}
	}
	
	public static boolean contains(String cacheName, String key, CacheType type) {
		if (key == null || cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.NONE) {
			return false;
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			Map<String, Object> cachedVals = (Map<String, Object>) attr.getAttribute(cacheName, type);
			return (cachedVals != null && cachedVals.containsKey(key));
		} else if (type == CacheType.MVSTORE) {
			return getMVMap(cacheName).containsKey(key);
		} else {
			Cache cache = getEHCache(cacheName, type);
			return cache.isKeyInCache(key);
		}
	}
	
	public static int getSize(String cacheName, CacheType type) {
		if (cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.NONE) {
			return 0;
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			Map<String, Object> cachedVals = (Map<String, Object>) attr.getAttribute(cacheName, type);
			return (cachedVals == null) ? 0 : cachedVals.size();
		} else if (type == CacheType.MVSTORE) {
			return getMVMap(cacheName).size();
		} else {
			Cache cache = getEHCache(cacheName, type);
			return cache.getKeysNoDuplicateCheck().size();
		}
	}
	
	public static void removeAny(String cacheName, String key) {
		remove(cacheName, key, CacheType.REQUEST);
		remove(cacheName, key, CacheType.SESSION);
		remove(cacheName, key, CacheType.MEMORY);
		remove(cacheName, key, CacheType.DISK);
		remove(cacheName, key, CacheType.MVSTORE);
	}
	
	public static void remove(String cacheName, String key, CacheType type) {
		if (key == null || cacheName == null) {
			throw new NullPointerException("CacheName + Key cannot be null");
		} else if (type == CacheType.NONE) {
			return;
		} else if (type == CacheType.REQUEST || type == CacheType.SESSION) {
			SettingsCache attr = getRequestAttrs();
			Map<String, Object> cachedVals = (Map<String, Object>) attr.getAttribute(cacheName, type);
			if (cachedVals == null) {
				return;
			}
			cachedVals.remove(key);
			attr.setAttribute(cacheName, cachedVals, type);
		} else if (type == CacheType.MVSTORE) {
			getMVMap(cacheName).remove(key);
		} else {
			Cache cache = getEHCache(cacheName, type);
			cache.remove(key);
		}
	}
	
	public synchronized static void close(String cacheName, CacheType type) {
		if (cacheName == null) {
			throw new NullPointerException("CacheName cannot be null");
		} else if (type == CacheType.NONE) {
		} else if (type == CacheType.REQUEST) {
		} else if (type == CacheType.SESSION) {
		} else if (type == CacheType.MVSTORE) {
			getMVStore(cacheName).close();
			MVMAPS.remove(cacheName);
		} else {
			getEHCache(cacheName, type).removeAll();
		}
	}
	
	
	public synchronized static void clearCache(String cacheName, CacheType type) {
		if (cacheName == null) {
			throw new NullPointerException("CacheName cannot be null");
		} else if (type == CacheType.NONE) {
			return;
		} else if (type == CacheType.REQUEST) {
			getRequestAttrs().removeAttribute(cacheName, type);
		} else if (type == CacheType.SESSION) {
			getRequestAttrs().removeAttribute(cacheName, type);
		} else if (type == CacheType.MVSTORE) {
			getMVMap(cacheName).clear();
		} else {
			getEHCache(cacheName, type).removeAll();
		}
	}
	
	public synchronized static void clearCaches(String cacheName) {
		clearCache(cacheName, CacheType.REQUEST);
		clearCache(cacheName, CacheType.SESSION);
		clearCache(cacheName, CacheType.MEMORY);
		clearCache(cacheName, CacheType.DISK);
		clearCache(cacheName, CacheType.MVSTORE);
	}
}
