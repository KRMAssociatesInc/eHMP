package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.hmp.feed.atom.Link;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.LinkedHashMap;
import java.util.Map;

public class DomainClassSelfLinkGeneratorTests {

    private PatientRelatedSelfLinkGenerator generator;
    private IPatientDAO mockPatientDao;

    @Before
    public void setUp() {
        mockPatientDao = Mockito.mock(IPatientDAO.class);

        generator = new PatientRelatedSelfLinkGenerator();
        generator.setPatientDao(mockPatientDao);
    }

    @Test
    public void testSupports() {
        Map<String, Object> map = new LinkedHashMap<String, Object>(1);
        map.put("icn", "12345");
        Assert.assertTrue(generator.supports(new PatientDemographics(map)));
        Assert.assertTrue(generator.supports(new Result()));
        Assert.assertFalse(generator.supports("foobar"));
    }

    @Test
    public void testGenerateLinkForPatient() {
        Map<String, Object> map = new LinkedHashMap<String, Object>(1);
        map.put("icn", "12345");
        Link link = generator.generateLink(new PatientDemographics(map));
        Assert.assertEquals(LinkRelation.SELF.toString(), link.getRel());
        Assert.assertEquals("/vpr/v1/12345", link.getHref());
    }

    @Test
    public void testGenerateLinkForPatientRelatedDomainObject() {
        Map<String, Object> map = new LinkedHashMap<String, Object>(2);
        map.put("pid", "42");
        map.put("icn", "12345");
        PatientDemographics mockPatient = new PatientDemographics(map);
        Mockito.when(mockPatientDao.findByPid("42")).thenReturn(mockPatient);

        Map<String, Object> map1 = new LinkedHashMap<String, Object>(4);
        map1.put("pid", "42");
        map1.put("uid", "urn:va:tiu:500:4064");
        map1.put("localId", "4064");
        map1.put("patient", mockPatient);
        Link link = generator.generateLink(new Document(map1));
        Assert.assertEquals(LinkRelation.SELF.toString(), link.getRel());
        Assert.assertEquals("/vpr/v1/12345/document/show/urn%3Ava%3Atiu%3A500%3A4064", link.getHref());
    }

}
