package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.HMPApp;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.queryeng.HMPAppInfo;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import gov.va.hmp.auth.AuthController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public abstract class ViewDefDefColDef extends AbstractPOMObject implements HMPApp, Comparable<ViewDefDefColDef> {

    protected static Logger log = LoggerFactory.getLogger(AuthController.class);
    
	public final static String JSON = "JSON";

	@SuppressWarnings("unchecked")
	public ViewDefDefColDef(Map<String, Object> vals) {
		super(vals);
		if(vals!=null) { // I had thought this would flow thru with the default setData functionality, but alas, it does not.
			if(vals.get("configProperties")!=null) {
				this.setConfigProperties((Map<String, Object>) vals.get("configProperties"));
			}
			if(vals.get("viewdefFilters")!=null) {
				this.setViewdefFilters((Map<String, Object>) vals.get("viewdefFilters"));
			}
		}
	}
	
	public void setData(Map<String, Object> vals) {
		super.setData(vals);
	}
	
	public ViewDefDefColDef() {
		super(null);
	}
	
	String description = "";
	String type = "";
	String viewdefName;
	String viewdefCode;
	String restEndpoint;
	Map<String, Object> viewdefFilters = new HashMap<String, Object>();
	Map<String, Object> configProperties = new HashMap<String, Object>();
	EditorOption editOpt = null;

	public EditorOption getEditOpt() {
		return editOpt;
	}

	String fieldName;
	String fieldDataIndex; // If this column wants to pluck a specific field out and hand off to a simple text editor or boolean editor, etc., we will use this to let the front end know which field to pluck out before passing along to the editor's setValue / etc.
	@JsonIgnore
	public String dataIndex;
	public Integer sequence = 0;
	public Integer id = 0;

	private ArrayList<String> domainClasses = new ArrayList<String>();
	
	public Integer getId() {
		return id;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

    public String getType() {
        return JSON;
    }

	public abstract String getViewdefCode(); // Return null to pull from a field in the root view that this column has been added to.

	public String getFieldDataIndex() {
		return fieldDataIndex;
	}
	
	public String getRestEndpoint() {
		return restEndpoint;
	}

	/** Override me */
	public abstract String getName();
	public abstract String getRenderClass();
	public abstract String getDescription();

	public Map<String, Object> getViewdefFilters() {
		return viewdefFilters;
	}

	public void setViewdefFilters(Map<String, Object> viewdefFilters) {
		this.viewdefFilters = viewdefFilters;
	}

	public Map<String, Object> getConfigProperties() {
		return configProperties;
	}

	public void setConfigProperties(Map<String, Object> configProperties) {
		this.configProperties = configProperties;
	}

	@JsonIgnore
	public List<Config> getViewdefFilterOptions() {
		return new ArrayList<Config>();
	}
	
	@JsonIgnore
	public List<Config> getConfigOptions() {
		return new ArrayList<Config>();
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}
	
	public Map<String, Object> getAppInfo() {
		HashMap<String, Object> ret = new HashMap<String, Object>();

		// get the annotation, use it to fill in any values not declared in the param
		HMPAppInfo annotation = getClass().getAnnotation(HMPAppInfo.class);
		String name = getName();
		if (name == null && annotation != null) {
			name = annotation.title();
		}
		
		// return the results
		ret.put("type", (annotation != null) ? annotation.value() : "gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef");
		ret.put("name", ((name == null || name.equals("")) ? getClass().getName() : name));
		ret.put("code", getClass().getName());
		ret.put("description", getDescription());
		return ret;
	}

	protected boolean poorManFuzzySearch(ArrayList<String> filterz, String type) {
		// Poor man's fuzzy search
		for(String s: filterz) {
			if(type.toLowerCase().contains(s.toLowerCase())) {
				return true;
			}
		}
		return false;
	}

	protected ArrayList<String> configPropertyToArray(String string, Map<String, Object> params) {
		ArrayList<String> filterz=null;
		Object fobj = params.get(string);
		if(fobj!=null && !fobj.toString().trim().equals("")) {
			String[] flist = fobj.toString().split("\\s*,\\s*");
			filterz = new ArrayList<String>(Arrays.asList(flist));
		}
		return filterz;
	}

	@Override
	public int compareTo(ViewDefDefColDef o) {
		int rslt = this.sequence.compareTo(o.sequence);
		if(rslt==0) {rslt = this.fieldName.compareTo(o.fieldName);}
		return rslt;
	}

	public ArrayList<String> getDomainClasses() {
		return domainClasses ;
	}
	
	/**
	 * Override in subclasses that want to show human readable properties or hide built-in assumed properties that don't need to be made visible.
	 * @return
	 */
	public ArrayList<String> getFilterDescription() {
		ArrayList<String> filterDesc = new ArrayList<String>();
		if(configProperties!=null) {
			for(String prop: configProperties.keySet()) {
				String val = uiPropAlias(configProperties.get(prop));
				if(val!=null && !val.equals("")) {
					String filter = uiAlias(prop);
					if(filter!=null && !filter.equals("")) {
						filterDesc.add(filter+": "+val);
					}
				}
			}
		}
		if(viewdefFilters!=null) {
			for(String prop: viewdefFilters.keySet()) {
				String val = uiPropAlias(viewdefFilters.get(prop));
				if(val!=null && !val.equals("")) {
					String filter = uiAlias(prop);
					if(filter!=null && !filter.equals("")) {
						filterDesc.add(filter+": "+val);
					}
				}
			}
		}
		
		return filterDesc;
	}
	
	/**
	 * Override in base classes that want to alias their property names.
	 * @param prop
	 * @return
	 */
	@JsonIgnore
	protected String uiAlias(String prop) {
		return prop;
	}
	
	@JsonIgnore
	protected String uiPropAlias(Object val) {
		if (val == null) return null;

        if(val instanceof List) {
			StringBuilder statii = new StringBuilder();
			boolean statfilter = false;
			
			for(Object s: (List)val) {
				statii.append((statfilter?", ":"")+s.toString());
				statfilter = true;
			}
			
			return statfilter?statii.toString():"ALL";
			
		} else {
			return val.toString();
		}
	}
	
	public boolean getTitleEditable() {
		return true;
	}

	public abstract Map<String, Object> runDeferred(DeferredBoardColumnTask task);
}
