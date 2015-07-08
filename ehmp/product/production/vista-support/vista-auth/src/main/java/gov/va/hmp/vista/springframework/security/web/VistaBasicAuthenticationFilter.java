package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.apache.commons.codec.binary.Base64;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.NullRememberMeServices;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.Assert;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * TODO: Provide summary documentation of class VistaBasicAuthenticationFilter
 */
public class VistaBasicAuthenticationFilter extends GenericFilterBean {
    public static final String USERNAME_PASSWORD_DELIMITER = ":";
    public static final String VISTA_ID_DIVISION_DELIMITER = ";";
    public static final String ACCESS_VERIFY_CODE_DELIMITER = ";";

    //~ Instance fields ================================================================================================

    private AuthenticationDetailsSource authenticationDetailsSource = new WebAuthenticationDetailsSource();
    private AuthenticationEntryPoint authenticationEntryPoint;
    private AuthenticationManager authenticationManager;
    private RememberMeServices rememberMeServices = new NullRememberMeServices();
    private boolean ignoreFailure = false;
    private String credentialsCharset = "UTF-8";

    //~ Methods ========================================================================================================

    @Override
    public void afterPropertiesSet() {
        Assert.notNull(this.authenticationManager, "An AuthenticationManager is required");

        if (!isIgnoreFailure()) {
            Assert.notNull(this.authenticationEntryPoint, "An AuthenticationEntryPoint is required");
        }
    }

    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String header = request.getHeader("Authorization");

        if (logger.isDebugEnabled()) {
            logger.debug("Authorization header: " + header);
        }

        if ((header != null) && header.startsWith("Basic ")) {
            byte[] base64Token = header.substring(6).getBytes("UTF-8");
            String token = new String(Base64.decodeBase64(base64Token), getCredentialsCharset(request));

            String username = "";
            String password = "";
            int delim = token.indexOf(USERNAME_PASSWORD_DELIMITER);

            if (delim != -1) {
                username = token.substring(0, delim);
                password = token.substring(delim + 1);
            }

            if (authenticationIsRequired(username)) {
                String vistaId = "";
                String division = "";
                int semicolon1 = username.indexOf(";");
                if (semicolon1 != -1) {
                    vistaId = username.substring(0, semicolon1);
                    division = username.substring(semicolon1 + 1);
                } else {
                    vistaId = username;
                }

                String accessCode = "";
                String verifyCode = "";
                int semicolon2 = password.indexOf(ACCESS_VERIFY_CODE_DELIMITER);
                if (semicolon2 != -1) {
                    accessCode = password.substring(0, semicolon2);
                    verifyCode = password.substring(semicolon2 + 1);
                }

                VistaAuthenticationToken authRequest =
                        new VistaAuthenticationToken(vistaId, division, accessCode, verifyCode, request.getRemoteAddr(), request.getRemoteHost());
                authRequest.setDetails(authenticationDetailsSource.buildDetails(request));

                Authentication authResult;

                try {
                    authResult = authenticationManager.authenticate(authRequest);
                } catch (AuthenticationException failed) {
                    // Authentication failed
                    if (logger.isDebugEnabled()) {
                        logger.debug("Authentication request for user: " + username + " failed: " + failed.toString());
                    }

                    SecurityContextHolder.getContext().setAuthentication(null);

                    rememberMeServices.loginFail(request, response);

                    onUnsuccessfulAuthentication(request, response, failed);

                    if (ignoreFailure) {
                        chain.doFilter(request, response);
                    } else {
                        authenticationEntryPoint.commence(request, response, failed);
                    }

                    return;
                }

                // Authentication success
                if (logger.isDebugEnabled()) {
                    logger.debug("Authentication success: " + authResult.toString());
                }

                SecurityContextHolder.getContext().setAuthentication(authResult);

                rememberMeServices.loginSuccess(request, response, authResult);

                onSuccessfulAuthentication(request, response, authResult);
            }
        }

        chain.doFilter(request, response);
    }

    private boolean authenticationIsRequired(String username) {
        // Only reauthenticate if username doesn't match SecurityContextHolder and user isn't authenticated
        // (see SEC-53)
        Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();

        if (existingAuth == null || !existingAuth.isAuthenticated()) {
            return true;
        }

        // Limit username comparison to providers which use usernames (ie VistaAuthenticationToken)
        // (see SEC-348)

        if (existingAuth instanceof VistaAuthenticationToken && !existingAuth.getName().equals(username)) {
            return true;
        }

        // Handle unusual condition where an AnonymousAuthenticationToken is already present
        // This shouldn't happen very often, as BasicProcessingFitler is meant to be earlier in the filter
        // chain than AnonymousAuthenticationFilter. Nevertheless, presence of both an AnonymousAuthenticationToken
        // together with a BASIC authentication request header should indicate reauthentication using the
        // BASIC protocol is desirable. This behaviour is also consistent with that provided by form and digest,
        // both of which force re-authentication if the respective header is detected (and in doing so replace
        // any existing AnonymousAuthenticationToken). See SEC-610.
        if (existingAuth instanceof AnonymousAuthenticationToken) {
            return true;
        }

        return false;
    }

    protected void onSuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              Authentication authResult) throws IOException {
    }

    protected void onUnsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                                AuthenticationException failed) throws IOException {
    }

    protected AuthenticationEntryPoint getAuthenticationEntryPoint() {
        return authenticationEntryPoint;
    }

    public void setAuthenticationEntryPoint(AuthenticationEntryPoint authenticationEntryPoint) {
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    protected AuthenticationManager getAuthenticationManager() {
        return authenticationManager;
    }

    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    protected boolean isIgnoreFailure() {
        return ignoreFailure;
    }

    public void setIgnoreFailure(boolean ignoreFailure) {
        this.ignoreFailure = ignoreFailure;
    }

    public void setAuthenticationDetailsSource(AuthenticationDetailsSource authenticationDetailsSource) {
        Assert.notNull(authenticationDetailsSource, "AuthenticationDetailsSource required");
        this.authenticationDetailsSource = authenticationDetailsSource;
    }

    public void setRememberMeServices(RememberMeServices rememberMeServices) {
        Assert.notNull(rememberMeServices, "rememberMeServices cannot be null");
        this.rememberMeServices = rememberMeServices;
    }

    public void setCredentialsCharset(String credentialsCharset) {
        Assert.hasText(credentialsCharset, "credentialsCharset cannot be null or empty");
        this.credentialsCharset = credentialsCharset;
    }

    protected String getCredentialsCharset(HttpServletRequest httpRequest) {
        return credentialsCharset;
    }
}
