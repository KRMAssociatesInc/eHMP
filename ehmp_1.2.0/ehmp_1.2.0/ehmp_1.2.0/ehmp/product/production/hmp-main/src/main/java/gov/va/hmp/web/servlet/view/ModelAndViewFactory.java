package gov.va.hmp.web.servlet.view;

import org.springframework.core.io.Resource;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

/**
 * Factory for creating {@link ModelAndView} instances that have special reserved view names.
 *
 * @see org.springframework.web.servlet.ViewResolver
 */
public class ModelAndViewFactory {

    public static final String DEFAULT_MODEL_KEY = "response";

    /**
     * Creates a {@link ModelAndView} with its view name set to <code>contentNegotiatingView</code> and no model data.
     * <p />
     * The content negotiating view delegates to other views to render different responses with different content types (application/json, application/xml) based on the format request parameter.
     */
    public static ModelAndView contentNegotiatingModelAndView() {
        return new ModelAndView(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME);
    }

    /**
     * Creates a {@link ModelAndView} from a single model object with its view name set to <code>contentNegotiatingView</code>.
     *  <p />
     * The content negotiating view delegates to other views to render different responses with different content types (application/json, application/xml) based on the format request parameter.
     *
     * @param modelObject the single model object
     */
    public static ModelAndView contentNegotiatingModelAndView(Object modelObject) {
        return new ModelAndView(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME, DEFAULT_MODEL_KEY, modelObject);
    }

    /**
     * Creates a {@link ModelAndView} from a map model object with its view name set to <code>contentNegotiatingView</code>.
     * <p />
     * The content negotiating view delegates to other views to render different responses with different content types (application/json, application/xml) based on the format request parameter.
     *
     * @param model Map of model names (Strings) to model objects
     *              (Objects). Model entries may not be <code>null</code>, but the
     *              model Map may be <code>null</code> if there is no model data
     */
    public static ModelAndView contentNegotiatingModelAndView(Map model) {
        return new ModelAndView(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME, model);
    }

    /**
     * Creates a a {@link ModelAndView} from a String, which will be written to the HTTP response by {@link StringView} with Content-Type set to <code>text/plain</code>
     * @param text the string to write to the HTTP response
     */
    public static ModelAndView stringModelAndView(String text) {
        return new ModelAndView(StringView.DEFAULT_VIEW_NAME, StringView.DEFAULT_MODEL_KEY, text);
    }

    /**
     *  Creates a a {@link ModelAndView} from a String, which will be written to the HTTP response by {@link StringView} with Content-Type set to specified type.
     * @param text the string to write to the HTTP response
     * @param contentType the value of the HTTP Content-Type header
     */
    public static ModelAndView stringModelAndView(String text, String contentType) {
        return new ModelAndView(StringView.DEFAULT_VIEW_NAME, StringView.DEFAULT_MODEL_KEY, text).addObject(StringView.DEFAULT_CONTENT_TYPE_KEY, contentType);
    }

    public static ModelAndView resourceModelAndView(Resource resource) {
        return new ModelAndView(ResourceView.DEFAULT_VIEW_NAME, ResourceView.DEFAULT_MODEL_KEY, resource);
    }
}
