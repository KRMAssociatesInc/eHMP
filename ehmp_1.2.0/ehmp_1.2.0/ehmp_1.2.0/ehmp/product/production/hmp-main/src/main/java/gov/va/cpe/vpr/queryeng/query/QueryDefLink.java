package gov.va.cpe.vpr.queryeng.query;

import java.util.Map;

public class QueryDefLink {
	
	String linkName;
	Boolean summary = false;
	Boolean reverse = false;
	
	String onParam;
	
	public QueryDefLink(String linkName) {
		this.linkName = linkName;
	}
	
	public void setOnParam(String param) {
		onParam = param;
	}
	
	public void setSummary(Boolean summary) {
		this.summary = summary;
	}
	
	public void setReverse(Boolean reverse) {
		this.reverse = reverse;
	}

	public String getQueryString(Map<String, Object> params) {
		if(onParam==null || Boolean.parseBoolean(params.get(onParam).toString())) {
			return (reverse?"rev":"rel")+";"+linkName+(summary?";summary":"");
		}
		return null;
	}

}
