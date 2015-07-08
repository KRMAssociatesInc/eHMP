package gov.va.hmp.auth;

import gov.va.hmp.web.WebUtils;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;

/**
 * RequestMatcher that detects AJAX requests via the X-Requested-With HTTP Header.
 */
public class AjaxRequestMatcher implements RequestMatcher {
    @Override
    public boolean matches(HttpServletRequest request) {
        return WebUtils.isAjax(request);
    }
}
