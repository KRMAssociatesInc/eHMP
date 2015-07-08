package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Represents a timestamp for when data from a particular VistA system was last fetched.
 */
public class VprUpdate extends AbstractPOMObject {

    private String systemId;
    private String timestamp;

    public VprUpdate(String systemId, String timestamp) {
        this(createData(systemId, timestamp));
    }

    @JsonCreator
    public VprUpdate(Map<String, Object> data) {
        super(data);
    }

    public String getSystemId() {
        return systemId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    private static Map<String,Object> createData(String systemId, String lastUpdate) {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("uid", "urn:va:vprupdate:" + systemId);
        data.put("systemId", systemId);
        data.put("timestamp", lastUpdate);
        return data;
    }
}
