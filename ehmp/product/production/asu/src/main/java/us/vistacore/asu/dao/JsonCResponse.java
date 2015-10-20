package us.vistacore.asu.dao;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import us.vistacore.asu.time.PointInTime;
import us.vistacore.asu.util.ParameterMap;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;

/**
 * This class helps implement Google's JSON Style Guide, or "JSON-C"</p>
 *
 * @param <R>
 * @see "https://google-styleguide.googlecode.com/svn/trunk/jsoncstyleguide.xml"
 */
public class JsonCResponse<R> {

    public JsonCResponse() {
        id = Integer.toString(hashCode());
    }

    /**
     * Represents the desired version of the service API in a request, and the version of the service API that's served in the response. apiVersion should always be present. This is not related to the version of the data. Versioning of data should be handled through some other mechanism such as etags.
     */
    public String apiVersion;
    /**
     * A server supplied identifier for the response (regardless of whether the response is a success or an error). This is useful for correlating server logs with individual responses received at a client.
     */
    public String id;
    /**
     * Client sets this value and server echos data in the response. This is useful in JSON-P and batch situations , where the user can use the context to correlate responses with requests. This property is a top-level property because the context should present regardless of whether the response was successful or an error. context differs from id in that context is specified by the user while id is assigned by the service.
     */
    public String context;
    /**
     * Represents the operation to perform, or that was performed, on the data. In the case of a JSON request, the method property can be used to indicate which operation to perform on the data. In the case of a JSON response, the method property can indicate the operation performed on the data.
     */
    public String method;
    /**
     * This object serves as a map of input parameters to send to an RPC request. It can be used in conjunction with the method property to execute an RPC function. If an RPC function does not need parameters, this property can be omitted.
     */
    public Map<String, Object> params;

    private Boolean success = null;

    /**
     * Included for increased compatibility with ExtJS.
     *
     * @return true when data object is set, false otherwise
     */
    public boolean getSuccess() {
        if (success != null) return success;
        if (error != null) return false;
        return (data != null);
    }

    /**
     * Container for all the data from a response. This property itself has many reserved property names, which are described below. Services are free to add their own data to this object. A JSON response should contain either a data object or an error object, but not both. If both data and error are present, the error object takes precedence.
     */
    public R data;

    /**
     * Indicates that an error has occurred, with details about the error. The error format supports either one or more errors returned from the service. A JSON response should contain either a data object or an error object, but not both. If both data and error are present, the error object takes precedence.
     */
    public Error error;

    public static class Error {
        /**
         * Represents the code for this error. This property value will usually represent the HTTP response code. If there are multiple errors, code will be the error code for the first error.
         */
        public String code;
        
        /**
         * A human readable message providing more details about the error. If there are multiple errors, message will be the message for the first error.
         */
        public String message;
        
        /** Current patient id context, useful for tracking errors down */
        public String pid;
        
        /** User id, useful for tracking errors down */
        public String user;

        /**
         * Container for any additional information regarding the error. If the service returns multiple errors, each element in the errors array represents a different error.
         */
        public List<Map<String, Object>> errors;
    }

    public static class Collection<T> {

        public Collection() {
            // NOOP
        }

        public Collection(List<T> items) {
            this.items = items;
            this.currentItemCount = this.items.size();
            this.totalItems = this.items.size();
            this.startIndex = 0;
            this.itemsPerPage = this.items.size();
        }

        public Collection(Page<T> page) {
            this.items = page.getContent();
            this.currentItemCount = page.getNumberOfElements();
            this.startIndex = page.getNumber() * page.getSize();
            this.itemsPerPage = page.getSize();
            this.pageIndex = page.getNumber();
            this.totalPages = page.getTotalPages();
            this.totalItems = ((Long) page.getTotalElements()).intValue();
        }

        /**
         * Indicates the last date/time the item was updated, as defined by the service.
         */
        public PointInTime updated;

