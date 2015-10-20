package us.vistacore.asu.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScheduledRuleRefreshJob implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(ScheduledRuleRefreshJob.class);

    @Value("${rule.service.endpoint}")
    private String ruleServiceEndpoint;
    @Value("${uri.rules}")
    private String ruleServiceContext;
    @Value("${uri.refresh}")
    private String ruleRefreshPath;

    /** The ASU Rules refresh service method */
    private String rulesRefreshMethod;

    @Override
    public void afterPropertiesSet() throws Exception {
        rulesRefreshMethod = ruleServiceEndpoint + ruleServiceContext + ruleRefreshPath;
    }

    @Scheduled(fixedDelayString = "${rule.refresh.interval.ms}", initialDelayString = "${rule.refresh.initial.delay.ms}")
    public void refreshAsuRules() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(rulesRefreshMethod, String.class);
     }
}