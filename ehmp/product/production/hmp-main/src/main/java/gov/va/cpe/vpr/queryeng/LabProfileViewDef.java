package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.ColDef.ActionColDef;
import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.apache.commons.lang.ArrayUtils;
import org.joda.time.DateTimeFieldType;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 *	This demonstrates a concrete implementation of ViewDef that imitates the data on a basic lab tab.
 *
 *	It includes some filter capabilities (all, abnormal, critical) and time range selection criteria.
 *
 */
@Component(value="gov.va.cpe.vpr.queryeng.LabProfileViewDef")
@Scope("prototype")
public class LabProfileViewDef extends ViewDef {
	
	/*
	 * This is an internal model used to map lab results into arbitrary groups.
	 * It also keeps reverse indexes and other metadata needed for rendering
	 * TODO: more than 1 way to map them? (loinc, order, vuid, etc.)
	 * TODO: summarization of value ranges?
	 * TODO: auto-misc panel?
	 */
	private static class LabPanelsOrgModel {
		Map<String, List<String>> panels = new HashMap<String, List<String>>();
		Map<String, List<String>> testidx = new HashMap<String,List<String>>();
		Map<String, Set<String>> dtmidx = new HashMap<String, Set<String>>();
		
		public Set<String> getAllPanels() {
			return panels.keySet();
		}
		
		public String[] getTest(String panel) {
			if (!panels.containsKey(panel)) {
				return null;
			}
			return panels.get(panel).toArray(new String[]{});
		}
		
		public String[] getTestPanels(String test) {
			// use reverse index to get list of panels a test should be on
			String[] ret = new String[0];
			if (testidx.containsKey(test)) {
				ret = testidx.get(test).toArray(new String[] {});
			}
			return ret;
		}
		
		public String[] getPanelDTMs(String panel) {
			// get the nth most recent dtm's
			if (dtmidx.containsKey(panel)) {
				String[] ret = dtmidx.get(panel).toArray(new String[] {});
				// sort most recent to least recent
				Arrays.sort(ret);
				ArrayUtils.reverse(ret);
				return ret;
			}
			return new String[0];
		}
		
		public void addDTM(String panel, String dtm) {
			if (dtmidx.containsKey(panel)) {
				dtmidx.get(panel).add(dtm);
			}
		}
		
		public void addPanel(String title, String... tests) {
			panels.put(title, Arrays.asList(tests));
			
			// reverse index each test (w/ empty dtm index for now)
			dtmidx.put(title, new HashSet<String>());
			for (String t : tests) {
				if (!testidx.containsKey(t)) {
					testidx.put(t, new ArrayList<String>());
				}
				testidx.get(t).add(title);
			}
		}
	}
	
	private static class PlaceholderColDef extends ColDef {
		private int idx;

		public PlaceholderColDef(int idx, Query query) {
			super("dtm"+idx, query);
			this.idx = idx;
			setMetaData("width", 55);
			setMetaData("align", "right");
		}
	}
	
	private static class CustomTransformer extends AbstractQuery {
		private LabPanelsOrgModel model;
		private Query q;
		
		public CustomTransformer(Query q, LabPanelsOrgModel model) {
			super(q.getPK(), null);
			this.q = q;
			this.model = model;
		}
		
		@Override
		public void exec(RenderTask task) throws Exception {
			int maxcols = task.getParamInt("filter.cols");
			this.q.exec(task);
			
			for (String pkval : task.getResults().getPKValues()) {
				Map<String, Object> row = new HashMap<String,Object>(task.getRow(pkval));
				
				// get the nth most recent dtm's for this panel
				String panel = (row == null || row.get("group") == null) ? null : row.get("group").toString();
				String[] dtms = model.getPanelDTMs(panel);
	
				for (int i=0; i < dtms.length; i++) {
					String dtm = dtms[i];
					String key = "dtm"+i;
					Object val = row.get(dtm);
					if (row.containsKey("header")) {
						// if this is a header row: display the the date/time instead of the row value
						// TODO: this is a hack, use a real dtm formatter.
						PointInTime pit = HL7DateTimeFormat.parse(dtm);
						String year = (pit.get(DateTimeFieldType.year()) + "").substring(2);
						int month = pit.get(DateTimeFieldType.monthOfYear());
						int day = pit.get(DateTimeFieldType.dayOfMonth());
						if(pit.isSupported(DateTimeFieldType.hourOfDay()) && pit.isSupported(DateTimeFieldType.minuteOfHour())){
							int hour = pit.get(DateTimeFieldType.hourOfDay());
							int min = pit.get(DateTimeFieldType.minuteOfHour());
							val = String.format("<span title='%s'>%s/%s/%s<br/>%2d:%02d</span>", dtm, month, day, year, hour, min);
						} else {
							val = String.format("<span title='%s'>%s/%s/%s</span>", dtm, month, day, year);	
						}
					}
					
					row.remove(dtm);
					if (i < maxcols) {
						row.put(key, val);
					}
				}
				task.getResults().replaceRow(pkval, row);
			}
		}
		
	}
	
