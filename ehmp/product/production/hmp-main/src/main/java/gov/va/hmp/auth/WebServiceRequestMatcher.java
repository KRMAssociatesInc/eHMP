package gov.va.hmp.auth;

import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * Matches requests where a request parameter of format is 'json' or 'xml', so spring security can route authentication
 * through the appropriate entry point.
 *
 * @see org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint
 */
public class WebServiceRequestMatcher implements RequestMatcher {
    public boolean matches(HttpServletRequest request) {
        String format = request.getParameter("format");
        if (StringUtils.isEmpty(format)) return false;
        return format.equalsIgnoreCase("xml") || format.equalsIgnoreCase("json");
    }

}
