package gov.va.hmp.auth;

import gov.va.hmp.healthtime.CPRSDateTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;
import gov.va.hmp.healthtime.MSCUIDateTimePrinterSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("userContext")
public class HmpUserContext implements UserContext {

    private AuthenticationTrustResolver authenticationTrustResolver;
    private HealthTimePrinterSet defaultHealthTimePrinterSet = new MSCUIDateTimePrinterSet();

    @Autowired
    public HmpUserContext(AuthenticationTrustResolver authenticationTrustResolver) {
        this.authenticationTrustResolver = authenticationTrustResolver;
    }

    public boolean isLoggedIn() {
        Authentication authentication = getAuthentication();
        return authentication != null && !authenticationTrustResolver.isAnonymous(authentication);
    }

    /**
     * Get the user details instance associated with the current authentication.
     *
     * @return the user
     */
    public HmpUserDetails getCurrentUser() {
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) return null;
        Authentication auth = context.getAuthentication();
        if (auth == null) return null;
        if (!auth.isAuthenticated()) return null;
        if (authenticationTrustResolver.isAnonymous(auth)) return null;
        if (auth.getPrincipal() instanceof HmpUserDetails)
            return (HmpUserDetails) auth.getPrincipal();
        else
            return null;
    }

    /**
     * Get the currently logged in user's principal. If not authenticated and the AnonymousAuthenticationFilter is
     * active (true by default) then the anonymous user's name will be returned ('anonymousUser' unless overridden).
     *
     * @return the principal
     */
    public Object getPrincipal() {
        Authentication auth = getAuthentication();
        if (auth == null) return null;
        return getAuthentication().getPrincipal();
    }

    /**
     * Get the currently logged in user's <code>Authentication</code>. If not authenticated and the
     * AnonymousAuthenticationFilter is active (true by default) then the anonymous user's auth will be returned
     * (AnonymousAuthenticationToken with username 'anonymousUser' unless overridden).
     *
     * @return the authentication
     */
    public Authentication getAuthentication() {
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) return null;
        Authentication auth = context.getAuthentication();
        return auth;
    }

    @Override
    public HealthTimePrinterSet getHealthTimePrinterSet() {
        HealthTimePrinterSetHolder printerSetHolder = getCurrentUserHealthTimePrinterSetHolder();
        if (printerSetHolder != null) {
            return printerSetHolder.getHealthTimePrinterSet();
        } else {
            return defaultHealthTimePrinterSet;
        }
    }

    @Override
    public void setHealthTimePrinterSet(HealthTimePrinterSet printerSet) {
        HealthTimePrinterSetHolder printerSetHolder = getCurrentUserHealthTimePrinterSetHolder();
        if (printerSetHolder != null) {
            printerSetHolder.setHealthTimePrinterSet(printerSet);
        }
    }

    private HealthTimePrinterSetHolder getCurrentUserHealthTimePrinterSetHolder() {
        HmpUserDetails currentUser = getCurrentUser();
        if (currentUser != null && currentUser instanceof HealthTimePrinterSetHolder) {
            return (HealthTimePrinterSetHolder) currentUser;
        }
        return null;
    }
}
