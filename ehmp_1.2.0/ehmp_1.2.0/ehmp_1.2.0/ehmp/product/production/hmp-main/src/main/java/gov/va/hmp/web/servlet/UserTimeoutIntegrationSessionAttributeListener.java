package gov.va.hmp.web.servlet;

import gov.va.hmp.auth.HmpUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

/**
 * Sets the servlet {@link javax.servlet.http.HttpSession} timeout based on an HMP user's timeout setting if the have XU PROG.
 * 
 * Now the the browser handles the timeouts, we may want to disable this in production as its mainly a convienence for developers.
 *
 * @see gov.va.hmp.auth.HmpUserDetails#getTimeoutSeconds()
 */
public class UserTimeoutIntegrationSessionAttributeListener implements HttpSessionAttributeListener {

    private static final Logger log = LoggerFactory.getLogger(UserTimeoutIntegrationSessionAttributeListener.class);

    public void attributeAdded(HttpSessionBindingEvent event) {
        if (!event.getName().equals(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY)) return;
        setTimeOut(event);
    }

    public void attributeRemoved(HttpSessionBindingEvent event) {
        if (!event.getName().equals(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY)) return;
    }

    public void attributeReplaced(HttpSessionBindingEvent event) {
        if (!event.getName().equals(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY)) return;
        setTimeOut(event);
    }
    
    private ApplicationContext getContext(HttpSession sess) {
        return WebApplicationContextUtils.getWebApplicationContext(sess.getServletContext());
    }

    private void setTimeOut(HttpSessionBindingEvent event) {
        SecurityContext securityContext = (SecurityContext) event.getValue();
        if (securityContext == null) return;
        Authentication auth = securityContext.getAuthentication();
        if (auth == null) return;
        if (auth.getPrincipal() != null && auth.getPrincipal() instanceof HmpUserDetails) {
            HmpUserDetails userInfo = (HmpUserDetails) auth.getPrincipal();
            HttpSession sess = event.getSession();
            ApplicationContext ctx = getContext(sess);
            Integer timeout = (ctx != null) ? ctx.getEnvironment().getProperty("session.timeoutSec", Integer.class) : null;
            
            if (!userInfo.hasVistaKey("XUPROG")) {
            	timeout = userInfo.getTimeoutSeconds();
            } else {
                // if the user has the programmer key, then let them have an extended session timeout
                timeout = 86400;
            }
            
            if (timeout != null && timeout > 0) {
            	sess.setMaxInactiveInterval(timeout);
            }
            log.debug("set timeout for user {} to {} seconds.", userInfo.getDUZ(), timeout);
        }
    }
}