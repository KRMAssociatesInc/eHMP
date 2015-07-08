package gov.va.cpe.tabs;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.List;
import java.util.Map;

public class UserTabPrefs extends AbstractPOMObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UserTabPrefs() {
        super(null);
    }
	
	public UserTabPrefs(Map<String, Object> vals) {
		super(vals);
	}
	
	private List<Map<String, Object>> tabs;
	private String userId;

	public List<Map<String, Object>> getTabs() {
		return tabs;
	}

	public void setTabs(List<Map<String, Object>> tabs) {
		this.tabs = tabs;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

}
