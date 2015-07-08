package gov.va.cpe.vpr.sync.vista.json.integration;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.sync.vista.json.AbstractImporterTest;
import gov.va.hmp.vista.rpc.RpcResponseExtractionException;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.junit.Test;

import java.util.*;

public class AsyncExtractOperationalITCase extends AbstractImporterTest {

    private RpcTemplate rpcTemplate = new RpcTemplate();
    private ObjectMapper jsonMapper = new ObjectMapper();
    //    private static final String PUT_JSON = '{"command":"put","localId":100848,"path":"/vpr/subscription","server":"AGP SERVER"}'
    private String server = "FLZBBER";
    private String lastId = "0";
    private int totalObjects = 0;

    public class VprObject {
        public String pid;
        public String collection;
        public JsonNode jsonObject;
    }

    @Test
    public void testPatientExtract() throws Exception {

        HashMap<String,Object> putData = new HashMap<String,Object>();
        subscribeOperational();
        monitorUpdates();
    }

    public void monitorUpdates() throws InterruptedException {
        // pendingPatients object is specific to this test
        // this would normally loop indefinitely
        while (checkForUpdates()) {
            Thread.sleep(1000);
        }
        checkForUpdates(); // call one more time so VistA knows what we've received
        System.out.println("lastId: " + lastId);
        System.out.println("totalObjects: " + totalObjects);
    }

    private boolean checkForUpdates() {
        System.out.print("lastId: " + lastId);
        System.out.print("  load");
        JsonNode fullResponse = loadUpdates(lastId);
        System.out.print(fullResponse);
        System.out.print("  extract");
        List<VprObject> objects = extractObjects(fullResponse);
        System.out.print("  save");
        for (VprObject vprObject : objects) {
            if (vprObject.collection.equals("syncStart")) {
//                jds.addPatient(vprObject);       // first object for patient is demographics
                totalObjects++;
            } else {
//                jds.savePatientItem(vprObject);  // subsequent objects
                totalObjects++;
            }

            // pendingPatients object is specific to this test
            // special checking so monitorUpdates knows when all patients have been synched
            if (vprObject.collection.equals("syncStatus")) {
                if (vprObject.jsonObject.path("initialized").asBoolean()) {
                    System.out.println();
                    return false;
                }
            }
        }
        lastId = fullResponse.path("data").path("lastUpdate").asText();
        System.out.println("  count: " + objects.size());
        return true;
    }

    private List<VprObject> extractObjects(JsonNode fullResponse) {
        List<VprObject> itemList = null;
        JsonNode itemsNode = fullResponse.path("data").path("items");
        int itemCount = itemsNode.size();
        itemList = new ArrayList<VprObject>(itemCount);
        for (int i=0; i < itemCount; i++) {
            JsonNode wrapper = itemsNode.get(i);
            VprObject vprObject = new VprObject();
            vprObject.collection = wrapper.path("collection").asText();
            vprObject.pid = wrapper.path("pid").asText();
            vprObject.jsonObject = wrapper.path("object").isMissingNode() ? null : wrapper.path("object");
            if (vprObject.jsonObject != null) itemList.add(vprObject); // no object if domain has 0 items
        }
        return itemList;
    }

    public void subscribeOperational() {
        Map<String, String> params = new LinkedHashMap<String, String>();
        params.put("command", "startOperationalDataExtract");
        params.put("server", server);
        String url =  "vrpcb://10vehu;vehu10@localhost:29060/" + "HMP SYNCHRONIZATION CONTEXT/HMPDJFS API";
        JsonNode json = rpcTemplate.executeForJson(url, params);
        if (json.has("error")) {
            System.err.println(json.path("error").path("message").asText());
        }
    }

    public void subscribePatientDomains(String patientId, String domain) {
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        ArrayList<String> domains = new ArrayList<String>();
        domains.add(domain);
        params.put("command", "putPtSubscription");
        params.put("server", server);
        params.put("localId", patientId);
        params.put("domains", domains);
        String url =  "vrpcb://10vehu;vehu10@localhost:29060/" + "HMP SYNCHRONIZATION CONTEXT/HMPDJFS API";
        JsonNode json = rpcTemplate.executeForJson(url, params);
        if (json.has("error")) {
            System.err.println(json.path("error").path("message").asText());
        }
    }

    public JsonNode loadUpdates(String lastUpdate) {
        Map<String, String> params = new LinkedHashMap<String, String>();
        params.put("command", "getPtUpdates");
        params.put("server", server);
        params.put("lastUpdate", lastUpdate);
        params.put("max", "1000");
        String url = "vrpcb://10vehu;vehu10@localhost:29060/" +"HMP SYNCHRONIZATION CONTEXT/HMPDJFS API";
        
        JsonNode json = null;
        try {
        	json = rpcTemplate.executeForJson(url, params);
        } catch(RpcResponseExtractionException e) {
        	JsonParseException exc = (JsonParseException) e.getCause();
        	int col = exc.getLocation().getColumnNr();
        	String respStr = e.getResponse().toString();
        	System.out.println();
        	System.out.println("Starting chars: "+respStr.substring(0,500));
        	System.out.println("In or around: "+respStr.substring(col-500, Math.min(col+500, respStr.length())));
            System.out.println("Ends with: "+respStr.substring(respStr.length()-100));
            e.printStackTrace();
        }

        return json;
    }
}
