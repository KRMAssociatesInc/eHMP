package gov.va.hmp.vista.springframework.security.userdetails.memory;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Map;

import static gov.va.hmp.vista.util.RpcUriUtils.ACCESS_VERIFY_CODE_DELIMITER;
import static gov.va.hmp.vista.util.RpcUriUtils.DIVISION_CREDENTIALS_DELIMITER;

public class VistaUserMap {

    private static final Logger logger = LoggerFactory.getLogger(VistaUserMap.class);
    private Map<String, VistaUserDetails> userMap = new HashMap<String, VistaUserDetails>();

    public void addUser(VistaUserDetails user) throws IllegalArgumentException {
        Assert.notNull(user, "Must be a valid User");

        logger.info("Adding user [" + getKey(user) + "]");
        this.userMap.put(getKey(user), user);
    }

    public VistaUserDetails getUser(String vistaId, String division, String accessCode, String verifyCode) throws UsernameNotFoundException {
        String key = getKey(division, accessCode, verifyCode);
        VistaUserDetails result = (VistaUserDetails) this.userMap.get(key);

        if (result == null) {
            throw new UsernameNotFoundException("Could not find user for division '" + division + "', access code '" + accessCode + "'");
        }

        return result;
    }

    public VistaUserDetails getUser(String vistaId, String division, String appHandle) throws UsernameNotFoundException {
        String key = getKey(division, appHandle);
        VistaUserDetails result = (VistaUserDetails) this.userMap.get(key);

        if (result == null) {
            throw new UsernameNotFoundException("Could not find user for division '" + division + "', app handle '" + appHandle + "'");
        }

        return result;
    }

    private String getKey(VistaUserDetails user) {
        return (user.getDivision() + DIVISION_CREDENTIALS_DELIMITER + user.getPassword()).toUpperCase();
    }

    private String getKey(String stationNumber, String accessCode, String verifyCode) {
        return (stationNumber + DIVISION_CREDENTIALS_DELIMITER + accessCode + ACCESS_VERIFY_CODE_DELIMITER + verifyCode).toUpperCase();
    }

    private String getKey(String stationNumber, String appHandle) {
        return (stationNumber + DIVISION_CREDENTIALS_DELIMITER + appHandle).toUpperCase();
    }

    public int getUserCount() {
        return this.userMap.size();
    }

    public void setUsers(Map<String, VistaUserDetails> users) {
        this.userMap = users;
    }
}