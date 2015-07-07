package gov.va.hmp.app;

import gov.va.cpe.vpr.PointOfCare;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.dynamic.IViewDefDefDAO;
import gov.va.cpe.vpr.queryeng.dynamic.PatientPanelViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDefConfigTemplate;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Controller
@RequestMapping("/config/**")
public class ConfigController {
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView index() {
        return new ModelAndView("/config/index", new LinkedHashMap<String, Object>());
    }

    @RequestMapping(value = "pointOfCareOptions", method = RequestMethod.GET)
    public ModelAndView pointOfCareOptions(HttpServletRequest request, HttpServletResponse response) {
        List<PointOfCare> rslt = genericDAO.findAll(PointOfCare.class);
        return ModelAndViewFactory.contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "pointOfCareOption", method = RequestMethod.POST)
    public ModelAndView setPointOfCareOption(HttpServletRequest request, HttpServletResponse response) {
        ParameterMap params = new ParameterMap(request);

        Object uid = params.get("uid");
        PointOfCare poc = new PointOfCare();
        if (uid!=null && !uid.toString().isEmpty()) {
            poc = ((PointOfCare) (genericDAO.findByUID(PointOfCare.class, uid.toString())));
        }

        poc.setData(params);
        genericDAO.save(poc);
        return ModelAndViewFactory.contentNegotiatingModelAndView(poc);
    }

