package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.roster.Roster;
import gov.va.cpe.roster.RosterPatient;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.queryeng.Query.AbstractQuery;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.jsonc.JsonCCollection;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Combines roster search and free-text patient search into a single viewdef.
 * <p/>
 * If the patient is on the roster (or in the search results) but not in the VPR then the record is still included, but
 * should not be clickable (because vprid is not present). If the patient is in the VPR, then additional fields (from
 * PatientDao) are also included in the results.
 * <p/>
 * Requires the following params: 1) roster.uid
 *
 * @author brian
 */
public class RosterPatientQuery extends AbstractQuery {

    private QueryDef qry;

    public RosterPatientQuery() {
        super("pid", null);
        qry = new QueryDef("rosters");
        qry.setForPatientObject(false);
        qry.where("uid").is("?:roster.uid");
    }

    @Override
    public void exec(RenderTask task) throws Exception {
        JdsTemplate tpl = task.getResource(JdsTemplate.class);
        Map<String, Object> params = getParams(task);
        int start = task.getParamInt("row.start");
        int count = task.getParamInt("row.count");
        String rosterUid = task.getParamStr("roster.uid");

        if (!StringUtils.hasText(rosterUid)) return;

        // build and execute the HTTP request
        String qs = getQueryString();
        String url = (qs != null) ? evalQueryString(task, qs) : null;
        if (url == null) {
            url = qry.getQueryString(params, start, count);
        } else {
            // ensure start+count are there
            url += (url.indexOf("?") > 0) ? "&" : "?";
            url += String.format("start=%d", start);
            if ( count > 0 ) {
            	url += String.format("&limit=%d", count);
            }
            url += String.format("&eq(uid, %s)", rosterUid);
        }

        // execute the query
        JsonCCollection<Roster> response = tpl.getForJsonC(Roster.class, task.evalString(url));
        List<Roster> items = response.getItems();
        filterTransformResults(task, params, items);
    }

    protected Map<String, Object> getParams(RenderTask task) {
        Map<String, Object> params = new HashMap<String, Object>(task.getParams());

        // if this is running per-row, merge the row data with the params; params take precedence if keys collide
        if (task instanceof RenderTask.RowRenderSubTask) {
            Map<String, Object> row = ((RenderTask.RowRenderSubTask) task).getParentRow();
            for (Map.Entry<String, Object> entry : row.entrySet()) {
                if (!params.containsKey(entry.getKey())) {
                    params.put(entry.getKey(), entry.getValue());
                }
            }
        }

        return params;
    }

    protected void filterTransformResults(RenderTask task, Map<String, Object> params, List<Roster> rosters) {
        if (rosters.isEmpty()) {
            return;
        }
        for (Roster roster : rosters) {
            for (RosterPatient pat : roster.getPatients()) {
                if(pat.getPid()==null && params.get("systemId")!=null) {
                    // TODO: Use a link-rel in JDS to do this. Wasn't working for patient UIDs for some reason.
                    String systemId = params.get("systemId").toString();
                    PatientDemographics fullDem = task.getResource(IPatientDAO.class).findByPid(pat.getPid());
                    if(fullDem!=null) {
                        pat.setData(fullDem.getData());
                    }
                }
                task.add(mapRow(task, pat.getData(JSONViews.WSView.class)));
            }
        }
    }
}