package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

public class VLERDocumentAuthor extends AbstractPOMObject {
	private String institution;
	private String name;
	
	@JsonCreator
	public VLERDocumentAuthor(Map<String, Object> vals){
		super(vals);
	}
	
	public String getInstitution() {
		return institution;
	}
	
	public String getName() {
		return name;
	}
	
	@JsonIgnore
	public String getSummary(){
		if(summary == null){
			return toString();
		}
		else{
			return summary;
		}
	}
	
}
