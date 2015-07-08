package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class TaskImporterTest extends AbstractImporterTest {
    @Test
    public void testTask() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("task.json"), mockPatient, "task");
        Task t = (Task) importer.convert(fragment);
        Assert.assertNotNull(t);
        assertThat(t.getPid(), is(equalTo(MOCK_PID)));
        assertThat(t.getFacilityCode(), is("500"));
        assertThat(t.getCreatedByCode(), is("urn:va:user:F484:1089"));
        assertThat(t.getCreatedByName(), is("AVIVAUSER,TWELVE "));
        assertThat(t.getTaskName(), is("a test of a task"));
        assertThat(t.getDueDate(), is(new PointInTime(2012, 10, 26)));
        assertThat(t.getDescription(), is("?test"));
    }

}
