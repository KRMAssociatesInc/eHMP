package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.EducationTopic;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class EducationTopicImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("education.json"), mockPatient, "education");

        EducationTopic topic = (EducationTopic) importer.convert(chunk);

        assertThat(topic.getPid(), is(equalTo(MOCK_PID)));
        assertThat(topic.getUid(), is(UidUtils.getEducationTopicUid("F484", "301", "1")));
        assertThat(topic.getLocalId(), is("1"));
        assertThat(topic.getFacilityCode(), is("888"));
        assertThat(topic.getFacilityName(), is("FT. LOGAN"));
        assertThat(topic.getEncounterUid(), is(UidUtils.getVisitUid("F484", "301", "374")));
        assertThat(topic.getEncounterName(), is("COMP AND PEN May 09, 1997"));
        assertThat(topic.getName(), is("VA-ALCOHOL ABUSE"));
        assertThat(topic.getLocationName(), is("COMP AND PEN"));
        assertThat(topic.getEntered(), is(new PointInTime(1997, 5, 9, 13, 0)));
        assertThat(topic.getResult(), is("FAIR"));
    }
}
