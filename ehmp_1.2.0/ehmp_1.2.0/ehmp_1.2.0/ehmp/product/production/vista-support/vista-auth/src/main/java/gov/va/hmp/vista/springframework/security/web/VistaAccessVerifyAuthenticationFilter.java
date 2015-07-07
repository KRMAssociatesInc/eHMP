package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VistaAccessVerifyAuthenticationFilter extends AbstractVistaAuthenticationProcessingFilter {

    public static final String ACCESS_CODE_KEY = "j_access";
    public static final String VERIFY_CODE_KEY = "j_verify";
    public static final String NEW_VERIFY_CODE_KEY = "j_newVerify";
    public static final String CONFIRM_VERIFY_CODE_KEY = "j_confirmVerify";

    private String accessCodeParameter = ACCESS_CODE_KEY;
    private String verifyCodeParameter = VERIFY_CODE_KEY;

    public VistaAccessVerifyAuthenticationFilter() {
        super("/j_spring_security_check");
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }

        String vistaId = obtainVistaId(request);
        String division = obtainDivision(request);
        String accessCode = obtainAccessCode(request);
        String verifyCode = obtainVerifyCode(request);
        String newVerifyCode = obtainNewVerifyCode(request);
        String confirmVerifyCode = obtainConfirmVerifyCode(request);
        String remoteAddress = obtainRemoteAddress(request);
        String remoteHostName = obtainRemoteHostName(request);

        if (accessCode == null) {
            accessCode = "";
        }

        if (verifyCode == null) {
            verifyCode = "";
        }

        VistaAuthenticationToken authRequest = createToken(vistaId, division, accessCode, verifyCode, newVerifyCode, confirmVerifyCode, remoteAddress, remoteHostName);

        // Allow subclasses to set the "details" property
        setDetails(request, authRequest);

        logger.debug("Attempting authentication with token: " + authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    protected VistaAuthenticationToken createToken(String vistaId, String division, String accessCode, String verifyCode, String newVerifyCode, String confirmVerifyCode, String remoteAddress, String remoteHostName) {
        return new VistaAuthenticationToken(vistaId, division, accessCode, verifyCode, newVerifyCode, confirmVerifyCode, remoteAddress, remoteHostName);
    }

    /**
     * Enables subclasses to override the composition of the access code, such as by including additional values
     * and a separator.
     *
     * @param request so that request attributes can be retrieved
     *
     * @return the access code that will be presented in the <code>Authentication</code> request token to the
     *         <code>AuthenticationManager</code>
     */
    protected String obtainAccessCode(HttpServletRequest request) {
        String accessCode = request.getParameter(accessCodeParameter);
        if (accessCode.contains(";")) {
           accessCode = accessCode.substring(0, accessCode.lastIndexOf(';'));
        }
        return accessCode;
    }

    /**
     * Enables subclasses to override the composition of the verify code, such as by including additional values
     * and a separator.
     *
     * @param request so that request attributes can be retrieved
     *
     * @return the verify code that will be presented in the <code>Authentication</code> request token to the
     *         <code>AuthenticationManager</code>
     */
    protected String obtainVerifyCode(HttpServletRequest request) {
        String verifyCode = request.getParameter(verifyCodeParameter);
        if (!StringUtils.hasText(verifyCode))                       {
            String accessCode = request.getParameter(accessCodeParameter);
            if (accessCode.contains(";")) {
                verifyCode = accessCode.substring(accessCode.lastIndexOf(';') + 1);
            }
        }
        return verifyCode;
    }

    protected String obtainNewVerifyCode(HttpServletRequest request) {
        return request.getParameter(NEW_VERIFY_CODE_KEY);
    }

    protected String obtainConfirmVerifyCode(HttpServletRequest request) {
        return request.getParameter(CONFIRM_VERIFY_CODE_KEY);
    }

    /**
     * Sets the parameter name which will be used to obtain the access code from the login request.
     *
     * @param accessCodeParameter the parameter name. Defaults to "j_accessCode".
     */
    public void setAccessCodeParameter(String accessCodeParameter) {
        this.accessCodeParameter = accessCodeParameter;
    }

    /**
     * Sets the parameter name which will be used to obtain the verify code from the login request.
     *
     * @param verifyCodeParameter the parameter name. Defaults to "j_verifyCode".
     */
    public void setVerifyCodeParameter(String verifyCodeParameter) {
        this.verifyCodeParameter = verifyCodeParameter;
    }

    public final String getAccessCodeParameter() {
        return accessCodeParameter;
    }

    public final String getVerifyCodeParameter() {
        return verifyCodeParameter;
    }
}
