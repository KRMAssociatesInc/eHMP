package gov.va.cpe.test.junit4.runners;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.cpe.vpr.sync.vista.json.PatientDemographicsImporter;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.util.Assert;

import java.util.*;

public class ImportIntegrationTestUtils {

    protected static final String EXAMPLE_CONNECTION_URI = "vrpcb://{stationNumber}:{accessCode};{verifyCode}@{host}:{port}";

    public static List<VistaDataChunk> fetchChunks(RpcTemplate rpcTemplate, String connectionUri, String dfn, String domain, PatientDemographics pt) {
        String uri = connectionUri + SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI;
        Map params = new HashMap();
        params.put("patientId", dfn);
        params.put("domain", domain);
        JsonNode response = rpcTemplate.executeForJson(uri, params);
        if (response == null) return Collections.emptyList();

        String division = RpcUriUtils.extractDivision(uri);
        List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>();
        JsonNode items = response.path("data").path("items");
        for (int i = 0; i < items.size(); i++) {
            VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(null, uri.toString(), items.get(i), domain, i, items.size(), pt, createMockJobParameters(division, dfn, pt));
            ((ArrayList<VistaDataChunk>) chunks).add(chunk);
        }

        return chunks;
    }

    public static List<VistaDataChunk> fetchChunks(RpcTemplate rpcTemplate, String connectionUri, String dfn, String domain) {
        return ImportIntegrationTestUtils.fetchChunks(rpcTemplate, connectionUri, dfn, domain, null);
    }

    public static PatientDemographics fetchPatient(RpcTemplate rpcTemplate, String uri, String dfn) {
        try {
            PatientDemographicsImporter patientImporter = new PatientDemographicsImporter();

            List<VistaDataChunk> chunks = fetchChunks(rpcTemplate, uri, dfn, "patient");
            Assert.notEmpty(chunks);
            PatientDemographics pt = patientImporter.convert(chunks.get(0));
            return pt;
        } catch (Throwable t) {
            throw t;
        }

    }

    private static Map createMockJobParameters(String division, String dfn, PatientDemographics pt) {
        Map params = new LinkedHashMap();
        params.put(SyncMessageConstants.DIVISION, division);
        params.put(SyncMessageConstants.PATIENT_DFN, dfn);
        params.put(SyncMessageConstants.PATIENT_ID, (pt == null ? null : pt.getPid()));
        params.put(SyncMessageConstants.PATIENT_ICN, (pt == null ? null : pt.getIcn()));
        return params;
    }

    private static Map createMockJobParameters(String division, String dfn) {
        return ImportIntegrationTestUtils.createMockJobParameters(division, dfn, null);
    }

}
