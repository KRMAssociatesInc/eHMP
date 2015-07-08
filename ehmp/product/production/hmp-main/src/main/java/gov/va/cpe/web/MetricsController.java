package gov.va.cpe.web;

import com.codahale.metrics.MetricFilter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.MetricSet;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static java.util.Collections.singletonMap;

@Controller
public class MetricsController implements ApplicationContextAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(MetricsController.class);

    private MetricRegistry metricRegistry;
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setMetricRegistry(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @RequestMapping(value = "/metrics", method = RequestMethod.GET)
    public ModelAndView metrics() {
        return ModelAndViewFactory.contentNegotiatingModelAndView(metricRegistry);
    }

    @RequestMapping(value = "/metrics/reset", method = RequestMethod.POST)
    public ModelAndView reset(HttpServletRequest request) {
        metricRegistry.removeMatching(MetricFilter.ALL);
        LOGGER.debug("Metrics Reset");
        Map<String,MetricSet> metricSets = applicationContext.getBeansOfType(MetricSet.class);
        for (MetricSet metricSet: metricSets.values()) {
            metricRegistry.registerAll(metricSet);
        }
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", "Metrics Reset")));
    }
}