        /**
         * The number of items in this result set. Should be equivalent to items.length, and is provided as a convenience property. For example, suppose a developer requests a set of search items, and asks for 10 items per page. The total set of that search has 14 total items. The first page of items will have 10 items in it, so both itemsPerPage and currentItemCount will equal "10". The next page of items will have the remaining 4 items; itemsPerPage will still be "10", but currentItemCount will be "4".
         */
        public Integer currentItemCount;

        /**
         * The number of items in the result. This is not necessarily the size of the data.items array; if we are viewing the last page of items, the size of data.items may be less than itemsPerPage. However the size of data.items should not exceed itemsPerPage.
         */
        public Integer itemsPerPage;

        /**
         * The index of the first item in data.items. For consistency, startIndex should be 1-based. For example, the first item in the first set of items should have a startIndex of 1. If the user requests the next set of data, the startIndex may be 10.
         */
        public Integer startIndex;

        /**
         * The total number of items available in this set. For example, if a user has 100 blog posts, the response may only contain 10 items, but the totalItems would be 100.
         */
        public Integer totalItems;

        /**
         * The index of the current page of items. For consistency, pageIndex should be 1-based. For example, the first page of items has a pageIndex of 1. pageIndex can also be calculated from the item-based paging properties: pageIndex = floor(startIndex / itemsPerPage) + 1.
         */
        public Integer pageIndex;

        /**
         * The total number of pages in the result set. totalPages can also be calculated from the item-based paging properties above: totalPages = ceiling(totalItems / itemsPerPage).
         */
        public Integer totalPages;

        /**
         * The self link can be used to retrieve the item's data. For example, in a list of a user's Picasa album, each album object in the <code>items</code> array could contain a <code>selfLink</code> that can be used to retrieve data related to that particular album.
         */
        public String selfLink;

        /**
         * The edit link indicates where a user can send update or delete requests. This is useful for REST-based APIs. This link need only be present if the user can update/delete this item.
         */
        public String editLink;

        /**
         * The next link indicates how more data can be retrieved. It points to the location to load the next set of data. It can be used in conjunction with the itemsPerPage, startIndex and totalItems properties in order to page through data.
         */
        public String nextLink;

        /**
         * The previous link indicates how more data can be retrieved. It points to the location to load the previous set of data. It can be used in conjunction with the itemsPerPage, startIndex and totalItems properties in order to page through data.
         */
        public String previousLink;

        /**
         * This construct is intended to provide a standard location for collections related to the current result. For example, the JSON output could be plugged into a generic pagination system that knows to page on the items array. If items exists, it should be the last property in the data object.
         */
        public List<T> items;

        private Map<String, Object> additionalData;

        @JsonAnyGetter
        public Map<String, Object> getAdditionalData() {
            return additionalData;
        }

        public Object get(String key) {
            if (additionalData == null) return null;
            return additionalData.get(key);
        }

        @JsonAnySetter
        public void put(String key, Object value) {
            if (additionalData == null) {
                additionalData = new HashMap<String, Object>();
            }
            additionalData.put(key, value);
        }
    }

    public JsonCResponse<R> setMethodAndParams(HttpServletRequest request) {
        this.method = request.getMethod() + " " + request.getRequestURI();
        this.params = new ParameterMap(request);
        if (request.getAttribute(WebUtils.ERROR_MESSAGE_ATTRIBUTE) != null) {
            this.error = new Error();
            this.error.code = "500";
            this.error.message = request.getAttribute(WebUtils.ERROR_MESSAGE_ATTRIBUTE).toString();
        }
        return this;
    }

    public JsonCResponse<R> setError(String code, String message) {
    	return setError(code, null, null, message);
    }
    
    public JsonCResponse<R> setError(String code, String user, String pid, String message) {
        if (this.data != null) this.data = null;
        if (this.error == null) this.error = new Error();

        this.error.code = code;
        if (pid != null) this.error.pid = pid;
        if (user != null) this.error.user = user;
        this.error.message = message;

        this.addError(code, message);
        return this;
    }

