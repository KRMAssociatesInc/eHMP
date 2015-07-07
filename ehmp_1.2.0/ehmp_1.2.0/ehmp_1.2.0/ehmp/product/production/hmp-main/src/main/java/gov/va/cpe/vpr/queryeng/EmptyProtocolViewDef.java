package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.EmptyProtocolViewDef")
public class EmptyProtocolViewDef extends ProtocolViewDef {
	
	public EmptyProtocolViewDef() {
		declareParam(new ViewParam.ViewInfoParam(this, "Empty Protocol"));
		declareParam(new ViewParam.PatientIDParam());
		
		QueryDef qry = new QueryDef();
		Query q1 = new JDSQuery("focus", qry, "/vpr/{pid}/last/vs-type?range=HEIGHT") {
			@Override
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Height");
				ret.put("status", getOverdueStatus(obs, Integer.MAX_VALUE));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "21+yo: once after age 21");
				return ret;
			}
		};
		addQuery(new ForceSingleRowQuery(q1));
		
		
		addColumns(q1, "focus", "status", "relevant_data");
		getColumn("status").setMetaData("width", 75);
		getColumn("relevant_data").setMetaData("width", 150);
		addColumn(new ColDef.HealthTimeColDef(q1, "last_done")).setMetaData("width", 85);
		addColumn(new QueryColDef(q1, "guidelines")).setMetaData("width", 250);
	}
}
