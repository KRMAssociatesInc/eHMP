package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import java.util.Set;
import java.util.SortedSet;

public class PatientDemographicsImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(PatientDemographicsImporterTest.class.getResourceAsStream("patient.json"), mockPatient, "patient");
        PatientDemographicsImporter pi = new PatientDemographicsImporter();
        PatientDemographics p = pi.convert(chunk);

        Assert.assertNotNull(p);
        Assert.assertEquals(p.getUid(), UidUtils.getPatientUid(chunk.getSystemId(), chunk.getLocalPatientId()));
        Assert.assertEquals("10104", p.getIcn());
        Assert.assertEquals("AVIVAPATIENT", p.getFamilyName());
        Assert.assertEquals("TWENTYFOUR", p.getGivenNames());
        Assert.assertEquals("A0004", p.getBriefId());
        Assert.assertEquals("666000004", p.getSsn());
        Assert.assertTrue(p.isSensitive());
        Assert.assertEquals(new PointInTime(1935, 4, 7), p.getBirthDate());

        Assert.assertEquals("Male", p.getGenderName());
        Assert.assertEquals("urn:va:pat-gender:M", p.getGenderCode());
        // TODO: test for religion (needs code translation)

        Assert.assertTrue(p.isVeteran());
        Assert.assertEquals("177", p.getLrdfn());
        Assert.assertTrue(p.isServiceConnected());
        Assert.assertEquals("10", p.getServiceConnectedPercent());

        Assert.assertEquals(1, p.getAddress().size());
        Address address = p.getAddress().iterator().next();
        Assert.assertEquals("Any Street", address.getLine1());
        Assert.assertEquals("Any Town", address.getCity());
        Assert.assertEquals("WEST VIRGINIA", address.getState());
        Assert.assertEquals("99998-0071", address.getZip());

        Assert.assertEquals(1, p.getPatientRecordFlag().size());
        PatientRecordFlag flag = p.getPatientRecordFlag().iterator().next();
        Assert.assertEquals("WANDERER", flag.getName());
        Assert.assertEquals("patient has a history of wandering off and getting lost", flag.getText());

        Assert.assertNotNull(p.getMaritalStatusName());
        Assert.assertEquals("urn:va:pat-maritalStatus:D", p.getMaritalStatusCode());
        Assert.assertEquals("Divorced", p.getMaritalStatusName());

        Assert.assertEquals(1, p.getAlias().size());
        Alias alias = p.getAlias().iterator().next();
        Assert.assertEquals("P4", alias.getFullName());
        Assert.assertNull(alias.getFamilyName());
        Assert.assertNull(alias.getGivenNames());

        Assert.assertEquals(2, p.getTelecom().size());
        Set<Telecom> telecoms = p.getTelecom();
        for (Telecom telecom : telecoms) {
            if (telecom.getUse().equals("H")) {
                Assert.assertEquals("(222)555-8235", telecom.getValue());
            } else if (telecom.getUse().equals("WP")) {
                Assert.assertEquals("(222)555-7720", telecom.getValue());
            } else {
                Assert.fail();
            }

        }

        Assert.assertEquals(1, p.getFacility().size());// .facilities.size()
        SortedSet<PatientFacility> facilities = p.getFacility();
        PatientFacility facility = facilities.first();
        Assert.assertEquals("500", facility.getCode());
        Assert.assertEquals("CAMP MASTER", facility.getName());
        Assert.assertEquals(chunk.getSystemId(), facility.getSystemId());
        Assert.assertEquals(chunk.getLocalPatientId(), facility.getLocalPatientId());
        Assert.assertFalse(facility.isHomeSite());

        Assert.assertEquals(6, p.getExposure().size());
        // assertEquals("urn:va:N", p.getExposure().iterator().next().getUid());

        Assert.assertEquals(1, p.getContact().size());
        PatientContact support = p.getContact().iterator().next();
        Assert.assertEquals("urn:va:pat-contact:NOK", support.getTypeCode());
        Assert.assertEquals("Next of Kin", support.getTypeName());
        Assert.assertEquals("VETERAN,BROTHER", support.getName());

    }

}
