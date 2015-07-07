package gov.va.cprs;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Component(value = "gov.va.cprs.CprsClassicRemindersViewDef")
@Scope("prototype")
public class CprsClassicRemindersViewDef extends ViewDef {
	public CprsClassicRemindersViewDef() {
		
		declareParam(new ViewParam.PatientIDParam());
//		declareParam(new ViewParam.SortParam("dateTime", false));
        declareParam(new ViewParam.SimpleViewParam("filter_dfn"));
        declareParam(new ViewParam.SimpleViewParam("filter_user"));
        declareParam(new ViewParam.SimpleViewParam("filter_location"));
		
    	String displayCols = "uid,name,status,dueDate,lastDone,clinicalMaintenance";
    	String requireCols = "uid";
    	String hideCols = "uid,clinicalMaintenance";
    	String sortCols = "name"; // Author sort does not work because it is called different things in different files that both contribute to this notesview JDS template.
    	String groupCols = "name";

		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

    	QueryDef querydef = new QueryDef("rems");

        Query q1 = addQuery(new RemsQuery("uid", querydef));
    		
		addColumns(q1, "uid", "name", "status", "dueDate", "lastDone", "clinicalMaintenance");

//		addColumn(new ColDef.HealthTimeColDef(q1, "dateTime")).setMetaData("text", "Date/Time");
        getColumn("name").setMetaData("text", "Name");
        getColumn("status").setMetaData("text", "Status");
        getColumn("dueDate").setMetaData("text", "Due Date");
        getColumn("lastDone").setMetaData("text", "Last Done");
//        getColumn("clinicalMaintenance").setMetaData("text", "Clinical Maintenance");
//        addColumn(new ColDef.HealthTimeColDef(q1, "dateTime")).setMetaData("text", "Alert Date/Time");
//        getColumn("message").setMetaData("text", "Message");
//        addColumn(new ColDef.UidClassSelfLinkColDef("selfLink"));
	}
	

	
	
	/**
	 * Custom field transformer to get the author information from the document
	 * in a couple different ways.
	 */
    public static class RemsQuery extends AbstractQuery {

		private QueryDef def;

		public RemsQuery(String pk, QueryDef def) {
			super(pk, null);
			this.def = def;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			// fetch raw data
           String dfn = task.getParamStr("filter_dfn");
           String user = task.getParamStr("filter_user");
//            String user = "1089";
//            String dfn = "229";

           String location = task.getParamStr("filter_location");
           Map<String, Object> params = new HashMap<String, Object>();
            params.put("command", "reminders");
            params.put("userId", user);
            params.put("patientId", dfn);
            params.put("location",location);
//            System.out.println(params);
           RpcTemplate rpcTemplate = task.getResource(RpcTemplate.class, "rpcTemplate");
           JsonNode results;
           try {
                results = rpcTemplate.executeForJson("/HMP UI CONTEXT/HMPCPRS RPC", params);
//                System.out.println(results.toString());
            } catch(Exception e) {
//                System.out.println("what the?");
               return;
            }
//           if (!results) return;
           JsonNode data = results.get("reminders");
//           System.out.println(data);
           for (int i = 0; i < data.size(); i++) {
               JsonNode rem = data.get(i);
//               System.out.println(rem);
               Map<String,Object> result = new HashMap<String, Object>();
               result = POMUtils.convertNodeToMap(rem);
               if (result.containsKey("status")) {
                    String status = result.get("status").toString();
                   if (status.equals("N/A")) continue;
                   if (status.equals("RESOLVED")) continue;
                   if (status.equals("NOT DUE")) continue;
                   if (!status.contains("DUE")) {
                       try {
                           PointInTime dueDate = HL7DateTimeFormat.parse(status);
                           result.put("status", PointInTime.toString(dueDate));
                       } catch (Exception e) {

                       }

                   }
               }
               task.add(result);
           }

		}


    }
}
