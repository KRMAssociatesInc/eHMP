package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.POMUtils;
import org.springframework.dao.DataRetrievalFailureException;
import gov.va.hmp.util.LoggingUtil;

import java.util.*;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;

/**
 * Represents a fragment of JSON returned by a VistA RPC that corresponds to an item that is processed individually, plus some metadata about where that data fragment came from.
 */
public class VistaDataChunk {

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain) {
        return createVistaDataChunk(vistaId, rpcUri, json, domain, 0, 1);
    }

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain, int itemIndex, int itemCount) {
        return createVistaDataChunk(vistaId, rpcUri, json, domain, itemIndex, itemCount, null);
    }

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain, int itemIndex, int itemCount, PatientDemographics pt) {
        return createVistaDataChunk(vistaId, rpcUri, json, domain, itemIndex, itemCount, pt, Collections.EMPTY_MAP);
    }

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain, int itemIndex, int itemCount, PatientDemographics pt, Map processorParams) {
        return createVistaDataChunk(vistaId, rpcUri, json, domain, itemIndex, itemCount, pt, processorParams, false);
    }

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain, int itemIndex, int itemCount, PatientDemographics pt, Map processorParams, boolean isBatch) {  
    	return createVistaDataChunk(vistaId, rpcUri, json, domain, itemIndex, itemCount, pt, processorParams, isBatch, NEW_OR_UPDATE);
    }

    public static VistaDataChunk createVistaDataChunk(String vistaId, String rpcUri, JsonNode json, String domain, int itemIndex, int itemCount, PatientDemographics pt, Map processorParams, boolean isBatch, String chunkType) {
        VistaDataChunk c = new VistaDataChunk();
        c.setSystemId(vistaId);
        c.setRpcUri(rpcUri);
        c.setParams(processorParams);
        c.setItemIndex(itemIndex);
        c.setItemCount(itemCount);
        c.setJson(json);
        c.setDomain(domain);
        c.setBatch(isBatch);
        c.setType(chunkType);
        if (pt != null) {
            c.setPatientId(pt.getPid());
            c.setLocalPatientId(pt.getLocalPatientIdForSystem(vistaId));
            c.setPatientIcn(pt.getIcn());
        } else {
            c.setPatientId(null);
            c.setLocalPatientId(null);
            c.setPatientIcn(null);
        }

        return c;
    }

    public static List<VistaDataChunk> createVistaDataChunks(String vistaId, String rpcUri, JsonNode jsonResponse, String domain, PatientDemographics pt, Map processorParams) {
        JsonNode itemsNode = jsonResponse.path("data").path("items");
        if (itemsNode.isNull())
            throw new DataRetrievalFailureException("missing 'data.items' node in JSON RPC response");
        List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>(itemsNode.size());
        for (int i = 0; i < itemsNode.size(); i++) {
            JsonNode item = itemsNode.get(i);
            if (vistaId == null) {
                vistaId = UidUtils.getSystemIdFromPatientUid(item.path("uid").asText());
            }
            if (processorParams == null) {
                processorParams = getProcessorParams(vistaId, pt.getPid(), pt.getIcn() != null);
            }
            chunks.add(createVistaDataChunk(vistaId, rpcUri, item, domain, i, itemsNode.size(), pt, processorParams));
        }
        return chunks;
    }

    public static Map getProcessorParams(String vistaId, String icnOrDfn, boolean icn) {
        Map m = new LinkedHashMap();
        m.put(VISTA_ID, vistaId);
        if (icn)
            m.put(PATIENT_ICN, icnOrDfn);
        else
            m.put(PATIENT_DFN, icnOrDfn);
        return m;
    }

    public static final String NEW_OR_UPDATE = "NEW_OR_UPDATE";
    public static final String ERROR = "ERROR";
    public static final String COMMAND = "COMMAND";

    /**
     * A unique identifier for the system that this chunk came from.
     * <p/>
     * In VistA, in defined as the hex string of the CRC-16 of the domain name of this VistA system.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DOMAIN NAME(8989.3,.01)"
     */
    private String systemId;

    /**
     * The VPR patient id of the patient this chunk pertains to
     */
    private String patientId;

    /**
     * The local patient id of the patient in the system this came from (DFN in VistA)
     */
    private String localPatientId;
    
    private String patientIcn;

    /**
     * The optional type of the chunk
     */
    private String type = NEW_OR_UPDATE;

    /**
     * The domain of this chunk (as passed to the extract RPC)
     */
    private String domain;

    /**
     * The actual content of this chunk as a string (usually JSON formatted)
     */
    private String content;

    /**
     * The URI of the RPC that this chunk was returned from.
     */
    private String rpcUri;

    /**
     * The index (0-based) of this chunk in the list of all chunks returned by one extract RPC
     */
    private int itemIndex;

    /**
     * The number of this type of chunk in the list of all chunks returned by one extract RPC
     */
    private int itemCount;

    /**
     * True if this chunk originated via an automatic update, false if the result of a manually triggered sync
     */
    private boolean autoUpdate = false;

    /**
     * A catch-all set of key value pairs that should accompany the chunk
     */
    private Map params;

    private JsonNode json;
    private boolean batch;

    public String getSystemId() {
        return systemId;
    }

    public void setSystemId(String systemId) {
        this.systemId = systemId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getLocalPatientId() {
        return localPatientId;
    }

    public void setLocalPatientId(String localPatientId) {
        this.localPatientId = localPatientId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRpcUri() {
        return rpcUri;
    }

    public void setRpcUri(String rpcUri) {
        this.rpcUri = rpcUri;
    }

    public int getItemIndex() {
        return itemIndex;
    }

    public void setItemIndex(int itemIndex) {
        this.itemIndex = itemIndex;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
    
    public boolean isBatch() {
    	return batch;
    }
    
    public void setBatch(boolean batch){
    	this.batch=batch;
    }

    public Map getParams() {
        return params;
    }

    public void setParams(Map params) {
        this.params = params;
    }

    public String getPatientIcn() {
        return patientIcn;
    }

    public void setPatientIcn(String patientIcn) {
        this.patientIcn = patientIcn;
    }

    public JsonNode getJson() {
        if (json == null) {
            json = POMUtils.parseJSONtoNode(content);
        }
        return this.json;
    }

    public Map<String, Object> getJsonMap() {
        return POMUtils.parseJSONtoMap(content);
    }

    public void setJson(JsonNode node) {
        content = node.toString();
        this.json = null;
    }

    @Override
    public String toString() {
        return "'%s' extract %s of %s%s returned by %s".format(domain, itemIndex + 1, itemCount, (patientIcn != null ? " for " + patientIcn : ""), rpcUri);
    }

    public String objectContentsOutput(String sMessageTitle) {
    	StringBuffer sbObjectContents = new StringBuffer();
    	String sCRLF = System.getProperty("line.separator");
    	String sTAB = "  ";

    	sbObjectContents.append(sCRLF + sMessageTitle + sCRLF);
    	sbObjectContents.append(sTAB + "autoUpdate: " + autoUpdate + sCRLF);
    	sbObjectContents.append(sTAB + "content: " + content + sCRLF);
    	sbObjectContents.append(sTAB + "domain: " + domain + sCRLF);
    	sbObjectContents.append(sTAB + "itemCount: " + itemCount + sCRLF);
    	sbObjectContents.append(sTAB + "itemIndex: " + itemIndex + sCRLF);
    	sbObjectContents.append(sTAB + "json: " + ((json == null) ? "null" : json.asText()) + sCRLF);
    	sbObjectContents.append(sTAB + "localPatientId: " + localPatientId + sCRLF);
    	sbObjectContents.append(sTAB + "params: " + itemIndex + sCRLF);
    	sbObjectContents.append(LoggingUtil.mapContentsOutput(sTAB, "params", params));
    	sbObjectContents.append(sTAB + "patientIcn: " + patientIcn + sCRLF);
    	sbObjectContents.append(sTAB + "patientId: " + patientId + sCRLF);
    	sbObjectContents.append(sTAB + "rpcUri: " + rpcUri + sCRLF);
    	sbObjectContents.append(sTAB + "systemId: " + systemId + sCRLF);
    	sbObjectContents.append(sTAB + "type: " + type + sCRLF);

    	return sbObjectContents.toString();
    }
}
