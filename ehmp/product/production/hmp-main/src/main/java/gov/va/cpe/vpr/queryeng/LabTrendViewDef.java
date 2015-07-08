package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.ReplaceTransformer;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;
@Component(value="gov.va.cpe.vpr.queryeng.LabTrendViewDef")
@Scope("prototype")
public class LabTrendViewDef extends ViewDef {
	
	public LabTrendViewDef() throws IOException {
		
    	this.domainClasses.add(Result.class.getSimpleName());
		// declare the view parameters
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.ViewInfoParam(this, "Lab Trend"));
		declareParam(new ViewParam.DateRangeParam("range", "N-1Y")); // defaults to past year
		declareParam(new ViewParam.RequiredParam("filter_typeCodes"));
		declareParam(new ViewParam.SimpleViewParam("filter_typeCodes"));
		declareParam(new ViewParam.AsArrayListParam("filter_typeCodesAry", "filter_typeCodes"));
		
		QueryDef qry1 = new QueryDef();
		qry1.fields().transform(new ReplaceTransformer("interpretationCode", "urn:hl7:observation-interpretation:",""));
		Query q1 = new JDSQuery("observed", qry1, "vpr/{pid}/index/lab-lnc-code?range={filter_typeCodes}&filter=between(observed,\"{range.startHL7}\",\"{range.endHL7}\")") {
			@Override
			protected Map<String, Object> mapRow(RenderTask task, Map<String, Object> row) {
				List<String> list = (List<String>) task.getParamObj("filter_typeCodesAry");
				String type = row.get("typeCode").toString();
				String obs = row.get("observed").toString();
				Object units = row.get("units");
				Object result = row.get("resultNumber");
				Object interp = row.get("interpretationCode");
				int id = list.indexOf(type);
				if (id < 0 || result == null) {
					return null;
				}
				
				// TODO: Add the detail rows back in here as: "detail_" + name, row
				String detail = result + " " + ((units != null) ? units : "");
				String interpStr = null;
				if (interp != null) {
					// TODO: Hack, this should be a CSS style
					interpStr = interp.toString().replace("urn:hl7:observation-interpretation:", "");
					detail += " <span style='color: red; font-weight: bold;'>" + interpStr + "</span>";
				}
				return Table.buildRow("observed", obs, id, result, id + "_detail", detail, id + "_units", units, id + "_interpret", interpStr);
			}
		};
		addColumn(new ColDef.HealthTimeColDef(q1, "observed"));
		addQuery(q1);
	}
}
