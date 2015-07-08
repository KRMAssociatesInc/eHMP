package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.vista.rpc.JacksonRpcResponseExtractor;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataRetrievalFailureException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.*;
import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

/**
 * Implementation of {@link IVistaOperationalDataDAO}
 */
public class VistaOperationalDataDAO extends VistaDaoSupport implements IVistaOperationalDataDAO, EnvironmentAware {

	public static final String OPERATIONAL_DATA_STREAM_RPC_URI = "/" +  SynchronizationRpcConstants.VPR_SYNCHRONIZATION_CONTEXT + "/" + SynchronizationRpcConstants.VPR_STREAM_API_RPC;
	
    private JacksonRpcResponseExtractor jsonRpcResponseExtractor = new JacksonRpcResponseExtractor();
	private Environment environment;
	private RpcOperations synchronizationRpcTemplate;

    private static Logger LOGGER = LoggerFactory.getLogger(VistaOperationalDataDAO.class);

    @Autowired
    void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Override
    public <T extends IPOMObject> T fetchOne(String vistaId, Class<T> type, String domain, String localId) {
        Map params = getRpcParam(domain);
        params.put("id", localId);
        JsonNode responseJson = rpcTemplate.executeForJson(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_GET_OPERATIONAL_DATA_RPC_URI, params);
        List<T> items = createListFromJsonCResponse(type, responseJson);
        return items.get(0);
    }

    @Override
    public <T> List<VistaDataChunk> fetchAllByDomain(String vistaId, Class<T> type) {
        String domain = getCollectionName(type);
        return fetchAllByDomain(vistaId, domain);
    }

