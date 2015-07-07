package gov.va.hmp.vista.springframework.security.userdetails.memory;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetailsService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.util.Assert;

public class InMemoryDaoImpl implements VistaUserDetailsService, InitializingBean {

    private VistaUserMap userMap;

    public void afterPropertiesSet() throws Exception {
        Assert.notNull(this.userMap,
                "A list of user duz, station numbers, access/verify codes, enabled/disabled status and their granted authorities must be set");
    }

    public VistaUserDetails login(String vistaId, String division, String accessCode, String verifyCode, String newVerifyCode, String confirmNewVerifyCode, String remoteAddress, String remoteHostName) throws BadCredentialsException, DataAccessException {
        return userMap.getUser(vistaId, division, accessCode, verifyCode);
    }

    @Override
    public VistaUserDetails login(String vistaId, String division, String appHandle, String remoteAddress, String remoteHostName) throws DataAccessException {
       return userMap.getUser(vistaId, division, appHandle);
    }

    public void logout(VistaUserDetails user) throws DataAccessException {
        // NOOP
    }

    public VistaUserMap getUserMap() {
        return userMap;
    }

    public void setUserMap(VistaUserMap userMap) {
        this.userMap = userMap;
    }
}
