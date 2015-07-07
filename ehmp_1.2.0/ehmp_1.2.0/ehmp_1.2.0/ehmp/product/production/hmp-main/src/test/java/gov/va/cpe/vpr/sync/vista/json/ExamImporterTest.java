package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Exam;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ExamImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("exam.json"), mockPatient, "exam");

        Exam exam = (Exam) importer.convert(chunk);
        assertThat(exam.getPid(), is(equalTo(MOCK_PID)));
        assertThat(exam.getUid(), is(UidUtils.getExamUid("F484", "100846", "34")));
        assertThat(exam.getLocalId(), is("34"));
        assertThat(exam.getFacilityCode(), is("500"));
        assertThat(exam.getFacilityName(), is("CAMP MASTER"));
        assertThat(exam.getEncounterUid(), is(UidUtils.getVisitUid("F484", "100846", "7553")));
        assertThat(exam.getEncounterName(), is("DIABETIC TELERETINAL IMAGER Nov 29, 2012"));
        assertThat(exam.getName(), is("DIABETIC TELERETINAL EYE EXAM"));
        assertThat(exam.getLocationName(), is("DIABETIC TELERETINAL IMAGER"));
        assertThat(exam.getEntered(), is(new PointInTime(2012, 11, 29, 9, 30)));
        assertThat(exam.getResult(), is("NORMAL"));
    }
}
