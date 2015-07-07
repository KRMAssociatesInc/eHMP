package gov.va.cpe.vpr.sync.vista.json.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.AbstractImporterTest;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;

import java.util.*;

public class AsyncExtractITCase extends AbstractImporterTest {

    private RpcTemplate rpcTemplate = new RpcTemplate();
    private ObjectMapper jsonMapper = new ObjectMapper();
    //    private static final String PUT_JSON = '{"command":"put","localId":100848,"path":"/vpr/subscription","server":"AGP SERVER"}'
    private String server = "JMC GFE";
    private String lastId = "0";
    private int totalObjects = 0;
    private ArrayList<String> pendingPatients;

    public class VprObject {
        public String pid;
        public String collection;
        public JsonNode jsonObject;
    }

    @Test
    public void testPatientExtract() throws Exception {

        HashMap<String,Object> putData = new HashMap<String,Object>();
        pendingPatients = new ArrayList<String>();
        pendingPatients.add("100848");
        subscribePatient("100848");
        monitorUpdates();
        Assert.assertTrue(totalObjects>0);
    }

    @Test
    @Ignore
    public void testPatientDomainExtract() throws Exception {

        HashMap<String,Object> putData = new HashMap<String,Object>();
        pendingPatients = new ArrayList<String>();
        pendingPatients.add("100848");
        subscribePatientDomains("100848", "med");
        monitorUpdates();
        Assert.assertTrue(totalObjects>0);
    }

    public void monitorUpdates() throws InterruptedException {
        // pendingPatients object is specific to this test
        // this would normally loop indefinitely
        while (pendingPatients.size() > 0) {
            checkForUpdates();
            Thread.sleep(1000);
        }
        checkForUpdates(); // call one more time so VistA knows what we've received
        System.out.println("lastId: " + lastId);
        System.out.println("totalObjects: " + totalObjects);
    }

    private void checkForUpdates() {
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
                    pendingPatients.remove(vprObject.jsonObject.path("localId").asText());
                    System.out.println();
                    System.out.println(pendingPatients.toString());
                }
            }
        }
        lastId = fullResponse.path("data").path("lastUpdate").asText();
        System.out.println("  count: " + objects.size());
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

    public void subscribePatient(String patientId) {
        Map<String, String> params = new LinkedHashMap<String, String>();
        params.put("command", "putPtSubscription");
        params.put("server", server);
        params.put("localId", patientId);
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
        JsonNode json = rpcTemplate.executeForJson(url, params);
        if (json.has("error")) {
            System.err.println(json.path("error").path("message").asText());
        }
        return json;
    }
}
