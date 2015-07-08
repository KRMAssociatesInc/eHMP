package gov.va.cpe.vpr.dao.jds;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.SyncStatus;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 2/3/14
 * Time: 6:22 PM
 * To change this template use File | Settings | File Templates.
 */
public class JdsSyncStatusDaoTests {
    private ObjectMapper jsonMapper = new ObjectMapper();

    @Before
    public void setUp() throws Exception {
    }

    private static String json = "  {\n" +
            "        \"uid\": \"urn:va:syncstatus:OPD\",\n" +
            "        \"summary\": \"gov.va.cpe.vpr.sync.SyncStatus@2c1cebdb\",\n" +
            "        \"syncComplete\": true,\n" +
            "        \"syncStarted\": true,\n" +
            "        \"forOperational\": \"true\",\n" +
            "   \"syncStatusByVistaSystemId\": {\n" +
            "       \"1234\": {\n\r" +
            "           \"syncComplete\" : \"true\", " +
            "           \"domainExpectedTotals\": {\n" +
            "               \"bar\": {\n" +
            "                   \"total\": 100, \n"+
            "                   \"count\": 50 \n"+
            "               }\n"+
            "           }\n"+
            "       }\n" +
            "   }\n" +
            "}";

    // @Ignore("In the previous release of HMP we had to ignore this because SyncStatus had to be changed to use boolean instead of Boolean.  Leaving this for now - but this serves as a warning message if it fails.")
    @Test
    public void testBooleanProp() throws Exception {
        JsonNode item = POMUtils.parseJSONtoNode(json);
        SyncStatus returnValue = jsonMapper.convertValue(item, SyncStatus.class);
//        System.out.println(":"+returnValue.getSyncComplete());
        assert(returnValue.getForOperational());
        assert(!returnValue.getSyncComplete());    // should return false; operational would return op flag not regular flag
        returnValue.setForOperational(false);
        assert(returnValue.getSyncComplete());
        assert(returnValue.getVistaAccountSyncStatusForSystemId("1234")!=null);
        assert(returnValue.getDomainExpectedTotalsForAllSystemIds().get("bar")!=null);
    }

    static RestTemplate tmp = null;

    private static RestTemplate getRestTemplate() {
        if(tmp==null) {

           tmp = new RestTemplate();
        }
        return tmp;
    }

    @Ignore
    @Test
    public void testNumericalVistaIdSave() throws Exception {
        RestTemplate tmp = getRestTemplate();
        JsonNode item = POMUtils.parseJSONtoNode(json);
        SyncStatus returnValue = jsonMapper.convertValue(item, SyncStatus.class);
        tmp.postForObject("http://localhost:9080/data",returnValue, SyncStatus.class);
    }

    private static class SyncStatux extends AbstractPOMObject {
        public String pid;
        public Map<String, Integer> domainExpectedTotals = new HashMap<>();

        public Boolean getSyncComplete() {
            return syncComplete;
        }

        public void setSyncComplete(Boolean syncComplete) {
            this.syncComplete = syncComplete;
        }

        private Boolean syncComplete = false;
        private String forOperational = "false";

        public String getForOperational() {
            return forOperational;
        }

        public void setForOperational(String forOperational) {
            this.forOperational = forOperational;
//            this.uid = "urn:va:syncstatus:"+(forOperational?"OPD":pid);
        }
    }
}
