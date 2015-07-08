package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

/**
 * Implementation of the Allergy List for the json object allergy-list
 * 
 * {"apiVersion":"1.01","data":{"updated":"20140917195624","currentItemCount":417,"
 * totalItems":417,"last":425,"items":[
 * {"localId":334,"name":"TARTRAZINE <YELLOW DYES>","root":"GMRD(120.82,\"D\")","uid":"urn:va:allergy-list::334"}
 * ]}}
 * 
 * 
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class AllergyList extends AbstractPOMObject{
	
	private String localId;
	private String name;
	private String root;
	
	
	@JsonCreator
	public AllergyList(Map<String, Object> vals) {
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
	public String getRoot() {
		return root;
	}
	public void setRoot(String root) {
		this.root = root;
	}
	
	@JsonIgnore
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}
	
	

}
