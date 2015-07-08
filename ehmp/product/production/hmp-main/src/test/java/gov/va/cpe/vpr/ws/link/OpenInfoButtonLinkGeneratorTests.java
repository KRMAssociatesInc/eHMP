package gov.va.cpe.vpr.ws.link;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;

public class OpenInfoButtonLinkGeneratorTests {

    static final String BASE_URL = "https://cfmdcisrv05.duhs.duke.edu/infobutton-service/infoRequest";
    static final String BASE_PARAMS = "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.genderCode=M&age.v.v=42&age.v.u=a";

    private String MOCK_PID = "42";
    private PatientDemographics MOCK_PATIENT;
    private OpenInfoButtonLinkGenerator generator;
    private Medication medication;
    private Problem problem;
    private Result result;

    private IPatientDAO mockPatientDao;
    private Environment mockEnvironment;

    @Before
    public void setUp() {
        MOCK_PATIENT = new PatientDemographics();
//        MOCK_PATIENT.setData("dateOfBirth", new PointInTime(1969, 7, 20));
        MOCK_PATIENT.setData("birthDate", new PointInTime(PointInTime.today().subtractYears(42)));
        MOCK_PATIENT.setData("genderCode","M");

        mockEnvironment = mock(Environment.class);
        when(mockEnvironment.getProperty(HmpProperties.INFO_BUTTON_URL)).thenReturn(BASE_URL);

        mockPatientDao = mock(IPatientDAO.class);

        generator = new OpenInfoButtonLinkGenerator();
        generator.setPatientDao(mockPatientDao);
        generator.setEnvironment(mockEnvironment);

        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(MOCK_PATIENT);
    }

    @Test
    public void testSupports() {
        assertTrue(generator.supports(new Medication()));
        assertTrue(generator.supports(new Result()));
        assertTrue(generator.supports(new Problem()));
        assertFalse(generator.supports(new Document()));
    }

    @Test
    public void testGenerateLinkForMedication() {
        //Medication medication = new Medication(qualifiedName: "SIMVASTATIN", patient: MOCK_PATIENT);
        medication = new Medication();
        
        // minimum requirement is qualified name, results in no coded value
        medication.setData("qualifiedName", "SIMVASTATIN TAB");
        medication.setData("pid", MOCK_PID);
        Link link = generator.generateLink(medication);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertThat(link.getHref(), is(BASE_URL + BASE_PARAMS +"&taskContext.c.c=MLREV&mainSearchCriteria.v.dn=SIMVASTATIN%20TAB&performer=PROV&transform"));

        // if product.ingredientCodeName as the name, exists, use it instead of qualifiedName (works better for tall man lettering)
        List<Map<String,Object>> products = new ArrayList<>();
        Map<String,Object> product = new HashMap<>();
        product.put("ingredientCodeName", "SIMVASTATIN");
        products.add(product);
        medication.setData("products", products);
        link = generator.generateLink(medication);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertThat(link.getHref(), is(BASE_URL + BASE_PARAMS + "&taskContext.c.c=MLREV&mainSearchCriteria.v.dn=SIMVASTATIN&performer=PROV&transform"));
        
        // finally, we should also have a coded value if the rxnorm code is present
        medication.getProducts().get(0).setData("ingredientRXNCode", "urn:rxnorm:36567");
        link = generator.generateLink(medication);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertEquals(link.getHref(), BASE_URL + BASE_PARAMS + "&taskContext.c.c=MLREV&mainSearchCriteria.v.dn=SIMVASTATIN&mainSearchCriteria.v.c=36567&mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&performer=PROV&transform");
    }

    @Test
    public void testGenerateLinkForProblem() {
        problem = new Problem();
        problem.setData("problemText", "FOOBAR");
        problem.setData("pid", MOCK_PID);
        Link link = generator.generateLink(problem);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertThat(link.getHref(), is(BASE_URL + BASE_PARAMS +"&taskContext.c.c=PROBLISTREV&mainSearchCriteria.v.dn=FOOBAR&performer=PROV&transform"));
        
        // if there is an ICD code, the icd coding should be returned
        problem.setData("icdCode", "urn:icd:389.21");
        link = generator.generateLink(problem);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertThat(link.getHref(), is(BASE_URL + BASE_PARAMS +"&taskContext.c.c=PROBLISTREV&mainSearchCriteria.v.dn=FOOBAR&mainSearchCriteria.v.c=389.21&mainSearchCriteria.v.cs=2.16.840.1.113883.6.103&performer=PROV&transform"));
    }

    @Test
    public void testGenerateLinkForResult() {
        result = new Result();
        result.setData("typeName", "GLUCOSE");
        result.setData("pid", MOCK_PID);
        ResultOrganizer organizer = new ResultOrganizer();
        organizer.setData("pid", MOCK_PID);
        result.addToOrganizers(organizer);
        Link link = generator.generateLink(result);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertEquals(link.getHref(), BASE_URL + BASE_PARAMS + "&taskContext.c.c=LABRREV&mainSearchCriteria.v.dn=GLUCOSE&performer=PROV&transform");
        
        // with a type code, include the loinc coding....
        result.setData("typeCode", "urn:lnc:2345-7");
        link = generator.generateLink(result);
        assertThat(link.getRel(), is(LinkRelation.OPEN_INFO_BUTTON.toString()));
        assertEquals(link.getHref(), BASE_URL + BASE_PARAMS + "&taskContext.c.c=LABRREV&mainSearchCriteria.v.dn=GLUCOSE&mainSearchCriteria.v.c=2345-7&mainSearchCriteria.v.cs=2.16.840.1.113883.6.1&performer=PROV&transform");
    }
}
