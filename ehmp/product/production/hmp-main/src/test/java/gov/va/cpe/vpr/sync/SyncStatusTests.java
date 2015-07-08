package gov.va.cpe.vpr.sync;

import gov.va.cpe.vpr.PidUtils;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class SyncStatusTests {
    @Test
    public void testGetUidForOperationalSyncStatus() throws Exception {
        SyncStatus syncStatus = new SyncStatus();
        syncStatus.setData("forOperational", true);

        assertThat(syncStatus.getUid(), is(SyncStatus.OPERATIONAL_DATA_STATUS_UID));
    }

    @Test
    public void testGetUidForPatientSyncStatus() throws Exception {
        SyncStatus syncStatus = new SyncStatus();
        syncStatus.setData("forOperational", false);
        syncStatus.setData("pid", PidUtils.getPid("ABCD", "1234"));

        assertThat(syncStatus.getUid(), is("urn:va:syncstatus:ABCD:1234"));
    }
}
