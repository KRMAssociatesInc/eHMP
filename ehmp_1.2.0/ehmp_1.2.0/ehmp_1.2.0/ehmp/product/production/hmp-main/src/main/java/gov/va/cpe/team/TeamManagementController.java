package gov.va.cpe.team;

import gov.va.cpe.odc.Person;
import gov.va.cpe.roster.IRosterService;
import gov.va.cpe.roster.Roster;
import gov.va.cpe.team.Team.StaffAssignment;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsDaoSupport;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.cpe.vpr.web.BadRequestException;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.*;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class TeamManagementController {

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    IGenericPOMObjectDAO jdsDao;

    @Autowired
    IVistaVprObjectDao vprObjectDao;

    @Autowired
    UserContext userContext;

    @Autowired
    TeamContext teamContext;

    @Autowired
    IRosterService rosterService;

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/person/list", method = RequestMethod.GET)
    public ModelAndView persons(@PathVariable String apiVersion,
                                @RequestParam(required = false) String query,
                                Pageable pageable,
                                HttpServletRequest request) throws IOException {
        query = JdsDaoSupport.quoteAndWildcardQuery(query);
        Page<Person> persons = jdsDao.findAllByIndexAndRange(Person.class, "person", query, pageable);
        return contentNegotiatingModelAndView(JsonCCollection.create(request, persons));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/teamPersons", method = RequestMethod.GET)
    public ModelAndView persons(@RequestParam(required = true) String teamUid) {
        // TODO: use link template here
        Team team = jdsDao.findByUID(Team.class, teamUid);
        ArrayList<Map<String, Object>> teamPeople = new ArrayList<Map<String, Object>>();
        for (StaffAssignment sa : team.getStaff()) {
            Map<String, Object> rslt = new HashMap<String, Object>();
            rslt.put("positionName", sa.getPositionName());
            String uid = sa.getPersonUid();
            if (uid != null && !uid.equals("")) {
                Person p = jdsDao.findByUID(Person.class, sa.getPersonUid());
                rslt.putAll(p.getData());
            }
            teamPeople.add(rslt);
        }
        return contentNegotiatingModelAndView(teamPeople);
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/team/list", method = RequestMethod.GET)
    public ModelAndView teams(
            @PathVariable String apiVersion,
            @RequestParam(required = false) String patdfn,
            @RequestParam(required = false) Boolean forCurrentUser,
            @RequestParam(required = false) String userUid,
            @RequestParam(required = false) Boolean showDraft,
            HttpServletRequest request) throws IOException {

        if (patdfn != null) {
            // If we're getting teams for a given patient, we aren't going to be looking at draft teams.
            return teamsForPatient(patdfn);
        }

        List<Team> teams = (List<Team>) GenUtil.draftFilter(jdsDao.findAllWithTemplate(Team.class, Team.TEAM_PERSONS_LINK_JDS_TEMPLATE), showDraft == null ? false : showDraft.booleanValue());

        if (forCurrentUser != null && forCurrentUser) {
            userUid = userContext.getCurrentUser().getUid();
        }
        if (userUid != null) {
            List<Team> newTeams = new ArrayList<Team>();
            for (Team t : teams) {
                if (t.getStaff() != null) {
                    for (StaffAssignment asg : t.getStaff()) {
                        if (asg.getPersonUid()!=null && asg.getPersonUid().equals(userUid)) {
                            newTeams.add(t);
                            break;
                        }
                    }
                }
            }
            teams = newTeams;
        }
        return contentNegotiatingModelAndView(JsonCCollection.create(request, teams));
    }

    private ModelAndView teamsForPatient(String patdfn) {
        List<Roster> rosters = rosterService.getRostersForPatient(patdfn);
        List<Team> rslt = new ArrayList<Team>();
        ArrayList<Integer> rids = new ArrayList<Integer>();
        for (Roster roster : rosters) {
            rids.add(Integer.parseInt(roster.getLocalId()));
        }
//		QueryDef qd = new QueryDef("team");
//		QueryDefFilter crit = new QueryDefFilter.QueryDefIndex("rosterID").in(rids);
//		qd.addCriteria(crit);
//		Map<String, Object> uriVariables = new HashMap<String, Object>();
//		uriVariables.put("pid","0");
//		return contentNegotiatingModelAndView(jdsDao.findAllByQuery(Team.class, qd, uriVariables));
        for (Team tm : jdsDao.findAll(Team.class)) {
            if (rids.contains(tm.getRosterId())) {
                rslt.add(tm);
            }
        }
        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/team/new", method = RequestMethod.POST)
    public ModelAndView createTeam(@PathVariable String apiVersion, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        Team team = POMUtils.newInstance(Team.class, requestJson);
        team.setData("ownerUid", userContext.getCurrentUser().getUid());
        team.setData("ownerName", userContext.getCurrentUser().getDisplayName());
        team.setData("displayName", StringEscapeUtils.escapeHtml(team.getDisplayName())); // sanitize name
        team = vprObjectDao.save(team);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, team));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/team/{uid}", method = RequestMethod.GET)
    public ModelAndView readTeam(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) throws IOException {
        Team team = jdsDao.findByUIDWithTemplate(Team.class, uid, Team.TEAM_PERSONS_LINK_JDS_TEMPLATE);
        if (team == null) throw new NotFoundException("Team '" + uid + "' not found.");
        return contentNegotiatingModelAndView(JsonCResponse.create(request, team));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/team/{uid}", method = RequestMethod.POST)
    public ModelAndView updateTeam(@PathVariable String apiVersion, @PathVariable String uid, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        Team team = POMUtils.newInstance(Team.class, requestJson);
        team.setData("displayName", StringEscapeUtils.escapeHtml(team.getDisplayName())); // sanitize name

        if (!uid.equalsIgnoreCase(team.getUid())) throw new BadRequestException("Team UID mismatch");
        // TODO: check for ownership and/or other privs
        //        if (userContext.getCurrentUser().getUid().equals(team.getOwnerUid())) throw new AccessDeniedException("Current user is not the owner of this team");
        try {
            team = vprObjectDao.save(team);
        } catch (DataRetrievalFailureException exc) {
            if (exc.getMessage().contains("UID") && exc.getMessage().contains(" not found")) {
                // The Vista copy of this team does not exist.
                if (jdsDao.findByUID(Team.class, team.getUid()) != null) {
                    jdsDao.deleteByUID(Team.class, team.getUid());
                }
                team.setData("uid", null);
                team = vprObjectDao.save(team);
            }
        }

        // if we have just updated the current team, make sure the context has the updated definition
        Team currentTeam = teamContext.getCurrentTeam();
        if (currentTeam != null && team.getUid().equalsIgnoreCase(currentTeam.getUid())) {
            teamContext.setCurrentTeam(team);
        }

        return contentNegotiatingModelAndView(JsonCResponse.create(request, team));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/team/{uid}", method = RequestMethod.DELETE)
    public ModelAndView deleteTeam(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) throws IOException {
        // TODO: check for ownership and/or other privs
        Team tm = jdsDao.findByUID(Team.class, uid);
        if (tm != null) {
            vprObjectDao.deleteByUID(Team.class, uid);
        }
        return contentNegotiatingModelAndView(JsonCResponse.create(request, Collections.emptyMap()));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/position/list", method = RequestMethod.GET)
    public ModelAndView positions(@PathVariable String apiVersion, HttpServletRequest request) throws IOException {
        List<TeamPosition> positions = jdsDao.findAll(TeamPosition.class);
        return contentNegotiatingModelAndView(JsonCCollection.create(request, positions));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/position/new", method = RequestMethod.POST)
    public ModelAndView createPosition(@PathVariable String apiVersion, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        TeamPosition position = POMUtils.newInstance(TeamPosition.class, requestJson);
        position.setData("name", StringEscapeUtils.escapeHtml(position.getName())); // sanitize name
        position = vprObjectDao.save(position);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, position));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/position/{uid}", method = RequestMethod.GET)
    public ModelAndView readPosition(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) throws IOException {
        TeamPosition position = jdsDao.findByUID(TeamPosition.class, uid);
        if (position == null) throw new NotFoundException("Team Position '" + uid + "' not found.");
        return contentNegotiatingModelAndView(JsonCResponse.create(request, position));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/position/{uid}", method = RequestMethod.POST)
    public ModelAndView updatePosition(@PathVariable String apiVersion, @PathVariable String uid, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        TeamPosition position = POMUtils.newInstance(TeamPosition.class, requestJson);
        position.setData("name", StringEscapeUtils.escapeHtml(position.getName())); // sanitize name
        if (!uid.equalsIgnoreCase(position.getUid())) throw new BadRequestException("Team Position UID mismatch");
        position = vprObjectDao.save(position);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, position));
    }

    @RequestMapping(value = "/teamMgmt/v{apiVersion}/position/{uid}", method = RequestMethod.DELETE)
    public ModelAndView deletePosition(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) throws IOException {
        // TODO: possibly check for Teams using this position and warn?
        vprObjectDao.deleteByUID(TeamPosition.class, uid);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, Collections.emptyMap()));
    }
}
