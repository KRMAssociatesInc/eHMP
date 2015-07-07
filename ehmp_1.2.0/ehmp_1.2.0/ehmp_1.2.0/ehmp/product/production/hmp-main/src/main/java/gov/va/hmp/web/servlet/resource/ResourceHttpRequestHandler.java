package gov.va.hmp.web.servlet.resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.util.StringUtils;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * Extends the Spring implementation of this class to correct for missing MIME types and set Last-Modified headers based on file modification dates.
 * <p>
 * Additionally, adds support for an alternate {@link HttpRequestHandler} that handles resource requests if the requested
 * resource is not found by this handler.  (For example, HMP configures this to delegate to a handler to serve resources
 * found in OSGi bundles via the OSGi HTTPService)
 */
public class ResourceHttpRequestHandler extends org.springframework.web.servlet.resource.ResourceHttpRequestHandler implements InitializingBean {

    static final SimpleDateFormat HTTP_DATE_FORMAT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.US);
    public static final String HEADER_LAST_MODIFIED = "Last-Modified";

    private Logger logger = LoggerFactory.getLogger(getClass());
    private ConfigurableMimeFileTypeMap fileTypeMap;
    private HttpRequestHandler alternateResourceHandler;

    public ResourceHttpRequestHandler() {
        HTTP_DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("GMT"));
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (fileTypeMap == null) {
            fileTypeMap = new ConfigurableMimeFileTypeMap();
            fileTypeMap.setMappingLocation(new ClassPathResource("gov/va/cpe/vpr/web/converter/mime.types"));
            fileTypeMap.afterPropertiesSet();
        }
    }

    public ConfigurableMimeFileTypeMap getFileTypeMap() {
        return fileTypeMap;
    }

    public void setFileTypeMap(ConfigurableMimeFileTypeMap fileTypeMap) {
        this.fileTypeMap = fileTypeMap;
    }

    public void setAlternateResourceHttpRequestHandler(HttpRequestHandler alternateResourceHandler) {
        this.alternateResourceHandler = alternateResourceHandler;
    }

    @Override
    protected MediaType getMediaType(Resource resource) {
        String mediaType = fileTypeMap.getContentType(resource.getFilename());
        return (StringUtils.hasText(mediaType) ? MediaType.parseMediaType(mediaType) : MediaType.APPLICATION_OCTET_STREAM);
    }

    @Override
    protected void setHeaders(HttpServletResponse response, Resource resource, MediaType mediaType) throws IOException {
        // attempt to set Last-Modified header
        try {
            String lastModified = HTTP_DATE_FORMAT.format(new Date(resource.lastModified()));
            response.setHeader(HEADER_LAST_MODIFIED, lastModified);
        } catch (Exception e) {
            // NOOP (ignore if this resource doesn't support lastModifed)
            logger.warn("unable to set Last-Modified HTTP header for resource: " + resource.getFilename(), e);
        }

        super.setHeaders(response, resource, mediaType);
    }

    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        checkAndPrepare(request, response, true);

        // check whether a matching resource exists
        Resource resource = getResource(request);
        if (resource == null) {
            if (alternateResourceHandler != null) {
                logger.debug("No matching resource found - trying alternate handler");
                try {
                    alternateResourceHandler.handleRequest(request, response);
                } catch (Exception e) {
                    throw new ServletException(e);
                }
                return;
            } else {
                logger.debug("No matching resource found - returning 404");
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
        }

        // check the resource's media type
        MediaType mediaType = getMediaType(resource);
        if (mediaType != null) {
            if (logger.isDebugEnabled()) {
                logger.debug("Determined media type '" + mediaType + "' for " + resource);
            }
        }
        else {
            if (logger.isDebugEnabled()) {
                logger.debug("No media type found for " + resource + " - not sending a content-type header");
            }
        }

        // header phase
        if (new ServletWebRequest(request, response).checkNotModified(resource.lastModified())) {
            logger.debug("Resource not modified - returning 304");
            return;
        }
        setHeaders(response, resource, mediaType);

        // content phase
        if (METHOD_HEAD.equals(request.getMethod())) {
            logger.trace("HEAD request - skipping content");
            return;
        }
        writeContent(response, resource);
    }

    @Override
    protected Resource getResource(HttpServletRequest request) {
        return super.getResource(request);    //To change body of overridden methods use File | Settings | File Templates.
    }
}