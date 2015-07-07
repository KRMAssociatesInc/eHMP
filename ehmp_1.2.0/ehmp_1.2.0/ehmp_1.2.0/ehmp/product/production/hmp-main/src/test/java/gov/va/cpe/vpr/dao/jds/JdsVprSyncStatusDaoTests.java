package gov.va.cpe.vpr.dao.jds;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;

import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static gov.va.cpe.vpr.dao.jds.JdsVprSyncStatusDao.SYNC_STATUS_LOADED_INDEX;
import static gov.va.cpe.vpr.dao.jds.JdsVprSyncStatusDao.SYNC_STATUS_LOADING_INDEX;
import static gov.va.cpe.vpr.dao.jds.JdsVprSyncStatusDao.SYNC_STATUS_PATIENT_INDEX;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class JdsVprSyncStatusDaoTests {

    private JdsOperations mockJdsTemplate;
    private IGenericPOMObjectDAO mockGenericDao;
    private JdsVprSyncStatusDao dao;
    private IPatientSelectDAO mockPatientSelectDao;
    private IPatientDAO mockPatientDao;

    @Before
    public void setUp() throws Exception {
        mockJdsTemplate = mock(JdsOperations.class);
        mockGenericDao = mock(IGenericPOMObjectDAO.class);
        mockPatientSelectDao = mock(IPatientSelectDAO.class);
        mockPatientDao = mock(IPatientDAO.class);
        dao = new JdsVprSyncStatusDao(mockGenericDao, mockJdsTemplate);
        dao.setPatientSelectDao(mockPatientSelectDao);
        dao.setPatientDao(mockPatientDao);
        dao.afterPropertiesSet();
    }

    @Test
    public void testFindOneByPid() throws Exception {
        String pid = "ABCD;34";

        SyncStatus syncStatus = dao.findOneByPid(pid);

        verify(mockGenericDao).findOneByIndexAndRange(SyncStatus.class, SYNC_STATUS_PATIENT_INDEX, pid);
    }

    @Test
    public void testCountLoadingPatients() throws Exception {
        int numLoading = dao.countLoadingPatients();
        verify(mockGenericDao).count(SYNC_STATUS_LOADING_INDEX);
    }

    @Test
    public void testCountLoadedPatients() throws Exception {
        int numLoading = dao.countLoadedPatients();
        verify(mockGenericDao).count(SYNC_STATUS_LOADED_INDEX);
    }

    @Test
    public void testFindOneForOperational() throws Exception {
        SyncStatus syncStatus = dao.findOneForOperational();

        verify(mockGenericDao).findByUID(SyncStatus.class, SyncStatus.OPERATIONAL_DATA_STATUS_UID);
    }

    @Test
    public void testFindAllLoadingPatientStatii() throws Exception {
        List<SyncStatus> syncStatus = dao.findAllLoadingPatientStatii();

        verify(mockGenericDao).findAllByIndex(SyncStatus.class, SYNC_STATUS_LOADING_INDEX);
    }

    @Test
    public void testFindAllPatientStatii() throws Exception {
        List<SyncStatus> syncStatus = dao.findAllPatientStatii();

        verify(mockGenericDao).findAllByIndex(SyncStatus.class, SYNC_STATUS_PATIENT_INDEX);
    }

    @Test
    public void testFindAllPatientStatiiByPage() throws Exception {
        PageRequest pageRequest = new PageRequest(0, 5);
        Page<SyncStatus> syncStatus = dao.findAllPatientStatii(pageRequest);

        verify(mockGenericDao).findAllByIndex(SyncStatus.class, SYNC_STATUS_PATIENT_INDEX, pageRequest);
    }
}
