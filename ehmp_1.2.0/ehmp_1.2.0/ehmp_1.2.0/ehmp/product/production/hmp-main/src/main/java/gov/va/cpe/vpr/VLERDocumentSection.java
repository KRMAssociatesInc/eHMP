package gov.va.cpe.vpr;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

public class VLERDocumentSection extends AbstractPOMObject {
	//private Map<String, String> templateIds; //Might be something other than a map?
	private List<VLERDocumentTemplateId> templateIds;
	private JdsCode code; //Might be a different code class?
	private String title;
	private String text;
	
	@JsonCreator
	public VLERDocumentSection(Map<String, Object> vals){
		super(vals);
	}
	
	/*
	public Map<String, String> getTemplateIds() {
		return templateIds;
	}
	*/
	
	public List<VLERDocumentTemplateId> getTemplateIds() {
		return templateIds;
	}

	public JdsCode getCode() {
		return code;
	}

	public String getTitle() {
		return title;
	}

	public String getText() {
		return text;
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
