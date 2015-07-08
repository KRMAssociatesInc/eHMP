package gov.va.hmp.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.web.WebUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class AjaxAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private AuthenticationSuccessHandler successHandler;
    private ObjectMapper jsonMapper;
    private RequestCache requestCache = new HttpSessionRequestCache();

    public AjaxAuthenticationSuccessHandler(AuthenticationSuccessHandler successHandler) {
        this.successHandler = successHandler;
        this.jsonMapper = new ObjectMapper();
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (WebUtils.isAjax(request)) {
            Map data = new HashMap();
            data.put("targetUrl", getTargetUrl(request, response));

            Map<String, Object> json = new HashMap<String, Object>();
            json.put("apiVersion", "1");
            json.put("success", true);
            json.put("data", data);
            json.put("DUZ", authentication.getName());

            jsonMapper.writeValue(response.getWriter(), json);

            clearAuthenticationAttributes(request);
        } else {
            successHandler.onAuthenticationSuccess(request, response, authentication);
        }
    }

    private String getTargetUrl(HttpServletRequest request, HttpServletResponse response) {
        SavedRequest savedRequest = requestCache.getRequest(request, response);
        if (savedRequest == null || WebUtils.isAjax(savedRequest)) {
            return "/";
        }
        requestCache.removeRequest(request, response);
        return savedRequest.getRedirectUrl();
    }

    /**
     * Removes temporary authentication-related data which may have been stored in the session
     * during the authentication process.
     */
    protected final void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return;
        }

        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
}
