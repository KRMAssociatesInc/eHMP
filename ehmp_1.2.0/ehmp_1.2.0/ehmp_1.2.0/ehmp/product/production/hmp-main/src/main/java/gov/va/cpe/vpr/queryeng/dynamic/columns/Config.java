package gov.va.cpe.vpr.queryeng.dynamic.columns;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * One configuration field.
 * Used by column configuration options.
 * @author vhaislchandj
 *
 */
public class Config {
	public static final String DATA_TYPE_STRING = "STRING";
	public static final String DATA_TYPE_NUMERIC = "NUMERIC";
	public static final String DATA_TYPE_BOOLEAN = "BOOLEAN";
	public static final String DATA_TYPE_MAP = "MAP";
	public static final String DATA_TYPE_LIST = "LIST";
	public static final String DATA_TYPE_RANGE = "RANGE";
	public static final String DATA_TYPE_TEAMCAT = "TEAM CATEGORIES";
	
	public boolean hasSubConfigs() {
		return true;
	}
	private ArrayList<Config> getDefinedConfigOptions(Object configValueForThisConfig) {
		return null;
	}
	private String name;
	private String label;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public ArrayList getChoiceList() {
		return choiceList;
	}
	public void addChoice(String choice) {
		addChoice(choice, choice);
	}
	public void addChoice(String choiceName, String choiceIndex) {
		if(choiceList==null) {
			choiceList = new ArrayList<Map<String, Object>>();
		}
		HashMap<String, Object> choice = new HashMap<String, Object>();
		choice.put("displayName", choiceName);
		choice.put("inputValue", choiceIndex);
		choiceList.add(choice);
	}
	private String dataType;
	private ArrayList choiceList;
}
