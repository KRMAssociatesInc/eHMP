package gov.va.hmp.jira;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/3/14
 * Time: 11:27 AM
 * To change this template use File | Settings | File Templates.
 */
public class JiraTicket extends AbstractPOMObject {

    String expand;
    String id;
    String self;
    String key;
    Map<String, Object> fields;

    public JiraTicket(Map<String, Object> rslt) {
        super(rslt);
        if(fields==null) {fields = new HashMap<>();}
    }

    public JiraTicket() {
        this(null);
        if(fields==null) {fields = new HashMap<>();}
    }

    public String getExpand() {
        return expand;
    }

    public void setExpand(String expand) {
        this.expand = expand;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Map<String, Object> getFields() {
        return fields;
    }

    public void setFields(Map<String, Object> fields) {
        this.fields = fields;
    }
}