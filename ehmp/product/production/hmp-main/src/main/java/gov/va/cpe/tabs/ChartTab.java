package gov.va.cpe.tabs;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class ChartTab extends AbstractPOMObject {

	private static final long serialVersionUID = 1L;

    private String name;
    private Map<String, Object> widget;
    private String category;

    public ChartTab() {
        super(null);
    }

    public ChartTab(Map<String, Object> vals) {
        super(vals);
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Map<String, Object> getWidget() {
		return widget;
	}

	public void setWidget(Map<String, Object> widget) {
		this.widget = widget;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

}
