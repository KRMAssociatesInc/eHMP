package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.PatientAlert;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.frameeng.*;
import gov.va.cpe.vpr.pom.*;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.termeng.ITermEng;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.WebUtils;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class FrameController {

    private IFrameRegistry registry;
    private IFrameRunner runner;
    private IGenericPatientObjectDAO dao;
    private IPatientDAO patdao;
    private JdsOperations tpl;
    private RpcOperations rpcTemplate;
    private ITermEng eng;

    @Autowired
    public void setRegistry(IFrameRegistry registry) {
        this.registry = registry;
    }

    @Autowired
    public void setRunner(IFrameRunner runner) {
        this.runner = runner;
    }

    @Autowired
    public void setDao(IGenericPatientObjectDAO dao) {
        this.dao = dao;
    }

    @Autowired
    public void setPatdao(IPatientDAO patdao) {
        this.patdao = patdao;
    }

    @Autowired
    public void setTpl(JdsOperations tpl) {
        this.tpl = tpl;
    }

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setEng(ITermEng eng) {
        this.eng = eng;
    }

    @RequestMapping(value = {"/frame/invoke/{entryPoint}"})
    public ModelAndView invoke(@PathVariable String entryPoint, HttpServletRequest req, @RequestParam(value = "uid", required = false) String uid) throws Frame.FrameInitException, Frame.FrameExecException {
        return exec(uid, null, entryPoint, null, req);
    }

    @RequestMapping(value = {"/frame/call/{frameID}"})
    public ModelAndView call(@PathVariable String frameID, HttpServletRequest req, @RequestParam(value = "uid", required = false) String uid) throws Frame.FrameInitException, Frame.FrameExecException {
        return exec(uid, frameID, null, null, req);
    }

    /**
     * Primary frame invoke/exec/call method indentded to be used as a web service
     */
    @RequestMapping(value = "/frame/exec", method = RequestMethod.GET)
    public ModelAndView exec(@RequestParam(required = false) String uid, @RequestParam(required = false) String frameID, @RequestParam(required = false) String entryPoint, @RequestParam(required = false) String mode, HttpServletRequest req) throws Frame.FrameExecException, Frame.FrameInitException {
        Map params = WebUtils.extractGroupAndSortParams(req);
        Class clazz = UidUtils.getDomainClassByUid(uid);
        IPOMObject obj = (StringUtils.hasText(uid) && clazz != null) ? dao.findByUID(clazz, uid) : patdao.findByPid(uid);
        if (!StringUtils.hasText((String) params.get("pid")) && obj != null && obj instanceof IPatientObject) params.put("pid", ((IPatientObject) obj).getPid());

        if (frameID == null && entryPoint == null) {
            throw new BadRequestException("You must specify either 'frameID' or 'entryPoint'");
        }


        // Create and run the event/job
        IFrameEvent evt = StringUtils.hasText(frameID) ? new CallEvent(frameID, obj, params) : new IFrameEvent.InvokeEvent(entryPoint, obj, params);
        FrameJob job = runner.exec(evt);

        // return appropriate view
        if (mode == null || mode.equalsIgnoreCase("json")) {
            LinkedHashMap<String, Object> model = new LinkedHashMap<>();
            model.put("actions", job.getActions());
            LinkedHashMap<Object, Object> frames = new LinkedHashMap<>();
            for (IFrame f : job.getFrames()) {
                frames.put(f.getID(), f.getName());
            }
            model.put("frames", frames);

            return ModelAndViewFactory.contentNegotiatingModelAndView(model);
        } else {
            LinkedHashMap<String, Object> map = new LinkedHashMap<>();
            map.put("dao", dao);
            map.put("patdao", patdao);
            map.put("job", job);
            return new ModelAndView(mode, map);
        }

    }

    /**
     * There are 2 ways an alert might want to be rendered.
     * <p/>
     * 1) a stored alert (exists in the cache under the specified UID) 2) a generated alert (does not exist, but should
     * have the same fields)
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/frame/alert")
    public ModelAndView renderAlert(HttpServletRequest request, @RequestBody(required = false) String alertBody) {
        ParameterMap params = new ParameterMap(request);
        String uid = (String) params.get("uid");
        PatientAlert alert = StringUtils.hasText(uid) ? dao.findByUID(PatientAlert.class, uid) : null;
        String frameID = (String) params.get("frameID");
        IFrame frame = registry.findByID(frameID);
        ArrayList<Object> links = new ArrayList<Object>();
        if (alert == null && StringUtils.hasText(alertBody)) {
            alert = POMUtils.newInstance(PatientAlert.class, alertBody);
        }

        if (alert != null) {
            for (Map m : alert.getLinks()) {
                String linkUid = (String) m.get("uid");
                if (StringUtils.hasText(linkUid)) links.add(dao.findByUID(linkUid));
            }
        }

        LinkedHashMap<String, Object> map = new LinkedHashMap<>();
        map.put("params", params);
        map.put("alert", alert);
        map.put("frame", frame);
        map.put("links", links);
        return new ModelAndView("/frame/alert", map);
    }

    @RequestMapping(value = "/frame/info/{uid}")
    public ModelAndView renderInfo(@PathVariable(value = "uid") String uid) {
        IFrame frame = registry.findByID(uid);
        if (frame == null) {
            throw new BadRequestException("unknown frame uid: " + uid);
        }

        LinkedHashMap<String, IFrame> map = new LinkedHashMap<String, IFrame>();
        map.put("frame", frame);
        return new ModelAndView("/frame/info", map);
    }

    @RequestMapping(value = "/frame/info")
    public ModelAndView renderInfo2(@RequestParam(value = "uid") String uid) {
        IFrame frame = registry.findByID(uid);
        if (frame == null) {
            throw new BadRequestException("unknown frame uid: " + uid);
        }

        LinkedHashMap<String, IFrame> map = new LinkedHashMap<>();
        map.put("frame", frame);
        return new ModelAndView("/frame/info", map);
    }

    @RequestMapping(value = "/frame/goal/{id}/{pid}")
    public ModelAndView renderGoal(@PathVariable(value = "id") String id, @PathVariable(value = "pid") String pid) {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>();
        map.put("pid", pid);
        map.put("dao", dao);
        map.put("patdao", patdao);
        map.put("rpc", rpcTemplate);
        return new ModelAndView("/frame/" + id, map);
    }

    @ResponseBody
    @RequestMapping(value = "/frame/param/delete/{frame}")
    public String delParam(@PathVariable String frame, @RequestParam(value = "pid") String pid) {
        String uid = "urn:va:::frame:" + frame;
        tpl.delete("/vpr/" + pid + "/" + uid);
        return "Deleted";
    }

    @ResponseBody
    @RequestMapping(value = "/frame/param/set/{frame}")
    public String setParam(@PathVariable String frame, @RequestParam(value = "pid") String pid, @RequestParam Map params) {
        // fetch the current values
        String uid = "urn:va:::frame:" + frame;
        Map data = null;
        try {
            data = tpl.getForMap("/vpr/" + pid + "/" + uid);
        } catch (Exception ex) {
            // TODO: not found!?!
        }

        if (data != null) {
            LinkedHashMap<String, String> map = new LinkedHashMap<>();
            map.put("uid", uid);
            map.put("pid", pid);
            data = map;
        }

        // add the specified values
        data.putAll(params);

        // update the VPR results
        tpl.postForLocation("/vpr/" + pid, data);
        return "Saved";
    }

    @ResponseBody
    @RequestMapping(value = "/frame/param/get/{frame}")
    public String getParam(@PathVariable String frame, @RequestParam(value = "pid") String pid, @RequestParam(value = "key") String key) {
        String uid = "urn:va:::frame:" + frame;
        try {
            Map data = tpl.getForMap("/vpr/" + pid + "/" + uid);
            data = (Map) ((List)((Map) data.get("data")).get("items")).get(0);
            if (key != null) {
                Object paramVal = data.get(key);
                if (paramVal != null)
                    return StringEscapeUtils.escapeHtml(paramVal.toString());
                else
                    return "";
            }

            return StringEscapeUtils.escapeHtml(data.toString());
        } catch (Exception ex) {
            // TODO: not found!?!
            return "";
        }
    }

    @ResponseBody
    @RequestMapping(value = "/frame/obs/set/{pid}/{key}")
    public String addObservation(@PathVariable Object pid, @PathVariable String key, @RequestParam Object value, @RequestParam(required = false) Object observed) {
        String uid = "urn:va:::obs:" + key;

        LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
        data.put("uid", uid);
        data.put("pid", pid);
        data.put("entered", PointInTime.now());
        data.put("kind", "Clinical Observation");
        data.put("typeCode", key);
        data.put("typeName", eng.getDescription(key));
        data.put("result", value);
        data.put("observed", observed);
        Observation item = new Observation();
        item.setData(data);
        dao.save(item);
        runner.pushEvents(item.getEvents());// TODO: This should not be here...
        return null;
    }

    @ResponseBody
    @RequestMapping(value = "/frame/obs/delete/{pid}/{key}")
    public String delObservation(@PathVariable Object pid, @PathVariable String key) {
        String uid = "urn:va:::obs:" + key;
        dao.deleteByUID(Observation.class, uid);
        return null;
    }

    @RequestMapping(value = "/frame/event/push")
    public ModelAndView createEvent(HttpServletRequest request) throws Frame.FrameExecException, Frame.FrameInitException {
        List<String> msgs = new ArrayList<>();
        Set<String> paramNames = new HashSet<>(Arrays.asList("eventClass", "frameID", "uid", "_ACTION_", "_NEW_KEY_", "_NEW_VAL_"));
        Map<String, Object> eventParams = new LinkedHashMap<>();

        Enumeration<String> i = request.getParameterNames();
        while (i.hasMoreElements()) {
            String key = i.nextElement();
            if (!paramNames.contains(key)) eventParams.put(key, request.getParameter(key));
        }

        if (StringUtils.hasText(request.getParameter("_NEW_KEY_"))) {
            eventParams.put(request.getParameter("_NEW_KEY_"), request.getParameter("_NEW_VAL_"));
        }

        // run the event if action=Execute
        String action = request.getParameter("_ACTION_");
        String uid = request.getParameter("uid");
        if (StringUtils.hasText(action)) {
            IFrameEvent evt = null;
            if (request.getParameter("eventClass").equals("gov.va.cpe.vpr.frameeng.CallEvent")) {
                evt = new CallEvent(request.getParameter("frameID"), null, eventParams);
            } else if (request.getParameter("eventClass").equals("gov.va.cpe.vpr.pom.PatientEvent")) {
                IPatientObject obj = dao.findByUID(uid);
                if (obj != null) {
                    evt = new PatientEvent(obj);
                    ((PatientEvent) evt).setParams(eventParams);
                } else {
                    msgs.add("Unable to find that UID");
                }
            }


            if (action.equals("Enqueue") && evt instanceof PatientEvent) {
                runner.pushEvent((PatientEvent) evt);
            } else if (evt != null) {
                FrameJob job = runner.exec(evt);

                LinkedHashMap<String, Object> model = new LinkedHashMap<>();
                model.put("event", evt.getClass().getName());
                model.put("eventParams", eventParams);
                model.put("actions", job.getActions());
                Map<String, Object> frames = new LinkedHashMap<>();
                for (IFrame f : job.getFrames()) {
                    frames.put(f.getID(), f.getName());
                }
                model.put("frames", frames);

                return ModelAndViewFactory.contentNegotiatingModelAndView(model);
            }
        }

        Map params = WebUtils.extractGroupAndSortParams(request);
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("msgs", msgs);
        map.put("params", params);
        map.put("eventParams", eventParams);
        return new ModelAndView("/event/createEvent", map);
    }

}
