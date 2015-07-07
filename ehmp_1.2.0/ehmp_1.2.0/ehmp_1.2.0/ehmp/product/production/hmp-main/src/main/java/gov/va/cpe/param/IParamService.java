package gov.va.cpe.param;

import java.util.List;
import java.util.Map;

/**
 * This is a general purpose interface to fetch/store/retrive user parameters to/from VISTA.
 *
 * The values are cached so you should be able to fetch/store values efficiently w/o excessive RPC traffic.
 *
 * Currently only supports user-specific parameters.
 *
 * Has some helpful functionality for dealing with parameters stored as key/value pairs in JSON, but does
 * not force you to store all parameters as JSON.
 *
 *
 *
 * @author Brian Bray
 */
public interface IParamService {
    Object getUserPreference(String key);
    void setUserPreference(String key, Object val);
    Map<String, Object> getUserPreferences();

    /**
     * Same as getUserParam(id, null);
     */
    String getUserParam(String id);

    /**
     * Returns the user parameter.  Assumes nothing about what format the parameter is in (JSON, XML, etc.)
     *
     * @param id The name of the parameter to fetch
     * @param instance The instance of the parameter, may be null for default (0)
     * @return Returns a string of the parameters value, or null if it doesn't exist.
     */
    String getUserParam(String id, String instance);

    Object getUserParamVal(String id, String key);

    /**
     * Returns a specific key from the specified user parameter.  Assumes the parameter is stored as a JSON document.
     *
     * @param id The name of the parameter to fetch
     * @param key The name of the parameter key to return
     * @param instance The instance of the parameter, may be null for default (0)
     * @return Returns the key's value, or null if the param or key doesn't exist.
     */
    Object getUserParamVal(String id, String key, String instance);

    /**
     * Sets/merges/updates the parameter with the key/values specified.  Assumes that the parameter is a JSON document.
     *
     * If this is the first time a value is set in the specified param, it will be created.
     *
     * @param id The name of the parameter to set
     * @param inst The name of the instance to update, if null then updates the default instance(0)
     * @param vals Updates/replaces the existing values with these values
     */
    void setUserParamVals(String id, String inst, Map<String, Object> vals);

    /**
     * Returns a list of all the unique instance ID's (not the full URN) for a
     * specific parameter ID for the current user.
     */
    List<String> getUserParamInstanceIDs(String id);

    /**
     * Clears/deletes the specified user parameter including all of its instances
     *
     * @param id The name of the user param to delete.
     */
    void clearUserParam(String id, String inst);

    String getUserPreferencesParamUid();
	String getUserParamUid(String vprUserPref, String inst);

}
