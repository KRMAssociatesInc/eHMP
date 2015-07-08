package gov.va.hmp.web.servlet.view;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.View;

import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 *  Implementation of {@link org.springframework.web.servlet.ViewResolver} that resolves views with the default view name
 *  (<code>contentNegotiatedView</code>), in addition to the view names configured via the Application Context.
 *
 *  @see org.springframework.web.servlet.view.ContentNegotiatingViewResolver
 */
public class ContentNegotiatingViewResolver extends org.springframework.web.servlet.view.ContentNegotiatingViewResolver {

    public static final String DEFAULT_VIEW_NAME = "contentNegotiatingView";

    private Set<String> viewNames;

    @Required
    public void setViewNames(Set<String> viewNames) {
        Set<String> mergedViewNames = new HashSet<String>(viewNames);
        mergedViewNames.add(DEFAULT_VIEW_NAME);
        this.viewNames = Collections.unmodifiableSet(mergedViewNames);
    }

    @Override
    public View resolveViewName(String viewName, Locale locale) throws Exception {
        if (viewNames.contains(viewName)) {
            return super.resolveViewName(viewName, locale);
        } else {
            return null;
        }
    }
}
