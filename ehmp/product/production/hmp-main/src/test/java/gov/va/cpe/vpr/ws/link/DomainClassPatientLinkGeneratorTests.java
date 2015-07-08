package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.*;
import gov.va.hmp.feed.atom.Link;
import gov.va.cpe.vpr.mapping.ILinkService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class DomainClassPatientLinkGeneratorTests {

    private static final String MOCK_PATIENT_URL = "http://www.example.org/foo/v1/12345";
    private DomainClassPatientLinkGenerator generator;

    @Before
    public void setUp() {
        ILinkService mockLinkService = mock(ILinkService.class);
        when(mockLinkService.getPatientHref(anyString())).thenReturn(MOCK_PATIENT_URL);

        generator = new DomainClassPatientLinkGenerator();
        generator.setLinkService(mockLinkService);
        generator.setOmitClasses(Arrays.<Class>asList(PatientFacility.class));
        generator.afterPropertiesSet();
    }

    @Test
    public void testSupports() {
        Assert.assertTrue(generator.supports(new ResultOrganizer()));
        Assert.assertTrue(generator.supports(new Document()));
        Assert.assertFalse(generator.supports(new PatientDemographics()));
    }

    @Test
    public void testGenerateLink() {
        Map<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("uid", "urn:va:tiu:500:4064");
        map.put("localId", "4064");
        Map<String, Object> map1 = new LinkedHashMap<String, Object>(1);
        map1.put("icn", "12345");
        map.put("patient", new PatientDemographics(map1));
        Link link = generator.generateLink(new Document(map));
        Assert.assertEquals(LinkRelation.PATIENT.toString(), link.getRel());
        Assert.assertEquals(MOCK_PATIENT_URL, link.getHref());
    }

    @Test
    public void testGenerateLinkForOmittedClassIsNull() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("code", "500");
        map.put("name", "CAMP MASTER");
        map.put("localPatientId", "4064");
        Link link = generator.generateLink(new PatientFacility(map));
        Assert.assertNull(link);
    }
}
