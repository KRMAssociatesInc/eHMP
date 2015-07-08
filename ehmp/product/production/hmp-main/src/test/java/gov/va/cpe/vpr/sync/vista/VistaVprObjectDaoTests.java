package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.test.mockito.ReturnsArgument;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_DELETE_OBJECT_RPC_URI;
import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_OBJECT_RPC_URI;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class VistaVprObjectDaoTests {

    private VistaVprObjectDao dao;
    private RpcOperations mockRpcTemplate;
    private IGenericPOMObjectDAO mockJdsDao;
    private IBroadcastService mockBroadcastService;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = mock(RpcOperations.class);
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        mockBroadcastService = mock(IBroadcastService.class);

        dao = new VistaVprObjectDao();
        dao.setRpcTemplate(mockRpcTemplate);
        dao.setJdsDao(mockJdsDao);
        dao.svc = mockBroadcastService;

        when(mockJdsDao.save(any(Foo.class))).then(new ReturnsArgument(0));
    }

    @Test
    public void testSaveMapReturnEntity() throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("bar", "spaz");
        data.put("baz", true);
        String requestJsonString = POMUtils.toJSON(data);

        JsonNode returnJson = createReturnJsonForSuccess("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString)).thenReturn(returnJson);

        Foo foo = dao.save(Foo.class, data);

        assertThat(foo.getUid(), is("urn:va:foo:1"));
        assertThat(foo.getBar(), is("spaz"));
        assertThat(foo.isBaz(), is(true));

        verify(mockRpcTemplate).executeForJson(VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString);
        verify(mockJdsDao).save(foo);
    }

    @Test
    public void testSaveEntity() throws Exception {
        Foo foo = new Foo("spaz", true);
        String requestJsonString = POMUtils.toJSON(foo);

        JsonNode returnJson = createReturnJsonForSuccess("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString)).thenReturn(returnJson);

        foo = dao.save(foo);

        assertThat(foo.getUid(), is("urn:va:foo:1"));
        assertThat(foo.getBar(), is("spaz"));
        assertThat(foo.isBaz(), is(true));

        verify(mockRpcTemplate).executeForJson(VPR_PUT_OBJECT_RPC_URI, "foo", requestJsonString);
        verify(mockJdsDao).save(foo);
    }

    @Test
    public void testDeleteEntity() throws Exception {
        Foo foo = new Foo("spaz", true);
        foo.setData("uid", "urn:va:foo:1");

        JsonNode returnJson = createReturnJsonForSuccess("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_DELETE_OBJECT_RPC_URI, "urn:va:foo:1")).thenReturn(returnJson);

        dao.delete(foo);

        verify(mockRpcTemplate).executeForJson(VPR_DELETE_OBJECT_RPC_URI, "urn:va:foo:1");
        verify(mockJdsDao).delete(foo);
    }

    @Test
    public void testDeleteByUID() throws Exception {
        Foo foo = new Foo("spaz", true);
        foo.setData("uid", "urn:va:foo:1");

        JsonNode returnJson = createReturnJsonForSuccess("urn:va:foo:1");
        when(mockRpcTemplate.executeForJson(VPR_DELETE_OBJECT_RPC_URI, "urn:va:foo:1")).thenReturn(returnJson);

        dao.deleteByUID(Foo.class, "urn:va:foo:1");

        verify(mockRpcTemplate).executeForJson(VPR_DELETE_OBJECT_RPC_URI, "urn:va:foo:1");
        verify(mockJdsDao).deleteByUID(Foo.class, "urn:va:foo:1");
    }

    @Test(expected = DataAccessException.class)
    public void testDeleteError() {
        Foo foo = new Foo("spaz", true);
        foo.setData("uid", "urn:va:foo:1");

        JsonNode returnJson = createReturnJsonForError("flibberty floo");
        when(mockRpcTemplate.executeForJson(VPR_DELETE_OBJECT_RPC_URI, "urn:va:foo:1")).thenReturn(returnJson);

        dao.delete(foo);
    }

    public static JsonNode createReturnJsonForSuccess(String uid) {
        ObjectNode returnJson = JsonNodeFactory.instance.objectNode();
        returnJson.put("apiVersion", "1.01");
        returnJson.put("success", true);
        ObjectNode dataNode = returnJson.putObject("data");
        dataNode.put("uid", uid);
        return returnJson;
    }

    public static JsonNode createReturnJsonForError(String message) {
        ObjectNode returnJson = JsonNodeFactory.instance.objectNode();
        returnJson.put("apiVersion", "1.01");
        returnJson.put("success", false);
        ObjectNode errorNode = returnJson.putObject("error");
        errorNode.put("message", message);
        return returnJson;
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
}
