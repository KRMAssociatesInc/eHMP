package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class PointOfCare extends AbstractPOMObject {
	
	public PointOfCare() {
		super(null);
	}

	public PointOfCare(Map<String, Object> vals) {
		super(vals);
	}
	
	String displayName;
	String displayWhen;
	String defaultStatus;
	Boolean inactive;
	String category;
	String sharedName;
	String useBoard;
	Boolean isPrimary;
	Boolean useColor;
	String foregroundColor;
	String backgroundColor;
	
	public String getDisplayName() {
		return displayName;
	}

	public String getDisplayWhen() {
		return displayWhen;
	}

	public String getDefaultStatus() {
		return defaultStatus;
	}

	public Boolean getInactive() {
		return inactive;
	}

	public String getCategory() {
		return category;
	}

	public String getSharedName() {
		return sharedName;
	}

	public String getUseBoard() {
		return useBoard;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public Boolean getUseColor() {
		return useColor;
	}

	public String getForegroundColor() {
		return foregroundColor;
	}

	public String getBackgroundColor() {
		return backgroundColor;
	}
	
/*
 *         {name:'displayName', type:'string'},
        {name:'displayWhen', type:'string'},
        {name:'defaultStatus', type:'string'},
        {name:'inactive', type:'boolean'},
        {name:'category', type:'string'},
        {name:'sharedName', type:'string'},
        {name:'useBoard', type:'string'},
        {name:'isPrimary', type:'boolean'},
        {name:'useColor', type:'boolean'},
        {name:'foregroundColor', type:'string'},
        {name:'backgroundColor', type:'string'},
        {name:'id', type:'int'}
 */
}
