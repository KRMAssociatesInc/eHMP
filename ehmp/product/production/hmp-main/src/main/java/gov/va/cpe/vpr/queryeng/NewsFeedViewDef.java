package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.VitalSignOrganizer;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * An experiment to view the contents of the JDS 'all-time' index, which contains all individual items for a patient
 * organized by time, most recent first.
 *
 * TODO: really we want a "stuff that has happened since" view, which should be tailored for inpatient/outpatient settings, this is only an approximation/starting-point
 * TODO: in particular, we need entries reflecting "activity" as opposed to records - orders/tasks completed, etc. (currently not tracking activity on tasks, for example)
 * TODO: probably wants to be encounter-aware, with items grouped by visit or admission, and also probably wants to be order-aware, results grouped by order, etc.
 */
@Component(value = "gov.va.cpe.vpr.queryeng.NewsFeedViewDef")
@Scope("prototype")
public class NewsFeedViewDef extends ViewDef {
    public NewsFeedViewDef() {
        declareParam(new ViewParam.PatientIDParam());

        final QueryDef newsFeed = new QueryDef("news-feed");
//        newsFeed.fields().alias("entered", "when");              // allergies
        newsFeed.fields().alias("dateTime", "when");             // appointment,consult,image,procedure,surgery,visit
//        newsFeed.fields().alias("referenceDateTime", "when");    // documents
        newsFeed.fields().alias("administeredDateTime", "when"); // immunization, mh
        newsFeed.fields().alias("observed", "when");             // lab, obs, vital
//        newsFeed.fields().alias("overallStart", "when");         // med
        newsFeed.fields().alias("start", "when");                // order
//        newsFeed.fields().alias("onset", "when");                // problem
//        newsFeed.fields().alias("date", "when");                 // roadtrip
//        newsFeed.fields().alias("dueDate", "when");              // task, treatment

        JDSQuery jdsQuery = new JDSQuery("id", newsFeed) {
            @Override
            protected void filterTransformResults(RenderTask task, Map<String, Object> params, List<Map<String, Object>> items) {
                if (items == null) {
                    return;
                } else if (newsFeed != null) {
                    // apply middle tier filters, aliases, transformations, etc...
                    newsFeed.applyFilters(items, params);
                }

                // add the rows to the task results....
                for (Map<String, Object> item : items) {
                    Map<String, Object> mappedRow = mapRow(task, item);
                    if (mappedRow != null && includeRow(task, mappedRow)) {
                        // transform hospitalization ids for admit/discharge date/times
                        if (isHospitalization(mappedRow)) {
                            Object dischargeDateTime = ((Map<String,Object>) mappedRow.get("stay")).get("dischargeDateTime");
                            if (dischargeDateTime != null) {
                                String dischargePKVal = (String)  mappedRow.get("uid") + "-2";
                                Map<String, Object> discharge = task.getRow(dischargePKVal);
                                if (discharge != null) {
                                    // add another entry for the admission
                                    mappedRow.put(getPK(), mappedRow.get("uid") + "-1");
                                } else {
                                    mappedRow.put(getPK(), mappedRow.get("uid") + "-2");
                                    mappedRow.put("when", ((Map<String, Object>) mappedRow.get("stay")).get("dischargeDateTime"));
                                }
                            } else {
                                mappedRow.put(getPK(), mappedRow.get("uid") + "-1");
                            }
                        }
                        task.add(mappedRow);
                    }
                }
            }

            //  @Override
            protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
                row.put(getPK(), row.get("uid"));
                return row;
            }
        };
        addQuery(jdsQuery);
    }

    private boolean isHospitalization(Map<String, Object> item) {
        return Encounter.class.isAssignableFrom(UidUtils.getDomainClassByUid((String) item.get("uid"))) && "urn:va:encounter-category:AD".equalsIgnoreCase((String) item.get("categoryCode"));
    }

    private boolean isVitalSign(Map<String, Object> item) {
        return VitalSign.class.isAssignableFrom(UidUtils.getDomainClassByUid((String) item.get("uid")));
    }
}
