package gov.va.hmp.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.vista.rpc.broker.protocol.VerifyCodeExpiredException;
import gov.va.hmp.web.WebUtils;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static gov.va.hmp.jsonc.JsonCResponseConstants.*;

public class AjaxAuthenticationFailureHandler implements AuthenticationFailureHandler {

    static final String VERIFY_CODE_EXPIRED = "VerifyCodeExpired";

    private AuthenticationFailureHandler failureHandler;
    private ObjectMapper jsonMapper = new ObjectMapper();

    public AjaxAuthenticationFailureHandler(AuthenticationFailureHandler failureHandler) {
        this.failureHandler = failureHandler;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        if (WebUtils.isAjax(request)) {
            Map error = new HashMap();
            Throwable cause = exception.getCause() != null ? exception.getCause() : exception;
            if (cause instanceof DataAccessResourceFailureException) {
                error.put(ERROR_CODE, HttpServletResponse.SC_SERVICE_UNAVAILABLE);
                cause = cause.getCause();
            } else if (cause instanceof HmpVersionMismatchException) {
                error.put(ERROR_CODE, HttpServletResponse.SC_FORBIDDEN);
            } else if (cause instanceof VerifyCodeExpiredException) {
                error.put(ERROR_CODE, VERIFY_CODE_EXPIRED);
            } else {
                error.put(ERROR_CODE, HttpServletResponse.SC_UNAUTHORIZED);
            }
            error.put(ERROR_MSG, cause.getMessage());

            Map json = new HashMap();
            json.put(API_VERSION, "1");
            json.put(SUCCESS, false);
            json.put(ERROR, error);

            if (error.get(ERROR_CODE) instanceof Integer) {
                response.setStatus((Integer) error.get(ERROR_CODE));
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }

            response.setContentType("application/json");
            jsonMapper.writeValue(response.getWriter(), json);
        } else {
            failureHandler.onAuthenticationFailure(request, response, exception);
        }
    }
}
