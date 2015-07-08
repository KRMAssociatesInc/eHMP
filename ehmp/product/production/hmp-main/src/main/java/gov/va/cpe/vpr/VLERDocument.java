package gov.va.cpe.vpr;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;

public class VLERDocument extends AbstractPatientObject implements IPatientObject {

	//private String uid; //Already defined in superclass
	//private String pid; //Already defined in superclass
	private String localId;
	private String kind;
	//private String summary; //Already defined in superclass
	private List<VLERDocumentAuthor> authorList;
	private PointInTime creationTime;
	private String documentUniqueId;
	private String homeCommunityId;
	private String mimeType;
	private String name;
	private String repositoryUniqueId;
	private String sourcePatientId;
	private List<VLERDocumentSection> sections;
	
	@JsonCreator
	public VLERDocument(Map<String, Object> vals) {
		super(vals);
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getLocalId() {
		return localId;
	}

	public String getKind() {
		if(StringUtils.hasText(kind)) {return kind;}
		return "C32 Document";
	}

	public String getSummary() {
		if(StringUtils.hasText(summary)) {return summary;}
		return getName();
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public List<VLERDocumentAuthor> getAuthorList() {
		return authorList;
	}
	
    public void addToAuthorList(VLERDocumentAuthor author) {
        if (authorList == null) {
        	authorList = new ArrayList<VLERDocumentAuthor>();
        }
        authorList.add(author);
    }

	public PointInTime getCreationTime() {
		return creationTime;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getDocumentUniqueId() {
		return documentUniqueId;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getHomeCommunityId() {
		return homeCommunityId;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getMimeType() {
		return mimeType;
	}

	public String getName() {
		return name;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getRepositoryUniqueId() {
		return repositoryUniqueId;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getSourcePatientId() {
		return sourcePatientId;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public List<VLERDocumentSection> getSections() {
		return sections;
	}
	
	@JsonView(JSONViews.SolrView.class)
	public List<String> getSection(){
		if (sections == null || sections.isEmpty()) {return Collections.emptyList();}
		List<String> titlesAndTextStrings = new ArrayList<>(sections.size());
		for(VLERDocumentSection section : this.getSections()) {
			titlesAndTextStrings.add(section.getTitle() + " " + section.getText() );
		}
		return titlesAndTextStrings;
	}
	
    public void addToSections(VLERDocumentSection section) {
        if (sections == null) {
        	sections = new ArrayList<VLERDocumentSection>();
        }
        sections.add(section);
    }
	
}
