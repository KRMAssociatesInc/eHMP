package gov.va.cpe.web;

import com.codahale.metrics.health.HealthCheck;
import com.codahale.metrics.health.HealthCheckRegistry;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.metrics.health.VistaAccountHealthCheckRegistrar;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.ExecutorService;

@Controller
public class HealthCheckController {

    private HealthCheckRegistry registry;
    private ExecutorService executorService;
    private IVistaAccountDao vistaAccountDao;
    private MessageSource messageSource;

    @Autowired
    public void setRegistry(HealthCheckRegistry registry) {
        this.registry = registry;
    }

    public void setExecutorService(ExecutorService executorService) {
        this.executorService = executorService;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @RequestMapping(value = "/health", method = RequestMethod.GET)
    public ModelAndView health(@RequestParam(required = false) String format,
                               HttpServletRequest request) {
        final SortedMap<String, HealthCheck.Result> results = runHealthChecks();
        List<VistaAccount> vistaAccounts = vistaAccountDao.findAll();

        List<Map> items = new ArrayList<>(results.size());
        for (Map.Entry<String, HealthCheck.Result> entry : results.entrySet()) {
            String displayName = messageSource.getMessage(entry.getKey(), null, entry.getKey(), request.getLocale());

            Map item = new HashMap();
            item.put("name", displayName);
            item.put("health", entry.getValue());
            if (entry.getKey().startsWith(VistaAccountHealthCheckRegistrar.VISTA_CONNECTION_HEALTH_PREFIX)) {
                String vistaId = entry.getKey().substring(VistaAccountHealthCheckRegistrar.VISTA_CONNECTION_HEALTH_PREFIX.length());
                VistaAccount account = findOneByVistaId(vistaAccounts, vistaId);
                if (account != null) {
                    item.put("vista", account);
                }
            }
            items.add(item);
        }
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, items));
    }

    private VistaAccount findOneByVistaId(List<VistaAccount> vistaAccounts, String vistaId) {
        for (VistaAccount account : vistaAccounts) {
            if (vistaId.equalsIgnoreCase(account.getVistaId())) return account;
        }
        return null;
    }

    private SortedMap<String, HealthCheck.Result> runHealthChecks() {
        if (executorService == null) {
            return registry.runHealthChecks();
        }
        return registry.runHealthChecks(executorService);
    }

    private static boolean isAllHealthy(Map<String, HealthCheck.Result> results) {
        for (HealthCheck.Result result : results.values()) {
            if (!result.isHealthy()) {
                return false;
            }
        }
        return true;
    }
}
