package gov.va.cpe.vpr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.AbstractImporterTest;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;

public class ChecksumTest extends AbstractImporterTest {

    private IChecksumService checksumService;
    private ObjectMapper jsonMapper = new ObjectMapper();

    @Test
    public void checkSameChecksum() throws Exception {
        String pid = "362";
        ArrayList<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
        JsonNode sourceCrc = getResourceAsJson("checksum-source.json");
        JsonNode compareCrc = getResourceAsJson("checksum-source.json");
        HashMap<String, Object> uids = new HashMap<String, Object>();
        uids = compareJsonNodes(sourceCrc, compareCrc, pid);
        if (uids.size() > 0) {
            result.add(uids);
        }

//        System.out.println(uids)
        //        assertFalse(same)
        Assert.assertEquals(0, result.size());
    }

    @Test
    public void checkDifferentChecksum() throws Exception {
        //pov should have one entry with a different checksum. Lab should be missing an uid
        String pid = "362";
        ArrayList<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
        JsonNode sourceCrc = getResourceAsJson("checksum-source.json");
        JsonNode compareCrc = getResourceAsJson("checksum-compare.json");
        HashMap<String, Object> uids = new HashMap<String, Object>();
        uids = compareJsonNodes(sourceCrc, compareCrc, pid);
        if (uids.size() > 0) {
            result.add(uids);
        }

//        System.out.println(result);
        //        assertFalse(same)
        Assert.assertTrue(result.size() > 0);
    }

    @Test
    public void testMerge() throws Exception {
        String pid = "362";
        JsonNode sourceCrc = getResourceAsJson("checksum-source.json");
        JsonNode compareCrc = getResourceAsJson("checksum-compare.json");
        HashMap<String, Object> uids = new HashMap<String, Object>();
        uids = compareJsonNodes(sourceCrc, compareCrc, pid);
        //        if (uids.size() > 0) {
        //            result.add(uids)
        //        }
//        System.out.println(uids);
        JsonNode value = POMUtils.convertObjectToNode(uids);
        HashMap<String, Object> results = new HashMap<String, Object>();
        results.put("vista", POMUtils.convertNodeToMap(sourceCrc));
        results.put("jds", POMUtils.convertNodeToMap(compareCrc));
        results.put("result", uids);
//        System.out.println(results);
        JsonNode output = POMUtils.convertObjectToNode(results);
//        System.out.println(output);
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
                    Iterator<String> it2 = node.fieldNames();
                    while (it2.hasNext()) {
                        String uid = it2.next();
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
                    Iterator<String> it3 = node.fieldNames();
                    while (it3.hasNext()) {
                        String uid = it3.next();
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
            while (it.hasNext()) {
                String uid = it.next();
                if (find.equals(uid)) {
                    result = node.path(uid).toString();
                    return result;
                }
            }
        }

        return result;
    }

    private JsonNode getResourceAsJson(String resourceName) throws IOException {
        return jsonMapper.readTree(getClass().getResourceAsStream(resourceName));
    }
}
