package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.cpe.vpr.sync.vista.json.PatientDemographicsImporter;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.pom.POMUtils.convertObjectToNode;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNotNull;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 6/4/14
 * Time: 11:35 AM
 * To change this template use File | Settings | File Templates.
 */
public class PatientDemographicsImporterTests {

    private PatientDemographicsImporter c;

    @Test
    public void testConvertWithBadFacilityDate() {
        c = new PatientDemographicsImporter();
        Map<String, Object> data = new HashMap<String, Object>();

        ArrayList<Map<String, Object>> facilities = new ArrayList<>();
        Map<String, Object> facility = new HashMap<String, Object>();
        facility.put("latestDate","201402286730");
        facility.put("code","babble");
        facilities.add(facility);
        data.put("uid", UidUtils.getPatientUid("ABCD", "42"));
        data.put("facility", facilities);

        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk("ABCD", "/foo/bar", convertObjectToNode(data), "patient", 0, 1);

        PatientDemographics dem = c.convert(chunk);
        assertNotNull(dem);
        assertEquals(dem.getFacility().first().getLatestDate().toString(), "20140228");

    }

}
