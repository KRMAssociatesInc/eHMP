package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.POMUtils;

import java.io.InputStream;
import java.util.*;

public class MockVistaDataChunks {

    public static final String VISTA_ID = "F484";
    public static final String ICN = "12345";
    public static final String DFN = "229";
    public static final String DIVISION = "500";

    public static VistaDataChunk createFromJson(JsonNode json, PatientDemographics pt, String domain) {
        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(VISTA_ID, "vrpcb://" + VISTA_ID + SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI, json, domain, 0, 1, pt, getParams());
        chunk.setLocalPatientId(DFN);
        return chunk;
    }

    public static VistaDataChunk createFromJson(JsonNode json, String systemId, String dfn, String domain) {
        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(systemId, "vrpcb://" + systemId + SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI, json, domain, 0, 1, null, getParams());
        chunk.setLocalPatientId(dfn);
        return chunk;
    }

    public static VistaDataChunk createFromJson(String json, PatientDemographics pt, String domain) {
        return createFromJson(POMUtils.parseJSONtoNode(json), pt, domain);
    }

    public static VistaDataChunk createFromJson(String json, String systemId, String dfn, String domain) {
        return createFromJson(POMUtils.parseJSONtoNode(json), systemId, dfn, domain);
    }

    public static VistaDataChunk createFromJson(InputStream stream, PatientDemographics pt, String domain) {
        JsonNode jsonNode = POMUtils.parseJSONtoNode(stream);
        return createFromJson(jsonNode, pt, domain);
    }

    public static VistaDataChunk createFromJson(InputStream stream, String systemId, String dfn, String domain) {
        JsonNode jsonNode = POMUtils.parseJSONtoNode(stream);
        return createFromJson(jsonNode, systemId, dfn, domain);
    }

    public static List<VistaDataChunk> createListFromJson(String systemId, PatientDemographics pt, String domain, int num) {
        final Random random = new Random(System.currentTimeMillis());
        List<VistaDataChunk> items = new ArrayList<VistaDataChunk>();
        for (int i = 0; i < num; i++) {
            String json = "{\"localId\":\"" + String.valueOf(random.nextLong()) + "\", \"uid\":\"urn:va:foo:bar:" + String.valueOf(random.nextLong()) + "\"}";
            VistaDataChunk item = VistaDataChunk.createVistaDataChunk(VISTA_ID, "vrpcb://" + VISTA_ID + SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI, POMUtils.parseJSONtoNode(json), domain, i, num, pt, getParams());
            items.add(item);
        }

        return items;
    }

    public static VistaDataChunk createOperationalFromJson(JsonNode json, String domain) {
        return VistaDataChunk.createVistaDataChunk(VISTA_ID, "vrpcb://" + VISTA_ID + SynchronizationRpcConstants.VPR_GET_OPERATIONAL_DATA_RPC_URI, json, domain, 0, 1, null, getParams());
    }

    public static VistaDataChunk createOperationalFromJson(String json, String domain) {
        return createOperationalFromJson(POMUtils.parseJSONtoNode(json), domain);
    }

    public static VistaDataChunk createOperationalFromJson(InputStream json, String domain) {
        JsonNode jsonNode = POMUtils.parseJSONtoNode(json);
        return createOperationalFromJson(jsonNode, domain);
    }

    public static List<VistaDataChunk> createOperationalListFromJson(String systemId, String domain, int num) {
        final Random random = new Random(System.currentTimeMillis());
        List<VistaDataChunk> items = new ArrayList<VistaDataChunk>();
        for (int i = 0; i < num; i++) {
            String json = "{\"localId\":\"" + String.valueOf(random.nextLong()) + "\"}";
            VistaDataChunk item = createOperationalFromJson(json, domain);
            item.setItemIndex(i);
            item.setItemCount(num);
            items.add(item);
        }

        return items;
    }

    private static Map getParams() {
        Map params = new LinkedHashMap();
        return params;
    }

}
