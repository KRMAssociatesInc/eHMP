package gov.va.cpe.roster;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RequestMapping(value = "/roster/**")
@Controller
public class RosterController {

    private IPatientDAO patientDao;
    private IParamService paramService;
    private IRosterService rosterService;

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setParamService(IParamService paramService) {
        this.paramService = paramService;
    }

    @Autowired
    public void setRosterService(IRosterService rosterService) {
        this.rosterService = rosterService;
    }

    @RequestMapping(value = "updateOne")
    public ModelAndView update(@RequestParam("set") String mySet, HttpSession session, HttpServletRequest request) {
        // clear cache
        session.removeAttribute("rosters");
        Map params = request.getParameterMap();
        return ModelAndViewFactory.contentNegotiatingModelAndView(updateJsonRoster(POMUtils.parseJSONtoNode(mySet)));
    }

    private Map updateJsonRoster(JsonNode myDef) {
        // update the user preferences (if any)
        Map rslt = null;
        if (myDef.get("id") != null) {
            // this is the list of recognized parameters that the GUI can modify.
            Set<String> keys = new HashSet<String>(Arrays.asList("favorite", "viewdef", "panel"));
            Map<String, Object> prefs = new LinkedHashMap<String, Object>();

            Iterator<String> iterator = myDef.fieldNames();
            while (iterator.hasNext()) {
                String p = iterator.next();
                if (keys.contains(p)) {
                    prefs.put(p, myDef.get(p).asText());
                }

            }

            // only update the preference if some parameters were actually defined.
            if (prefs.size() > 0) {
                paramService.setUserParamVals("VPR ROSTER PREF", myDef.get("id").textValue(), prefs);
            }

            JsonNode defNode = myDef.get("def");
            List<String> items = new ArrayList<String>(defNode.size());
            for (JsonNode item : defNode) {
                items.add(item.asText());
            }

            Roster roster = rosterService.updateRoster(items.toArray(new String[items.size()]));
            rslt = roster.getData(JSONViews.WSView.class);
        }

        return rslt;
    }

    @RequestMapping(value = "delete")
    @ResponseBody
    public String delete(@RequestParam String uid, HttpSession session) {
        if (StringUtils.hasText(uid)) {
            session.removeAttribute("rosters");
            return rosterService.deleteRoster(uid);
        }

        return null;
    }

    @RequestMapping(value = "source")
    public ModelAndView source(@RequestParam(required = false) String id, @RequestParam(required = false) String query) {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("data", new ArrayList<Object>());
        map.put("type", id);
        map.put("query", query);
        // TODO: consider folding this logic regarding min query length into searchRosterSource
        if (!"Patient".equals(id)) {
            map.put("data", rosterService.searchRosterSource(id, query));
        } else if (query != null && query.length() >= 4) {// ensure that at least 4 search characters are present for patient lists
            map.put("data", rosterService.searchRosterSource(id, query));
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(map);
    }

    @RequestMapping(value = "list")
    public ModelAndView list(Pageable pageable, HttpServletRequest request) {
        Page<Roster> rosters = rosterService.getRosters(pageable);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, rosters));
    }

    /**
     * See if a patient (or a roster of patients) has been updated since the last ping
     */
    @RequestMapping(value = "ping")
    public ModelAndView ping(@RequestParam(required = false) String pid) {
        if (StringUtils.hasText(pid)) {
            // TODO: this probably isn't the most efficient
            PatientDemographics pat = patientDao.findByPid(pid);
            if (pat == null) throw new PatientNotFoundException(pid);

            List<Map<String, Object>> items = new ArrayList<>();
            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(2);
            map.put("lastUpdated", pat.getLastUpdated());
            map.put("domainsUpdated", pat.getDomainUpdated());
            items.add(map);
            return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("items", items));
        }

        return null;
    }
}
