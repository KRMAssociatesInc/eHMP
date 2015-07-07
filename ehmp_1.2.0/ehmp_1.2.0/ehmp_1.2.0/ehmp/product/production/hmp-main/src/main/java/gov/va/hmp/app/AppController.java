package gov.va.hmp.app;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;

import gov.va.cpe.board.BoardContext;
import gov.va.cpe.encounter.EncounterContext;
import gov.va.cpe.param.IParamService;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.roster.RosterContext;
import gov.va.cpe.team.TeamContext;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.CPRSDateTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.MSCUIDateTimePrinterSet;
import gov.va.hmp.healthtime.SortableDateTimePrinterSet;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.servlet.AjaxHandlerExceptionResolver;

import org.apache.http.HttpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.util.*;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class AppController {
    public static final String HMP_DEFAULT_WORKSPACE_USER_PREF = "hmp.default.workspace";
    public static final String DATETIME_FORMAT_USER_PREF = "cpe.datetime.format";

    private UserContext userContext;
    private PatientContext patientContext;
    private EncounterContext encounterContext;
    private TeamContext teamContext;
    private RosterContext rosterContext;
    private BoardContext boardContext;
    private IParamService paramService;
    private IAppService appService;
    private ISyncService syncService;
    private ApplicationContext ctx;
    private IVistaAccountDao vistaAccountDao;
    private AjaxHandlerExceptionResolver resolver;

    private final ImmutableMap<String, ? extends HealthTimePrinterSet> healthTimePrinterSets = ImmutableMap.of("mscui", new MSCUIDateTimePrinterSet(),
            "cprs", new CPRSDateTimePrinterSet(),
            "sortable", new SortableDateTimePrinterSet());

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPatientContext(PatientContext patientContext) { this.patientContext = patientContext; }

    @Autowired
    public void setEncounterContext(EncounterContext encounterContext) { this.encounterContext = encounterContext; }

    @Autowired
    public void setTeamContext(TeamContext teamContext) {
        this.teamContext = teamContext;
    }

    @Autowired
    public void setRosterContext(RosterContext rosterContext) {
        this.rosterContext = rosterContext;
    }

    @Autowired
    public void setBoardContext(BoardContext boardContext) {
        this.boardContext = boardContext;
    }

    @Autowired
    public void setParamService(IParamService paramService) {
        this.paramService = paramService;
    }

    @Autowired
    public void setAppService(IAppService appService) {
        this.appService = appService;
    }

    @Autowired
    public void setApplicationContext(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }
    
    @Autowired
    public void setAjaxHandlerExceptionResolver(AjaxHandlerExceptionResolver resolver) {
    	this.resolver = resolver;
    }
    
    /** Returns error details about a specific request (and as long as it hasn't expired) or all requests.  Requires admin permissions */
    @RequestMapping(value = "/app/errors")
    public ModelAndView error(HttpServletRequest request, @RequestParam(value="id", required=false) String id) {
    	// only permitted if user has correct keys
    	if (!userContext.isLoggedIn() || !currentUserHasAnyOfAuthorities(ImmutableSet.of("VISTA_KEY_VPR_ADMIN", "VISTA_KEY_XUPROG"))) {
    		return contentNegotiatingModelAndView(JsonCResponse.create(request).setError("403", "Forbidden"));
    	}

    	// specific ID requested, fetch it, show error if it doesn't exist
    	if (id != null) {
    		JsonCResponse.Error error = resolver.getRecentException(id);
    		if (error == null) {
    			return contentNegotiatingModelAndView(JsonCResponse.create(request).setError("404", "Exception ID not found in recent error history"));
	    	}
	        return contentNegotiatingModelAndView(JsonCResponse.create(error));
    	}
    	
    	// no id specified, return all
		return contentNegotiatingModelAndView(JsonCCollection.create(resolver.getRecentExceptions()));
    }

    /**
     * Returns a bunch of app, system and environment variables.
     * Useful for debugging sometimes and capturing system context.
     */
    @RequestMapping(value = "/app/info")
    public ModelAndView info(HttpServletRequest request) {
        Map<String, Object> appInfo = new HashMap<>();

        if (!userContext.isLoggedIn()) {
            appInfo.put("userInfo", Collections.singletonMap("displayName", "Guest"));

            Map<String, String> limitedProperties = new HashMap<>();
            limitedProperties.put(HmpProperties.VERSION, ctx.getEnvironment().getProperty(HmpProperties.VERSION));
            limitedProperties.put(HmpProperties.BUILD_DATE, ctx.getEnvironment().getProperty(HmpProperties.BUILD_DATE));
            limitedProperties.put(HmpProperties.BUILD_NUMBER, ctx.getEnvironment().getProperty(HmpProperties.BUILD_NUMBER));
            appInfo.put("props", limitedProperties);
        } else {
            // this little bit of user pref to context mapping feels like it might belong in a ContextManager or something like that
            Map<String, Object> userPrefs = paramService.getUserPreferences();

            syncCurrentUserHealthTimePrinterSetFromUserPref(userPrefs); // does this belong here?

            Map<String, Object> contexts = new HashMap<>();
            contexts.put("pid", patientContext.getCurrentPatientPid());
            contexts.put("patient", patientContext.getCurrentPatient());
            contexts.put("encounterUid", encounterContext.getCurrentEncounterUid());
            //contexts.put("encounter", encounterContext.getCurrentEncounter());    // DO NOT return encounter object
            contexts.put("rosterUid", rosterContext.getCurrentRosterUid());
            contexts.put("roster", rosterContext.getCurrentRoster());
            contexts.put("boardUid", boardContext.getCurrentBoardUid());
            contexts.put("board", boardContext.getCurrentBoard());
            contexts.put("teamUid", teamContext.getCurrentTeamUid());
            contexts.put("team", teamContext.getCurrentTeam());
            contexts.put("panelId", request.getSession().getAttribute("panelId"));
            contexts.put("cpeActiveItem", request.getSession().getAttribute("cpeActiveItem"));

            appInfo.put("userInfo", userContext.getCurrentUser());
            appInfo.put("userPrefs", userPrefs);
            appInfo.put("env", System.getenv());
            appInfo.put("system", System.getProperties());
            appInfo.put("props", HmpProperties.getProperties(ctx.getEnvironment()));
            appInfo.put("menus", appService.getMainMenu().values());
            appInfo.put("operationalDataSynching", syncService.isOperationalSynching());
            appInfo.put("contexts", contexts);
            appInfo.put("ccowDisabled", request.getSession().getAttribute("ccowDisabled"));
            appInfo.put("autoUpdateEnabled", getCurrentUserAutoUpdateEnabled());
            appInfo.put("debug", request.getSession().getAttribute("debug"));
            appInfo.put("authenticatedJiraUser", request.getSession().getAttribute("jiraUsername"));
        };

        JsonCResponse jsonc = JsonCResponse.create(request, appInfo);
        return contentNegotiatingModelAndView(jsonc);
    }

    private void syncCurrentUserHealthTimePrinterSetFromUserPref(Map<String, Object> vals) {
        if (vals != null && vals.containsKey(DATETIME_FORMAT_USER_PREF)) {
            String value = (String) vals.get(DATETIME_FORMAT_USER_PREF);
            HealthTimePrinterSet printerSet = healthTimePrinterSets.get(value);
            if (printerSet != null && userContext.getHealthTimePrinterSet() != printerSet) {
                userContext.setHealthTimePrinterSet(printerSet);
            }
        }
    }

    private Boolean getCurrentUserAutoUpdateEnabled() {
        HmpUserDetails currentUser = userContext.getCurrentUser();
        if (currentUser == null) return false;

        List<VistaAccount> vistaAccounts = vistaAccountDao.findAllByVistaId(currentUser.getVistaId());
        for (VistaAccount vistaAccount: vistaAccounts) {
            if (vistaAccount.isVprAutoUpdate()) return true;
        }
        return false;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String renderDefault() {
        String defaultWorkspace = getDefaultWorksapce();
        return "redirect:/app/" + defaultWorkspace;
    }

    private String getDefaultWorksapce() {
        String defaultWorkspace = (String) paramService.getUserPreference(HMP_DEFAULT_WORKSPACE_USER_PREF);
        if (!StringUtils.hasText(defaultWorkspace)) {
            defaultWorkspace = AppService.DEFAULT_WORKSPACE;
        }
        return defaultWorkspace;
    }

    @RequestMapping(value = "/app/{app}", method = RequestMethod.GET)
    public ModelAndView render(@PathVariable String app, HttpServletRequest request, ModelMap model) {
        // get the default app if none is specified
        if (!StringUtils.hasText(app)) {
            app = getDefaultWorksapce();
        }
        model.put("appService", appService);
        model.put("paramService", paramService);

        Map<String, Object> appConfig = appService.getApp(app);
        if (appConfig != null && appConfig.containsKey("extClass")) {
            String platformName = ctx.getMessage("platform.name.short", null, request.getLocale());
            model.put("extClass", appConfig.get("extClass"));
            model.put("title", platformName + " &raquo; " + appConfig.get("name"));
            return new ModelAndView("/app/extClass", model);
        }

        // otherwise, get the list of all apps and find the apps logical view name or URL to redirect to.
        String url = (appConfig != null ? (String) appConfig.get("url") : null);
        if (url != null && url.startsWith("http")) {
            return new ModelAndView("redirect:" + url, model);
        } else if (url != null) {
            return new ModelAndView(url, model);  // url is logical view name
        } else {
            return new ModelAndView("/app/" + StringUtils.deleteAny(app, "\\./"), model); // should cause spring dispatcher servlet to complain about unknown view
        }
    }

    @RequestMapping(value = "/app/list")
    public ModelAndView list(@RequestParam(required = false) String type) {
        List<Map<String,Object>> vals = (List<Map<String,Object>>) new ArrayList(appService.getApps(type).values());
        Collections.sort(vals, new Comparator<Map<String,Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                String name1 = (String) o1.get("name");
                String name2 = (String) o2.get("name");
                return name1.compareTo(name2);
            }
        });

        return contentNegotiatingModelAndView(Collections.singletonMap("items", vals));
    }

    @RequestMapping(value = "/app/cpeActiveItem/{activeItem}", method=RequestMethod.POST)
    public ModelAndView setCpeActiveItem(HttpServletRequest req, @PathVariable String activeItem) {
        req.getSession().setAttribute("cpeActiveItem",activeItem);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success","true");
        resp.put("activeItem", activeItem);
        return contentNegotiatingModelAndView(resp);
    }
    
    private boolean currentUserHasAnyOfAuthorities(Set<String> authorities) {
        if (authorities == null) return false;
        for (String authority : authorities) {
            if (userContext.getCurrentUser().hasAuthority(authority)) {
                return true;
            }
        }
        return false;
    }

}
