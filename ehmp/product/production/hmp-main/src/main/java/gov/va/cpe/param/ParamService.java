package gov.va.cpe.param;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.ImmutableMap;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.vistasvc.CacheMgr;
import gov.va.cpe.vpr.vistasvc.CacheMgr.CacheType;
import gov.va.cpe.vpr.vistasvc.ICacheMgr;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.CPRSDateTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.MSCUIDateTimePrinterSet;
import gov.va.hmp.healthtime.SortableDateTimePrinterSet;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponseExtractionException;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.CONTROLLER_RPC_URI;

/**
 * TODO: finish the system-level parameters.
 * TODO: mash system and user level parameters togeather? (if a user value doesn't exist, then default to system level)?
 * TODO: support looking up values for user other than the current user.
 */
@Service
public class ParamService implements IParamService {

    public static final String GET_PARAM_COMMAND = "getParam";
    public static final String GET_ALL_PARAMS_COMMAND = "getAllParam";
    public static final String SAVE_PARAM_BY_UID_COMMAND = "saveParamByUid";
    public static final String CLEAR_PARAM_COMMAND = "clearParam";

    private static final String ENTITY_USR = "USR";
	private static final String ENTITY_SYS = "SYS";
    static final String VPR_USER_PREF = "HMP USER PREF";

    @Autowired
	protected RpcOperations rpcTemplate;

	@Autowired
	protected UserContext userContext;

	protected ICacheMgr<String> cache = new CacheMgr<String>("ParamCache", CacheType.SESSION_MEMORY);

	// Get/fetch functions ----------------------------------------------------


    @Override
    public Map getUserPreferences() {
        return getUserParamMap(VPR_USER_PREF, null);
    }

    @Override
    public Object getUserPreference(String key) {
        Map userPrefs = getUserPreferences();
        if (userPrefs == null) return null;
        return userPrefs.get(key);
    }

    @Override
    public void setUserPreference(String key, Object val) {
        setUserParamVal(VPR_USER_PREF, null, key, val);
    }

	@Override
    public String getUserParam(String id) {
		return getUserParam(id, null);
	}

	@Override
    public Object getUserParamVal(String id, String key) {
		return getUserParamVal(id, key, null);
	}

	@Override
    public Object getUserParamVal(String id, String key, String instance) {
		Map<String, ?> map = getUserParamMap(id, instance);
		if (map == null || !map.containsKey(key)) {
			return null;
		}
		return map.get(key);
	}

	/**
	 * Returns the user parameter.  Assumes its stored as a JSON document.
	 * 
	 * @param id The name of the parameter to fetch
	 * @param instance The instance of the parameter, may be null for default (0)
	 * @return Returns a map of all the parameters values, or null if it doesn't exist.
	 */
	public Map<String, Object> getUserParamMap(String id, String instance) {
		String val = getUserParam(id, instance);
		if (val == null || val.length() == 0) {
			return null;
		}
		return POMUtils.parseJSONtoMap(val);
	}


	@Override
    public String getUserParam(String id, String instance) {
		if (userContext.getCurrentUser() == null) {
			// anonymous user, return null
			return null;
		}


		String uid = getUid(id, instance, ENTITY_USR);
		String val = cache.fetch(uid);
		if (val == null) {
			Map<String, String> params = new HashMap<String,String>();
			params.put("command", GET_PARAM_COMMAND);
			params.put("uid", uid);
			val = rpcTemplate.executeForString(CONTROLLER_RPC_URI, params);
			if (val != null && val.length() > 0) {
				cache.store(uid, val);
			} else {
				val = null;
			}
		}
		return val;
	}

	public String getSystemParam(String id, String instance) {
		throw new UnsupportedOperationException();
	}

	// set/Store functions ----------------------------------------------------

	/**
	 * Sets the value of the user parameter, replaces any existing value.
	 *
	 * @param id The name of the parameter to set
	 * @param inst The name of the instance to update, if null then updates the default instance(0)
	 * @param value The value to set.
	 */
	public void setUserParam(String id, String inst, String value) {
		String uid = getUid(id, inst, ENTITY_USR);

		Map<String, Object> params = new HashMap<String,Object>();
		params.put("command", SAVE_PARAM_BY_UID_COMMAND);
		params.put("uid", uid);
		params.put("value", VistaStringUtils.splitLargeStringIfNecessary(value));
		
		rpcTemplate.executeForString(CONTROLLER_RPC_URI, params);
		cache.store(uid, value);
	}

