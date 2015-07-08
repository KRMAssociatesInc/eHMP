package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.roster.IRosterService;
import gov.va.cpe.roster.Roster;
import gov.va.cpe.roster.RosterService;
import gov.va.cpe.team.Team;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.jds.JdsGenericDAO;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.PatientTeamsViewDef")
@Scope("prototype")
public class PatientTeamsViewDef extends ViewDef {
	
	@Autowired
	IRosterService rosterService;
	
	@Autowired
	IPatientDAO patDao;

	@Autowired
	IGenericPOMObjectDAO jdsDao;

    public PatientTeamsViewDef() {
    	this.domainClasses.add(Team.class.getSimpleName());
    	
    	declareParam(new ViewParam.ViewInfoParam(this, "Patient Teams"));
    	declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SystemIDParam());
    	declareParam(new ViewParam.SortParam("updated", true));
    	
        String displayCols = "displayName,description,ownerName,rosterId,summary,updated";
        String requireCols = "displayName";
        String hideCols = "uid,ownerUid";
        String sortCols = "";
        String groupCols = "";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

    	Query q = new AbstractQuery("uid", null) {

			@Override
			public void exec(RenderTask task) throws Exception {
				// This might want to be its own Query type; Service query? Meh.
                Map<String, Object> parms = task.getParams();
                String pid = parms.get("pid").toString();
                if (pid != null && !pid.equals("") && !pid.equals("0")) {
                    PatientDemographics pat = patDao.findByPid(pid);
                    JdsGenericDAO dao = task.getResource(JdsGenericDAO.class);
                    //List<Map<String, Object>> rosters = rosterService.getRostersForPatient(dfn);
                    QueryDef qd = new QueryDef(RosterService.ROSTERS_BY_PATIENT_INDEX, pid);
                    qd.setForPatientObject(false);
                    List<Roster> roosters = dao.findAllByQuery(Roster.class, qd, new HashMap<String, Object>());
                    ArrayList<Integer> rids = new ArrayList<Integer>();
                    for (Roster roster : roosters) {
                        rids.add(Integer.parseInt(roster.getLocalId().toString()));
                    }
                    for (Team tm : jdsDao.findAll(Team.class)) {
                        if (rids.contains(tm.getRosterId())) {
                            task.appendRow(tm.getUid(), tm.getData());
                        }
                    }
                }
            }
    	};
    	
    	addColumns(q, "displayName", "description", "ownerName", "rosterId", "summary", "uid",  "ownerUid");

        addColumn(new ColDef.HealthTimeColDef(q, "updated")).setMetaData("text", "Updated");
//        addColumn(new DomainClassSelfLinkColDef("selfLink", Team.class));
        
    	addQuery(q);
    }
}
