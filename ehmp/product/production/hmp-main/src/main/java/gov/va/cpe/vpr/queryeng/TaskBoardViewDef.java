
package gov.va.cpe.vpr.queryeng;


import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.queryeng.query.QueryDefCriteria.where;

/**
 * {@link ViewDef} for showing a user's created, claimed, or past-due tasks
 */
@Component(value = "gov.va.cpe.vpr.queryeng.TaskBoardViewDef")
public class TaskBoardViewDef extends ViewDef {

    public TaskBoardViewDef() {
		addTrigger(new PatientEventTrigger<Task>(Task.class)); 
		domainClasses.add("Task");
    	
        declareParam(new ViewParam.SimpleViewParam("userId"));

        String displayCols = "displayName, name, description, dueDate, claimedBy";
        String requireCols = "displayName, name, description, dueDate, claimedBy";
        String hideCols = "uid,selfLink,domainClass";
        String sortCols = "displayName, dueDate, claimedBy"; // Author sort does not work because it is called different things in different files that both contribute to this notesview JDS template.
        String groupCols = "displayName, dueDate, claimedBy, createdBy";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
        declareParam(new ViewParam.SortParam("dueDate", false));

        // fetch VPR PIDs for all patients in the VPR
        QueryDef qry = new QueryDef("task-pending");
        qry.whereAny(where("createdByCode").is("?:userId"), where("claimedByUid").is("?:userId"));
        //qry.where("createdByCode").is("?:userId");
        qry.linkIf("task-link",null,true);
        qry.setCrossPatient(true);
        
        JDSQuery query = new JDSQuery("uid", qry){

            protected boolean includeRow(RenderTask task, Map<String, Object> mappedRow) {
                String userId = task.getParams().get("userId").toString();
                if(mappedRow.containsKey("createdByCode") && mappedRow.get("createdByCode").equals(userId)) {
                    if(mappedRow.containsKey("claimedByUid") && !mappedRow.get("claimedByUid").equals(userId)) {
                        if(mappedRow.containsKey("dueDate") && !HL7DateTimeFormat.parse(mappedRow.get("dueDate").toString()).before(PointInTime.now())) {
                            return false;
                        }
                    }
                }
                return true;
            }

            protected void filterTransformResults(RenderTask task, Map<String, Object> params, List<Map<String, Object>> items) {

                IPatientDAO patientDao = task.getResource(IPatientDAO.class);
                for(Map<String, Object> row: items) {
                    PatientDemographics pt = patientDao.findByPid(row.get("pid").toString());
                    if (pt == null) return;
                    row.put("displayName", pt.getDisplayName());
                }

                Object scol = params.get("sort.col");
                final Object sdir = params.get("sort.dir");
                if (scol != null && sdir != null && scol.toString().equals("displayName")) {
                    Collections.sort(items, new Comparator<Map<String, Object>>() {
                        @Override
                        public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                            Object val1 = o1.get("displayName");
                            Object val2 = o2.get("displayName");
                            int rslt = 0;
                            if (val1 instanceof Integer && val2 instanceof Integer) {
                                rslt = ((Integer) val1).compareTo((Integer) val2);
                            } else {
                                if (val1 == null && val2 == null) {
                                    rslt = 0;
                                } else if (val1 == null && val2 != null) {
                                    rslt = 1;
                                } else if (val2 == null && val1 != null) {
                                    rslt = -1;
                                } else {
                                    rslt = val1.toString().toLowerCase().compareTo(val2.toString().toLowerCase());
                                }
                            }
                            if (!sdir.toString().equalsIgnoreCase("ASC")) {
                                rslt = rslt * -1;
                            }
                            return rslt;
                        }
                    });
                }
                super.filterTransformResults(task, params, items);
            }
        };
        addQuery(query);
        addQuery(new QueryMapper.PerRowAppendMapper(new AbstractQuery("pid", null) {

            @Override
            public void exec(RenderTask task) throws Exception {
                RenderTask.RowRenderSubTask rowtask = (RenderTask.RowRenderSubTask) task;
                String pid = (String) rowtask.getParentRowVal("pid");
                
                // I could not make a link by PID work (it reported "Unknown UID"... can dig into M code later)
                // So, for now, brute force method to get pat name in view.
                IPatientDAO patientDao = task.getResource(IPatientDAO.class);
                PatientDemographics pt = patientDao.findByPid(pid);
                if (pt == null) return;

                task.appendVal(pid, "displayName", pt.getDisplayName());

            }
        }));
        addColumns(query,
                "displayName",
                "name",
                "description",
                "dueDate",
                "claimedBy");
        addColumn(new DomainClassSelfLinkColDef("selfLink", Task.class));
    }

}
