package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Implementation of the vital qualifier list of the vital qual JSON object
 * 
 * {"apiVersion":"1.01","data":{"updated":"20141007195624","currentItemCount":19,
 * "totalItems":19,"last":19,"items":[
 * {"effectiveDate":20070607145058,"localId":129,"masterVuid":"YES","qualifer":"urn:va:vitalqualifier-list:9E7A:129",
 * "status":"ACTIVE","synonym":"Hip","uid":"urn:va:vitalqualifier-list:9E7A:129",
 * "vtype":[{"category":"LOCATION","vitalType":"BLOOD PRESSURE"},{"category":"METHOD","vitalType":"TEMPERATURE"},
 * {"category":"POSITION","vitalType":"RESPIRATION"},{"category":"QUALITY","vitalType":""}],"vuid":"urn:va:vuid:4697470"}
 * ]}}
 * 
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class VitalQualifierList extends AbstractPOMObject {
	
	private PointInTime effectiveDate;
	private String localId;
	private String masterVuid;
	private String qualifier;
	private String status;
	private String synonym;
	private List<Map<String, String>> vtype;
	private String vuid;
	
	@JsonCreator
	public VitalQualifierList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}

	public PointInTime getEffectiveDate() {
		return effectiveDate;
	}

	public String getLocalId() {
		return localId;
	}

	public String getMasterVuid() {
		return masterVuid;
	}

	public String getQualifier() {
		return qualifier;
	}

	public String getStatus() {
		return status;
	}

	public String getSynonym() {
		return synonym;
	}

	public List<Map<String, String>> getVtype() {
		return vtype;
	}

	public String getVuid() {
		return vuid;
	}
	
	
	@JsonIgnore
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}

	
	
	

}
