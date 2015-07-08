package gov.va.hmp.web.servlet.view;

import org.springframework.core.io.Resource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * View that renders a Resource via an HttpMessageConverter.
 * <p/>
 * If configured
 */
public class ResourceView extends AbstractView {

    public static final String DEFAULT_VIEW_NAME = "resourceView";

    public static final String DEFAULT_MODEL_KEY = "response";

    private String modelKey = DEFAULT_MODEL_KEY;

    private HttpMessageConverter<Resource> resourceConverter;

    public ResourceView(HttpMessageConverter<Resource> resourceConverter) {
        this.resourceConverter = resourceConverter;
    }

    /**
     * Set the name of the model key that represents the object to be converted. If not specified, the entire model map will be
     * converted.
     */
    public String getModelKey() {
        return modelKey;
    }

    public void setModelKey(String modelKey) {
        this.modelKey = modelKey;
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        Resource resource = (Resource) model.get(modelKey);
        resourceConverter.write(resource, null, new ServletServerHttpResponse(response));
    }
}
