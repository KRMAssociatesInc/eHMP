package gov.va.cpe.vpr.queryeng.dynamic;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.queryeng.ColDef;
import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.query.RosterPatientQuery;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.PointInTimeFormat;

import java.util.Iterator;
import java.util.Map;

public class PatientPanelViewDef extends ViewDef {

    public PatientPanelViewDef(ViewDefDef vdd) {
        super();
        setID(vdd.getUid());
        
        StringBuilder colnames = new StringBuilder("pt");
        int coldex = 0;
        /**
         * Difference between domain-data driven ViewDefs and patient field ViewDefs?
         */
        for (ViewDefDefColDef cd : vdd.cols) {
            colnames.append(",");
            cd.dataIndex = "dyncol-" + (coldex++);
            colnames.append(cd.dataIndex);
        }
        String displayCols = colnames.toString();
        String requireCols = "pt";
        String hideCols = "temporary";
        String sortCols = "";
        String groupCols = "";

        // update triggers
        addTrigger(new PatientEventTrigger<Task>(Task.class));

        declareParam(new ViewParam.ViewInfoParam(this, "List Patients", null));
        declareParam(new ViewParam.DateRangeParam("recent", "2010..NOW"));
        declareParam(new ViewParam.SessionParams());
        declareParam(new ViewParam.SimpleViewParam("roster.uid"));

        // list of fields that are not displayable as columns and a default user column set/order
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        // primary query is a simple RosterService call executed once
        Query primary = new RosterPatientQuery() {

            protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
                Map<String, Object> ret = super.mapRow(renderer, row);
                String rslt = "";
                if (ret.containsKey("gender") && (!ret.get("gender").equals("")) && ret.containsKey("dob")) {
                    PointInTime dob = (PointInTime) ret.get("dob");
                    PointInTime died = (PointInTime) ret.get("died");
                    int age = PatientDemographics.calculateAge(dob, died);
                    String gender = (String) ret.get("gender");
                    String dateStr = PointInTimeFormat.date().print(dob);
                    String ageStr = "&nbsp;<span class='label label-default'>" + (died != null ? "Deceased" : age) + "</span>";
                    rslt = dateStr + ageStr;
                }
                if (ret.containsKey("ssn") && ret.get("ssn").toString().length() > 4) {
                    String ssn = ret.get("ssn").toString();
                    ret.put("ssnf", ssn.substring(0, 3) + "&#8209;" + ssn.substring(3, 5) + "&#8209;" + ssn.substring(5));//ssn.length()-4));
                }

                return ret;
            }
        };
        
        addQuery(primary);

        // add a cohort filter (if specified)
//		String cohort = (String) vdd.getProperty("cohort");
//		if (cohort != null && cohort.equals("gov.va.cpe.vpr.queryeng.CohortFilterQuery.AlertPatientCohort")) {
//			addQuery(new CohortFilterQuery.AlertPatientCohort());
//		} else if (cohort != null && cohort.equals("gov.va.cpe.vpr.queryeng.CohortFilterQuery.HighA1CPatientCohort")) {
//			// abnormal A1C query
//			QueryDef def = new QueryDef("lab-lnc-code", "urn:lnc:4637-5");
//			def.setIndexOperation("last");
//			def.where("interpretationName").exists();
//			addQuery(new CohortFilterQuery.GenericCohortFilter("pid", new JDSQuery("uid", def)));
//		} else {
//			// TODO: throw error?  use class inflection? both?
//		}

        addColumn(new ColDef.HealthTimeColDef(primary, "updated"));
        addColumn(new TemplateColDef("pt",
                "<div class=\"media\">" +
                    "<img class='media-object pull-left' src='{photoHRef}' width='30' height='30'/>" +
                    "<div class='media-body'>" +
                        "<h5 class='media-heading'>{displayName}<span class='text-muted small pull-right'>{[values.sensitive?'':values.genderName.slice(0,1)]}</span></h5>" +
                        "<div class='text-muted small'>" +
                            "<tpl if=\"!values.sensitive\">" +
                                "{[gov.va.hmp.team.Patient.formatSSN(values.ssn)]} <span class='pull-right'>{[PointInTime.format(values.dateOfBirth)]}&nbsp;<span class='label label-default'><tpl if='died'>Deceased<tpl else>{age}</tpl></span></span>" +
                            "<tpl else>" +
                                "*Sensitive*" +  // TODO: need to screen for sensitivity on server and not send SSN and DOB over wire
                            "</tpl>" +
                        "</div>" +
                    "</div>" +
                "</div>").setMetaData("text", "Patient").setMetaData("width", 140));//[text: 'Patient', width: 200]));
        // Now, add custom columns to the rest o' this ViewDef.
        Iterator<ViewDefDefColDef> citer = vdd.cols.iterator();
        while (citer.hasNext()) {
            ViewDefDefColDef cdef = citer.next();

            if (cdef != null) {
                String view = cdef.getViewdefCode();
                ColDef cd = addColumn(new ColDef.DeferredViewDefDefColDef(cdef, "pid", cdef.dataIndex)).setMetaData("text", cdef.getFieldName());
                if (cdef.getEditOpt() != null) {
                    cd.setMetaData("editOpt", cdef.getEditOpt());
                }
            }
        }
    }
}
