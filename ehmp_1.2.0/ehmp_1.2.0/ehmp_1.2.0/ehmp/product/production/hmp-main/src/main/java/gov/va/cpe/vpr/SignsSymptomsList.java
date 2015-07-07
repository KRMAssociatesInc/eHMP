package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
/**
 * Implementation of Signs and Symptoms java class for the Signs and Symptoms json list
 * 
 * {"apiVersion":"1.01","data":{"updated":"20141003195624","currentItemCount":417,
 *  "totalItems":417,"last":425,"items":[
 *  {"localId":559,"name":"HEMATOMA","uid":"urn:va:signssymptoms-list:9E7A:559"}
 *  ]}}
 * 
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class SignsSymptomsList extends AbstractPOMObject {
	
	
	private String localId;
	private String name;
	
	@JsonCreator
	public SignsSymptomsList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}
	
	public String getLocalId() {
		return localId;
	}

	public void setLocalId(String localId) {
		this.localId = localId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JsonIgnore
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}

}
