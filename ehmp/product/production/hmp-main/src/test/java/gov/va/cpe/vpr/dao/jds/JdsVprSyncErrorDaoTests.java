package gov.va.cpe.vpr.dao.jds;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.SyncError;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataRetrievalFailureException;

import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class JdsVprSyncErrorDaoTests {

    private JdsVprSyncErrorDao dao;
    private JdsOperations mockJdsTemplate;
    private IGenericPOMObjectDAO mockGenericDao;

    @Before
    public void setUp() throws Exception {
        mockGenericDao = mock(IGenericPOMObjectDAO.class);
        mockJdsTemplate = mock(JdsOperations.class);

        dao = new JdsVprSyncErrorDao(mockGenericDao, mockJdsTemplate);
        dao.afterPropertiesSet();
    }

    @Test
    public void testGetAllSyncErrors() throws Exception {
        List<SyncError> errors = dao.getAllSyncErrors();

        verify(mockGenericDao).findAll(SyncError.class);
    }

    @Test
    public void testGetErrorCountForPid() throws Exception {
        String pid = "12345";
        Integer num = dao.getErrorCountForPid(pid);

        verify(mockGenericDao).count("syncerror-pid-count", pid);
    }

    @Test
    public void TestGetErrorPatientCount() throws Exception {
        Integer num = dao.getErrorPatientCount();

        verify(mockGenericDao).count("syncerror-pid-count");
    }

    @Test
    public void testGetOneByJMSMessageId() throws Exception {
        String id = "ISP-LTTEITELE-52006-1394550145177-2:1:23:1:2";

        SyncError error = dao.getOneByJMSMessageId(id);

        verify(mockGenericDao).findByUID(SyncError.class, "urn:va:syncerror:"+id);
    }

    @Test
    public void TestGetSyncErrorCount() throws Exception {
        when(mockGenericDao.count(SyncError.class)).thenReturn(3);

        long num = dao.getSyncErrorCount();

        assertThat(num, is(3L));
    }

    @Test
    public void TestGetSyncErrorCountWithException() throws Exception {
        when(mockGenericDao.count(SyncError.class)).thenThrow(new DataRetrievalFailureException("Unable to retrieve count: collection 'SyncErrors': is unknown."));

        long num = dao.getSyncErrorCount();

        verify(mockGenericDao).count(SyncError.class);
        assertThat(num, is(0L));
    }

    @Test
    public void testDeleteByJMSMessageId() throws Exception {
        String id = "ISP-LTTEITELE-52006-1394550145177-2:1:23:1:2";

        dao.deleteByJMSMessageId(id);

        verify(mockGenericDao).deleteByUID(SyncError.class, "urn:va:syncerror:" + id);
    }

    @Test
    public void testPurge() throws Exception {
        dao.purge();
        verify(mockGenericDao).deleteAll(SyncError.class);
    }

}
