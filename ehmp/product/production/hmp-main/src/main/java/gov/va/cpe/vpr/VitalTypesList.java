package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
/**
 *  {"apiVersion":"1.01","data":{"updated":"20141007195624","currentItemCount":19,
 * "totalItems":19,"last":19,"items":[
 * {"abbreviation":"PO2","effective":20070607120123,"localId":21,"masterVuid":"YES"
 * ,"name":"PULSE OXIMETRY","pce":"PO2","rate":"YES","status":"ACTIVE",
 * "uid":"urn:va:vitaltypes-list::21","vuid":"urn:va:vuid:4500637"}
 * ]}}
 * 
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class VitalTypesList extends AbstractPOMObject {

	private String abbreviation;
	private PointInTime effective;
	private String localId;
	private String masterVuid;
	private String name;
	private String pce;
	private String rate;
	private String status;
	
	
	
	public String getAbbreviation() {
		return abbreviation;
	}



	public void setAbbreviation(String abbreviation) {
		this.abbreviation = abbreviation;
	}



	public PointInTime getEffective() {
		return effective;
	}



	public void setEffective(PointInTime effective) {
		this.effective = effective;
	}

	public String getLocalId() {
		return localId;
	}

	public void setLocalId(String localId) {
		this.localId = localId;
	}

	public String getMasterVuid() {
		return masterVuid;
	}



	public void setMasterVuid(String masterVuid) {
		this.masterVuid = masterVuid;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getPce() {
		return pce;
	}



	public void setPce(String pce) {
		this.pce = pce;
	}



	public String getRate() {
		return rate;
	}



	public void setRate(String rate) {
		this.rate = rate;
	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	@JsonCreator
	public VitalTypesList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}
}