	public void setUserParamVal(String id, String inst, String key, Object val) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put(key, val);
		setUserParamVals(id, inst, map);
	}


	@Override
    public void setUserParamVals(String id, String inst, Map<String, Object> vals) {
		Map<String, Object> map = getUserParamMap(id, inst);
		if (map == null) {
			map = vals;
		} else {
			map.putAll(vals);
		}

		setUserParam(id, inst, POMUtils.toJSON(map));
	}

    public void setSystemParam(String id, String inst, String value) {
		throw new UnsupportedOperationException();
	}

	// misc functions ---------------------------------------------------------

	public String getUserParamUid(String id, String inst) {
		return getUid(id, inst, ENTITY_USR);
	}

    @Override
    public String getUserPreferencesParamUid() {
        return getUserParamUid(VPR_USER_PREF, null);
    }

    public String getSystemUID(String id, String inst) {
		return getUid(id, inst, ENTITY_SYS);
	}

	/**
	 * URN format for user param is "urn:va:param:{vistaID}:{user DUZ}:{PARAM NAME}:{instance ID}
	 * URN format for system param is "urn:va:param:{vistaID}:SYS:{PARAM NAME}:{instance ID}
	 * 	
	 * Instance ID defaults to 0 if not specified, entity defaults to user if not specified
	 */
	protected String getUid(String paramId, String inst, String entity) {
		HmpUserDetails user = userContext.getCurrentUser();
		String vistaId = (user != null) ? user.getVistaId() : null;
		String instance = (inst == null) ? "0" : inst;
		if (entity == null || entity.equals(ENTITY_USR)) {
			entity = (user != null) ? user.getDUZ() : null;
		} else if (!entity.equals(ENTITY_SYS)) {
			throw new IllegalArgumentException("Unrecognized parameter entity: " + entity);
		}
		return "urn:va:param:" + vistaId + ':' + entity + ':' + paramId + ':' + instance;
	}

	/**
	 * Returns just a list of the unique param ID's (not the full URN) for this user.
	 */
	public String[] getUserParamIDs() {
		List<String> all = listUserParams();
		Set<String> ret = new HashSet<String>();
		for (String s : all) {
			String[] parts = s.split(":");
			ret.add(parts[5]);
		}
		return ret.toArray(new String[0]);
	}


	@Override
    public List<String> getUserParamInstanceIDs(String id) {
		List<String> all = listUserParams();
		List<String> ret = new ArrayList<String>();
		for (String uid : all) {
			if (uid.contains(":" + id + ":")) {
				String[] parts = uid.split(":");
				ret.add(parts[6]);
			}
		}
		return ret;
	}

	/**
	 * Lists all the URN's of all the users params and param instances
	 * @return
	 */
	public List<String> listUserParams() {
		HmpUserDetails user = userContext.getCurrentUser();
		String duz = (user != null) ? user.getDUZ() : null;

		Map<String, Object> params = new HashMap<String,Object>();
		params.put("command", GET_ALL_PARAMS_COMMAND);
		params.put("entity", "USR");
		params.put("entityId", duz);
		params.put("getValues", true);
		// TODO: cache this
        ArrayList<String> ret = new ArrayList<String>();
        try {
            JsonNode data = rpcTemplate.executeForJson(CONTROLLER_RPC_URI, params);
            data = data.get("params");
           for (int i = 0; i < data.size(); i++) {
                JsonNode val = data.get(i);
                ret.add(val.get("uid").asText());
            }
        } catch (RpcResponseExtractionException e) { // params were probably blank, so JSON couldn't be constructed
            // NOOP
        }
		return ret;
	}

	@Override
    public void clearUserParam(String id, String inst) {
		String uid = getUid(id, inst, ENTITY_USR);
		cache.remove(uid);
		Map<String, String> params = new HashMap<String,String>();
		params.put("command", CLEAR_PARAM_COMMAND);

		params.put("uid", uid);
		rpcTemplate.executeForString(CONTROLLER_RPC_URI, params);
	}

    void clearCache() {
        cache.removeAll();
    }
}
