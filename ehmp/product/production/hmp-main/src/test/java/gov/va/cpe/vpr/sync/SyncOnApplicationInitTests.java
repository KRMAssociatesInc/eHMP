package gov.va.cpe.vpr.sync;

import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.mockito.Mockito.*;

public class SyncOnApplicationInitTests {

    private ISyncService mockSyncService;
    private IVistaAccountDao mockVistaAccountDao;
    private JdsOperations mockJdsTemplate;
    private List<VistaAccount> mockAccounts;

    @Before
    public void setUp() throws Exception {
        mockSyncService = mock(ISyncService.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        mockJdsTemplate = mock(JdsOperations.class);
        mockAccounts = createMockAccounts(Arrays.asList("ABCD", "EFGH", "IJKL"));
        mockAccounts.get(1).setOdcAutoInit(false);
    }

    @Test
    public void testOnContextStarted() throws Exception {
        when(mockVistaAccountDao.findAllByVistaIdIsNotNull()).thenReturn(mockAccounts);
        when(mockJdsTemplate.getForJsonC("/data/all/count/collection")).thenReturn(JsonCCollection.<Map<String, Object>>create(Collections.<Map<String,Object>>singletonList(Collections.<String,Object>singletonMap("count", new Integer(0)))));

        SyncOnApplicationInit i = new SyncOnApplicationInit(mockVistaAccountDao, mockSyncService, mockJdsTemplate);

        i.setLastUpdateDao(mock(IVprUpdateDao.class));
        i.run();

        verify(mockJdsTemplate).getForJsonC("/data/all/count/collection");
        verify(mockVistaAccountDao).findAllByVistaIdIsNotNull();
        verify(mockSyncService).subscribeOperational("ABCD");
        verify(mockSyncService, never()).subscribeOperational("EFGH");
        verify(mockSyncService).subscribeOperational("IJKL");
    }

    @Test
    public void testOperationalDataExists() throws Exception {
        when(mockJdsTemplate.getForJsonC("/data/all/count/collection")).thenReturn(JsonCCollection.<Map<String, Object>>create(Collections.<Map<String,Object>>singletonList(Collections.<String,Object>singletonMap("count", new Integer(23)))));

        SyncOnApplicationInit i = new SyncOnApplicationInit(mockVistaAccountDao, mockSyncService, mockJdsTemplate);

        i.run();

        verify(mockJdsTemplate).getForJsonC("/data/all/count/collection");
//        verifyZeroInteractions(mockVistaAccountDao, mockSyncService);
    }

    private static List<VistaAccount> createMockAccounts(List<String> vistaIds) {
        List<VistaAccount> accounts = new ArrayList<VistaAccount>(vistaIds.size());
        for (String vistaId : vistaIds) {
            VistaAccount account = new VistaAccount();
            account.setVistaId(vistaId);
            accounts.add(account);
        }
        return accounts;
    }
}
