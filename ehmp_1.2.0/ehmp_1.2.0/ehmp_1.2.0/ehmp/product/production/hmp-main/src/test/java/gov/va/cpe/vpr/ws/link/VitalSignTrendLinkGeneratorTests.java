package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.*;
import gov.va.hmp.feed.atom.Link;
import gov.va.cpe.vpr.mapping.ILinkService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VitalSignTrendLinkGeneratorTests {

    private VitalSignTrendLinkGenerator generator;
    private ILinkService mockLinkService;

    @Before
    public void setUp() {
        mockLinkService = mock(ILinkService.class);
        when(mockLinkService.getPatientHref(anyString())).thenReturn("http://www.example.org/foo/12345");

        generator = new VitalSignTrendLinkGenerator();
        generator.setLinkService(mockLinkService);
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

        generator.setLinkService(mockLinkService);
        generator.afterPropertiesSet();
    }

    @Test
    public void testSupports() {
        Assert.assertTrue(generator.supports(new VitalSign()));
        Assert.assertFalse(generator.supports(new Medication()));
    }

    @Test
    public void testGenerateLinkWithTypeName() {
        Map<String, Object> map = new LinkedHashMap<>(2);
        map.put("typeName", "BLOOD PRESSURE");
        Map<String, Object> map1 = new LinkedHashMap<>(1);
        Map<String, Object> map2 = new LinkedHashMap<>(1);
        map2.put("icn", "12345");
        map1.put("patient", new PatientDemographics(map2));
        map.put("organizer", new VitalSignOrganizer(map1));
        Link link = generator.generateLink(new VitalSign(map));

        Assert.assertEquals(LinkRelation.TREND.toString(), link.getRel());
        Assert.assertEquals("http://www.example.org/foo/12345/vital/all?typeName=BLOOD%20PRESSURE", link.getHref());
    }

    @Test
    public void testGenerateLinkWithTypeCode() {
        Map<String, Object> map = new LinkedHashMap<>(2);
        map.put("typeCode", "urn:vuid:4500634");
        Map<String, Object> map1 = new LinkedHashMap<>(1);
        Map<String, Object> map2 = new LinkedHashMap<>(1);
        map2.put("icn", "12345");
        map1.put("patient", new PatientDemographics(map2));
        map.put("organizer", new VitalSignOrganizer(map1));
        Link link = generator.generateLink(new VitalSign(map));

        Assert.assertEquals(LinkRelation.TREND.toString(), link.getRel());
        Assert.assertEquals("http://www.example.org/foo/12345/vital/all?typeCode=urn:vuid:4500634", link.getHref());
    }
}
