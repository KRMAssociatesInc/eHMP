package us.vistacore.vxsync.term.load.hmp;

public interface ICacheMgr<T> {

	public abstract T storeUnlessNull(String key, T val);

	public abstract T store(String key, T val);

	/**
	 * Store something in cache with the specified key and value for the specified time
	 * 
	 * @param key Key to store the value under
	 * @param val Value to store
	 * @param ttlSec How long until it expires if > 0, forever is <= 0.  Overrides the default TTL (if any) specified in ehcache.xml
	 * @return Cached value (or null if it doesnt exist)
	 */
	public abstract T store(String key, T val, int ttlSec);

	public abstract T fetch(String key);

	public abstract boolean contains(String key);
	public abstract int getSize();
	public abstract void remove(String... keys);
	public abstract void removeAll();
	public abstract void close();

}