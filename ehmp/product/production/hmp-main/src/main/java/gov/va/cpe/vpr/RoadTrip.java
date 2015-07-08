package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class RoadTrip extends AbstractPatientObject {
	
	public RoadTrip() {
		super(null);
	}

	public RoadTrip(Map<String, Object> vals) {
		super(vals);
	}
	
	PointOfCare location;
	PointInTime date;
	String time;
	String comment;
	Boolean removed;// = "false";
	
	public Boolean getRemoved() {
		return removed!=null?removed:false;
	}

	public PointOfCare getLocation() {
		return location;
	}
	
	public PointInTime getDate() {
		return date;
	}

	public String getTime() {
		return time;
	}

	public String getComment() {
		return comment;
	}
	
}