    @RequestMapping(value = "panels", method = RequestMethod.GET)
    public ModelAndView panels(HttpServletRequest request, HttpServletResponse response, @RequestParam(required = false) Boolean showDraft) {
        // build up the param set
        ParameterMap params = new ParameterMap(request);

        // Return JSON of panels;
        List<ViewDefDef> boards = (List<ViewDefDef>) GenUtil.draftFilter(vddDAO.findAll(), showDraft == null ? false : showDraft.booleanValue());

        ArrayList<Object> rslt = new ArrayList<Object>();
        for (ViewDefDef d : boards) {
            Map<String, Object> map = d.getData();
            map.put("columns", d.getCols());
            rslt.add(map);
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "panel", method = RequestMethod.POST)
    public ModelAndView savePanel(@RequestParam(required = true) String panel, HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        Map<String, Object> pmap = POMUtils.parseJSONtoMap(panel);
        pmap.put("name", StringEscapeUtils.escapeHtml((String) pmap.get("name"))); // sanitize name
        Object vdclass = pmap.get("primaryViewDefClassName");
        if (vdclass==null || vdclass.toString().isEmpty()) {
            pmap.put("primaryViewDefClassName", PatientPanelViewDef.class.getName());
        }

        // Funny construction b/c of column polymorphism not reconstructing easily from raw map.
        // Refactoring out of needing specific class implementations would take care of this,
        // however that means either front-end widgets for each column, or GSPs.
        List<Map> cols = (List<Map>) pmap.get("columns");
        pmap.remove("columns");
        ViewDefDef vdd = new ViewDefDef(pmap);
        for (Map col : cols) {
            String className = ((Map)col.get("appInfo")).get("code").toString();
            ViewDefDefColDef cdf = (ViewDefDefColDef) Class.forName(className).getConstructor(Map.class).newInstance(col);
            vdd.addColumn(cdf);
        }

        vddDAO.save(vdd);
        return ModelAndViewFactory.contentNegotiatingModelAndView(vdd);
    }

    @RequestMapping(value = "panel/{uid}", method = RequestMethod.DELETE)
    public ModelAndView deletePanel(@PathVariable String uid, HttpServletRequest request, HttpServletResponse response) {
        vddDAO.delete(vddDAO.findByUid(uid));
        LinkedHashMap<String, Boolean> map = new LinkedHashMap<String, Boolean>(1);
        map.put("success", true);
        return ModelAndViewFactory.contentNegotiatingModelAndView(map);
    }

    @RequestMapping(value = "column/list", method = RequestMethod.GET)
    public ModelAndView getColumnList() {
        ArrayList<Object> rslt = new ArrayList<Object>();
        Map<String, Object> apps = appService.getApps("gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef");
        Collection<Map<String, Object>> capps = new ArrayList<Map<String, Object>>();
        for(String key: apps.keySet()) {
            Object val = apps.get(key);
            if(val instanceof Map) {
                capps.add((Map<String, Object>) val);
            }
        }
//        Collection<Map<String, Object>> capps = appService.getApps("gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef");
        for (Map<String, Object> cap : capps) {
            rslt.add(ctx.getBean(cap.get("code").toString()));
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = {"getColumnConfigOptions"}, method = RequestMethod.GET)
    public ModelAndView getColumnConfigOptions(@RequestParam(required = true) String code, HttpServletRequest request, HttpServletResponse response) {
        LinkedHashMap<Object, Object> options = new LinkedHashMap<Object, Object>();
        ViewDefDefColDef vddcd = getViewDefDefColDef(code);
        options.put("viewdefFilterOptions", vddcd.getViewdefFilterOptions());
        options.put("configOptions", vddcd.getConfigOptions());
        options.put("description", vddcd.getDescription());
        options.put("titleEditable", vddcd.getTitleEditable());
        options.put("templateOptions", getViewDefDefColDefConfigTemplates(code));
        return ModelAndViewFactory.contentNegotiatingModelAndView(options);
    }

    private ViewDefDefColDef getViewDefDefColDef(String vddcd) {
        // if the view is an exact bean name
        if (ctx.containsBean(vddcd)) {
            return ctx.getBean(vddcd, ViewDefDefColDef.class);
        }

        return null;
    }

    private List<ViewDefDefColDefConfigTemplate> getViewDefDefColDefConfigTemplates(String code) {
        List<ViewDefDefColDefConfigTemplate> tmps = genericDAO.findAll(ViewDefDefColDefConfigTemplate.class);
        List<ViewDefDefColDefConfigTemplate> rslt = new ArrayList<ViewDefDefColDefConfigTemplate>();
        for (ViewDefDefColDefConfigTemplate t : tmps) {
            if (t.getColumnClass().equals(code)) {
                ((ArrayList<ViewDefDefColDefConfigTemplate>) rslt).add(t);
            }

        }

        return rslt;
    }

    @RequestMapping(value = {"setColTemplate"}, method = RequestMethod.POST)
    public ModelAndView setColTemplate(@RequestParam(required = true) String columnClass, @RequestParam(required = true) String name, @RequestParam(required = true) String formData, HttpServletRequest request, HttpServletResponse response) {
        ViewDefDefColDefConfigTemplate tmp = new ViewDefDefColDefConfigTemplate();
        tmp.setData("name", name);
        tmp.setData("columnClass", columnClass);
        tmp.setData("formVals", POMUtils.parseJSONtoMap(formData));
        return ModelAndViewFactory.contentNegotiatingModelAndView(vprDao.save(tmp));
    }

    public IGenericPOMObjectDAO getGenericDAO() {
        return genericDAO;
    }

    public void setGenericDAO(IGenericPOMObjectDAO genericDAO) {
        this.genericDAO = genericDAO;
    }

    public IVistaVprObjectDao getVprDao() {
        return vprDao;
    }

    public void setVprDao(IVistaVprObjectDao vprDao) {
        this.vprDao = vprDao;
    }

    public IAppService getAppService() {
        return appService;
    }

    public void setAppService(IAppService appService) {
        this.appService = appService;
    }

    public IViewDefDefDAO getVddDAO() {
        return vddDAO;
    }

    public void setVddDAO(IViewDefDefDAO vddDAO) {
        this.vddDAO = vddDAO;
    }

    public ApplicationContext getCtx() {
        return ctx;
    }

    public void setCtx(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Autowired
    private IGenericPOMObjectDAO genericDAO;
    @Autowired
    private IVistaVprObjectDao vprDao;
    @Autowired
    private IAppService appService;
    @Autowired
    private IViewDefDefDAO vddDAO;
    @Autowired
    private ApplicationContext ctx;
}
