package gov.va.cpe.vpr.sync.vista.json.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.sync.vista.json.AbstractImporterTest;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.zip.CRC32;

public class BulkDataITCase extends AbstractImporterTest {

    private RpcTemplate rpcTemplate = new RpcTemplate();
    private ObjectMapper jsonMapper = new ObjectMapper();
    private static final String HF_JSON = "\n{\n    \"category\": {\n        \"name\": \"PTSD ON GUARD\",\n        \"uid\": \"urn:va:factor-category:PTSD ON GUARD\"\n    },\n    \"encounterName\": \"AUDIOLOGY Jul 25, 2012\",\n    \"encounterUid\": \"urn:va:visit:F484:359:7355\",\n    \"entered\": 20120725120226,\n    \"facilityCode\": 500,\n    \"facilityName\": \"CAMP MASTER\",\n    \"kind\": \"Health Factor\",\n    \"localId\": 131,\n    \"locationName\": \"AUDIOLOGY\",\n    \"name\": \"PTSD SCREEN - ON GUARD\",\n    \"summary\": \"PTSD SCREEN - ON GUARD\",\n    \"uid\": \"urn:va:factor:F484:359:131\"\n}\n";


    @Ignore
    @Test
    public void testUpdate() throws Exception {

        String pat = "359";
        String user = "1089";
        Integer num = 10;
        String command = "saveData";
        String domain = "factor";
        String sysId = "Test_Bulk_Data";

        LinkedHashMap<Object, Object> params = new LinkedHashMap<Object, Object>();
        params.put("patient", pat);
        params.put("user", user);
        params.put("num", num);
        params.put("command", command);
        params.put("json", HF_JSON);
        params.put("domain", domain);
        params.put("system", sysId);

        //Store values to VistA
        String uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPRTRPC RPC";
        RpcTemplate rpc = new RpcTemplate();
        String jsonResponse = rpc.executeForString(uri, params);
        String saveData = jsonResponse;
//        System.out.println(jsonResponse)
        JsonNode json = jsonMapper.readValue(jsonResponse, JsonNode.class);

        //Return values in freshness call
        String lastUpdate = json.get("lastUpdate").asText();
        String saveUpdate = lastUpdate;
        lastUpdate = callFreshness(sysId, lastUpdate, domain, num, false);

        //Delete values from VistA, either an delete entry or marked as entered in error
        uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPRTRPC RPC";
        params.clear();
        params.put("patient", pat);
        params.put("system", sysId);
        params.put("command", "deleteData");
        params.put("json", saveData);
//        System.out.println(params)
        String result = rpc.executeForString(uri, params);

        //Call freshness to get deleted values back.
        lastUpdate = callFreshness(sysId, lastUpdate, domain, num, true);

        //Clear values from freshness
        uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPRTRPC RPC";
        params.clear();
        params.put("system", sysId);
        params.put("command", "clearData");
        params.put("patient", pat);
        params.put("id", saveUpdate);
        params.put("beg", saveUpdate);
        params.put("end", lastUpdate);
        params.put("json", saveData);
        System.out.println(params);
        result = rpc.executeForString(uri, params);
//        System.out.println("delete data " + result)

    }

    private String callFreshness(String sysId, String id, String domain, Integer num, Boolean delete) throws IOException {
        LinkedHashMap<Object, Object> params = new LinkedHashMap<Object, Object>();
        RpcTemplate rpc = new RpcTemplate();
        String uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPR GET PATIENT DATA JSON";
        //        System.out.println("last updated " + lastUpdate)

        params.put("domain", "new");
        params.put("id", id);
        params.put("text", "1");
        params.put("systemID", sysId);
        //        System.out.println(params)
        String jsonResponse = rpc.executeForString(uri, params);
        //        System.out.println(jsonResponse)
        JsonNode json = jsonMapper.readValue(jsonResponse, JsonNode.class);
        JsonNode dataNode = json.path("data");
        String updateValue = dataNode.path("lastUpdate").textValue();
        //        System.out.println(updateValue)
        JsonNode patientNode = dataNode.path("patients").path(0);
        //        System.out.println(patientNode)
        if (!delete) {
            JsonNode domainNode = patientNode.path("domains").path(0);
            String domainName = domainNode.path("domainName").textValue();
            Assert.assertEquals(domain, domainName);
            Integer total = domainNode.path("total").intValue();
            Assert.assertEquals(num, total);
        } else {
            JsonNode deletesNode = patientNode.path("deletes");
            //        System.out.println(patientNode)
            //        System.out.println(deletesNode)
            Integer cnt = 0;
            String domainName;
            if (!deletesNode.isMissingNode()) {
                for (JsonNode deleteNode : deletesNode) {
                    String uid = deleteNode.get("uid").textValue();
                    domainName = deleteNode.get("domainName").textValue();
                    Assert.assertEquals(domain, domainName);
                    cnt = cnt++;
                }
            }

            Assert.assertEquals(num, cnt);
        }

        return updateValue;

    }

