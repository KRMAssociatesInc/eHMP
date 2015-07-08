package gov.va.hmp.app;

import gov.va.cpe.tabs.ChartTab;
import gov.va.cpe.tabs.UserTabPrefs;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.*;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.module.PatientDataDisplayType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class PageController {
    /*
    * Destsined for a service eventually - but for now, a simple list.
    */
    private static final List<ChartTab> PAGES = new ArrayList<>();

    static {
        PAGES.add(createTab("2", "Tasks", Collections.<String, Object>singletonMap("xtype", "taskspanel"), "Encounter"));
        PAGES.add(createTab("7", "Search", Collections.<String, Object>singletonMap("xtype", "searchpanel"), "Encounter"));
        PAGES.add(createTab("8", "Unsigned Review", Collections.<String, Object>singletonMap("xtype", "unsignedreviewtab"), "Encounter"));
        PAGES.add(createTab("9", "Recent Activity", createViewDefWidget(RecentViewDef.class.getName(), "right", "Recent Activity"), "Encounter"));
        PAGES.add(createTab("1", "Condition Review", Collections.<String, Object>singletonMap("xtype", "overviewpanel"), "Review"));
        PAGES.add(createTab("3", "Meds Review", Collections.<String, Object>singletonMap("xtype", "medspanel"), "Review"));
        PAGES.add(createTab("4", "Lab Review", Collections.<String, Object>singletonMap("xtype", "labreviewtab"), "Review"));
//        pageList.add(createTab("5", "Procedures", singletonMap("xtype","procedurespanel"), "Review"));
        PAGES.add(createTab("6", "Documents", Collections.<String, Object>singletonMap("xtype", "documentspanel"), "Review"));
        PAGES.add(createTab("10", "Orders", createViewDefWidget(OrdersViewDef.class.getName(), "right", "Orders"), "Review"));
        PAGES.add(createTab("11", "Observations", createViewDefWidget(ObservationsViewDef.class.getName(), "right", "Observations"), "Review"));
        PAGES.add(createTab("12", "Health Factors", createViewDefWidget(FactorsViewDef.class.getName(), "right", "Health Factors"), "Review"));
        PAGES.add(createTab("17", "Teams", createViewDefWidget(PatientTeamsViewDef.class.getName(), "rowbody", "Patient Teams"), "Specialties"));
//        pageList.add(createTab("14", "Primary Care Worksheet", singletonMap("xtype","worksheetpanel"), "Specialties"));
//        pageList.add(createTab("15", "Surgery", singletonMap("xtype","underconstruction"), "Specialties"));
//        pageList.add(createTab("16", "Nursing Flowsheet", singletonMap("xtype","underconstruction"), "Specialties"));
//        pageList.add(createTab("17", "Lab Review2", singletonMap("xtype","labreviewpanel"), "Review"));
    }

    private static  ChartTab createTab(String uid, String name, Map<String, Object> widget, String category) {
        ChartTab tab = new ChartTab();
        tab.setData("uid", uid);
        tab.setData("name", name);
        tab.setData("widget", widget);
        tab.setData("category", category);
        return tab;
    }

    private static Map<String, Object> createViewDefWidget(String viewID, String detailType, String title) {
        Map<String, Object> widget = new LinkedHashMap<String, Object>();
        widget.put("xtype", "viewdefgridpanel");
        widget.put("viewID", viewID);
        widget.put("detailType", detailType);
        widget.put("title", title);
        return widget;
    }

    private IGenericPOMObjectDAO genericDAO;
    private IVistaVprObjectDao vprDao;
    private UserContext userContext;
    private IPageService pageService;
    private IComponentService componentService;

    @Autowired
    public void setGenericDAO(IGenericPOMObjectDAO genericDAO) {
        this.genericDAO = genericDAO;
    }

    @Autowired
    public void setVprDao(IVistaVprObjectDao vprDao) {
        this.vprDao = vprDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPageService(IPageService pageService) {
        this.pageService = pageService;
    }

    @Autowired
    public void setComponentService(IComponentService componentService) {
        this.componentService = componentService;
    }

    @RequestMapping(value = "/page/list", method = RequestMethod.GET)
    public ModelAndView listPages() {
        ArrayList<ChartTab> rslt = new ArrayList<>();
        rslt.addAll(PAGES);
        rslt.addAll(genericDAO.findAll(ChartTab.class));
        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/page/{apiVersion}/{uid}", method = RequestMethod.GET)
    public ModelAndView get(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) {
        Page pagedef = pageService.getPage(uid);
        if (pagedef == null) throw new NotFoundException("page with uid '" + uid + "' not found");
        return contentNegotiatingModelAndView(JsonCResponse.create(request, pagedef));
    }

    @RequestMapping(value = "/page/{apiVersion}/list", method = RequestMethod.GET)
    public ModelAndView list(@PathVariable String apiVersion, HttpServletRequest request) {
        List<Page> pageDefs = pageService.getPages();
        return contentNegotiatingModelAndView(JsonCCollection.create(request, pageDefs));
    }


    // FIXME: I don't like this here
    @RequestMapping(value = "/page/{apiVersion}/component/list", method = RequestMethod.GET)
    public ModelAndView list(@PathVariable String apiVersion, @RequestParam(required = false) PatientDataDisplayType type, HttpServletRequest request) {
        List<ComponentDescriptor> components = null;
        if (type != null) {
            components = componentService.getComponents(type);
        } else {
            components = componentService.getComponents();
        }
        return contentNegotiatingModelAndView(JsonCCollection.create(request, components));
    }


    @RequestMapping(value = "/page/set", method = RequestMethod.POST)
    public ModelAndView setPages(@RequestParam(required = true) String tabsJson) {
        String uuid = userContext.getCurrentUser().getUid();
//		QueryDef qd = new QueryDef('usertab',uuid,uuid);
//		UserTabPrefs utp = genericDAO.findOneByQuery(UserTabPrefs.class, qd, ['userId':uuid]);
        UserTabPrefs utp = getOneForUserId(uuid);
        if (utp == null) {
            utp = new UserTabPrefs();
            utp.setUserId(uuid);
            utp.setTabs(Collections.<Map<String, Object>>emptyList());
        }

        Map<String, Object> tj = POMUtils.parseJSONtoMap(tabsJson);
        List<Map<String, Object>> dat = (List<Map<String, Object>>) tj.get("data");
        utp.setTabs(dat);
        vprDao.save(utp);
        return contentNegotiatingModelAndView(Collections.singletonMap("success", true));
    }

    @RequestMapping(value = "/page/userPref", method = RequestMethod.GET)
    public ModelAndView getPagesForCurrentUser() {
        String uuid = userContext.getCurrentUser().getUid();
//		QueryDef qd = new QueryDef('usertab',uuid,uuid);
//		UserTabPrefs utp = genericDAO.findOneByQuery(UserTabPrefs.class, qd, ['userId':uuid]);
        UserTabPrefs utp = getOneForUserId(uuid);
        return contentNegotiatingModelAndView(utp);
    }

    @RequestMapping(value = "/page/add", method = RequestMethod.POST)
    public ModelAndView addNewTabOption(@RequestParam(required = true) String tabJson) {
        Map<String, Object> newTab = POMUtils.parseJSONtoMap(tabJson);
        if (newTab != null && !newTab.isEmpty()) {
            ChartTab ptab = new ChartTab(newTab);
            vprDao.save(ptab);
            return contentNegotiatingModelAndView(ptab);
        } else {
            return contentNegotiatingModelAndView(Collections.singletonMap("success", false));
        }
    }

    /**
     * Just because queryDef doesn't support non-PID queries and I haven't had time to subclass it and blah blah blah So,
     * containing to one place to refactor this one.
     *
     * @param uid
     * @return
     */
    private UserTabPrefs getOneForUserId(String uid) {
        // TODO: replace with findOneByIndexAndRange()? (shouldn't need to retrieve all usertabprefs to find one)
        for (UserTabPrefs pref : genericDAO.findAll(UserTabPrefs.class)) {
            if (pref.getUserId().equals(uid)) {
                return pref;
            }

        }

        return null;
    }
}
