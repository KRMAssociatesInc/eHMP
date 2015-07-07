package gov.va.cprs;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Component(value = "gov.va.cprs.CprsClassicAlertsViewDef")
@Scope("prototype")
public class CprsClassicAlertsViewDef extends ViewDef {
	public CprsClassicAlertsViewDef() {
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("dateTime", false));
		
    	String displayCols = "cnt,action,infoOnly,patient,location,urgency,dateTime,mustBeProcess,message";
    	String requireCols = "patient";
    	String hideCols = "cnt,action,mustBeProcess";
    	String sortCols = "patient,dateTime"; // Author sort does not work because it is called different things in different files that both contribute to this notesview JDS template.
    	String groupCols = "patient";

		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

    	QueryDef querydef = new QueryDef("alerts");

        Query q1 = addQuery(new AlertsQuery("cnt", querydef));
    		
		addColumns(q1, "action", "dateTime", "infoOnly", "location", "patient", "mustBeProcess", "message","urgency");

//		addColumn(new ColDef.HealthTimeColDef(q1, "dateTime")).setMetaData("text", "Date/Time");
        getColumn("infoOnly").setMetaData("text", "Info.");
        getColumn("patient").setMetaData("text", "Patient");
        getColumn("location").setMetaData("text", "Location");
        getColumn("dateTime").setMetaData("text", "Alert Date/Time");
        getColumn("urgency").setMetaData("text", "Urgency");
//        addColumn(new ColDef.HealthTimeColDef(q1, "dateTime")).setMetaData("text", "Alert Date/Time");
        getColumn("message").setMetaData("text", "Message");
//        addColumn(new ColDef.UidClassSelfLinkColDef("selfLink"));
	}

	/**
	 * Custom field transformer to get the author information from the document
	 * in a couple different ways.
	 */
    public static class AlertsQuery extends AbstractQuery {

		private QueryDef def;

		public AlertsQuery(String pk, QueryDef def) {
			super(pk, null);
			this.def = def;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			// fetch raw data
           Map<String, Object> params = new HashMap<String, Object>();
           params.put("command","alerts");
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
           JsonNode data = results.path("data").path("alerts");
//           System.out.println(data);
           for (int i = 0; i < data.size(); i++) {
               JsonNode alert = data.path(i).get("alert");
//               System.out.println(alert);
               Map<String,Object> result = new HashMap<String, Object>();
               result = POMUtils.convertNodeToMap(alert);
//               "action,dateTime,infoOnly,location,patient,mustBeProcess,message,urgency"
//               if (alert.path("action").booleanValue()) result.put("action", alert.get("action").toString());
//               if (!alert.path("dateTime").isValueNode()) result.put("dateTime", alert.get("dateTime").toString());
//               if (!alert.path("infoOnly").isValueNode()) result.put("infoOnly", alert.get("infoOnly").toString());
//               if (!alert.path("location").isValueNode()) result.put("location", alert.get("location").toString());
//               if (!alert.path("patient").isValueNode()) result.put("patient", alert.get("patient").toString());
//               if (!alert.path("mustBeProcess").isValueNode()) result.put("mustBeProcess", alert.get("mustBeProcess"));
//               if (!alert.path("message").isValueNode()) result.put("message", alert.get("message").toString());
//               if (!alert.path("urgency").isValueNode()) result.put("urgency", alert.get("urgency").toString());

//               result.put("action", alert.get("action").toString());
//               result.put("dateTime", alert.get("dateTime").toString());
//                result.put("infoOnly", alert.get("infoOnly").toString());
//                result.put("location", alert.get("location").toString());
//                result.put("patient", alert.get("patient").toString());
//                result.put("mustBeProcess", alert.get("mustBeProcess"));
//                result.put("message", alert.get("message").toString());
//                result.put("urgency", alert.get("urgency").toString());

               result.put("cnt", Integer.toString(i));
               task.add(result);
           }

		}


    }
}
