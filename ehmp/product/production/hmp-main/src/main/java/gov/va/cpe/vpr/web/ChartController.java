package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.Treatment;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.util.VistaStringUtils;
import gov.va.hmp.web.WebUtils;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.apache.commons.lang.StringEscapeUtils;
import org.joda.time.format.DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.util.LinkedHashMap;
import java.util.Map;

@RequestMapping(value = {"/chart/**", "/vpr/chart/**"})
@Controller
public class ChartController {
    
    private RpcOperations rpcTemplate;
    private IPatientDAO patientDao;
    private UserContext userContext;
    private IGenericPatientObjectDAO genericJdsDAO;
    private IVistaVprPatientObjectDao vprPatientObjectDao;

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setGenericJdsDAO(IGenericPatientObjectDAO genericJdsDAO) {
        this.genericJdsDAO = genericJdsDAO;
    }

    @Autowired
    public void setVprPatientObjectDao(IVistaVprPatientObjectDao vprPatientObjectDao) {
        this.vprPatientObjectDao = vprPatientObjectDao;
    }

    @RequestMapping(value = "/orderingControl", method = RequestMethod.GET)
    public ModelAndView orderingControl(@RequestParam String command, @RequestParam(required = false) String uid, @RequestParam(required = false) String patient, @RequestParam(required = false) String snippet, @RequestParam(required = false) String name, @RequestParam(required = false) String orderAction, @RequestParam(required = false) String action, @RequestParam(required = false) String orderChecksOnly, HttpServletRequest request) {
//        def duz = getDuz()
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        params.put("command", command);
        if (StringUtils.hasText(uid)) params.put("uid", uid);
        if (StringUtils.hasText(patient)) params.put("patient", patient);
        if (StringUtils.hasText(snippet)) params.put("snippet", snippet);
        if (StringUtils.hasText(name)) params.put("name", name);
        if (StringUtils.hasText(orderAction)) params.put("orderAction", orderAction);
        if (StringUtils.hasText(action)) params.put("action", action);
        if (StringUtils.hasText(orderChecksOnly))
            params.put("orderChecksOnly", orderChecksOnly);

        params.put("location", "240");
        params.put("user", "1089");
        params.put("panelNumber", "1");
//        params["patient"] = '10103'
//        request.getParameterMap().location = '240'
//        request.getParameterMap().provider = '1089'
//        request.getParameterMap().panelNumber = '1'
        //params.command = "listQuickOrders"
        String rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.ORDERING_CONTROLLER_RPC_URI, params);
        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");
    }

    @RequestMapping(value = "/getReminderList", method = RequestMethod.GET)
    public ModelAndView getReminderList(HttpServletRequest request) {
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        params.put("command", "getReminderList");
//        params["user"] = userContext.currentUser.getUid()
        params.put("location", "");
        String rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");

    }

    @RequestMapping(value = "/evaluateReminder", method = RequestMethod.GET)
    public ModelAndView evaluateReminder(@RequestParam(required = false) String uid, @RequestParam(required = false) String patientId, @RequestParam(required = false) String dfn, HttpServletRequest request) {
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        params.put("command", "evaluateReminder");
        if (StringUtils.hasText(uid)) params.put("uid", uid);

        if (dfn == null) {
            PatientDemographics pt = patientDao.findByPid(patientId);
            if (pt != null) {
                dfn = pt.getLocalPatientIdForSystem(userContext.getCurrentUser().getVistaId());
            }

        }

        params.put("patientId", dfn);
        String rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");

    }

    @RequestMapping(value = "/orderingControl", method = RequestMethod.POST)
    public ModelAndView postOrderingControl(@RequestParam String command, @RequestParam(required = false) String uid, @RequestParam(required = false) String patient, @RequestParam(required = false) String snippet, @RequestParam(required = false) String name, @RequestParam(required = false) String qoIen, @RequestParam(required = false) String orderAction, @RequestParam(required = false) String action, HttpServletRequest request) {
//        def duz = getDuz()
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        params.put("command", command);
        if (StringUtils.hasText(uid)) params.put("uid", uid);
        if (StringUtils.hasText(patient)) params.put("patient", patient);
        if (StringUtils.hasText(snippet)) params.put("snippet", snippet);
        if (StringUtils.hasText(name)) params.put("name", name);
        if (StringUtils.hasText(qoIen)) params.put("qoIen", qoIen);
        if (StringUtils.hasText(orderAction)) params.put("orderAction", orderAction);
        if (StringUtils.hasText(action)) params.put("action", action);

        params.put("location", "240");
        params.put("provider", "1089");
        params.put("panelNumber", "1");
        String rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.ORDERING_CONTROLLER_RPC_URI, params);
        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");
    }

    @RequestMapping(value = "/addTreatment", method = RequestMethod.POST)
    public ModelAndView postAddTreatment(@RequestParam(required = true) String patientId, @RequestParam(required = true) String description, @RequestParam(required = true) String dateTime, @RequestParam(required = true) String linkUid, HttpServletRequest request) {

        Map<String, Object> temp = new LinkedHashMap<String, Object>();
        temp.put("description", description);
        temp.put("dueDate", PointInTime.fromLocalDate(DateTimeFormat.forPattern("MM/dd/yyy").parseLocalDate(dateTime)));
        temp.put("facilityCode", userContext.getCurrentUser().getDivision());
        temp.put("facilityName", userContext.getCurrentUser().getDivisionName());

        PatientDemographics pt = patientDao.findByPid(patientId);
        if (pt == null) throw new PatientNotFoundException(patientId);
        String dfn = pt.getLocalPatientIdForSystem(userContext.getCurrentUser().getVistaId());
        if (!StringUtils.hasText(dfn)) throw new RuntimeException("No DFN found for patient with pid=" + patientId);

        String json = POMUtils.toJSON(temp);
        Object value = VistaStringUtils.splitLargeStringIfNecessary(json);
        JsonNode result = rpcTemplate.executeForJson(UserInterfaceRpcConstants.VPR_PUT_PATIENT_DATA_URI, dfn, "treatment", value);
        if (result.path("success").asBoolean()) {
            JsonNode dataNode = result.path("data");
            String uid = dataNode.path("uid").textValue();

            temp.put("pid", pt.getPid());
            temp.put("uid", uid);
            Treatment treatment = new Treatment();
            treatment.setData(temp);

            genericJdsDAO.save(treatment);
        }


        return ModelAndViewFactory.contentNegotiatingModelAndView(result);
    }

    @RequestMapping(value = "/addTask", method = RequestMethod.POST)
	public ModelAndView postAddTask(@RequestParam String patientId,
			@RequestParam String taskName, @RequestParam String type,
			@RequestParam String description,
			@RequestParam PointInTime dueDate,
			@RequestParam(required = false) Boolean completed,
			@RequestParam String linkUid,
			@RequestParam(required = false) String claimedByUid,
			@RequestParam(required = false) String claimedByName,
			HttpServletRequest request) throws HttpRequestMethodNotSupportedException {
    	
    	// mitigate CSRF attacks
    	if (!WebUtils.isAjax(request)) {
    		throw new HttpRequestMethodNotSupportedException("POST", "Must post using XHR");
    	}

        // validate patientId
        PatientDemographics pt = patientDao.findByPid(patientId);
        if (pt == null) {
            throw new PatientNotFoundException(patientId);
        }

        Map<String, Object> map = new LinkedHashMap<String, Object>(10);
        map.put("pid", patientId);
        map.put("taskName", StringEscapeUtils.escapeHtml(taskName));
        map.put("description", StringEscapeUtils.escapeHtml(description));
        map.put("type", StringEscapeUtils.escapeHtml(type));
        map.put("dueDate", dueDate);
        map.put("completed", completed);
        map.put("createdByName", userContext.getCurrentUser().getDisplayName());
        map.put("createdByCode", userContext.getCurrentUser().getUid());
        map.put("facilityCode", userContext.getCurrentUser().getDivision());
        map.put("facilityName", userContext.getCurrentUser().getDivisionName());
        Map<String, Object> taskVals = map;

        if (StringUtils.hasText(linkUid))
            taskVals.put("linkUid", linkUid);
        
        if (claimedByUid != null && claimedByName != null) {
        	map.put("claimedByUid", claimedByUid);
        	map.put("claimedByName", claimedByName);
        }

        Task task = vprPatientObjectDao.save(Task.class, taskVals);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, task));
    }

    @RequestMapping(value = "patientSecurityLog", method = RequestMethod.GET)
    public ModelAndView patientSecurityLog(@RequestParam String pid) {
        PatientDemographics pt = patientDao.findByPid(pid);

        // throw 404 error if patient not found
        if (pt == null) {
            throw new PatientNotFoundException(pid);
        }


        final HmpUserDetails user = userContext.getCurrentUser();
        String dfn = pt.getLocalPatientIdForSystem((user == null ? null : user.getVistaId()));

        Map params = new LinkedHashMap();
        params.put("command", "logPatientAccess");
        params.put("patientId", dfn);
        String rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");
    }
}
