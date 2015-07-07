package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.frameeng.*;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.IDynamicViewDefService;
import gov.va.cpe.vpr.queryeng.dynamic.IViewDefDefDAO;
import gov.va.cpe.vpr.queryeng.dynamic.PatientPanelViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.app.IAppService;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.WebUtils;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
public class ViewController {
    private FrameContext fctx;
    private IDynamicViewDefService dynamicViewDefService;
    private IFrameRunner runner;
    private IAppService appService;
    private IViewDefDefDAO vddDAO;
    private IFrameRegistry registry;
    private UserContext userContext;
   
    @Autowired
    public void setUserContext(UserContext userContext) {
    	this.userContext = userContext;
    }

    @Autowired
    public void setFctx(FrameContext fctx) {
        this.fctx = fctx;
    }

    @Autowired
    public void setDynamicViewDefService(IDynamicViewDefService dynamicViewDefService) {
        this.dynamicViewDefService = dynamicViewDefService;
    }

    @Autowired
    public void setRunner(IFrameRunner runner) {
        this.runner = runner;
    }

    @Autowired
    public void setAppService(IAppService appService) {
        this.appService = appService;
    }

    @Autowired
    public void setVddDAO(IViewDefDefDAO vddDAO) {
        this.vddDAO = vddDAO;
    }

    @Autowired
    public void setRegistry(IFrameRegistry registry) {
        this.registry = registry;
    }

    private ViewDef getViewDef(String view) {
        return ((ViewDef) (registry.findByID(view)));
    }

    @RequestMapping(value = "/vpr/view/{view}")
    public ModelAndView render(@PathVariable(value = "view") String view, @RequestParam(required = false) String mode, @RequestParam(required = false) boolean debug, HttpServletRequest request) throws Exception {
        ViewDef viewdef = getViewDef(view);
        if (viewdef == null) {
            throw new NotFoundException("ViewDef '" + view + "' not found.");
        }


        Map params = WebUtils.extractGroupAndSortParams(request);

        params.put("userId", userContext.getCurrentUser().getUid());
        
        // execute the viewdef
        FrameJob.FrameTask task = runner.exec(viewdef, params);
        ViewDef.ViewRenderAction action = task.getAction(ViewDef.ViewRenderAction.class);
        if (action==null) action = task.getAction(ViewDef.CachedViewRenderAction.class);
        if (debug) {
            action.setGenerateDebugInfo(true);
        }

        // determine how to pass the results back
        if (mode == null || mode.equalsIgnoreCase("json")) {
            // pass the results though as a string
            return ModelAndViewFactory.stringModelAndView(action.renderToString(), "application/json");
        } else {
            // TODO: Try to make this more consistent with the parameters in DetailController
            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(6);
            map.put("view", view);
            map.put("viewdef", viewdef);
            map.put("params", params);
            map.put("task", task);
            map.put("action", action);
            map.put("results", action.getResults());
            return new ModelAndView(mode, map);
        }
    }

    @RequestMapping(value = {"/vpr/view/meta", "/view/meta"})
    @ResponseBody
    public String meta(@RequestParam final Object view, HttpServletResponse response) {
        ViewDef viewdef = getViewDef((String) view);
        if (viewdef==null) {
            throw new NotFoundException("Unknown view '" + String.valueOf(view) + "'");
        }


        CallEvent<Map<String, Object>> evt = new CallEvent<Map<String, Object>>(viewdef, new LinkedHashMap<String, Object>());
        FrameJob.FrameTask task = new FrameJob.FrameTask(fctx, viewdef, evt, viewdef.getTriggers().get(0));
        RenderTask job = new RenderTask(task, viewdef, viewdef.getPrimaryQuery());
        job.setParams(viewdef.calcParams(job));
        return gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction.renderMetaData(job).toString();
    }

    @RequestMapping(value = {"/vpr/view/ptlists", "/view/ptlists"})
    public ModelAndView ptlists(HttpServletRequest rq, HttpServletResponse rsp) {
        Map<String, Object> vals = appService.getApps("gov.va.cpe.multipatientviewdef");//.values();
        List<ViewDefDef> vdds = vddDAO.findAll();
        for (ViewDefDef vdd : vdds) {
            ViewDef vd = dynamicViewDefService.getViewDefByUid(vdd.getUid());
            if (vd!=null && vd instanceof PatientPanelViewDef) {
                LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
                map.put("name", vdd.getName());
                map.put("code", vdd.getUid());
                vals.put(vdd.getUid(), map);
            }

        }

        LinkedHashMap<String, Collection<Object>> map = new LinkedHashMap<String, Collection<Object>>(1);
        map.put("items", vals.values());
        return ModelAndViewFactory.contentNegotiatingModelAndView(map);
    }

    /**
     * Test mechanism only, attempts to render every viewdef defind.  Its just to catch some errors.
     */
    @RequestMapping(value = "/vpr/viewall")
    public ModelAndView viewAll() {
        return new ModelAndView("/app/viewdef");
    }
}
