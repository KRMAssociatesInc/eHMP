package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_OPERATIONAL_DATA_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_PUT_OBJECT_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.VistaDataChunk.createVistaDataChunk;
import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class VistaOperationalDataDAOTests {

    public static final String MOCK_VISTA_ID = "ABCD";
    private VistaOperationalDataDAO s;
    private RpcOperations mockRpcTemplate;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = mock(RpcOperations.class);

        s = new VistaOperationalDataDAO();
        s.setRpcTemplate(mockRpcTemplate);
    }

    @Test
    public void testFetchAllByDomain() throws Exception {
        List<Foo> mockFoos = createMockFoos();
        List<VistaDataChunk> mockFooChunks = createChunks(mockFoos, "foo");

        Map<String, Object> requestParams = new HashMap<String, Object>();
        requestParams.put("domain", "foo");

        JsonNode returnJson = createReturnJsonForFooList(mockFoos);
        RpcResponse mockRpcResponse = new RpcResponse(returnJson.toString());
        mockRpcResponse.setRequestUri(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI);
        when(mockRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams)).thenReturn(mockRpcResponse);

        List<VistaDataChunk> fooChunks = s.fetchAllByDomain(MOCK_VISTA_ID, "foo");

        assertThat(fooChunks.size(), is(mockFooChunks.size()));
        for (int i = 0; i < fooChunks.size(); i++) {
            VistaDataChunk c = fooChunks.get(i);

            assertThat(c.getDomain(), is("foo"));
            assertThat(c.getSystemId(), is(MOCK_VISTA_ID));
            assertThat(c.getRpcUri(), is(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI));
            assertThat(fooChunks.get(i).getJson().get("bar"), is(mockFooChunks.get(i).getJson().get("bar")));
            assertThat(fooChunks.get(i).getJson().get("baz"), is(mockFooChunks.get(i).getJson().get("baz")));
        }

        verify(mockRpcTemplate).execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams);
    }

    @Test
    public void testFetchBatchByDomain() throws Exception {
        List<Foo> mockFoos = createMockFoos();
        List<VistaDataChunk> mockFooChunks = createChunks(mockFoos, "foo");

        Map<String, Object> requestParams = new HashMap<String, Object>();
        requestParams.put("domain", "foo");
        requestParams.put("limit", 100);
        requestParams.put("start", "bar");

        JsonNode returnJson = createReturnJsonForFooList(mockFoos);
        ((ObjectNode) returnJson.get("data")).put("last", "baz");
        RpcResponse mockRpcResponse = new RpcResponse(returnJson.toString());
        mockRpcResponse.setRequestUri(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI);
        when(mockRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams)).thenReturn(mockRpcResponse);

        VistaDataChunkBatch batch = s.fetchBatchByDomain(MOCK_VISTA_ID, "foo", 100, "bar");

        assertThat(batch.getStartId(), is("bar"));
        assertThat(batch.getLastId(), is("baz"));

        assertThat(batch.getChunks().size(), is(mockFooChunks.size()));
        for (int i = 0; i < batch.getChunks().size(); i++) {
            VistaDataChunk c = batch.getChunks().get(i);

            assertThat(c.getDomain(), is("foo"));
            assertThat(c.getSystemId(), is(MOCK_VISTA_ID));
            assertThat(c.getRpcUri(), is(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI));
            assertThat(batch.getChunks().get(i).getJson().get("bar"), is(mockFooChunks.get(i).getJson().get("bar")));
            assertThat(batch.getChunks().get(i).getJson().get("baz"), is(mockFooChunks.get(i).getJson().get("baz")));
        }

        verify(mockRpcTemplate).execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams);
    }

    @Test
    public void testFetchBatchByDomainForPatientSelectDomain() throws Exception {
        List<PatientSelect> mockPatients = createMockPatientSelects();
        List<VistaDataChunk> mockPatientChunks = createChunks(mockPatients, "patient");

        Map<String, Object> requestParams = new HashMap<String, Object>();
        requestParams.put("domain", "patient");
        requestParams.put("limit", 100);
        requestParams.put("start", "bar");

        JsonNode returnJson = createReturnJsonForFooList(mockPatients);
        ((ObjectNode) returnJson.get("data")).put("last", "baz");
        RpcResponse mockRpcResponse = new RpcResponse(returnJson.toString());
        mockRpcResponse.setRequestUri(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI);
        when(mockRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams)).thenReturn(mockRpcResponse);

        VistaDataChunkBatch batch = s.fetchBatchByDomain(MOCK_VISTA_ID, "patient", 100, "bar");

        assertThat(batch.getStartId(), is("bar"));
        assertThat(batch.getLastId(), is("baz"));

        assertThat(batch.getChunks().size(), is(mockPatientChunks.size()));
        for (int i = 0; i < batch.getChunks().size(); i++) {
            VistaDataChunk c = batch.getChunks().get(i);

            assertThat(c.getDomain(), is("patient"));
            assertThat(c.getSystemId(), is(MOCK_VISTA_ID));
            assertThat(c.getLocalPatientId(), is(mockPatients.get(i).getLocalPatientIdForSystem(c.getSystemId())));
            assertThat(c.getPatientId(), is(mockPatients.get(i).getPid()));
            assertThat(c.getRpcUri(), is(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI));
        }

        verify(mockRpcTemplate).execute(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, requestParams);
    }

    @Test
    public void testSave() throws Exception {
        Foo foo = new Foo("fred", false);

        String requestJsonString = POMUtils.toJSON(foo);

        JsonNode returnJson = createReturnJsonForSuccess("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString)).thenReturn(returnJson);

        foo = s.save(MOCK_VISTA_ID, foo);

        assertThat(foo.getUid(), is("urn:va:foo:1"));
        assertThat(foo.getBar(), is("fred"));
        assertThat(foo.isBaz(), is(false));

        verify(mockRpcTemplate).executeForJson(VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString);
    }

    public static List<Foo> createMockFoos() {
        Foo foo1 = new Foo("fred", false);
        Foo foo2 = new Foo("wilma", true);

        List<Foo> mockFooList = new ArrayList<Foo>();
        mockFooList.add(foo1);
        mockFooList.add(foo2);
        return mockFooList;
    }

    public static List<PatientSelect> createMockPatientSelects() {
        PatientSelect pt1 = new PatientSelect(MockPatientUtils.create("1", "10104", MOCK_VISTA_ID, "229").getData());
        PatientSelect pt2 = new PatientSelect(MockPatientUtils.create("2", "10105", MOCK_VISTA_ID, "301").getData());

        List<PatientSelect> mockPtList = new ArrayList<>();
        mockPtList.add(pt1);
        mockPtList.add(pt2);
        return mockPtList;
    }

    public static List<Map> createMockFoosAsMaps() {
        Foo foo1 = new Foo("fred", false);
        Foo foo2 = new Foo("wilma", true);

        ObjectMapper jsonMapper = new ObjectMapper();
        List<Map> mockFooList = new ArrayList<Map>();
        mockFooList.add(jsonMapper.convertValue(foo1, Map.class));
        mockFooList.add(jsonMapper.convertValue(foo2, Map.class));
        return mockFooList;
    }

    public static List<VistaDataChunk> createChunks(List items, String domain) {
        ObjectMapper jsonMapper = new ObjectMapper();
        List<VistaDataChunk> mockFooChunkList = new ArrayList<VistaDataChunk>(items.size());
        for (int i = 0; i < items.size(); i++) {
            mockFooChunkList.add(createVistaDataChunk(MOCK_VISTA_ID, VISTA_RPC_BROKER_SCHEME + "://" + MOCK_VISTA_ID + VPR_GET_OPERATIONAL_DATA_RPC_URI, jsonMapper.convertValue(items.get(i), JsonNode.class), domain, i, items.size()));
        }
        return mockFooChunkList;
    }

    public static JsonNode createReturnJsonForFooList(List itemList) {
        ObjectNode returnJson = JsonNodeFactory.instance.objectNode();
        returnJson.put("apiVersion", "1.01");
        returnJson.put("success", true);
        ObjectNode dataNode = returnJson.putObject("data");
        dataNode.put("totalItems", itemList.size());
        ArrayNode itemsNode = dataNode.putArray("items");
        for (Object o : itemList) {
            JsonNode item = POMUtils.convertObjectToNode(o);
            itemsNode.add(item);
        }
        return returnJson;
    }

    public static JsonNode createReturnJsonForSuccess(String uid) {
        ObjectNode returnJson = JsonNodeFactory.instance.objectNode();
        returnJson.put("apiVersion", "1.01");
        returnJson.put("success", true);
        ObjectNode dataNode = returnJson.putObject("data");
        dataNode.put("uid", uid);
        return returnJson;
    }
}
