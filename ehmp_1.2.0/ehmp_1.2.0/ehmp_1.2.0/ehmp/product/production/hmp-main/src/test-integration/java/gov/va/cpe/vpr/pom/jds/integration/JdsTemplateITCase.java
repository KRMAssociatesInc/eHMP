package gov.va.cpe.vpr.pom.jds.integration;

import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

public class JdsTemplateITCase {

    static JdsTemplate t;

    @BeforeClass
    public static void init() {
        t = new JdsTemplate();
        t.setRestTemplate(new RestTemplate());
        t.setJdsUrl("http://localhost:9080");
    }

    @Test
    public void testGetForJsonC() throws Exception {
        JsonCCollection r = t.getForJsonC("/vpr/1/index/immunization");
    }
}
