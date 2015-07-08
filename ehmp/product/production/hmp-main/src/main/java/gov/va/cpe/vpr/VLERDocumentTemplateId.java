package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

public class VLERDocumentTemplateId extends AbstractPOMObject {
	private String root;
	
	@JsonCreator
	public VLERDocumentTemplateId( Map<String, Object> vals) {
		super(vals);
	}
	
	public String getRoot(){
		return root;
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