	private static class CustomColDef extends ColDef {
		public CustomColDef(String key, Query query) {
			super(key, query);
			setMetaData("width", 55);
			setMetaData("align", "right");
		}
	}
	
	public LabProfileViewDef() {
		
    	this.domainClasses.add(Result.class.getSimpleName());
		// declare the view parameters
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.ViewInfoParam(this, "Lab Worksheet"));
		declareParam(new ViewParam.DateRangeParam("range", "-1Y"));
		declareParam(new ViewParam.ENUMParam("filter.profiles", "ALL", "ALL", "Micro Profile", "CBC Profile", "Dr Smiths Panel", "Chem Profile").addMeta("title", "Lab Profile(s)").addMeta("multiple", true));
		declareParam(new ViewParam.NumRangeParam("filter.cols", 3, 3, 10).addMeta("title", "# Cols"));
		declareParam(new ViewParam.AsArrayListParam("filter.profiles"));
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "rowactions,disp,specimen,dtm0,dtm1,dtm2,dtm3,dtm4,dtm5,dtm6,dtm7,dtm8,dtm9,units,range";
		String requireCols = "disp,specimen";
		String hideCols = "uid,pid";
		String sortCols = "";
		String groupCols = "group";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		/*
		 * 5/1/2012:Here's what I'm thinking I need to do next:
		 * 1) first query populate the "group" (CBC, CHEM, MISC) row header and 1 row for each item
		 * -- Include GROUP field for each row (just the group name..) 
		 * 2) accession based query (time range limited?) for all lab results
		 * 3) addRow() for each result, dynamic dtm fields, relying on map merge to collate results (test name is PK).
		 * 4) CustomColDef dynamically maps most recent 10 dtm fields into col1-10
		 * -- Multiple daily results? Convert to range?
		 * -- Include annual/monthy/weekly range?
		 * -- Include total result count?
		 * 5) new results (new PK) go into last one (which must be MISC) 
		 * 6) Micro might fit? Able to see when infection cleared up?
		 * 7) Report-based results represented as **note** links?
		 */
		
		final LabPanelsOrgModel model = new LabPanelsOrgModel();
		model.addPanel("Micro Profile", "ORGANISM");
		model.addPanel("CBC Profile", "WBC","RBC","HGB","HCT","MCV","MCH","MCHC","RDW","PLT","LYMPH %");
		model.addPanel("Dr Smiths Panel", "GLUCOSE","BUN","NA","CL","CO2","CREAT","K");
		model.addPanel("Chem Profile", "GLUCOSE","BUN","NA","CL","CO2","CREAT","K","ANI GAP","PROTEIN","ALBUMIN","CA","PO4","LDH","SGOT","ALK PHO","T. BIL","D BILI","MG","AMYLASE","UA-SMA","UA-ACA");
		
		QueryDef qry = new QueryDef();
		qry.namedIndexRange("lab-time", ":range.startHL7", ":range.endHL7");
		qry.fields().alias("typeName", "name").alias("displayName", "display")
			.alias("interpretationCode", "interpretation").alias("resultStatusCode", "status");
		final Query qdata = new JDSQuery("uid", qry); //"vpr/{pid}/index/laboratory"
		
