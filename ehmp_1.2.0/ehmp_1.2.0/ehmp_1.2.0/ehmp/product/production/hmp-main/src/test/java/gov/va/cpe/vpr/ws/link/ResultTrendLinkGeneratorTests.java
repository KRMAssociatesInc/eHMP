package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.*;
import gov.va.hmp.feed.atom.Link;
import gov.va.cpe.vpr.mapping.ILinkService;
import groovy.lang.Closure;
import org.codehaus.groovy.runtime.DefaultGroovyMethods;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

public class ResultTrendLinkGeneratorTests {

    private ResultTrendLinkGenerator generator;

    @Before
    public void setUp() {
        generator = new ResultTrendLinkGenerator();
        generator.setLinkService(DefaultGroovyMethods.asType(new Closure<String>(this, this) {
            public String doCall(Object it) {
                return "http://www.example.org/foo/12345";
            }

            public String doCall() {
                return doCall(null);
            }

        }, ILinkService.class));
    }

    @Test
    public void testAfterPropertiesSet() {
        try {
            generator.setLinkService(null);
            generator.afterPropertiesSet();
            Assert.fail("expected illegal arg exception");
        } catch (Exception e) {
            // NOOP
        }

        generator.setLinkService(DefaultGroovyMethods.asType(new Closure<Void>(this, this) {
            public void doCall(Object it) {
            }

            public void doCall() {
                doCall(null);
            }

        }, ILinkService.class));
        generator.afterPropertiesSet();
    }

    @Test
    public void testSupports() {
        Assert.assertTrue(generator.supports(new Result()));
        Assert.assertFalse(generator.supports(new Medication()));
    }

    @Test
    public void testGenerateLinkWithTypeName() {
        Map<String, Object> map = new LinkedHashMap<>(2);
        map.put("typeName", "LDL CHOLESTEROL");
        Map<String, Object> map1 = new LinkedHashMap<>(1);
        Map<String, Object> map2 = new LinkedHashMap<>(1);
        map2.put("icn", "12345");
        map1.put("patient", new PatientDemographics(map2));
        map.put("organizers", Arrays.asList(new ResultOrganizer(map1)));
        Link link = generator.generateLink(new Result(map));

        Assert.assertEquals(LinkRelation.TREND.toString(), link.getRel());
        Assert.assertEquals("http://www.example.org/foo/12345/result/all?typeName=LDL%20CHOLESTEROL", link.getHref());
    }

    @Test
    public void testGenerateLinkWithTypeCode() {
        Map<String, Object> map = new LinkedHashMap<>(2);
        map.put("typeCode", "urn:lnc:22748-8");
        Map<String, Object> map1 = new LinkedHashMap<>(1);
        Map<String, Object> map2 = new LinkedHashMap<>(1);
        map2.put("icn", "12345");
        map1.put("patient", new PatientDemographics(map2));
        map.put("organizers", Arrays.asList(new ResultOrganizer(map1)));
        Link link = generator.generateLink(new Result(map));

        Assert.assertEquals(LinkRelation.TREND.toString(), link.getRel());
        Assert.assertEquals("http://www.example.org/foo/12345/result/all?typeCode=urn:lnc:22748-8", link.getHref());
    }
}
