package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

/**
 * Implementation of the Java object for  the problem list
 * {"apiVersion":"1.01","data":{"updated":"20140917195624","currentItemCount":417,"
 *  totalItems":417,"last":425,"items":[
 *  {"cCode":428309004,"codeSys":"SNOMED CT","dCode":
 *  2696098012,"icd":"V12.3","icdIen":11341,"impDt":"ICD-9-CM","lexIen":
 *  8101032,"lexName":"History of RhD negative","uid":"urn:va:problem-list:9E7A:82"}
 * ]}}
 * @author nagarh
 *
 */
@SuppressWarnings("serial")
public class ProblemList extends AbstractPOMObject {

	private String cCode;
	private String codeSys;
	private String dCode;
	private String icd;
	private String icdIen;
	private String impDt;
	private String lexIen;
	private String lexName;
	
	@JsonCreator
	public ProblemList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}

	public String getcCode() {
		return cCode;
	}
	public void setcCode(String cCode) {
		this.cCode = cCode;
	}
	public String getCodeSys() {
		return codeSys;
	}
	public void setCodeSys(String codeSys) {
		this.codeSys = codeSys;
	}
	public String getdCode() {
		return dCode;
	}
	public void setdCode(String dCode) {
		this.dCode = dCode;
	}
	public String getIcd() {
		return icd;
	}
	public void setIcd(String icd) {
		this.icd = icd;
	}
	public String getIcdIen() {
		return icdIen;
	}
	public void setIcdIen(String icdIen) {
		this.icdIen = icdIen;
	}
	public String getImpDt() {
		return impDt;
	}
	public void setImpDt(String impDt) {
		this.impDt = impDt;
	}
	public String getLexIen() {
		return lexIen;
	}
	public void setLexIen(String lexIen) {
		this.lexIen = lexIen;
	}
	public String getLexName() {
		return lexName;
	}
	public void setLexName(String lexName) {
		this.lexName = lexName;
	}
	
	@JsonIgnore
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}
	
	
	
}
