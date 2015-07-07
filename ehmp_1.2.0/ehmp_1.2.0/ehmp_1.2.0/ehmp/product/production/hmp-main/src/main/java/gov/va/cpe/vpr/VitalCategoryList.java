package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
/**
 * Implementation of the VitalCategoryList java object for vital category list json
 * 
 * {"apiVersion":"1.01","data":{"updated":"20141007195624","currentItemCount":19,
 * "totalItems":19,"last":19,"items":[
 * {"category":"CUFF SIZE","effectiveDate":20070607120122,"localId":6,"masterVuid":
 * "YES","status":"ACTIVE","synonym":"","uid":"urn:va:vitalcategory-list::6","vtype
 * ":[{"defaultQualifier":66,"editOrder":4,"maxEntries":1,"printOrder":4,"vitalType
 * ":1},{"defaultQualifier":"","editOrder":2,"maxEntries":1,"printOrder":1,"vitalTy
 * pe":20},{"defaultQualifier":"","editOrder":4,"maxEntries":1,"printOrder":4,"vita
 * lType":5},{"defaultQualifier":"","editOrder":2,"maxEntries":1,"printOrder":2,"vi
 * talType":9},{"defaultQualifier":"","editOrder":1,"maxEntries":1,"printOrder":1,"
 * vitalType":21}],"vuid":"urn:va:vuid:4688627"}]}}
 * 
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class VitalCategoryList extends AbstractPOMObject {
	
	private String category;
	private PointInTime effectiveDate;
	private String localId;
	private String masterVuid;
	private String status;
	private String synonym;
	private String vuid;
	private List<Map<String, String>> vtype;
	
	
	
	@JsonCreator
	public VitalCategoryList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}



	public String getCategory() {
		return category;
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



	public String getStatus() {
		return status;
	}



	public String getSynonym() {
		return synonym;
	}



	public String getVuid() {
		return vuid;
	}



	public List<Map<String, String>> getVtype() {
		return vtype;
	}
	
	

}
