package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.Query.AbstractQuery;
import gov.va.cpe.vpr.queryeng.RenderTask;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Queries for all patient IDs currently in the VPR
 */
public class VprPatientQuery extends AbstractQuery {

    public VprPatientQuery() {
        super("pid", null);
    }

    @Override
    public void exec(RenderTask task) throws Exception {
        IPatientDAO patientDao = task.getResource(IPatientDAO.class);

        // TODO: add paging from params and use patientDao.listPatientIds(new PageRequest());
        List<String> pids = patientDao.listLoadedPatientIds();
        for (String pid : pids) {
            Map<String, Object> row = new HashMap<String, Object>();
            row.put("pid", pid);
            task.add(row);
        }
    }
}
