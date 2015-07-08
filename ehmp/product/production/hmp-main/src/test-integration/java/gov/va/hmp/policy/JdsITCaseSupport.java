package gov.va.hmp.policy;

import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.atomic.AtomicReference;

public class JdsITCaseSupport {

    private static final AtomicReference<JdsTemplate> JDS_TEMPLATE_REFERENCE = new AtomicReference<>();

    public static JdsTemplate getJdsTemplate() {
        return JDS_TEMPLATE_REFERENCE.get();
    }

    public static void init() throws Exception {
       init("http://localhost:9080");
    }

    public static void init(String jdsUrl) throws Exception {
        JdsTemplate jdsTemplate = new JdsTemplate();
        jdsTemplate.setJdsUrl(jdsUrl);
        jdsTemplate.setRestTemplate(new RestTemplate(new HttpComponentsClientHttpRequestFactory()));
        jdsTemplate.afterPropertiesSet();

        JDS_TEMPLATE_REFERENCE.set(jdsTemplate);
    }

    public static void destroy() {
        JdsTemplate jdsTemplate = JDS_TEMPLATE_REFERENCE.getAndSet(null);
    }
}
