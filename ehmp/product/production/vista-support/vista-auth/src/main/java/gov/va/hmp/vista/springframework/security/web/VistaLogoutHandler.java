package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetailsService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VistaLogoutHandler implements LogoutHandler, InitializingBean {

    private VistaUserDetailsService userDetailsService;

    public void afterPropertiesSet() throws Exception {
        Assert.notNull(userDetailsService, "userDetailsService must be set.");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (!(authentication instanceof VistaAuthenticationToken)) return;
        VistaAuthenticationToken auth = (VistaAuthenticationToken) authentication;
        userDetailsService.logout(auth.getVistaUserDetails());
    }

    public VistaUserDetailsService getUserDetailsService() {
        return userDetailsService;
    }

    public void setUserDetailsService(VistaUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
}