    @Ignore
    @Test
    public void crcTest() throws Exception {
        JsonNode json = jsonMapper.readValue(HF_JSON, JsonNode.class);
        String name = json.path("name").textValue();
        JsonNode entered = json.path("entered");
        String uid = json.path("uid").textValue();

        String[] uidArray = uid.split(":");
        String domain = uidArray[4].toString();
        String fields = getFields();
        JsonNode jsonFields = jsonMapper.readValue(fields, JsonNode.class);
        JsonNode dataNode = jsonFields.path("data");
        Long value = null;
        CRC32 crc32 = new CRC32();
        for (JsonNode typeNode : dataNode) {
            if (typeNode.path("type").path("name").textValue().equals(domain)) {
                JsonNode fieldsNode = typeNode.path("type").path("fields");
                byte[] bytes;
                for (int f = 0; f < fieldsNode.size(); f++) {
                    String fieldName = fieldsNode.path(f).path("field").textValue();
                    //need to check for null values to handle different file types for
                    // for comparision
                    String field = json.path(fieldName).textValue();
                    if (!StringUtils.hasText(field)) field = json.path(fieldName).asText();

                    String fieldValue = fieldName.toString() + ":" + field;
//                    System.out.println(fieldValue)
                    bytes = (fieldValue).getBytes(Charset.forName("ISO-8859-1"));
                    crc32.update(bytes, 0, bytes.length);
                    value = crc32.getValue();
//                    System.out.println(value)
                }

            }
        }

        LinkedHashMap<Object, Object> params = new LinkedHashMap<Object, Object>();
        params.put("domain", "factor");
        params.put("patientId", 359);
        params.put("uid", uid);
        params.put("system", "test system");
        params.put("queued", false);
        RpcTemplate rpc = new RpcTemplate();
        String uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPR GET CHECKSUM";
        String result = rpc.executeForString(uri, params);
        System.out.println(value);
        System.out.println(result);
        assertNotNull(value);
        Assert.assertEquals(value.toString(), result);
    }

    @Ignore
    @Test
    public void comparePatient() throws Exception {
        LinkedHashMap<Object, Object> params = new LinkedHashMap<Object, Object>();
        params.put("patientId", 8);
        params.put("system", "test system");
        params.put("queued", true);
        RpcTemplate rpc = new RpcTemplate();
        String uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPR GET CHECKSUM";
        String result = null;
//        if (!result) System.out.println('result not defined')
        while (!StringUtils.hasText(result)) {
//            System.out.println('In while loop')
            result = rpc.executeForString(uri, params);
            Thread.sleep(3000);
        }

//        System.out.println('Out of while loop')
        JsonNode vistaCrc = jsonMapper.readValue(result, JsonNode.class);
        Integer pid = 8;
        RestTemplate resttpl = new RestTemplate();
        JdsTemplate tpl = new JdsTemplate();
        tpl.setRestTemplate(resttpl);
        tpl.setJdsUrl("http://localhost:9080");
        JsonNode jdsResult = tpl.getForJsonNode("/vpr/" + pid + "/checksum/F484");
        JsonNode vistaPatient = vistaCrc.path("patient");
        JsonNode jdsPatient = jdsResult.path("patient");
//        assertEquals(vistaPatient.path("crc"), jdsPatient.path("crc"))
        Assert.assertNotEquals(vistaPatient.path("crc"), jdsPatient.path("crc"));
        HashMap<String, Object> uids = new HashMap<String, Object>();
        uids = compareJsonNodes(vistaCrc, jdsResult, pid.toString());
//        System.out.println(uids)
    }

    private String getFields() {
        LinkedHashMap<Object, Object> params = new LinkedHashMap<Object, Object>();
        params.put("command", "getFields");
        RpcTemplate rpc = new RpcTemplate();
        String uri = "vrpcb://10vehu;vehu10@localhost:29060/" + "VPR DEV CONTEXT/VPRTRPC RPC";
        String result = rpc.executeForString(uri, params);
        return null;
    }

    public HashMap<String, Object> compareJsonNodes(JsonNode source, JsonNode compare, String pid) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        if (source.equals(compare)) {
            return result;
        }

        Iterator<String> it = source.fieldNames();
        while (it.hasNext()) {
            String field = it.next();
            if (field.equals("patient")) continue;
            JsonNode sourceDomain = source.path(field);
            JsonNode compareDomain = compare.path(field);
            if (!sourceDomain.path("crc").equals(compareDomain.path("crc"))) {
                JsonNode sourceUid = sourceDomain.path("uids");
                JsonNode compareUid = compareDomain.path("uids");
                for (int i = 0; i < sourceUid.size(); i++) {
                    JsonNode node = sourceUid.path(i);
                    Iterator<String> j = node.fieldNames();
                    while (j.hasNext()) {
                        String uid = j.next();
                        JsonNode path = compareUid.findPath(uid);
                        if (!path.asBoolean()) {
                            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
                            map.put("uid", uid);
                            map.put("reason", "Uid not found JDS");
                            list.add(map);
                        } else if (!node.path(uid).equals(path)) {
                            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
                            map.put("uid", uid);
                            map.put("reason", "Checksum do not match");
                            list.add(map);
                        }

                    }
                }

                for (int i = 0; i < compareUid.size(); i++) {
                    JsonNode node = compareUid.path(i);
                    Iterator<String> it2 = node.fieldNames();
                    while (it2.hasNext()) {
                        String uid = it2.next();
                        JsonNode path = sourceUid.findPath(uid);
                        if (!path.asBoolean()) {
                            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
                            map.put("uid", uid);
                            map.put("reason", "Uid not found in VistA Extract");
                            list.add(map);
                        }

                    }
                }
            }
        }

        if (list.size() > 0) {
            result.put("pid", pid);
            result.put("uids", list);
        }

        return result;
    }

    public String findCrc(JsonNode compare, String find) {
        String result = "0";
        for (int i = 0; i < compare.size(); i++) {
            JsonNode node = compare.path(i);
            Iterator<String> it = node.fieldNames();
            while(it.hasNext()) {
                String uid = it.next();
                if (find.equals(uid)) {
                    result = node.path(uid).toString();
                    return result;
                }
            }
        }

        return result;
    }
}
