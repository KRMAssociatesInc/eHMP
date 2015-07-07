package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class VistaAppHandleAuthenticationFilter extends AbstractVistaAuthenticationProcessingFilter {

    public static final String APP_HANDLE_KEY = "j_appHandle";

    private String appHandleParameter = APP_HANDLE_KEY;

    public VistaAppHandleAuthenticationFilter() {
        super("/j_cprs_sso_spring_security_check");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        if (postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }

        String vistaId = obtainVistaId(request);
        String division = obtainDivision(request);
        String appHandle = obtainAppHandle(request);
        String remoteAddress = obtainRemoteAddress(request);
        String remoteHostName = obtainRemoteHostName(request);

        if (division == null) {
            division = "";
        }

        if (appHandle == null) {
            appHandle = "";
        }

        VistaAuthenticationToken authRequest = createToken(vistaId, division, appHandle, remoteAddress, remoteHostName);

        // Allow subclasses to set the "details" property
        setDetails(request, authRequest);

        logger.debug("Attempting authentication with token: " + authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    protected VistaAuthenticationToken createToken(String vistaId, String division, String appHandle, String remoteAddress, String remoteHostName) {
        return new VistaAuthenticationToken(vistaId, division, appHandle, remoteAddress, remoteHostName);
    }

    /**
     * Enables subclasses to override the composition of the app handle, such as by including additional values and a
     * separator.
     *
     * @param request so that request attributes can be retrieved
     * @return the username that will be presented in the <code>Authentication</code> request token to the
     *         <code>AuthenticationManager</code>
     */
    protected String obtainAppHandle(HttpServletRequest request) {
        return request.getParameter(appHandleParameter);
    }

    /**
     * Sets the parameter name which will be used to obtain the app handle from the login request.
     *
     * @param appHandleParameter the parameter name. Defaults to "j_appHandle".
     */
    public void setAppHandleParameter(String appHandleParameter) {
        this.appHandleParameter = appHandleParameter;
    }

    public final String getAppHandleParameter() {
        return appHandleParameter;
    }
}
