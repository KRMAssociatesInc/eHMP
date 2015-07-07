package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.io.InputStream;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class ResultImporterTest extends AbstractImporterTest {
    @Test
    public void testImportGlucose() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getResultResourceAsStream(), mockPatient, "lab");

        Result glucose = (Result) importer.convert(chunk);

        assertThat(glucose.getCategoryCode(), equalTo("urn:va:lab-category:CH"));
        assertThat(glucose.getCategoryName(), equalTo("Laboratory"));
        assertThat(glucose.getDisplayName(), equalTo("GLUCOSE"));
        assertThat(glucose.getFacilityCode(), equalTo("500D"));
        assertThat(glucose.getFacilityName(), equalTo("SLC-FO HMP DEV"));
        assertThat(glucose.getGroupName(), equalTo("CH 0721 6"));
        assertThat(glucose.getGroupUid(), equalTo("urn:va:accession:F484:229:CH;6889297.92"));
        assertThat(glucose.getHigh(), equalTo("110"));
        assertThat(glucose.getInterpretationCode(), equalTo("urn:hl7:observation-interpretation:H"));
        assertThat(glucose.getInterpretationName(), equalTo("High"));
        assertThat(glucose.getLocalId(), equalTo("CH;6889297.92;2"));
        assertThat(glucose.getLow(), equalTo("60"));
        assertThat(glucose.getObserved(), equalTo(new PointInTime(2011, 7, 1, 8, 0)));
        assertThat(glucose.getResult(), equalTo("120"));
        assertThat(glucose.getResulted(), equalTo(new PointInTime(2011, 7, 21, 6, 45)));
        assertThat(glucose.getSpecimen(), equalTo("SERUM"));
//        assertThat(glucose.statusCode, equalTo("urn:va:lab-status:completed"))
//        assertThat(glucose.statusName, equalTo("completed"))
        assertThat(glucose.getSummary(), equalTo("GLUCOSE (SERUM) 120<em>H</em> mg/dL"));
        assertThat(glucose.getTypeCode(), equalTo("urn:lnc:2345-7"));
        assertThat(glucose.getTypeName(), equalTo("GLUCOSE"));
        assertThat(glucose.getUid(), equalTo(UidUtils.getResultUid("F484", "229", "CH;6889297.92;2")));
        assertThat(glucose.getUnits(), equalTo("mg/dL"));
//        assertThat(glucose.vuid, equalTo("urn:vuid:4665460"))
    }

    @Test
    public void testImportMalariaSmear() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("lab-malaria-smear.json"), mockPatient, "lab");

        Result malariaSmear = (Result) importer.convert(chunk);

        assertThat(malariaSmear.getCategoryCode(), equalTo("urn:va:lab-category:CH"));
        assertThat(malariaSmear.getCategoryName(), equalTo("Laboratory"));
        assertThat(malariaSmear.getComment(), equalTo("TESTING THE EPI PATCH MALARIA SMEAR reported incorrectly as POSITIVE FOR MALARIA "));
        assertThat(malariaSmear.getDisplayName(), equalTo("MALARIA"));
        assertThat(malariaSmear.getFacilityCode(), equalTo("500"));
        assertThat(malariaSmear.getFacilityName(), equalTo("CAMP MASTER"));
        assertThat(malariaSmear.getGroupName(), equalTo("HE 0520 1"));
        assertThat(malariaSmear.getGroupUid(), equalTo("urn:va:accession:F484:229:CH;7029478.858493"));
        assertThat(malariaSmear.getHigh(), nullValue());
        assertThat(malariaSmear.getInterpretationCode(), nullValue());
        assertThat(malariaSmear.getInterpretationName(), nullValue());
        assertThat(malariaSmear.getLocalId(), equalTo("CH;7029478.858493;488"));
        assertThat(malariaSmear.getLow(), nullValue());
        assertThat(malariaSmear.getObserved(), equalTo(new PointInTime(1997, 5, 20, 14, 15)));
        assertThat(malariaSmear.getResult(), equalTo("POSITIVE"));
        assertThat(malariaSmear.getResulted(), equalTo(new PointInTime(1997, 5, 21, 8, 16)));
//        assertThat(malariaSmear.sample, equalTo("BLOOD"))
        assertThat(malariaSmear.getSpecimen(), equalTo("BLOOD"));

//        assertThat(malariaSmear.statusCode, equalTo("urn:va:lab-status:completed"))
//        assertThat(malariaSmear.statusName, equalTo("completed"))
        assertThat(malariaSmear.getSummary(), equalTo("MALARIA SMEAR (BLOOD) POSITIVE"));
        assertThat(malariaSmear.getTypeCode(), equalTo("urn:va:ien:60:503:70"));
        assertThat(malariaSmear.getTypeName(), equalTo("MALARIA SMEAR"));
        assertThat(malariaSmear.getUid(), equalTo(UidUtils.getResultUid("F484", "229", "CH;7029478.858493;488")));
        assertThat(malariaSmear.getUnits(), nullValue());
//        assertThat(malariaSmear.vuid, equalTo("urn:vuid:4665460"))
    }

    public static InputStream getResultResourceAsStream() {
        return ResultImporterTest.class.getResourceAsStream("lab-glucose.json");
    }
}
