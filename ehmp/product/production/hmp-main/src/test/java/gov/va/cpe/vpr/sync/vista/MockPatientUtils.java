package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientFacility;
import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.healthtime.PointInTime;

/**
 * TestCase that sets up a mock Patient and facility for use in tests
 */
public class MockPatientUtils {

    public static PatientDemographics create() {
        return create("1");
    }

    public static PatientDemographics create(String pid) {
        return create(pid, MockVistaDataChunks.ICN, MockVistaDataChunks.VISTA_ID, MockVistaDataChunks.DFN);
    }

    public static PatientDemographics create(String pid, String icn, String systemId, String localPatientId) {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", pid);
        pt.setData("icn", icn);
        pt.setData("uid", UidUtils.getPatientUid(systemId, localPatientId));
        pt.setLastUpdated(PointInTime.now());

        PatientFacility facility = new PatientFacility();
        facility.setData("code", MockVistaDataChunks.DIVISION);
        facility.setData("name", "CAMP MASTER");
        facility.setData("homeSite", true);
        facility.setData("localPatientId", localPatientId);
        facility.setData("systemId", systemId);

        pt.addToFacilities(facility);
        return pt;
    }
}
