package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.PatientFacility;
import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;
import java.util.LinkedHashMap;

public class ProblemImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() throws Exception {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(3);
        map.put("systemId", "F484");
        map.put("code", "500");
        map.put("localPatientId", "229");
        mockPatient.addToFacilities(new PatientFacility(map));
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getProblemResourceAsStream(), mockPatient, "problem");
        Problem problem = (Problem) importer.convert(fragment);

        Assert.assertNotNull(problem);
        Assert.assertThat(problem.getPid(), CoreMatchers.is(CoreMatchers.equalTo(MOCK_PID)));
        Assert.assertEquals(UidUtils.getProblemUid(fragment.getSystemId(), fragment.getLocalPatientId(), "923"), problem.getUid());
        Assert.assertEquals("CAMP MASTER", problem.getFacilityName());
        Assert.assertEquals("500", problem.getFacilityCode());
        Assert.assertEquals("Diabetes Mellitus Type II or unspecified", problem.getProblemText());
        Assert.assertEquals(new PointInTime(2011, 3, 23), problem.getEntered());
        Assert.assertEquals(new PointInTime(2005), problem.getOnset());
        Assert.assertEquals(new PointInTime(2012, 5, 10), problem.getUpdated());
        Assert.assertEquals("250.0", problem.getIcdName());
        Assert.assertEquals("urn:icd:250.00", problem.getIcdCode());
        Assert.assertEquals("GENERAL MEDICINE", problem.getLocationName());
        Assert.assertEquals("23", problem.getLocationCode());
        Assert.assertNull(problem.getService());
        Assert.assertEquals(UidUtils.getUserUid("F484", "983"), problem.getProviderCode());
        Assert.assertEquals("PROVIDER,ONE", problem.getProviderName());
        Assert.assertTrue(!Boolean.TRUE.equals(problem.getRemoved()));
        Assert.assertTrue(!Boolean.TRUE.equals(problem.getServiceConnected()));
        Assert.assertEquals("urn:va:sct:55561003", problem.getStatusCode());
        Assert.assertEquals("ACTIVE", problem.getStatusName());
        Assert.assertFalse(problem.getUnverified());
        Assert.assertEquals(2, problem.getComments().size());
        Assert.assertEquals(new PointInTime(2012, 5, 10), problem.getComments().get(0).getEntered());
        Assert.assertEquals("AVIVAUSER,SEVEN", problem.getComments().get(0).getEnteredByName());
        Assert.assertEquals("urn:va:user:F484:1091", problem.getComments().get(0).getEnteredByCode());
        Assert.assertEquals("Adequate control on oral medications.", problem.getComments().get(0).getComment());
        Assert.assertEquals(new PointInTime(2012, 5, 10), problem.getComments().get(1).getEntered());
        Assert.assertEquals("AVIVAUSER,SEVEN", problem.getComments().get(1).getEnteredByName());
        Assert.assertEquals("urn:va:user:F484:1091", problem.getComments().get(1).getEnteredByCode());
        Assert.assertEquals("Goal to lose 50 pounds in 1 year.", problem.getComments().get(1).getComment());
        
        // simple icd problem grouping
        Assert.assertEquals("250", problem.getIcdGroup());
        
        // complex icd problem grouping
        problem.setData("icdCode", "urn:icd:E819.9");
        Assert.assertEquals("E819", problem.getIcdGroup());
    }

    public static InputStream getProblemResourceAsStream() {
        return ProblemImporterTest.class.getResourceAsStream("problem.json");
    }

}
