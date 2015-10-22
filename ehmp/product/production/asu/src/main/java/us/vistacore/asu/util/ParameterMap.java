package us.vistacore.asu.util;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * A parameter map class that allows mixing of request parameters and controller parameters. If a controller
 * parameter is set with the same name as a request parameter the controller parameter value is retrieved.
 */
public class ParameterMap extends LinkedHashMap<String, Object> implements Map<String, Object> {

    private HttpServletRequest request;

    /**
     * Creates a ParameterMap populating from the given request object
     * @param request The request object
     */
    public ParameterMap(HttpServletRequest request) {
        this.request = request;
        for (Map.Entry<String, String[]> entry: request.getParameterMap().entrySet()) {
            if (entry.getValue().length == 1) {
                this.put(entry.getKey(), entry.getValue()[0]);
            } else {
                this.put(entry.getKey(), Arrays.asList(entry.getValue()));
            }
        }
        if (request instanceof MultipartHttpServletRequest) {
            Map<String, MultipartFile> fileMap = ((MultipartHttpServletRequest) request).getFileMap();
            for (String fileName : fileMap.keySet()) {
                this.put(fileName, ((MultipartHttpServletRequest) request).getFile(fileName));
            }
        }
    }
}
