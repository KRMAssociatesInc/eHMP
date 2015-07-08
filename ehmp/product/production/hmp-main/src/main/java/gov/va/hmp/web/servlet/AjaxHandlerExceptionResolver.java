package gov.va.hmp.web.servlet;

import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.web.BadRequestException;
import gov.va.hmp.Bootstrap;
import gov.va.hmp.auth.AuthController;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.WebUtils;
import org.apache.commons.collections.map.LRUMap;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.env.Environment;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

public class AjaxHandlerExceptionResolver extends DefaultHandlerExceptionResolver {

    private static Logger LOGGER = LoggerFactory.getLogger(AuthController.class);
    private ContentNegotiationStrategy contentNegotiationStrategy;
    private LRUMap history = new LRUMap(250);
    private Environment environment;
    private UserContext userContext;
    private PatientContext patContext;

    @Autowired
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPatientContext(PatientContext patientContext) {
        this.patContext = patientContext;
    }

    @Required
    public void setContentNegotiationStrategy(ContentNegotiationStrategy contentNegotiationStrategy) {
        this.contentNegotiationStrategy = contentNegotiationStrategy;
    }
    
    public void setExceptionHistorySize(int size) {
    	history = new LRUMap(size);
    }

    @Override
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (shouldResolveException(request, response, handler, ex)) {
            ModelAndView modelAndView = super.doResolveException(request, response, handler, ex);
            if (modelAndView == null) {
                if (ex instanceof NotFoundException) {
                    modelAndView = handleNotFound((NotFoundException) ex, request, response);
                } else if (ex instanceof BadRequestException) {
                    modelAndView = handleBadRequest(ex, request, response);
                } else if (ex instanceof PermissionDeniedDataAccessException) {
                	SecurityContext ctx = SecurityContextHolder.getContext();
                	Authentication auth = ctx.getAuthentication();
                	if(auth instanceof VistaAuthenticationToken && StringUtils.hasText(((VistaAuthenticationToken)auth).getAppHandle()))
                    {
                		modelAndView = handleCCOWTokenTimeout(ex, request, response);
                    } else {
                    	modelAndView = handleBadCredentials(ex, request, response);
                    }
                	request.getSession().invalidate();
                } else {
                    modelAndView = handleInternalServerError(ex, request, response);
                }
            }
            return modelAndView;
        }

        return null;
    }

    private boolean shouldResolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (WebUtils.isAjax(request)) return true;
        try {
            List<MediaType> mediaTypes = contentNegotiationStrategy.resolveMediaTypes(new ServletWebRequest(request));
            if (!mediaTypes.isEmpty()) return true;
        } catch (HttpMediaTypeNotAcceptableException e) {
            // NOOP
        }
        return false;
    }

    private ModelAndView handleBadRequest(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_BAD_REQUEST, ex));
    }
    
    private ModelAndView handleCCOWTokenTimeout(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(430);
        JsonCResponse resp = createErrorResponse(request, 430, ex);
        resp.error.message = "CCOW Single Sign-On time limit exceeded";
        return contentNegotiatingModelAndView(resp);
    }
    
    private ModelAndView handleBadCredentials(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_UNAUTHORIZED, ex));
    }

    protected ModelAndView handleInternalServerError(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ex));
    }

    protected ModelAndView handleNotFound(NotFoundException e, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_NOT_FOUND, e));
    }

    @Override
    protected ModelAndView handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleHttpRequestMethodNotSupported(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_METHOD_NOT_ALLOWED, ex));
    }

    @Override
    protected ModelAndView handleNoSuchRequestHandlingMethod(NoSuchRequestHandlingMethodException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleNoSuchRequestHandlingMethod(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_NOT_FOUND, ex));
    }

    @Override
    protected ModelAndView handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleHttpMediaTypeNotSupported(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, ex));
    }

    @Override
    protected ModelAndView handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleHttpMediaTypeNotAcceptable(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_NOT_ACCEPTABLE, ex));
    }

    @Override
    protected ModelAndView handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleMissingServletRequestParameter(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    @Override
    protected ModelAndView handleServletRequestBindingException(ServletRequestBindingException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleServletRequestBindingException(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    @Override
    protected ModelAndView handleConversionNotSupported(ConversionNotSupportedException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleConversionNotSupported(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ex));
    }

    @Override
    protected ModelAndView handleTypeMismatch(TypeMismatchException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleTypeMismatch(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    @Override
    protected ModelAndView handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleHttpMessageNotReadable(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    @Override
    protected ModelAndView handleHttpMessageNotWritable(HttpMessageNotWritableException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleHttpMessageNotWritable(ex, request, response, handler);
        return contentNegotiatingModelAndView(createErrorResponse(request, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ex));
    }

    @Override
    protected ModelAndView handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleMethodArgumentNotValidException(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    @Override
    protected ModelAndView handleMissingServletRequestPartException(MissingServletRequestPartException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        super.handleMissingServletRequestPartException(ex, request, response, handler);
        return handleBadRequest(ex, request, response);
    }

    protected JsonCResponse<?> createErrorResponse(HttpServletRequest request, int statusCode, Exception ex) {
    	// get some context information
    	HmpUserDetails user = this.userContext.getCurrentUser();
    	String curPID = this.patContext.getCurrentPatientPid();

    	// build an error message
    	JsonCResponse.Error error = JsonCResponse.convertExceptionToError(Integer.toString(statusCode), ex);
    	error.pid = (curPID != null) ? curPID : "N/A";
    	error.user = (user != null) ? user.getUid() : "N/A";
    	
    	// if developer mode, send full stack trace, otherwise just the summary message
    	JsonCResponse<?> ret;
    	if (Bootstrap.isDevelopment(environment)) {
    		ret = JsonCResponse.create(request).setError(error);
    	} else {
    		ret = JsonCResponse.create(request).setError(error.code, error.user, error.pid, ex.getMessage());
    	}
    	
    	// store the exception in memory and log it, wrapped with the request id+info
    	history.put(ret.id, error);
    	String msg = String.format("Request Failed. ID: %s, User: %s, PID: %s", 
    			ret.id, error.user, error.pid);
    	LOGGER.error(ex.getMessage(), new WrapperException(msg, ex));
    	
        return ret;
    }
    
    /** Returns a recent exception by random ID, null if invalid or expired */
    public JsonCResponse.Error getRecentException(String id) {
    	if (history.containsKey(id)) {
    		return (JsonCResponse.Error) history.get(id);
    	}
    	return null;
    }
    
    /** Returns a list of all the recent exceptions */
    public List<JsonCResponse.Error> getRecentExceptions() {
    	List<JsonCResponse.Error> ret = new ArrayList<>();
    	for (Object ex : history.values()) {
    		ret.add((JsonCResponse.Error) ex);
    	}
    	return ret;
    }
    
    /** Simple wrapper that can add extra info and also suppress irrelevant stack info */
    private static class WrapperException extends Exception {
		private static final long serialVersionUID = 1L;

		public WrapperException(String msg, Throwable cause) {
    		super(msg, cause, true, false);
		}
    }
}
