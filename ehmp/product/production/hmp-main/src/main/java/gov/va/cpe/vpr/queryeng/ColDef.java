package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef;

import java.util.HashMap;
import java.util.Map;

/**
 * ColDefs define the columns available in a ViewDef.
 * 
 * ColDefs may contribute column/field data to results or it may just be a "virtual column" of other results, or both.
 * ColDefs may contribute more than one column/field worth of data to the results.
 * ColDefs may be attached to other queries to map data from multiple queries into a single result.
 * ColDefs can have generic meta data that may be used by UI applications for rendering/display preferences.
 * 
 * TODO: need to find a way to automate dealing with dotted column names by diving into sub-maps.  It works in groovy eval
 * but should be generalized across all ColDefs in plain java.
 * 
 * TODO: experiment with a coldef that would render asynch in ExtJS outside of the primary data query (ie a sparkline image next to a vital)
 */
public abstract class ColDef {
	private Map<String, Object> metadata = new HashMap<String,Object>();

	private String key;
	private Query query;

	public ColDef(String key, Query query) {
		this.key = key;
 		this.query = query;
        setMetaData("dataIndex", key);
	}
	
	public Map<String, Object> getColumnMetaData(ViewDef qd) {
		return metadata;
	}

	public ColDef setMetaData(Map<String,Object> map) {
		metadata.putAll(map);
		return this;
	}
	
	public ColDef setMetaData(String key, Object val) {
		metadata.put(key, val);
		return this;
	}

    public ColDef removeMetaData(String key) {
        metadata.remove(key);
        return this;
    }

	/**
	 * @return Primary query associated with the column.  May be null.
	 */
	public Query getQuery() {
		return query;
	}
	
	public String getKey() {
		return this.key;
	}
	
	public String toString() {
		return getClass().getSimpleName() + ": " + this.key;
	}
	
	/**
	 * TODO: this column should probably go away, this is too much ExtJS in Java.
	 * Longer term strategy would be to have a GridAdvisor type ExtJS object to handle some of this.
	 */
	public static class TemplateColDef extends ColDef {
		private String template;

		public TemplateColDef(String key, String template) {
			super(key, null);
			this.template = template;
			setMetaData("xtype", "templatecolumn");
			setMetaData("tpl", this.template);
            removeMetaData("dataIndex");
		}

	}
	
	public static class CustomRendererColDef extends ColDef {
		String rendererFnType = "";
		
		public CustomRendererColDef(String key, String rendererFnType) {
			super(key, null);
			this.rendererFnType = rendererFnType;
			setMetaData("rendererFnType", rendererFnType);
		}
	}
	
	@Deprecated 
	public static class QueryColDef extends ColDef {
		protected String source;

		public QueryColDef(Query q, String sourceTarget) {
			super(sourceTarget, q);
			this.source = sourceTarget;
		}

		public QueryColDef(Query q, String source, String target) {
			super(target, q);
			this.source = source;
		}
		
	}
	
	/**
	 * Date/Time handling column.  Parses the HL7DateTime from the database
	 * into a PointInTime class (which the JSON renderer knows how to convert into a JavaScript date)
	 */
	public static class HealthTimeColDef extends QueryColDef {

		public HealthTimeColDef(Query q, String sourceTarget) {
			this(q, sourceTarget, sourceTarget);
		}
		
		public HealthTimeColDef(Query q, String source, String target) {
			super(q, source, target);
			setMetaData("width", 125);
			setMetaData("xtype", "healthtimecolumn");
		}
	}

	public static class ActionColDef extends ColDef {

		public ActionColDef(String key) {
			super(key, null);
			setMetaData("xtype", "rowactioncolumn");
		}
	}
	
	public static class UidClassSelfLinkColDef extends ColDef {
	    public UidClassSelfLinkColDef(String key) {
	        super(key, null);
	    }
	}
	
	public static class DeferredViewDefDefColDef extends ColDef {
		public ViewDefDefColDef cdef;
		public String keyCol;

		public DeferredViewDefDefColDef(ViewDefDefColDef cdef, String keyCol, String dataIndex) {
			super(dataIndex, null);
			this.cdef = cdef;
			this.keyCol = keyCol;
		}
	}
}