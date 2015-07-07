package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import gov.va.cpe.vpr.frameeng.Frame;
import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.frameeng.FrameAction.IPatientSerializableAction;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PatientAlert extends AbstractPatientObject implements FrameAction, IPatientSerializableAction {
	private String title;
	private String description;
	private String frameID;
	private boolean severe;
	private String kind = "ALERT";
	private PointInTime referenceDateTime = PointInTime.now();
	
	@JsonTypeInfo(use=JsonTypeInfo.Id.CLASS, include=JsonTypeInfo.As.PROPERTY, property="@class")
	private List<FrameAction> actions;
	private List<Map<String, Object>> links;
	
	public PatientAlert() {
		super(null);
	}
	
	@JsonCreator
	public PatientAlert(Map<String, Object> vals) {
		super(vals);
	}

	public PatientAlert(Frame frame, String id, String pid, String title, String description) {
		super(Table.buildRow("uid", "urn:va:::alert:" + pid + ":" + id, "pid", pid, "frameID", frame.getID(), "title", title, "description", description));
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getDescription() {
		return description;
	}
	
	public String getKind() {
		return kind;
	}
	
	public boolean isSevere() {
		return severe;
	}
	
	public String getFrameID() {
		return this.frameID;
	}
	
	public PointInTime getReferenceDateTime() {
		return referenceDateTime;
	}
	
	@JsonIgnore
	public void addLink(String urn, String type) {
		List<Map<String, Object>> links = getLinks();
		links.add(Table.buildRow("uid", urn, "rel", type));
		setData("links", links);
	}
	
	@JsonIgnore
	public void addSubAction(FrameAction action) {
		actions.add(action);
	}
	
	public List<Map<String, Object>> getLinks() {
		if (links == null) {
			links = new ArrayList<Map<String, Object>>();
		}
		return links;
	}
	
	public List<FrameAction> getActions() {
		if (actions == null) {
			actions = new ArrayList<FrameAction>();
		}
		return this.actions;
	}
	
	@Override
	public String toString() {
		return getTitle() + ": " + getDescription();
	}
}
