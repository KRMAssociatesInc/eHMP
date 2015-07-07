package gov.va.hmp.web.servlet.view;

import org.springframework.util.CollectionUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import java.util.Map;
import java.util.Set;

public class MappingJacksonJsonView extends MappingJackson2JsonView {

    public MappingJacksonJsonView() {
        super();
        setExtractValueFromSingleKeyModel(true);
        setModelKey(ModelAndViewFactory.DEFAULT_MODEL_KEY);
    }

    @Override
    protected Object filterModel(Map<String, Object> model) {
        return (isFilterNeeded(model)) ? super.filterModel(model) : model;
    }

    /*
      * Method to prevent filtering maps that don't need additional filtering.
      * Fix for returning an empty map when the attribute to remove is not in the model.
      */
    boolean isFilterNeeded(Map<String, Object> model) {
        Set<String> renderedAttributes = (!CollectionUtils.isEmpty(getModelKeys()) ? getModelKeys() : model.keySet());

        for (Map.Entry<String, Object> entry : model.entrySet()) {
            if (!(entry.getValue() instanceof BindingResult) && renderedAttributes.contains(entry.getKey())) {
                return true;
            }
        }
        return false;
    }
}
