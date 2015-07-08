package gov.va.hmp.auth;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This class isn't actually responsible for the commencement of
 * authentication, as it is in the case of other providers. It will be called if
 * an AJAX request is made without a Authentication header (after a user's session has
 * timed out or otherwise invalidated for instance).
 * <p/>
 * The <code>commence</code> method will delegate the handling of the response to an AuthenticationFailureHandler
 *
 * @see org.springframework.security.web.authentication.AuthenticationFailureHandler
 * @see org.springframework.security.web.access.ExceptionTranslationFilter
 */
public class UnauthorizedAjaxEntryPoint implements AuthenticationEntryPoint {

    private AuthenticationFailureHandler failureHandler;

    @Required
    public void setAuthenticationFailureHandler(AuthenticationFailureHandler failureHandler) {
        this.failureHandler = failureHandler;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        this.failureHandler.onAuthenticationFailure(request, response, authException);
    }
}
