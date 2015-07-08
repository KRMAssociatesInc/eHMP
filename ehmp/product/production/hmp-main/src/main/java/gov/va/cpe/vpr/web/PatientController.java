package gov.va.cpe.vpr.web;

import gov.va.cpe.param.ParamService;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.*;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.app.IAppService;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.*;

@Controller
public class PatientController {
    private IPatientDAO patientDao;
    private IGenericPatientObjectDAO patientRelatedDao;
    private IGenericPOMObjectDAO genericDao;
    private IVistaVprPatientObjectDao vprPatientObjectDao;
    private ParamService paramService;
    private IAppService appService;
    private UserContext userContext;
    private PatientService patientService;
    private ISyncService syncService;
    private INamingStrategy namingStrategy = new DefaultNamingStrategy();
    private IVistaVprObjectDao vprObjectDao;

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setPatientRelatedDao(IGenericPatientObjectDAO patientRelatedDao) {
        this.patientRelatedDao = patientRelatedDao;
    }

    @Autowired
    public void setGenericDao(IGenericPOMObjectDAO genericDao) {
        this.genericDao = genericDao;
    }

    @Autowired
    public void setVprPatientObjectDao(IVistaVprPatientObjectDao vprPatientObjectDao) {
        this.vprPatientObjectDao = vprPatientObjectDao;
    }

    @Autowired
    public void setParamService(ParamService paramService) {
        this.paramService = paramService;
    }

    @Autowired
    public void setAppService(IAppService appService) {
        this.appService = appService;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setVprObjectDao(IVistaVprObjectDao vprObjectDao) {
         this.vprObjectDao = vprObjectDao;
     }

    @RequestMapping(value = {"/patient/list", "/patient/index"}, method = RequestMethod.GET)
    public ModelAndView list(Pageable pageable, @RequestParam(required = false) String format, HttpServletRequest request) {
        Page<PatientDemographics> page = patientDao.findAll(pageable);

        JsonCCollection cr = JsonCCollection.create(request, page);
        cr.setSelfLink(request.getRequestURI());

        List<Class> domainClasses = VprConstants.PATIENT_RELATED_DOMAIN_CLASSES;
        Map countsByPatient = new LinkedHashMap();
        Map errorsByPatient = new LinkedHashMap();
        for (PatientDemographics pt : page.getContent()) {
            LinkedHashMap<String, Integer> map = new LinkedHashMap<String, Integer>(2);
            int gtot = 0;
            map.put("Errors", 0);
            countsByPatient.put(pt, map);
            for (Class domainClass : domainClasses) {
                int countForDomainClass = 0;
                try {
                    countForDomainClass = patientRelatedDao.countByPID(domainClass, pt.getPid());
                } catch (IllegalArgumentException iae) {// not all classes mapped to domains
                    continue;
                }

                map.put(namingStrategy.collectionName(domainClass), countForDomainClass);
                gtot += countForDomainClass;
            }
            map.put("Total", gtot);

            int errorCount = syncService.getPatientErrorCount(pt.getPid());
            map.put("Errors", errorCount);
            errorsByPatient.put(pt, (errorCount > 0));
        }


        if ((format==null || format.toLowerCase().equals("false")) || format.equals("html")) {
            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(7);
            map.put("appService", appService);
            map.put("paramService", paramService);
            map.put("patientInstanceList", cr.getItems());
            map.put("max", cr.getItemsPerPage());
            map.put("offset", cr.getStartIndex());
            map.put("patientInstanceTotal", cr.getTotalItems());
            List<String> collNames = new ArrayList<String>();
            for(Class clz: domainClasses) {
                collNames.add(namingStrategy.collectionName(clz));
            }
            map.put("countedDomainClasses", collNames);
            return new ModelAndView("/patient/list", map);
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(cr);
        }

    }

    @RequestMapping(value = "/patient/summary", method = RequestMethod.GET)
    public ModelAndView summary(Pageable pageable, HttpServletRequest request) {
        Page<PatientDemographics> ptList = patientDao.findAll(pageable);
        final ArrayList<Object> itemList = new ArrayList<Object>();
        final List<Class> domainClasses = VprConstants.PATIENT_RELATED_DOMAIN_CLASSES;
        final Map countsByPatient = new LinkedHashMap();
        final Map errorsByPatient = new LinkedHashMap();

        for(PatientDemographics pt: ptList) {
            int totalItemCount = 0;
            Map<String, Object> countMap = new LinkedHashMap<>();
            countsByPatient.put(pt, countMap);
            //domainClasses.each { Class domainClass ->
            for (Class domainClass : domainClasses) {
                int countForDomainClass = 0;
                try {
                    countForDomainClass = patientRelatedDao.countByPID(domainClass, pt.getPid());
                } catch (IllegalArgumentException iae) {// not all classes mapped to domains
                    continue;
                }
                countMap.put(namingStrategy.collectionName(domainClass), countForDomainClass);
                totalItemCount += countForDomainClass;
            }

            int errorCount = syncService.getPatientErrorCount(pt.getPid());
            errorsByPatient.put(pt, (errorCount > 0));

            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(5);
            map.put("patient", pt);
            map.put("itemCount", totalItemCount);
            map.put("counts", countsByPatient.get(pt));
            map.put("totalErrorCount", errorCount);
            map.put("errors", errorsByPatient.get(pt));
            itemList.add(map);
        }

        JsonCCollection cr = JsonCCollection.create(itemList);
        cr.setSelfLink(request.getRequestURI());

        return ModelAndViewFactory.contentNegotiatingModelAndView(cr);
    }

    @RequestMapping(value = "/vpr/{apiVersion}/{pid}", method = RequestMethod.GET)
    public ModelAndView vprShow(@PathVariable String apiVersion, @PathVariable String pid) {
        PatientDemographics pt = patientService.getPatient(pid);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(pt));
    }