		Query q1 = new AbstractQuery("pk", null) {
			@Override
			public void exec(RenderTask task) throws Exception {
				ArrayList<String> filters = (ArrayList<String>) task.getParamObj("filter.profiles");
				ArrayList<String> qfilters = (ArrayList<String>) task.getParamObj("qfilter.profiles");
				
				// construct the header and placeholder rows, and build a reverse index at the same time
				for (String panel : model.getAllPanels()) {
					if (filters != null && filters.size()>0 && !filters.contains(panel) && !filters.contains("ALL")) {
						continue; // skip if not in filters list
					}
					// inserting a header row
					task.add(Table.buildRow("pk", panel, "group", panel, "units", "Units", "range", "Range", "header", true));
					
					// insert placeholder rows for each desired value
					// TODO: this would be a great place for pagination? If there are more tests and requested rows, don't include this panel on this page?
					for (String test : model.getTest(panel)) {
						// primary key is combo of panel and test (units/range will be filled in by the actual data later)
						String pk = panel + ":" + test;
						task.add(Table.buildRow("pk", pk, "group", panel, "disp", test));
					}
				}
				
				// execute the data query, loop through results and map them in.
				RenderTask subtask = new RenderTask(task, qdata);
				qdata.exec(subtask);
				for (int i=0; i < subtask.size(); i++) {
					Map<String,Object> row = subtask.getRowIdx(i);
					String dtm = row.get("observed")!=null ? row.get("observed").toString() : "";
					dtm = (dtm.length()>12?dtm.substring(0,11):dtm);
					String name = (row.get("name")!=null) ? row.get("name").toString() : "";
					Object test = (row.get("display")!=null) ? row.get("display") : "";
					if (test == null) test = row.get("name");
					Object comment = row.get("comment");
					Object typeCode = row.get("typeCode");
					String resultstr = (row.get("result")!=null) ? row.get("result").toString() : "";
					String specimen = (row.get("specimen")!=null) ? row.get("specimen").toString() : "";
					String range = (row.get("low") != null) ? row.get("low").toString() : "";
					range += (row.get("high") != null) ? "-" + row.get("high").toString() : "";
					Object units = row.get("units");
					Object interp = row.get("interpretation");
					String uid = row.get("uid") != null ? row.get("uid").toString() : "";
					String pid = row.get("pid") != null ? row.get("pid").toString() : "";
					
					// if the length is large, wrap it in a span with title
					String titlestr = resultstr;
					if (interp != null) {
						String interpStr = interp.toString().replace("urn:hl7:observation-interpretation:", "");
						resultstr += "<span style='color: red; font-weight: bold;'>" + interpStr + "</span>";
					}
					if (comment != null) {
						resultstr = "*" + resultstr;
						titlestr += "\n COMMENTS:" + comment.toString();
					}
					resultstr = "<span title='" + titlestr + "'>" + resultstr + "</span>";

					
					// add the result once for each panel its part of
					for (String panel : model.getTestPanels(test.toString())) {
						if (filters != null && !filters.contains(panel) && !filters.contains("ALL") && !filters.isEmpty()) {
							continue; // skip if not in filters list
						}
						
						// if a row already exists, check its specimen, if its the same then overwrite/append the row,
						// (ie: no need to modify the PK), if its different, we need to create a different row (with a new PK)
						String pk = panel + ":" + test;
						Map<String, Object> currow = task.getRow(pk);
						String curspecimen = (String) currow.get("specimen");
						int idx = -1;
						
						if (currow == null) {
							// TODO: this test does not appear on any panel, add it to misc?
						} else if (curspecimen == null) {
							// no specimen defined yet (first value added to row), no need to modify PK
						} else if (curspecimen != null && curspecimen.equals(specimen)) {
							// no need to modify PK
						} else {
							// new specimen (non-first), new PK necessary, insert strategically after current PK
							idx = task.getResults().indexOf(currow);
							pk += ":" + specimen;
						}
						Map<String, Object> newrow = Table.buildRow("pk", pk, "group", panel, "pid", pid, "uid", uid, "disp", test, "name", name, "typeCode", typeCode, "specimen", specimen, dtm, resultstr, "units", units, "range", range);
						task.getResults().appendRowIdx(idx, newrow);
						
						// record every unique DTM for each panels resultset
						model.addDTM(panel, dtm);
					}
				}
				
				// now that the data is mapped in, loop though each panel group, and if its empty
				// clean it up for display
				for (String panel : model.getAllPanels()) {
					
					// if there is data, skip to the next panel
					boolean isEmpty = model.getPanelDTMs(panel).length == 0;
					if (!isEmpty) {
						// TODO: it would be nice to put some more summary info here
						// like total count, etc....
						continue;
					}
					
					// otherwise, loop through rows
					ArrayList<Map<String,Object>> delRows = new ArrayList<Map<String, Object>>();
					for (Map<String, Object> row : task.getRows()) {
						if (row.get("pk").equals(panel)) {
							// header row, rename and remove headings
							task.appendVal(panel, "group", panel + " - No Results For Date Range");
							task.appendVal(panel, "range", "");
							task.appendVal(panel, "units", "");
						} else if (row.get("group").equals(panel)) {
							// body row, remove later to prevent concurrent modification exeption
							delRows.add(row);
						}
					}
					task.removeAll(delRows);

				}
			}
		};
	
	
		addQuery(new CustomTransformer(q1, model));
		addColumn(new QueryColDef(q1, "pk")).setMetaData("text", "key").setMetaData("width", 125);
		addColumn(new QueryColDef(q1, "pid"));
		addColumn(new QueryColDef(q1, "group")).setMetaData("width", 65);
		addColumn(new QueryColDef(q1, "disp")).setMetaData("width", 60);
		addColumn(new QueryColDef(q1, "name"));
		addColumn(new QueryColDef(q1, "typeCode"));
		addColumn(new QueryColDef(q1, "specimen")).setMetaData("width", 75);
		addColumn(new QueryColDef(q1, "uid"));
		
		// Date Columns 1-N....
		// TODO: This is a little hacky as only the first one does anything.
		addColumn(new CustomColDef("dtm0", q1));
		addColumn(new PlaceholderColDef(1, q1));
		addColumn(new PlaceholderColDef(2, q1));
		addColumn(new PlaceholderColDef(3, q1));
		addColumn(new PlaceholderColDef(4, q1));
//		addColumn(new PlaceholderColDef(5, q1));
//		addColumn(new PlaceholderColDef(6, q1));
//		addColumn(new PlaceholderColDef(7, q1));
//		addColumn(new PlaceholderColDef(8, q1));
//		addColumn(new PlaceholderColDef(9, q1));
		
		// reference cols
		addColumn(new QueryColDef(q1, "units")).setMetaData("width", 55);
		addColumn(new QueryColDef(q1, "range")).setMetaData("width", 65);
		
        addColumn(new ActionColDef("rowactions"));//.setMetaData("requestAction", false);
	}
}