    public JsonCResponse<R> addError(String code, String message) {
        if (this.data != null) this.data = null;
        if (this.error == null) this.error = new Error();

        if (this.error.errors == null) {
            this.error.errors = new ArrayList<Map<String, Object>>();
        }

        Map<String, Object> error = new HashMap<String, Object>();
        error.put("code", code);
        error.put("message", message);
        this.error.errors.add(error);

        return this;
    }

    public JsonCResponse<R> setError(String code, Exception e) {
    	if (this.data != null) this.data = null;
    	this.error = convertExceptionToError(code, e);
    	return this;
    }
    
    public JsonCResponse<R> setError(Error error) {
    	this.error = error;
    	return this;
    }

    /** Harvest the useful info out of an exception and convert into a nicely formatted JSON response */
    public static Error convertExceptionToError(String code, Exception e) {
    	Error ret = new Error();
    	ret.code = code;
        ret.message = e.getMessage();
        
        Map<String, Object> error = new HashMap<String, Object>();
        error.put("code", code);
        error.put("message", e.getMessage());
        error.put("exception", e.getClass().getName());

        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        String stackTrace = sw.toString();
        error.put("stackTrace", stackTrace);

        Throwable cause = e.getCause();
        if (cause != null) {
            error.put("causedBy", cause.getClass().getName());
            error.put("causedByMessage", cause.getMessage());
            StackTraceElement[] causedByStackTraceElements = cause.getStackTrace();
            if (causedByStackTraceElements.length >= 1) {
                StackTraceElement causedByElement = causedByStackTraceElements[0];
                error.put("causedByFileName", causedByElement.getFileName());
                error.put("causedByLineNumber", causedByElement.getLineNumber());
                error.put("causedByClassName", causedByElement.getClassName());
                error.put("causedByMethodName", causedByElement.getMethodName());
            }
        }

        ret.errors = (List<Map<String, Object>>) Collections.singletonList(error);
    	return ret;
    }

    public static <T> JsonCResponse<T> create(T item) {
        JsonCResponse<T> jsonCResponse = new JsonCResponse<T>();
        jsonCResponse.data = item;
        return jsonCResponse;
    }

    public static <T> JsonCResponse create(HttpServletRequest request, T item) {
        JsonCResponse<T> response = new JsonCResponse<T>();
        response.setMethodAndParams(request);
        response.data = item;
        return response;
    }

    public static JsonCResponse<?> create(HttpServletRequest request) {
        JsonCResponse<?> response = new JsonCResponse<>();
        response.setMethodAndParams(request);
        return response;
    }

    public static JsonCError createError(String code, String message) {
        return new JsonCError(code, message);
    }

    public static JsonCError createError(String code, Exception e) {
        return new JsonCError(code, e);
    }

    public static JsonCError createError(Errors errors) {
        return new JsonCError(errors);
    }

    public static JsonCError createError(HttpServletRequest request, String code, String message) {
        JsonCError jsonCError = createError(code, message);
        jsonCError.setMethodAndParams(request);
        return jsonCError;
    }

    public static JsonCError createError(HttpServletRequest request, String code, Exception e) {
        JsonCError jsonCError = createError(code, e);
        jsonCError.setMethodAndParams(request);
        return jsonCError;
    }

    public static JsonCError createError(HttpServletRequest request, Errors errors) {
        JsonCError jsonCError = createError(errors);
        jsonCError.setMethodAndParams(request);
        return jsonCError;
    }

    public static JsonCError createError(HttpServletRequest request, JsonNode errors)  {
        JsonCError jsonCError = new ObjectMapper().convertValue(errors, JsonCError.class);
        jsonCError.setMethodAndParams(request);
        return jsonCError;
    }
}