    @RequestMapping(value = "/patient/syncErrors", method = RequestMethod.GET)
    public ModelAndView syncErrors(@RequestParam String pid, @RequestParam(required = false) String format, Pageable pageable) {
        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) {
            throw new PatientNotFoundException(pid);
        }

        if (!StringUtils.hasText(format) || format.equals("html")) {
            LinkedHashMap<String, PatientDemographics> map = new LinkedHashMap<String, PatientDemographics>(1);
            map.put("patient", pt);
            return new ModelAndView("/patient/syncErrors", map);
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(getSyncErrorsForPatient(pt.getPid(), pageable));
        }

    }

    private JsonCCollection getSyncErrorsForPatient(String pid, Pageable pageable) {
        Page<SyncError> syncErrors = syncService.findAllErrorsByPatientId(pid, new PageRequest(pageable.getPageNumber(), pageable.getPageSize(), Sort.Direction.DESC, "dateCreated"));
        JsonCCollection response = JsonCCollection.create(syncErrors);
        List<Map> rslt = new ArrayList<>();
        for(SyncError error: syncErrors) {
            LinkedHashMap<String, Serializable> map = new LinkedHashMap<String, Serializable>(7);
            map.put("patient", error.getPatient());
            map.put("id", error.getId());
            map.put("item", error.getItem());
            map.put("dateCreated", error.getDateCreated());
            map.put("json", error.getJson());
            map.put("message", error.getMessage());
            map.put("stackTrace", error.getStackTrace());
            rslt.add(map);
        }

        ((Map)response.get("data")).put("items", rslt);
        return response;
    }

    @RequestMapping(value = "/patient/menu/{id}", method = RequestMethod.GET)
    public ModelAndView menu(@PathVariable String id) {
        PatientDemographics pt = patientDao.findByPid(id);
        if (pt==null) {
            throw new PatientNotFoundException(id);
        } else {
            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(3);
            map.put("patientInstance", pt);
            map.put("appService", appService);
            map.put("paramService", paramService);
            return new ModelAndView("/patient/menu", map);
        }
    }

    @RequestMapping(value = "/patient/acuity", method = RequestMethod.POST)
    public ModelAndView setAcuity(@RequestParam(required = true) String pid, @RequestParam(required = true) String acuity, @RequestParam(required = false) String uid) {
        Encounter enc = patientService.getCurrentVisit(pid);
        if (enc != null && POMUtils.parseJSONtoMap(acuity).get("acuity")!=null) {
            return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.updateCurrentVisitField("acuity", POMUtils.parseJSONtoMap(acuity).get("acuity").toString(), enc, pid));
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(new ArrayList<Object>());
        }

    }

    @RequestMapping(value = "/patient/acuity", method = RequestMethod.GET)
    public ModelAndView getAcuity(@RequestParam(required = true) String pid) {
        Encounter enc = patientService.getCurrentVisit(pid);
        if (enc != null) {
            Auxiliary aux = patientService.getOnePatientAuxiliaryObject(pid);
            return ModelAndViewFactory.contentNegotiatingModelAndView(aux.getDomainAux().get(enc.getUid()));
        } else {
            LinkedHashMap<String, Serializable> map = new LinkedHashMap<String, Serializable>(2);
            map.put("acuity", "<span class=\"text-muted\">No Current Visit</span>");
            map.put("editable", false);
            return ModelAndViewFactory.contentNegotiatingModelAndView(map);
        }

    }

    @RequestMapping(value = "/patient/currentvisit/{field}", method = RequestMethod.POST)
    public ModelAndView setVisitComments(@PathVariable String field, @RequestParam(required = true) String pid, @RequestParam(required = false) String uid, HttpServletRequest request) {
        String val = request.getParameter(field);
        Encounter enc = patientService.getCurrentVisit(pid);
        if (enc != null) {
            return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.updateCurrentVisitField(field, val, enc, pid));
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(new ArrayList<>());
        }

    }

    @RequestMapping(value = "/patient/comments", method = RequestMethod.POST)
    public ModelAndView setPatientComments(@RequestParam(required = true) String pid, @RequestParam(required = true) String comments, @RequestParam(required = false) Integer idx, @RequestParam(required = false) Boolean forCurrentVisit) throws Exception {

        Auxiliary aux = patientService.getOnePatientAuxiliaryObject(pid);

        if (forCurrentVisit!=null && forCurrentVisit) {
            Encounter enc = patientService.getCurrentVisit(pid);
            if (enc != null) {
                if (idx != null) {
                    aux.setCurrentCommentAt(idx, comments, userContext.getCurrentUser().getDisplayName(), enc.getUid());
                } else {
                    aux.addCurrentComment(comments, userContext.getCurrentUser().getDisplayName(), enc.getUid());
                }

            } else {
                return ModelAndViewFactory.contentNegotiatingModelAndView(new ArrayList<Object>());
            }

        } else {
            if (idx != null) {
                aux.setCommentAt(idx, comments, userContext.getCurrentUser().getDisplayName());
            } else {
                aux.addComment(comments, userContext.getCurrentUser().getDisplayName());
            }

        }


        vprPatientObjectDao.save(aux);
        return ModelAndViewFactory.contentNegotiatingModelAndView(aux);
    }

    @RequestMapping(value = "/patient/comments", method = RequestMethod.GET)
    public ModelAndView getPatientComments(@RequestParam(required = true) String pid, @RequestParam(required = false) Boolean forCurrentVisit) {
        if (forCurrentVisit) {
            return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.getOnePatientAuxiliaryObject(pid).getDomainAux().get(patientService.getCurrentVisit(pid).getUid()));
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.getOnePatientAuxiliaryObject(pid));
    }

    @RequestMapping(value = "/patient/comments/{pid}/{idx}/{forCurrentVisit}", method = RequestMethod.DELETE)
    public ModelAndView deletePatientComment(@PathVariable String pid, @PathVariable Integer idx, @PathVariable Boolean forCurrentVisit) {
        Auxiliary aux = patientService.getOnePatientAuxiliaryObject(pid);
        if (forCurrentVisit != null && forCurrentVisit) {
            Encounter enc = patientService.getCurrentVisit(pid);
            if (enc != null) {
                Map<String, Object> dat = aux.getDomainAux().get(enc.getUid());
                if (dat!=null && dat.get("comments")!=null && (((List)dat.get("comments")).size() > idx)) {
                    ((List)dat.get("comments")).remove(idx.intValue());
                }

            }

        } else {
            aux.getComments().remove(idx.intValue());
        }

        vprPatientObjectDao.save(aux);
        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(1);
        map.put("success", "true");
        return ModelAndViewFactory.contentNegotiatingModelAndView(map);
    }

    @RequestMapping(value = "/patient/location", method = RequestMethod.POST)
    public ModelAndView setPatientLocation(@RequestParam(required = true) String pid, @RequestParam(required = true) String value) {
        Auxiliary aux = patientService.getOnePatientAuxiliaryObject(pid);
        PointOfCare poc = null;
        if (value!=null && !value.isEmpty()) {
            poc = new PointOfCare(POMUtils.parseJSONtoMap(value));
            aux.setData("location", poc);
        } else {
            aux.setData("location", null);
        }

        vprPatientObjectDao.save(aux);
        return ModelAndViewFactory.contentNegotiatingModelAndView(aux);
    }

    @RequestMapping(value = "/patient/location", method = RequestMethod.GET)
    public ModelAndView getPatientLocation(@RequestParam(required = true) String pid) {
        return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.getOnePatientAuxiliaryObject(pid).getLocation());
    }

    @RequestMapping(value = "/patient/flag", method = RequestMethod.GET)
    public ModelAndView getPatientFlags(@RequestParam(required = true) String pid) {
//		Patient pat = patientDao.findByVprPid(pid);
        PatientDemographics pat = patientDao.findByPid(pid);
        if (pat != null) {
            QueryDef qd = new QueryDef("cwad");
            List<Object> rslt = new ArrayList<Object>();

            /*
             * I have to do this in two separate queries because of the mess that results from trying to query on one domain class when two different classes have been  pushed into the JDS.
             */
            LinkedHashMap<String, Object> map = new LinkedHashMap<>(1);
            map.put("pid", pid);
            List<? extends AbstractPatientObject> docs = genericDao.findAllByQuery(PatientAlert.class, qd, map);
            for (AbstractPatientObject doc : docs) {
                if (UidUtils.getDomainClassByUid(doc.getUid()).equals(PatientAlert.class)) {
                    LinkedHashMap<String, String> map1 = new LinkedHashMap<String, String>(3);
                    map1.put("code", "A");
                    map1.put("name", doc.getProperty("kind").toString());
                    map1.put("content", doc.getSummary());
                    rslt.add(map1);
                }

            }


            LinkedHashMap<String, Object> map1 = new LinkedHashMap<>(1);
            map1.put("pid", pid);
            docs = genericDao.findAllByQuery(Document.class, qd, map1);
            for (AbstractPatientObject doc : docs) {
                if (UidUtils.getDomainClassByUid(doc.getUid()).equals(Document.class)) {
                    Object txt = doc.getProperty("text");
                    if(txt != null && txt instanceof List && ((List)txt).size()>0) {
                        Object textItem = ((List)txt).get(0);
                        if(textItem instanceof Map && ((Map)textItem).get("content")!=null) {
                            String content = ((Map)textItem).get("content").toString();
                            LinkedHashMap<String, String> map2 = new LinkedHashMap<String, String>(3);
                            map2.put("code", doc.getProperty("documentTypeCode").toString());
                            map2.put("name", doc.getProperty("documentTypeName").toString());
                            map2.put("content", content);
                            rslt.add(map2);
                        }
                    }
                }

            }


            if (pat.getPatientRecordFlag() != null) {
                for (PatientRecordFlag f : pat.getPatientRecordFlag()) {
                    LinkedHashMap<String, String> map2 = new LinkedHashMap<String, String>(3);
                    map2.put("code", "F");
                    map2.put("name", f.getName());
                    map2.put("content", f.getText());
                    rslt.add(map2);
                }
           }
            return ModelAndViewFactory.contentNegotiatingModelAndView(rslt);
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.emptyList());
        }

    }

    @RequestMapping(value = "/patient/goals", method = RequestMethod.GET)
    public ModelAndView getPatientGoals(@RequestParam(required = true) String pid) {
        return ModelAndViewFactory.contentNegotiatingModelAndView(patientService.getOnePatientAuxiliaryObject(pid));
    }

    @RequestMapping(value = "/patient/goal", method = RequestMethod.POST)
    public ModelAndView setPatientGoals(@RequestParam(required = true) String pid, @RequestParam(required = true) String goal, @RequestParam(required = false) String value, @RequestParam(required = false) String comment) {

        Auxiliary aux = patientService.getOnePatientAuxiliaryObject(pid);
        Map<String, Map<String, Object>> goals = aux.getGoals();
        Map<String, Object> g = goals.containsKey(goal) ? goals.get(goal) : new LinkedHashMap();
        ArrayList comments = (g.get("comments"))!=null && g.get("comments") instanceof ArrayList ? (ArrayList)g.get("comments") : new ArrayList();
        if (value!=null) {
            LinkedHashMap<String, Object> map = new LinkedHashMap<>(1);
            map.put("value", value);
            aux.setGoal(goal, map);
        } else if (comment!=null) {
            LinkedHashMap<String, Serializable> map = new LinkedHashMap<String, Serializable>(2);
            map.put("dtm", PointInTime.now());
            map.put("text", comment);
            comments.add(map);
            LinkedHashMap<String, Object> map1 = new LinkedHashMap<>(1);
            map1.put("comments", comments);
            aux.setGoal(goal, map1);
        } else { // Logically both comment and value are null at this point.
            // clear goal
            aux.setGoal(goal, null);
        }

        vprPatientObjectDao.save(aux);
        return ModelAndViewFactory.contentNegotiatingModelAndView(aux);
    }

    @RequestMapping(value = "/patient/demographics", method = RequestMethod.GET)
    ModelAndView getPatientDemographics(@RequestParam(required = true) String pid, HttpServletRequest request) {
        Map<String, Object> data = patientService.getPatientDemographics(pid);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, data));
    }

   @RequestMapping(value = "/patient/demographics", method = RequestMethod.POST)
   public ModelAndView setPatientPhoneNumbers(@RequestParam(required = true) String pid,
                                                                     @RequestParam(required = true) String homePhone,
                                                                     @RequestParam(required = true) String cellPhone,
                                                                     @RequestParam(required = true) String workPhone,
                                                                     @RequestParam(required = true) String emergencyContact,
                                                                     @RequestParam(required = true) String emergencyPhone,
                                                                     @RequestParam(required = true) String nokContact,
                                                                     @RequestParam(required = true) String nokPhone,
                                                                     HttpServletRequest request) {

        patientService.updatePatientPhoneNumbers(pid, homePhone, cellPhone, workPhone, emergencyContact, emergencyPhone, nokContact, nokPhone);
        return ModelAndViewFactory.contentNegotiatingModelAndView("{'success':'true'}");
    }

    @RequestMapping(value = "/patient/patientIdentifiers", method = RequestMethod.GET)
    ModelAndView getPatientIdentifiers(@RequestParam(required = true) String pid, HttpServletRequest request) {
        Map<String, String> data = patientService.getPatientIdentifiers(pid);
        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, data));
    }
}
