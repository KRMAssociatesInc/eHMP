package gov.va.cpe.vpr.sync;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import javax.jms.JMSException;
import javax.jms.Message;
import java.lang.reflect.Field;
import java.util.Date;
import java.util.Map;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;

public class SyncError extends AbstractPOMObject {

    public String message;
    public String stackTrace;
    public String json;
    public String item;
    public String pid;
    public Date dateCreated;

    public String id;

    private PatientDemographics patient;

    public SyncError() {
        super(null);
    }

    @JsonCreator
    public SyncError(Map<String, Object> data) {
        super(data);
    }

    public SyncError(Message message, Map msg, Throwable t) {
        super(null);
        try {
            id=message.getJMSMessageID();
            dateCreated = new Date(message.getJMSTimestamp());
            if(msg!=null) {
                if(msg.get(PATIENT_ID)!=null) {
                    pid=msg.get(PATIENT_ID).toString();
                }
                String json = (msg.get(RPC_ITEM_CONTENT)!=null?msg.get(RPC_ITEM_CONTENT).toString():null);
                if (json != null) {
                    ObjectMapper jsonMapper = new ObjectMapper();
                    json = jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonMapper.readTree(json));
                }
                this.json=json;
            }
            StringBuffer traceText = new StringBuffer();
            this.message=t.getMessage();
            item=getItem(msg, t);
            while(t!=null) {
            	traceText.append(t.getMessage());
            	for(StackTraceElement el: t.getStackTrace()) {
                	traceText.append("\t"+el.toString());
                	traceText.append("\r\n");
            	}
            	t = t.getCause();
            	if(t!=null) {
            		traceText.append("Caused By:\r\n");
            	}
            }
            stackTrace=traceText.toString();
        } catch (Exception x) {
            throw new IllegalArgumentException("unable to convert MapMessage", x);
        }
    }

    @Override
    public String getUid() {
        return "urn:va:syncerror:"+id;
    }

    private String getItem(Map msg, Throwable t) throws JMSException {
        if (msg.get(DOMAIN)!=null) {
            if(msg.get(RPC_ITEM_INDEX)!=null && msg.get(RPC_ITEM_COUNT)!=null) {
                return String.format("'%s' chunk %d of %d returned from %s", msg.get(DOMAIN), Integer.valueOf(msg.get(RPC_ITEM_INDEX).toString()) + 1, Integer.valueOf(msg.get(RPC_ITEM_COUNT).toString()), msg.get(RPC_URI));
            } else {
                return msg.get(DOMAIN).toString();
            }
        } else if(msg.get(EXCEPTION_NAME)!=null) {
            return msg.get(EXCEPTION_NAME).toString();
        } else if(msg.get(COMMAND)!=null) {
            return msg.get(COMMAND).toString();
        } else {
                return t.getClass().getName();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PatientDemographics getPatient() {
        return patient;
    }

    public void setPatient(PatientDemographics patient) {
        this.patient = patient;
    }

    public String getMessage() {
        return message;
    }


    public void setMessage(String message) {
        this.message = message;
    }


    public String getStackTrace() {
        return stackTrace;
    }


    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
    }


    public String getJson() {
        return json;
    }


    public void setJson(String json) {
        this.json = json;
    }


    public String getItem() {
        return item;
    }


    public void setItem(String item) {
        this.item = item;
    }

    public String getPid() {
        return pid;
    }


    public void setPid(String pid) {
        this.pid = pid;
    }


    public Date getDateCreated() {
        return dateCreated;
    }


    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public boolean match(String searchString, String[] areas) throws IllegalAccessException {
        boolean matched = false;
        for(Field f: SyncError.class.getFields()) {
            boolean found = false;
            if(areas!=null) {
                for(String area: areas) {
                    if(f.getName().equalsIgnoreCase(area)) {
                        found = true;
                        break;
                    }
                }
            } else {found = true;}
            if(found) {
                Object fldval = f.get(this);
                if(fldval!=null && fldval.toString().contains(searchString)) {
                    matched=true;
                    break;
                }
            }
        }
        return matched;
    }
}
