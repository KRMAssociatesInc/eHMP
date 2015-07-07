package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.ViewDef.CachedViewDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.ReplaceTransformer;
import gov.va.cpe.vpr.queryeng.QueryMapper.SpringViewRenderQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.*;

@Component(value="gov.va.cpe.vpr.queryeng.LabProfileViewDef2")
@Scope("prototype")
public class LabProfileViewDef2 extends CachedViewDef {
	public LabProfileViewDef2() {
		// declare the view parameters
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.ViewInfoParam(this, "Lab Profile2"));
		declareParam(new ViewParam.DateRangeParam("range", "-1Y"));
		declareParam(new ViewParam.ENUMParam("filter.profiles", "ALL", "ALL", "Micro Profile", "CBC Profile", "Dr Smiths Panel", "Chem Profile").addMeta("title", "Lab Profile(s)").addMeta("multiple", true));
		declareParam(new ViewParam.AsArrayListParam("filter.profiles"));
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "Lab,Last,svgContent";
		String requireCols = "Lab,Last";
		String hideCols = "uid";
		String sortCols = "";
		String groupCols = "group";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		LabPanelGroupTransformer grouper = new LabPanelGroupTransformer("group", "Other Labs");
		grouper.declarePanel("Micro Profile", "ORGANISM");
		grouper.declarePanel("CBC Profile", "WBC","RBC","HGB","HCT","MCV","MCH","MCHC","RDW","PLT","LYMPH %");
		grouper.declarePanel("Dr Smiths Panel", "GLUCOSE","PROTEIN","BUN","NA","CL","CO2","CREAT","K");
		grouper.declarePanel("Chem Profile", "GLUCOSE","BUN","NA","CL","CO2","CREAT","K","ANI GAP","PROTEIN","ALBUMIN","CA","PO4","LDH","SGOT","ALK PHO","T. BIL","D BILI","MG","AMYLASE","UA-SMA","UA-ACA");
		
		QueryDef qry = new QueryDef();
		qry.fields().include("uid", "summary", "vuid", "statusCode", "specimen", "abnormal", "observed", "typeCode", "typeName", "displayName");
		qry.fields().include("pid", "result", "units", "interpretationCode");
		qry.fields().transform(grouper);
		qry.fields().transform(new ReplaceTransformer("interpretationCode", "urn:hl7:observation-interpretation:", ""));
		
		Query q1 = addQuery(new JDSQuery("rowidx", qry, "/vpr/{pid}/last/lab-type"));
		
		Map<String,Object> extraParams = new HashMap<String,Object>();
		extraParams.put("filter_typeCodes", "");
		extraParams.put("range", "-10Y");
		//new SpringViewRenderQuery("svgContent", "/patientDomain/labsparkline", new ViewDefQuery("observed", null, "gov.va.cpe.vpr.queryeng.LabTrendViewDef2", extraParams)))
//		Query q2 = addQuery(new QueryMapper.PerRowAppendMapper(new SpringViewRenderQuery("svgContent", "/patientDomain/labsparkline", new ViewDefQuery("observed", null, "gov.va.cpe.vpr.queryeng.LabTrendViewDef2", extraParams))));
		Query q2 = addQuery(new QueryMapper.PerRowAppendMapper(new SpringViewRenderQuery("svgContent", "/patientDomain/labsparkline", new ViewDefLookup("gov.va.cpe.vpr.queryeng.LabTrendViewDef2", extraParams))));
		Query q3 = addQuery(new QueryMapper.UINotifyQueryMapper("trend2", new ViewDefLookup("gov.va.cpe.vpr.queryeng.LabTrendViewDef2", extraParams)));
		
		
		addColumns(q1, "group", "uid", "interpretationCode");
		addColumns(q2, "svgContent");
		
        addColumn(new ColDef.TemplateColDef("Lab", "<b style='float: left;' title='{typeName}'>{displayName}</b><br/><span style='margin-left: 10px; font-variant: small-caps;'>{specimen}</span>"))
	    	.setMetaData("width", 75);
        addColumn(new ColDef.TemplateColDef("Last", "<b style='float: left;'><tpl if='interpretationCode'><em style='color: red;'>{interpretationCode}</em></tpl> {result}</b>&nbsp;<span style='font-variant: small-caps'>{units}</span><br/><i style='margin-left: 10px;'>{[PointInTime.format(values.observed)]}</i>"))
	    	.setMetaData("width", 125);
        addColumn(new ColDef.QueryColDef(q1, "svgContent")
        		.setMetaData("xtype","sparklinecolumn")
        		.setMetaData("text", "Sparkline").setMetaData("width", 210));
	}
	
	/**
	 * A QueryTransformer that groups test results.  Duplicating rows that below to multiple groups.
	 * If a test belongs to no groups, puts them in a default group.
	 */
	public static class LabPanelGroupTransformer implements QueryDefTransformer {
		private Map<String, List<String>> panels = new HashMap<String, List<String>>();
		private Map<String, List<String>> testidx = new HashMap<String,List<String>>();
		private String groupField;
		private String defaultGroup;
		
		public LabPanelGroupTransformer(String groupField, String defaultGroup) {
			this.groupField = groupField;
			this.defaultGroup = defaultGroup;
		}
		
		public void declarePanel(String title, String... tests) {
			panels.put(title, Arrays.asList(tests));	
			
			// reverse index (test to panel)
			for (String t : tests) {
				if (!testidx.containsKey(t)) {
					testidx.put(t, new ArrayList<String>());
				}
				testidx.get(t).add(title);
			}
		}

		@Override
		public void transform(List<Map<String, Object>> rows) {
			// loop through each row of results
			for (int i=0; i < rows.size(); i++) {
				Map<String, Object> row = rows.get(i);
				String dispName = (String) row.get("displayName");
				String typeName = (String) row.get("typeName");
				String typeCode = (String) row.get("typeCode");
				String pid = (String) row.get("pid");
				// TODO: Also check local ID and vocab concept
				
				// figure out which panel(s) it belongs to (if any)
				List<String> panels = Arrays.asList(this.defaultGroup);
				if (dispName != null && testidx.containsKey(dispName)) {
					panels = testidx.get(dispName);
				} else if (typeName != null && testidx.containsKey(typeName)) {
					panels = testidx.get(typeName);
				}
				
				// set the group field.  If there is more than 1 group, duplicate the row and add it
				row.put(this.groupField, panels.get(0));
				row.put("rowidx", ""+i);
				for (int j=1; j < panels.size(); j++) {
					Map<String, Object> newrow = new HashMap<String, Object>(row);
					newrow.put(this.groupField, panels.get(j));
					newrow.put("rowidx", ++i+"");
					rows.add(i, newrow);
				}
				
				// generate the sparkline URL
				String url = "/vpr/view/gov.va.cpe.vpr.queryeng.LabTrendViewDef2?" +
						"pid=" + pid + "&filter_typeCodes=" + typeCode + "&range=-10Y&mode=/patientDomain/labsparkline";
				row.put("svg", url);
			}
		}

	}
}
