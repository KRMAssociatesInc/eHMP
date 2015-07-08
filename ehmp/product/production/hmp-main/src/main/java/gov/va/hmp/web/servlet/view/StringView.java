package gov.va.hmp.web.servlet.view;

import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * View that renders a string in the specified
 */
public class StringView extends AbstractView {

    public static final String DEFAULT_VIEW_NAME = "stringView";

    public static final String DEFAULT_MODEL_KEY = "response";
    public static final String DEFAULT_CONTENT_TYPE_KEY = "contentType";

    private String modelKey = DEFAULT_MODEL_KEY;
    private String contentTypeKey = DEFAULT_CONTENT_TYPE_KEY;

    public StringView() {
        setContentType("text/plain");
    }

    /**
     * Set the name of the model key that represents the object to be converted. If not specified, the entire model map will be
     * converted.
     */
    public void setModelKey(String modelKey) {
        this.modelKey = modelKey;
    }

    public void setContentTypeKey(String contentTypeKey) {
        this.contentTypeKey = contentTypeKey;
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String contentType = getContentType();
        if (model.containsKey(contentTypeKey)) {
            contentType = model.get(contentTypeKey).toString();
        }

        response.setContentType(contentType);

        Object responseObject = model.get(modelKey);
        String responseBody = responseObject.toString();
        response.getWriter().write(responseBody);
    }
}
