package gov.va.cpe.ctx;

import gov.va.cpe.board.BoardContext;
import gov.va.cpe.encounter.EncounterContext;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.roster.RosterContext;
import gov.va.cpe.team.TeamContext;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class ContextManagementController {

    private RosterContext rosterContext;
    private BoardContext boardContext;
    private TeamContext teamContext;
    private PatientContext patientContext;
    private EncounterContext encounterContext;
    private IPatientSelectDAO patientSelectDAO;

    @Autowired
    public void setRosterContext(RosterContext rosterContext) {
        this.rosterContext = rosterContext;
    }

    @Autowired
    public void setBoardContext(BoardContext boardContext) {
        this.boardContext = boardContext;
    }

    @Autowired
    public void setTeamContext(TeamContext teamContext) {
        this.teamContext = teamContext;
    }

    @Autowired
    public void setPatientContext(PatientContext patientContext) {
        this.patientContext = patientContext;
    }

    @Autowired
    public void setEncounterContext(EncounterContext encounterContext) { this.encounterContext = encounterContext; }

    @Autowired
    public void setPatientSelectDAO(IPatientSelectDAO patientSelectDAO) {
        this.patientSelectDAO = patientSelectDAO;
    }

    @RequestMapping(value = "/context/patient", method = RequestMethod.POST)
    ModelAndView set(@RequestParam("pid") String pid,
                     HttpServletRequest request) {
        PatientSelect patientSelect = patientSelectDAO.findOneByPid(pid);
        if (patientSelect == null) throw new PatientNotFoundException(pid);

        patientContext.setCurrentPatientPid(pid);

        PatientDemographics pt = patientContext.getCurrentPatient();
        if (pt == null) throw new PatientNotFoundException(pid);

        Map<String, Object> data = new HashMap();
        data.put("patient", pt);
        data.put("patientChecks", patientContext.getCurrentPatientChecks());
        data.put("additionalDemographics", patientContext.getCurrentPatientAdditionalDemographics());
        data.put("syncStatus", patientContext.getCurrentPatientSyncStatus());
        data.put("currentLocation", patientContext.getCurrentPatientLocation());
        data.put("isInPatient", patientContext.isCurrentPatientInPatient());

        return contentNegotiatingModelAndView(JsonCResponse.create(request, data));
    }

    @RequestMapping(value = "/context/{context}", method = RequestMethod.POST)
    ModelAndView set(@PathVariable("context") String context,
                     @RequestParam("uid") String uid,
                     HttpServletRequest request) {
        if (StringUtils.hasText(uid)) {
            if ("roster".equalsIgnoreCase(context)) {
                rosterContext.setCurrentRosterUid(uid);
            } else if ("board".equalsIgnoreCase(context)) {
                boardContext.setCurrentBoardUid(uid);
            } else if ("team".equalsIgnoreCase(context)) {
                teamContext.setCurrentTeamUid(uid);
            }
        }

        // encounter context can be set using no uid (no appointment or admission)
        if ("encounter".equalsIgnoreCase(context)) {
            encounterContext.setCurrentEncounterUid(uid);
        }

        Map<String, Object> contexts = getContexts();
        return contentNegotiatingModelAndView(JsonCResponse.create(request, contexts));
    }

    @RequestMapping(value = "/context", method = RequestMethod.POST)
    ModelAndView set(@RequestParam(value = "roster", required = false) String rosterUid,
                     @RequestParam(value = "board", required = false) String boardUid,
                     @RequestParam(value = "team", required = false) String teamUid,
                     @RequestParam(value = "encounter", required = false) String encounterUid,
                     HttpServletRequest request) {
        if (StringUtils.hasText(rosterUid)) {
            rosterContext.setCurrentRosterUid(rosterUid);
        }
        if (StringUtils.hasText(boardUid)) {
            boardContext.setCurrentBoardUid(boardUid);
        }
        if (StringUtils.hasText(teamUid)) {
            teamContext.setCurrentTeamUid(teamUid);
        }

        // encounter context can be set using no uid (no appointment or admission)
        encounterContext.setCurrentEncounterUid(encounterUid);

        Map<String, Object> contexts = getContexts();
        return contentNegotiatingModelAndView(JsonCResponse.create(request, contexts));
    }

    @RequestMapping(value = "/ccow/disable", method = RequestMethod.POST)
    ModelAndView setCcowStatus(HttpServletRequest request) {
        request.getSession().setAttribute("ccowDisabled", true);
        return getCcowStatus(request);
    }

    @RequestMapping(value = "/ccow/disable", method = RequestMethod.GET)
    ModelAndView getCcowStatus(HttpServletRequest request) {
        Object rslt = request.getSession().getAttribute("ccowDisabled");
        Map<String, Object> result = new HashMap<>();
        result.put("disabled", rslt == null ? "false" : rslt);
        return contentNegotiatingModelAndView(result);
    }

    // put this in contextService?
    private Map<String, Object> getContexts() {
        Map<String, Object> contexts = new HashMap();
        contexts.put("board", boardContext.getCurrentBoard());
        contexts.put("roster", rosterContext.getCurrentRoster());
        contexts.put("team", teamContext.getCurrentTeam());
        contexts.put("encounter", encounterContext.getCurrentEncounterUid()); // just return  uid ...
        return contexts;
    }
}
