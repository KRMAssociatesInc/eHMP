package us.vistacore.vxsync.term.load.hmp;


import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import us.vistacore.vxsync.term.load.hmp.CacheMgr.CacheType;

public class SettingsCache {
	
	private static SettingsCache defacto = null;
	private UUID id = UUID.randomUUID();
	private Map<CacheType, Map<String, Object>> attributeStore = new HashMap<CacheType, Map<String, Object>>();

	public String getSessionId(){
		return id.toString();
	}
	
	public String[] getAttributeNames(CacheType type) {
		Map<String, Object> map = getCacheTypeAttributes(type, true);
		String[] keys = new String[map.size()];
		map.keySet().toArray(keys);
		return keys;
	}
	
	public Object getAttribute(String name, CacheType type) {
		return getCacheTypeAttributes(type, true).get(name);
	}
	
	public void setAttribute(String name, Object value, CacheType scope) {
		getCacheTypeAttributes(scope, true).put(name, value);
	}
	
	public void removeAttribute(String name, CacheType scope) {
		Map<String, Object> cache = getCacheTypeAttributes(scope,false);
		if(cache != null) {
			cache.remove(name);
		}
	}
	
	public static SettingsCache getDefaultAttributes() {
		if(defacto == null) {
			defacto = new SettingsCache();
		}
		return defacto;
	}
	
	private Map<String, Object> getCacheTypeAttributes(CacheType type, boolean create) {
		if(!attributeStore.containsKey(type) && create) {
			Map<String, Object> typeMap = new HashMap<String, Object>();
			attributeStore.put(type, typeMap);
		}
		return attributeStore.get(type);
	}
}