    @Override
    public List<VistaDataChunk> fetchAllByDomain(String vistaId, String domain) {
        Map params = getRpcParam(domain);
        RpcResponse rpcResponse = rpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_GET_OPERATIONAL_DATA_RPC_URI, params);
        JsonNode responseJson = jsonRpcResponseExtractor.extractData(rpcResponse);
        return createVistaDataChunks(vistaId, rpcResponse.getRequestUri(), responseJson, domain);
    }

    @Override
    public <T> VistaDataChunkBatch fetchBatchByDomain(String vistaId, Class<T> type, int limit, String startId) {
        String domain = getCollectionName(type);
        return fetchBatchByDomain(vistaId, domain, limit, startId);
    }

    @Override
    public VistaDataChunkBatch fetchBatchByDomain(String vistaId, String domain, int limit, String startId) {
        Map params = getRpcParam(domain);
        params.put("limit", limit);
        params.put("start", startId == null ? "" : startId);
        RpcResponse rpcResponse = rpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_GET_OPERATIONAL_DATA_RPC_URI, params);
        JsonNode responseJson = jsonRpcResponseExtractor.extractData(rpcResponse);
        List<VistaDataChunk> chunks = createVistaDataChunks(vistaId, rpcResponse.getRequestUri(), responseJson, domain);
        String lastId = responseJson.path("data").path("last").asText();
        return new VistaDataChunkBatch(chunks, startId, lastId);
    }

    @Override
    public <T extends IPOMObject> T save(String vistaId, T entity) {
        String requestJsonString = POMUtils.toJSON(entity);
        JsonNode responseJson = executeForJsonAndSplitLastArg(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_PUT_OBJECT_RPC_URI, getCollectionName(entity.getClass()), requestJsonString);
        if (!responseJson.path("success").booleanValue()) {
            String message = responseJson.path("error").path("message").textValue();
            throw new DataRetrievalFailureException("Unable to save " + entity.getClass().getName() + " to VPR OBJECT file: " + message);
        }
        Map<String, Object> data = POMUtils.convertNodeToMap(responseJson.path("data"));
        entity.setData(data);
        return entity;
    }

    private <T extends IPOMObject> Map getRpcParam(Class<T> type) {
        String domain = getCollectionName(type);
        return getRpcParam(domain);
    }

    private Map getRpcParam(String domain) {
        Map params = new HashMap();
        params.put("domain", domain);
        return params;
    }

    private List<VistaDataChunk> createVistaDataChunks(String vistaId, String rpcUri, JsonNode jsonResponse, String domain) {
        JsonNode itemsNode = jsonResponse.path("data").path("items");
        if (itemsNode.isNull())
            throw new DataRetrievalFailureException("missing 'data.items' node in JSON RPC response");
        List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>(itemsNode.size());
        if (domain.equalsIgnoreCase("patient")) {
            for (int i = 0; i < itemsNode.size(); i++) {
                JsonNode item = itemsNode.get(i);
                PatientDemographics pt = POMUtils.newInstance(PatientDemographics.class, item);
                chunks.add(VistaDataChunk.createVistaDataChunk(vistaId, rpcUri, item, domain, i, itemsNode.size(), pt));
            }
        } else {
            for (int i = 0; i < itemsNode.size(); i++) {
                JsonNode item = itemsNode.get(i);
                chunks.add(VistaDataChunk.createVistaDataChunk(vistaId, rpcUri, item, domain, i, itemsNode.size()));
            }
        }
        return chunks;
    }

    private <T> List<T> createListFromJsonCResponse(Class<T> type, JsonNode jsonc) {
        if (!Map.class.isAssignableFrom(type) && !IPOMObject.class.isAssignableFrom(type))
            throw new IllegalArgumentException("[Assertion failed] - type must be of type " + Map.class + " or of type " + IPOMObject.class);
        if (jsonc == null) {
            throw new DataRetrievalFailureException("Unable to fetch all " + type.getName() + "s from " + VPR_GET_OPERATIONAL_DATA_RPC + " because response JSON was null");
        }

        JsonNode dataNode = jsonc.path("data");
        if (dataNode.isNull()) {
            String message = jsonc.path("error").path("message").textValue();
            throw new DataRetrievalFailureException("Unable to fetch all " + type.getName() + "s from " + VPR_GET_OPERATIONAL_DATA_RPC + ": " + message);
        }

        JsonNode itemsNode = jsonc.path("data").path("items");
        List<T> ret = (List<T>) (Map.class.isAssignableFrom(type) ? createListOfMaps(type.asSubclass(Map.class), itemsNode) : createList(type.asSubclass(IPOMObject.class), itemsNode));
        return ret;
    }

    private <T extends IPOMObject> List<T> createList(Class<T> type, JsonNode itemsNode) {
        List<T> ret = new ArrayList<T>(itemsNode.size());
        for (JsonNode itemNode : itemsNode) {
            T item = POMUtils.newInstance(type, itemNode);
            ret.add(item);
        }
        return ret;
    }

    private List<Map> createListOfMaps(Class<? extends Map> type, JsonNode itemsNode) {
        List<Map> ret = new ArrayList<Map>(itemsNode.size());
        for (JsonNode itemNode : itemsNode) {
            Map item = POMUtils.convertNodeToMap(itemNode);
            ret.add(item);
        }
        return ret;
    }

	@Override
	public void setEnvironment(Environment environment) {
		this.environment = environment;
	}

    private void doSynchronizationCommand(String command, String vistaId) {
        Map<String, Object> params = new HashMap<>();
        params.put("server", environment.getProperty(HmpProperties.SERVER_ID));
        params.put("command",command);

        String url =  VISTA_RPC_BROKER_SCHEME + "://" + vistaId + OPERATIONAL_DATA_STREAM_RPC_URI;
        JsonNode json = synchronizationRpcTemplate.executeForJson(url, params);

        if (json.has("error")) {
            String msg = json.path("error").path("message").asText();
            LOGGER.error("unable to subscribe to operational event stream for vistId '{}': {}", vistaId, msg);
        }
    }

	@Override
	public void subscribe(String vistaId) {
		doSynchronizationCommand("startOperationalDataExtract", vistaId);
	}

    @Override
    public void resetServerSubscriptions(String vistaId) {
        doSynchronizationCommand("resetAllSubscriptions", vistaId);
    }
}
