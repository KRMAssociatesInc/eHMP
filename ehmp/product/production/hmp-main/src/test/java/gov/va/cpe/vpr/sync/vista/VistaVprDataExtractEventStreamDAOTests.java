package gov.va.cpe.vpr.sync.vista;

import com.codahale.metrics.MetricRegistry;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.hamcrest.CoreMatchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.core.env.Environment;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedHashMap;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_DATA_VERSION_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class VistaVprDataExtractEventStreamDAOTests {

    private RpcOperations mockRpcTemplate;
    private IPatientDAO mockPatientDao;
    private VistaVprDataExtractEventStreamDAO s;
    private static final String VERSION_RESULT_STRING = "foo";
    private static final String MOCK_HMP_VERSION = "aversion";
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = Mockito.mock(RpcOperations.class);
        mockPatientDao = Mockito.mock(IPatientDAO.class);
        mockEnvironment = Mockito.mock(Environment.class);
        Mockito.when(mockEnvironment.getProperty(Mockito.eq(HmpProperties.HDR_ENABLED), Mockito.eq(Boolean.class), Mockito.eq(false))).thenReturn(Boolean.FALSE);
        Mockito.when(mockEnvironment.getProperty(Mockito.eq(HmpProperties.ASYNC_BATCH_SIZE), Mockito.eq(Integer.class), Mockito.anyInt())).thenReturn(1000);
        Mockito.when(mockEnvironment.getProperty(Mockito.eq(HmpProperties.VERSION))).thenReturn(MOCK_HMP_VERSION);
        s = new VistaVprDataExtractEventStreamDAO();
        s.setPatientDao(mockPatientDao);
        s.setSynchronizationRpcTemplate(mockRpcTemplate);
        s.setEnvironment(mockEnvironment);
        s.setMetricRegistry(new MetricRegistry());
    }

    @Test
    public void testFetchVprVersion() {
        Mockito.when(mockRpcTemplate.executeForString("vrpcb://foobar" + VPR_DATA_VERSION_RPC_URI)).thenReturn(VERSION_RESULT_STRING);

        String version = s.fetchVprVersion("foobar");
        assertThat(version, is(VERSION_RESULT_STRING));
    }

    @Test
    public void testFetchDemographicsWithDfn() throws IOException {
        RpcResponse response = createMockResponseFromResource("patient.json");
        response.setDivision("500");
        response.setDivisionName("CAMP MASTER");

        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
        map.put("patientId", "229");
        map.put("domain", "patient");
        map.put("extractSchema",VistaVprDataExtractEventStreamDAO.EXTRACT_SCHEMA);
        Mockito.when(mockRpcTemplate.execute("vrpcb://foobar" + VPR_GET_VISTA_DATA_JSON_RPC_URI, map)).thenReturn(response);

        VistaDataChunk f = s.fetchPatientDemographicsWithDfn("foobar", "229");
        assertThat(f, CoreMatchers.not(CoreMatchers.nullValue()));
        assertThat(f.getSystemId(), is("foobar"));
        assertThat(f.getItemIndex(), is(0));
        assertThat(f.getItemCount(), is(1));
        assertThat(f.getLocalPatientId(), is("229"));
        assertThat((String) f.getParams().get(SyncMessageConstants.DIVISION), is("500"));
        assertThat((String) f.getParams().get(SyncMessageConstants.DIVISION_NAME), is("CAMP MASTER"));
        assertThat(f.getDomain(), is("patient"));

        JsonNode patientElement = new ObjectMapper().readTree(response.toString()).get("data").get("items").get(0);
        assertThat(f.getJson().toString(), equalTo(patientElement.toString()));
    }

    private RpcResponse createMockResponseFromResource(String resourceName) throws IOException {
        return new RpcResponse(FileCopyUtils.copyToString(new InputStreamReader(getClass().getResourceAsStream(resourceName))));
    }

    @Test
    public void testFetchDemographicsWithIcn() throws IOException {
        RpcResponse response = createMockResponseFromResource("patient.json");
        response.setDivision("500");
        response.setDivisionName("CAMP MASTER");

        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
        map.put("patientId", ";10104");
        map.put("domain", "patient");
        map.put("extractSchema",VistaVprDataExtractEventStreamDAO.EXTRACT_SCHEMA);
        Mockito.when(mockRpcTemplate.execute("vrpcb://foobar" + VPR_GET_VISTA_DATA_JSON_RPC_URI, map)).thenReturn(response);

        VistaDataChunk f = s.fetchPatientDemographicsWithIcn("foobar", "10104");
        assertThat(f, CoreMatchers.not(CoreMatchers.nullValue()));
        assertThat(f.getSystemId(), is("foobar"));
        assertThat(f.getItemIndex(), is(0));
        assertThat(f.getItemCount(), is(1));
        assertThat(f.getLocalPatientId(), CoreMatchers.nullValue());// localPatientId is null when fetched with ICN, will pick up in PatientImporter
        assertThat((String) f.getParams().get(SyncMessageConstants.DIVISION), is("500"));
        assertThat((String) f.getParams().get(SyncMessageConstants.DIVISION_NAME), is("CAMP MASTER"));
        assertThat(f.getDomain(), is("patient"));

        JsonNode patientElement = new ObjectMapper().readTree(response.toString()).get("data").get("items").get(0);
        assertThat(f.getJson().toString(), equalTo(patientElement.toString()));
    }
}
