package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.order.Orderable;
import gov.va.cpe.order.Route;
import gov.va.cpe.order.Schedule;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsDaoSupport;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RequestMapping(value = {"/order/**", "/vpr/order/**"})
@Controller
public class OrderController {
    private IGenericPOMObjectDAO genDao;
    // TODO: put RPC call behind a service interface; controllers shouldn't call RPCs directly
    @Deprecated
    private RpcOperations rpcTemplate;
    private UserContext userContext;
    private ISyncService syncService;
    private PatientContext patientContext;

    @Autowired
    public void setGenDao(IGenericPOMObjectDAO genDao) {
        this.genDao = genDao;
    }

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    public UserContext getUserContext() {
        return userContext;
    }
    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    public ISyncService getSyncService() {
        return syncService;
    }
    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setPatientContext(PatientContext patientContext) {
        this.patientContext = patientContext;
    }

    @RequestMapping(value = "types", method = RequestMethod.GET)
    public ModelAndView orderTypes(HttpServletRequest request) {
        ArrayList<Map<String, Object>> rslt = new ArrayList<Map<String, Object>>();
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Inpatient Meds"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Outpatient Meds"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Non-VA Meds"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Angio/Neuro/Interventional"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "CT Scan"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "General Radiology"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Magnetic Resonance Imaging"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Mammography"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Nuclear Medicine"));
        rslt.add(Collections.<String, Object>singletonMap("typeName", "Ultrasound"));
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, rslt));
    }

    @RequestMapping(value = "orderables", method = RequestMethod.GET)
    public ModelAndView orderablesForType(@RequestParam(required = true) String type, @RequestParam(required = false) String query, Pageable pageable, HttpServletRequest request) {
        String range = type;
        if (StringUtils.hasText(query)) {
            range += ">" + JdsDaoSupport.quoteAndWildcardQuery(query);
        }

        Page<Orderable> orderables = genDao.findAllByIndexAndRange(Orderable.class, "orderable-types", range, pageable);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, orderables));
    }

    @RequestMapping(value = "routes", method = RequestMethod.GET)
    public ModelAndView getRoutes(HttpServletRequest request) {
        List<Route> vals = genDao.findAll(Route.class, new Sort("name"));
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, vals));
    }

    @RequestMapping(value = "schedules", method = RequestMethod.GET)
    public ModelAndView getSchedules(HttpServletRequest request) {
        List<Schedule> vals = genDao.findAll(Schedule.class, new Sort("name"));
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, vals));
    }

    @RequestMapping(value = "save", method = RequestMethod.POST)
    public ModelAndView save(@RequestParam(required = true) String type, HttpServletRequest request) {
        Map<String, Object> params = new LinkedHashMap<String, Object>();
        params.put("command", "saveOrder");
        String orderStr = "";
        String key = "";
        String value = "";
        Map<String, String[]> temp = request.getParameterMap();
        for (Map.Entry<String, String[]> i : temp.entrySet()) {
            key = i.getKey().toString();
            value = i.getValue()[0].toString();
            if (!"type".equals(i.getKey().toString())) {
                if (orderStr.length() == 0) orderStr = key + ";" + value;
                else orderStr = orderStr + " " + key + ";" + value;
            }
        }

//        List<Schedule> vals = genDao.findAll(Schedule.class);
        params.put("location", "240");

        // get patient pid and system id for syncService and patient dfn for RPC
        String pid = patientContext.getCurrentPatientPid();
        String system = userContext.getCurrentUser().getVistaId();

        PatientDemographics pt = patientContext.getCurrentPatient();
        String dfn = pt.getLocalPatientIdForSystem(system);

        params.put("provider", userContext.getCurrentUser().getDUZ());
        params.put("patient", dfn);
        params.put("orderString", orderStr);
        params.put("type", type);

        // TODO: put RPC call behind a service interface; controllers shouldn't call RPCs directly
        JsonNode rpcResult = rpcTemplate.executeForJson(UserInterfaceRpcConstants.ORDERING_CONTROLLER_RPC_URI, params);
        if (rpcResult.path("success").asBoolean()) {
            JsonNode dataNode = rpcResult.path("data");
            Order o = POMUtils.newInstance(Order.class, dataNode);
            VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(system, UserInterfaceRpcConstants.ORDERING_CONTROLLER_RPC_URI, dataNode, "order", 0, 1, pt);
            chunk.setBatch(false);
            syncService.sendImportVistaDataExtractItemMsg(chunk);
            return ModelAndViewFactory.contentNegotiatingModelAndView(rpcResult);

        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.createError(request, rpcResult));
    }


}
