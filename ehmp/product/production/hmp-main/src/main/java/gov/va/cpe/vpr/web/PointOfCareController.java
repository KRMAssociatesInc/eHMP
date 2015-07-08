package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.PointOfCare;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.Collections;
import java.util.LinkedHashMap;

@RequestMapping(value = {"/pointOfCare/**", "/vpr/pointOfCare/**"})
@Controller
public class PointOfCareController {
    @RequestMapping(value = "/updatePointOfCare", method = RequestMethod.POST)
    public ModelAndView postAddPointOfCare(@RequestParam(required = true) String value, HttpServletRequest request) {

        LinkedHashMap<String, Object> temp = new LinkedHashMap<>();

        String uid = null;
        String newvalue;

        if (request.getParameterMap().containsKey("uid")) uid = request.getParameterMap().get("uid")[0].toString();

        temp.put("uid", uid);
        temp.put("ownerName", userContext.getCurrentUser().getDisplayName());
        temp.put("ownerCode", userContext.getCurrentUser().getUid());
        temp.put("facilityCode", userContext.getCurrentUser().getDivision());
        temp.put("facilityName", userContext.getCurrentUser().getDivisionName());

        PointOfCare poc = (uid!=null?genericJdsDAO.findByUID(PointOfCare.class, uid):new PointOfCare());
        poc.setData(temp);
        poc.setData(POMUtils.parseJSONtoMap(value));
        vprObjectDao.save(poc);
        return ModelAndViewFactory.contentNegotiatingModelAndView(poc);
    }

    @RequestMapping(value = "/getPointOfCareOptions", method = RequestMethod.GET)
    public ModelAndView getPointOfCareList(@RequestParam(required = true) String value, HttpServletRequest request) {
        return ModelAndViewFactory.contentNegotiatingModelAndView(genericJdsDAO.findAll(PointOfCare.class));
    }

    @RequestMapping(value = "/pointOfCare/{uid}", method = RequestMethod.DELETE)
    public ModelAndView deletePoc(@PathVariable String uid, HttpServletRequest request) throws IOException {
        vprObjectDao.deleteByUID(PointOfCare.class, uid);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, Collections.emptyMap()));
    }

    @RequestMapping(value = "/pointOfCare/{uid}", method = RequestMethod.POST)
    public ModelAndView updatePoc(@PathVariable String uid, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        PointOfCare poc = POMUtils.newInstance(PointOfCare.class, requestJson);
        poc.setData("displayName", StringEscapeUtils.escapeHtml(poc.getDisplayName())); // Sanitize name
        if (!uid.equalsIgnoreCase(poc.getUid())) throw new BadRequestException("Category UID mismatch");
        poc = vprObjectDao.save(poc);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, poc));
    }

    @RequestMapping(value = "/pointOfCare/new", method = RequestMethod.POST)
    public ModelAndView createPoc(@RequestBody String requestJson, HttpServletRequest request) throws IOException {
        PointOfCare poc = POMUtils.newInstance(PointOfCare.class, requestJson);
        poc.setData("displayName", StringEscapeUtils.escapeHtml(poc.getDisplayName())); // Sanitize name
        poc = vprObjectDao.save(poc);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, poc));
    }

    public RpcOperations getRpcTemplate() {
        return rpcTemplate;
    }

    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    public IPatientDAO getPatientDao() {
        return patientDao;
    }

    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    public UserContext getUserContext() {
        return userContext;
    }

    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    public IVistaVprObjectDao getVprObjectDao() {
        return vprObjectDao;
    }

    public void setVprObjectDao(IVistaVprObjectDao vprObjectDao) {
        this.vprObjectDao = vprObjectDao;
    }

    public IGenericPOMObjectDAO getGenericJdsDAO() {
        return genericJdsDAO;
    }

    public void setGenericJdsDAO(IGenericPOMObjectDAO genericJdsDAO) {
        this.genericJdsDAO = genericJdsDAO;
    }

    @Autowired
    private RpcOperations rpcTemplate;
    @Autowired
    private IPatientDAO patientDao;
    @Autowired
    private UserContext userContext;
    @Autowired
    private IVistaVprObjectDao vprObjectDao;
    @Autowired
    private IGenericPOMObjectDAO genericJdsDAO;
}
