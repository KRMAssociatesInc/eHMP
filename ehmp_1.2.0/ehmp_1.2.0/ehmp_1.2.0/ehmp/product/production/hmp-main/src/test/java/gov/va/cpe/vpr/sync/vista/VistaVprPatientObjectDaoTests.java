package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.frameeng.IFrameRunner;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_PATIENT_DATA_URI;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class VistaVprPatientObjectDaoTests {

    public static final String MOCK_DFN = MockVistaDataChunks.DFN;
    public static final String MOCK_PID = "3";
    public static final PatientDemographics MOCK_PATIENT = MockPatientUtils.create(MOCK_PID);
    public static final String MOCK_VISTA_ID = MockVistaDataChunks.VISTA_ID;

    private VistaVprPatientObjectDao dao;
    private RpcOperations mockRpcTemplate;
    private IPatientDAO mockPatientDao;
    private IGenericPatientObjectDAO mockGenericDao;
    private UserContext mockUserContext;
    private IBroadcastService mockBroadcastService;
    private IFrameRunner mockFrameRunner;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = mock(RpcOperations.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockGenericDao = mock(IGenericPatientObjectDAO.class);
        mockUserContext = mock(UserContext.class);
        mockBroadcastService = mock(IBroadcastService.class);
        mockFrameRunner = mock(IFrameRunner.class);

        dao = new VistaVprPatientObjectDao();
        dao.setRpcTemplate(mockRpcTemplate);
        dao.setJdsPatientDao(mockPatientDao);
        dao.setJdsGenericDao(mockGenericDao);
        dao.setUserContext(mockUserContext);
        dao.setBroadcastService(mockBroadcastService);
        dao.setFrameRunner(mockFrameRunner);

        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
        when(mockUser.getVistaId()).thenReturn(MOCK_VISTA_ID);
//        when(mockGenericDao.save(any(Foo.class))).then(new ReturnsArgument(0));
    }

    @Test
    public void testSaveMapReturnEntity() throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("pid", MOCK_PID);
        data.put("bar", "spaz");
        data.put("baz", true);
        String requestJsonString = POMUtils.toJSON(data);

        when(mockPatientDao.findByPid("3")).thenReturn(MOCK_PATIENT);

        JsonNode returnJson = createReturnJson("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_PUT_PATIENT_DATA_URI, MOCK_DFN, "foo", requestJsonString)).thenReturn(returnJson);

        Foo foo = dao.save(Foo.class, data);

        assertThat(foo.getUid(), is("urn:va:foo:1"));
        assertThat(foo.getBar(), is("spaz"));
        assertThat(foo.isBaz(), is(true));

        verify(mockRpcTemplate).executeForJson(VPR_PUT_PATIENT_DATA_URI, MOCK_DFN, "foo", requestJsonString);
        verify(mockGenericDao).save(foo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSaveMapWithNoPid() throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("bar", "spaz");
        data.put("baz", true);

        dao.save(Foo.class, data);
    }

    @Test(expected = PatientNotFoundException.class)
    public void testSaveMapWithUnknownPid() throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("pid", MOCK_PID);
        data.put("bar", "spaz");
        data.put("baz", true);

        dao.save(Foo.class, data);
    }

    @Test
    public void testSaveEntity() throws Exception {
        Foo foo = new Foo("spaz", true);
        foo.setData("pid", MOCK_PID);
        String requestJsonString = POMUtils.toJSON(foo);

        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(MOCK_PATIENT);

        JsonNode returnJson = createReturnJson("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_PUT_PATIENT_DATA_URI, MOCK_DFN, "foo", requestJsonString)).thenReturn(returnJson);

        foo = dao.save(foo);

        assertThat(foo.getUid(), is("urn:va:foo:1"));
        assertThat(foo.getBar(), is("spaz"));
        assertThat(foo.isBaz(), is(true));

        verify(mockRpcTemplate).executeForJson(VPR_PUT_PATIENT_DATA_URI, MOCK_DFN, "foo", requestJsonString);
        verify(mockGenericDao).save(foo);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSaveEntityWithNoPid() throws Exception {
        Foo foo = new Foo("spaz", true);
        dao.save(foo);
    }

    @Test(expected = PatientNotFoundException.class)
    public void testSaveEntityWithUnknownPid() throws Exception {
        Foo foo = new Foo("spaz", true);
        foo.setData("pid", MOCK_PID);
        dao.save(foo);
    }

    private JsonNode createReturnJson(String uid) {
        ObjectNode returnJson = JsonNodeFactory.instance.objectNode();
        returnJson.put("apiVersion", "1.01");
        returnJson.put("success", true);
        ObjectNode dataNode = returnJson.putObject("data");
        dataNode.put("uid", uid);
        return returnJson;
    }
}
