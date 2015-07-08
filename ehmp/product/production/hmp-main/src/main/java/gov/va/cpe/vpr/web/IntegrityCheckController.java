package gov.va.cpe.vpr.web;

import gov.va.cpe.roster.Roster;
import gov.va.cpe.team.Team;
import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameAction.RefDataAction;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class IntegrityCheckController {
	public static final String ENTRY_POINT = "integrity.check";
	
	@Autowired 
	IGenericPOMObjectDAO dao;
	
	@Autowired
	FrameRunner runner;
	
	// TODO: Push down into IntegrityService?
	List<Runnable> resolutions = new ArrayList<Runnable>();
	
	@RequestMapping(value = "/integritycheck", method = RequestMethod.GET)
	public ModelAndView performIntegrityCheck() throws FrameInitException, FrameExecException {
		List<Map<String, Object>> errors = new ArrayList<Map<String, Object>>();
		errors.addAll(getTeamErrors());
		
		// run any frames listening for this specific invoke event, currently only recognize RefDataAction's
		FrameJob job = runner.exec(new InvokeEvent<Map>(ENTRY_POINT, new HashMap()));
		for (RefDataAction action : job.getActions(RefDataAction.class)) {
			errors.add(action.getData());
		}
		
		return contentNegotiatingModelAndView(errors);
	}
	
	// TODO: Use validation per domain? Pluggable validation runners?
	private List<Map<String, Object>> getTeamErrors() {
		resolutions.clear();
		// Check teams
		List<Map<String, Object>> errors = new ArrayList<Map<String, Object>>();
		List<Team> teams = dao.findAll(Team.class);
		Map<String, Object> vars = new HashMap<String, Object>();
		for(Team t: teams) {
			String rid = t.getRosterId().toString();
			QueryDef qd = new QueryDef("rosters");
			qd.setForPatientObject(false);
			qd.where("localId").is(rid);
			List<Roster> roosters = dao.findAllByQuery(Roster.class, qd, vars);
			if(roosters.size()==0) {
				Map<String, Object> error = new HashMap<String, Object>();
				error.put("error", "Team '"+t.getDisplayName()+"' points to invalid roster. (Roster ID "+rid+" does not exist.)");
				error.put("class", Team.class.getSimpleName());
				List<Map<String, Object>> rlist = new ArrayList<Map<String, Object>>();
				Runnable delTeam = getTeamDeletionRunnable(t.getUid());
				Map<String, Object> resolution = new HashMap<String, Object>();
				resolution.put("display", "Delete Team "+t.getDisplayName());
				resolution.put("hashcode", delTeam.hashCode());
				rlist.add(resolution);
				error.put("resolutions", POMUtils.toJSON(rlist));
				resolutions.add(delTeam);
//				error.put("resolution", t.getData());
				// TODO: Stick the runnable in the resolutions map.
				// TODO: Return anchor link with ID for resolution.
				errors.add(error);
			}
		}
		return errors;
	}
	
	private Runnable getTeamDeletionRunnable(final String teamId) {
		Runnable delTeam = new Runnable() {
			public void run() {
				dao.deleteByUID(Team.class, teamId);
			}
		};
		return delTeam;
	}
	
	@RequestMapping(value="/integritycheck/resolve", method=RequestMethod.POST)
	public void doResolution(@RequestParam Integer hashcode) {
		for(Runnable r: resolutions) {
			if(hashcode.intValue()==r.hashCode()) {
				// TODO: Wrap in executor with a future that will send a notification to the integrity checker that it needs to re-evaluate.
				r.run();
			}
		}
	}
}
