package gov.va.hmp.web.converter;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.util.StringUtils;

import java.io.IOException;

/**
 * Extends the Spring implementation of this class to correct for image/x-png,image/svg+xml,application/font-woff content-types and set Last-Modified headers
 */
public class ResourceHttpMessageConverter extends org.springframework.http.converter.ResourceHttpMessageConverter implements InitializingBean {

    private ConfigurableMimeFileTypeMap fileTypeMap;

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

    @Override
    protected MediaType getDefaultContentType(Resource resource) {
        String mediaType = fileTypeMap.getContentType(resource.getFilename());
        return (StringUtils.hasText(mediaType) ? MediaType.parseMediaType(mediaType) : MediaType.APPLICATION_OCTET_STREAM);
    }

    @Override
    protected void writeInternal(Resource resource, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        // attempt to set Last-Modified header
        try {
            outputMessage.getHeaders().setLastModified(resource.lastModified());
        } catch (IOException e) {
            // NOOP (ignore if this resource doesn't support lastModifed)
        }

        super.writeInternal(resource, outputMessage);
    }
}
