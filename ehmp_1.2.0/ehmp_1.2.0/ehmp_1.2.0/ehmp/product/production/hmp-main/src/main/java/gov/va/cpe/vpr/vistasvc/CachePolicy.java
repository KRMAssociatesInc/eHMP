package gov.va.cpe.vpr.vistasvc;

import gov.va.cpe.vpr.vistasvc.CacheMgr.CacheType;

import java.util.Date;


/**
 * TODO: could morph the VistAService.isOnline() method into CachePolicy.isApplicable()/isActive()/useAlternative()?
 * 
 * CachePolicy defines how cache is stored (per user, per system, etc.)
 * CachePolicy defines the following aspects:
 * - How the cache is stored (per-user, per-system, etc);
 * - How long the cached value(s) are good for.
 * - If no data can be found/fetched, CachePolicy's can be chained togeather to gracefully degrade.
 * 
 * - it is expected that applications will create/define a CachePolicy 
 * 
 * 
 * TODO: should the application policy use EHCache as well (so it can more carefully define memory usage?)
 * 
 * @author brian
 */
public class CachePolicy {
	// TODO: Get this to throw an error all the time?
	public static CachePolicy OFFLINE_ERROR = new CachePolicy(CacheType.NONE, 0);
	public static CachePolicy NO_CACHE = new CachePolicy(CacheType.NONE, 0);
	
	public CacheType cache = CacheType.NONE;
	public int ttl = 60 * 1000; // 60 seconds
	public CachePolicy offlinePolicy = OFFLINE_ERROR;
	
	boolean fetchPermitStale = false; // true to permit fetch to return stale data (if it exists); typically used for a backup/offline policy
	boolean fetchExceptionOnNull = false; // true to have the cache throw an exception when no cached value is found; typically used for a backup/offline policy 
	
	boolean storeQueue = false; // true to permit queuing so this gets stored when you are next connected to vista.  Implies async=true
	boolean storeAsync = false; // true to return right away before confirming the store command worked. 
	boolean primeOnStore = true; // if false, put/store will not also write to cache (implies cache wont be primed until the next load attempt)

	// TODO: Maybe have a default value?
	// TODO: Maybe have a flag for ErrorOnNotFOund?
	
	public CachePolicy(CacheType type, int ttlmillis) {
		this.cache = type;
		this.ttl = ttlmillis;
	}
	
	public long getExpireAt() {
		return new Date().getTime() + ttl;
	}
}