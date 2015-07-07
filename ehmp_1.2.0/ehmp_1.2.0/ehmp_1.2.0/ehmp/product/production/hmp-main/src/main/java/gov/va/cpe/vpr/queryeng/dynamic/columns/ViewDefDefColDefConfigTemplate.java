package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class ViewDefDefColDefConfigTemplate extends AbstractPOMObject {

	/**
	 * Used for persisting saved options for a given column as a "config button" that appears at the top of the column options form.
	 */
	
	String columnClass;
	String name;
	Map<String, Object> formVals;
	
	private static final long serialVersionUID = 1L;

	public ViewDefDefColDefConfigTemplate() {
        super(null);
    }
	
	public ViewDefDefColDefConfigTemplate(Map<String, Object> vals) {
		super(vals);
	}

	public String getName() {
		return name;
	}

	public Map<String, Object> getFormVals() {
		return formVals;
	}

	public String getColumnClass() {
		return columnClass;
	}

}
