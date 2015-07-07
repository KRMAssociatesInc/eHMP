package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.BMIViewDef")
public class BMIViewDef extends ViewDef {
	
	public BMIViewDef() {
		this.domainClasses.add("VitalSign");
		declareParam(new ViewParam.ViewInfoParam(this, "BMI Trend"));
		declareParam(new ViewParam.DateRangeParam("range", "-3Y"));
        declareParam(new ViewParam.PatientIDParam());
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "observed,typeName,value,range";
		String requireCols = "observed,typeName,value";
		String hideCols = "uid,result,units,selfLink";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		QueryDef qry = new QueryDef("vs-type", "HEIGHT,WEIGHT");
		qry.fields().include("uid","observed","typeName","result","units");
		qry.fields().transform(new QueryDefTransformer.QueryFieldTransformer.NumberParserTransformer("result"));
		qry.where("typeName").in("?:filter_kind");
		qry.where("observed").between(":range.startHL7", ":range.endHL7");
		Query primary = addQuery(new JDSQuery("observed", qry) {
			@Override
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				String obs = row.get("observed").toString();
				String uid = (String) row.get("uid");
				String typeName = (String) row.get("typeName");
				Number result = (Number) row.get("result");
				String units = (String) row.get("units");
				return Table.buildRow("observed", obs, typeName, result, typeName + "_units", units, typeName + "_uid", uid);
			}
			
			@Override
			protected void filterTransformResults(RenderTask task, Map<String, Object> params, List<Map<String, Object>> items) {
				super.filterTransformResults(task, params, items);

				int height = -1;
				int weight = -1;
				for (int i=task.size()-1; i >= 0; i--) {
					Map<String, Object> item = task.getRowIdx(i);
					String obs = item.get("observed").toString();
					if (item.containsKey("HEIGHT")) {
						height = (Integer) item.get("HEIGHT");
					}
					if (item.containsKey("WEIGHT")) {
						weight = (Integer) item.get("WEIGHT");
					}
					
					if (height > 0 && weight > 0) {
						task.add(Table.buildRow("observed", obs, "BMI", calcBMI(height, weight)));
					}
				}
			}
			
			
		});
		
		addColumns(primary, "uid","typeName","result","units");
		addColumn(new ColDef.HealthTimeColDef(primary, "observed")).setMetaData("text", "Observed");
		getColumn("typeName").setMetaData("text", "Type Name");
		addColumn(new TemplateColDef("value", "{result} {units}")).setMetaData("text", "Result");
	}
	
	private static float calcBMI(float height, float weight) {
		float bmi = (weight/(height*height)) * 703f;
		return round(bmi, 2);
	}
	
	public static float round(float targetValue, int roundToDecimalPlaces){
        int valueInTwoDecimalPlaces = (int) (targetValue * Math.pow(10, roundToDecimalPlaces));
        return (float) (valueInTwoDecimalPlaces / Math.pow(10, roundToDecimalPlaces));
    }
}