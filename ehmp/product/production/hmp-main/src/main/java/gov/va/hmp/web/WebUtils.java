package gov.va.hmp.web;

import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.web.servlet.mvc.ParameterMap;

import org.springframework.security.web.savedrequest.SavedRequest;

import com.google.common.base.CharMatcher;

import javax.servlet.http.HttpServletRequest;

import java.util.Map;

public class WebUtils {

    private static final String XML_HTTP_REQUEST = "XMLHttpRequest";
    private static final String X_REQUESTED_WITH = "X-Requested-With";
    
    // match HTML characters and non-ascii characters
    private static final CharMatcher HTML = CharMatcher.anyOf("<>&;").or(CharMatcher.ASCII.negate());
    
    // match low ascii characters (except for CR,LF)
    private static final CharMatcher LOWASCII = CharMatcher.inRange('\0', '\31').and(CharMatcher.anyOf("\n\r").negate());
    
    public static boolean isAjax(HttpServletRequest request) {
        return XML_HTTP_REQUEST.equals(request.getHeader(X_REQUESTED_WITH));
    }

    public static boolean isAjax(SavedRequest request) {
        return request.getHeaderValues(X_REQUESTED_WITH).contains(XML_HTTP_REQUEST);
    }

    public static Map extractGroupAndSortParams(HttpServletRequest request) {
        Map params = new ParameterMap(request);
        extractAndReplaceJsonParam(params, "group");
        extractAndReplaceJsonParam(params, "sort");
        return params;
    }

    private static void extractAndReplaceJsonParam(Map params, String paramName) {
        Object p = params.get(paramName);
        if (p != null && p instanceof String && ((String)p).startsWith("[") && ((String)p).endsWith("]")) {
        	String ps = (String)p;
        	Map<String, Object> stuff = POMUtils.parseJSONtoMap(ps.substring(1,ps.length()-1));
            try {
                if(stuff.containsKey("direction")){params.put(paramName+".dir", stuff.get("direction"));}
                if(stuff.containsKey("property")){params.put(paramName+".col", stuff.get("property"));}
            } catch (RuntimeException e) {e.printStackTrace();}
        }
    }
    
    /**
     * Simple input sanitizer, mostly useful for search strings at this point.
     * 
     * Strips <,>,*,; characters as well as unprintable unicode characters
     * 
     * @param str
     * @return
     */
    public static final String sanitizeInput(String str) {
    	if (str == null) return null;
    	String ret = str;
    	// remove html characters and non-ascii characters
    	ret = HTML.removeFrom(ret);
    	
    	// remove low-ascii (unprintable) characters (except for \n\r)
    	ret = LOWASCII.removeFrom(ret);
    	
    	// trim whitespace from begin/end
    	return CharMatcher.WHITESPACE.trimFrom(ret);
    }
}
