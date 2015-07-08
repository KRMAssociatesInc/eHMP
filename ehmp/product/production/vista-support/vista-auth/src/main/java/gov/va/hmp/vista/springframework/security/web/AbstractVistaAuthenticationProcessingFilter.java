package gov.va.hmp.vista.springframework.security.web;

import java.net.UnknownHostException;

import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.http.HttpServletRequest;

public abstract class AbstractVistaAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {

    public static final String VISTA_ID_KEY = "j_vistaId";
    public static final String DIVISION_KEY = "j_division";

    private String vistaIdParameter = VISTA_ID_KEY;
    private String divisionParameter = DIVISION_KEY;
    protected boolean postOnly = true;

    public AbstractVistaAuthenticationProcessingFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    /**
     * Provided so that subclasses may configure what is put into the authentication request's details
     * property.
     *
     * @param request that an authentication request is being created for
     * @param authRequest the authentication request object that should have its details set
     */
    protected void setDetails(HttpServletRequest request, VistaAuthenticationToken authRequest) {
        authRequest.setDetails(authenticationDetailsSource.buildDetails(request));
    }

    /**
     * Enables subclasses to override the composition of the vistaId, such as by including additional values
     * and a separator.
     *
     * @param request so that request attributes can be retrieved
     *
     * @return the vistaId that will be presented in the <code>Authentication</code> request token to the
     *         <code>AuthenticationManager</code>
     */
    protected String obtainVistaId(HttpServletRequest request) {
        return request.getParameter(vistaIdParameter);
    }

    /**
     * Enables subclasses to override the composition of the division, such as by including additional values
     * and a separator.
     *
     * @param request so that request attributes can be retrieved
     *
     * @return the division that will be presented in the <code>Authentication</code> request token to the
     *         <code>AuthenticationManager</code>
     */
    protected String obtainDivision(HttpServletRequest request) {
        return request.getParameter(divisionParameter);
    }

    protected String obtainRemoteAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    protected String obtainRemoteHostName(HttpServletRequest request) {
    	String host = request.getRemoteHost();
    	String ip = request.getRemoteAddr();
    	if(ip.equals(host)) {
    		try {
				host = java.net.InetAddress.getByName(host).getHostName();
			} catch (UnknownHostException e) {
				e.printStackTrace();
			}
    	}
        return host;
    }

    /**
     * Sets the parameter name which will be used to obtain the vistaId from the login request.
     *
     * @param vistaIdParameter the parameter name. Defaults to "j_vistaId".
     */
    public void setVistaIdParameter(String vistaIdParameter) {
        this.vistaIdParameter = vistaIdParameter;
    }

    /**
     * Sets the parameter name which will be used to obtain the division from the login request.
     *
     * @param divisionParameter the parameter name. Defaults to "j_division".
     */
    public void setDivisionParameter(String divisionParameter) {
        this.divisionParameter = divisionParameter;
    }

    public final String getVistaIdParameter() {
        return vistaIdParameter;
    }

    public final String getDivisionParameter() {
        return divisionParameter;
    }

    /**
     * Defines whether only HTTP POST requests will be allowed by this filter.
     * If set to true, and an authentication request is received which is not a POST request, an exception will
     * be raised immediately and authentication will not be attempted. The <tt>unsuccessfulAuthentication()</tt> method
     * will be called as if handling a failed authentication.
     * <p>
     * Defaults to <tt>true</tt> but may be overridden by subclasses.
     */
    public void setPostOnly(boolean postOnly) {
        this.postOnly = postOnly;
    }
}
