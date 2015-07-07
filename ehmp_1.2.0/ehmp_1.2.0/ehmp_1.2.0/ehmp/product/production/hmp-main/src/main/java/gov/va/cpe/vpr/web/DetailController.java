package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.pom.*;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.search.ISearchService;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.asu.AsuDecisionRequest;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsuDecisionRequest;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCError;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.util.VistaStringUtils;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.solr.client.solrj.SolrServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.util.*;

import static java.util.Collections.singletonMap;

@Controller
public class DetailController {
    private static Map<Class<? extends IPOMObject>, String> detailTemplateNames = new HashMap<>();

    static {
        detailTemplateNames.put(Task.class, "rel;task-link");
        detailTemplateNames.put(Document.class, "rev;document-parent;child-document");

    }

    private IPatientDAO patientDao;
    private IGenericPatientObjectDAO patientRelatedDao;
    private ApplicationContext applicationContext;
    private FrameRunner frameRunner;
    private ISearchService searchService;
    private UserContext userContext;
    private IPolicyDecisionPoint pdp;

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setPatientRelatedDao(IGenericPatientObjectDAO patientRelatedDao) {
        this.patientRelatedDao = patientRelatedDao;
    }

    @Autowired
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setFrameRunner(FrameRunner runner) {
        this.frameRunner = runner;
    }

    @Autowired
    public void setSearchService(ISearchService searchService) {
        this.searchService = searchService;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPolicyDecisionPoint(IPolicyDecisionPoint pdp) {
        this.pdp = pdp;
    }

    @RequestMapping(value = {"/detail/**", "/vpr/detail/**"}, method = RequestMethod.GET)
    public ModelAndView renderDetail(HttpServletRequest request,
                                     @RequestParam(value = "searchterm", required = false) String searchTerm,
                                     @RequestParam(required = false) String format) throws SolrServerException {
        String uri = URLDecoder.decode(request.getRequestURI());
        String uid = (uri.indexOf("urn:") > -1 ? uri.substring(uri.indexOf("urn:")) : null);
        if (!StringUtils.hasText(uid)) {
            if (!StringUtils.hasText(format) || "html".equalsIgnoreCase(format)) {
                return new ModelAndView("/exception/detailNotFound", singletonMap("error", singletonMap("message", "Unique ID not found; Is this a summary view?")));
            } else {
                throw new BadRequestException("'uid' argument must have text; it must not be null, empty, or blank");
            }
        }
        // fetch the POM object and generate the field map for the UID
        Class domainClass = UidUtils.getDomainClassByUid(uid);
        if (domainClass == null) throw new BadRequestException("unknown domain class for " + uid);
        AbstractPOMObject item = (AbstractPOMObject) patientRelatedDao.findByUidWithTemplate(domainClass, uid, detailTemplateNames.get(domainClass));

        if (item instanceof Document && Document.isTIU(uid)) {
            AsuDecisionRequest decisionRequest = new DocumentAsuDecisionRequest(userContext.getCurrentUser(), DocumentAction.VIEW, (Document) item);
            AuthorizationDecision decision = pdp.evaluate(decisionRequest);
            if (Decision.DENY.equals(decision.getDecision())) {
                Map<String, Object> model = new HashMap<>();
                model.put("decision", decision.getDecision());
                model.put("status", decision.getStatus());
                if (!StringUtils.hasText(format) || "html".equalsIgnoreCase(format)) {
                    return new ModelAndView("/patientDomain/documentViewDenied", model);
                } else {
                    return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCError.createError(request, "401", decision.getStatus().getMessage()));
                }
            } else if (Decision.INDETERMINATE.equals(decision.getDecision())) {
                Map<String, Object> model = new HashMap<>();
                model.put("decision", decision.getDecision());
                model.put("status", decision.getStatus());
                if (!StringUtils.hasText(format) || "html".equalsIgnoreCase(format)) {
                    return new ModelAndView("/patientDomain/documentViewError", model);
                } else {
                    return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCError.createError(request, "401", decision.getStatus().getMessage()));
                }
            }
        }

        Boolean isChild = false;
        // type check for safety as we are casting the item object
        if (item != null && item.getClass().equals(Document.class)) {
            // if there is a parentUid field, get that doc, otherwise process the children
            if (((Document) item).getIsInterdisciplinary().equalsIgnoreCase("true")) {
                if (((Document) item).getInterdisciplinaryType().equalsIgnoreCase("child")) {
                    uid = ((Document) item).getParentUid();
                    item = (AbstractPOMObject) patientRelatedDao.findByUidWithTemplate(domainClass, uid, detailTemplateNames.get(domainClass));
                    isChild = true;
                }
            } else {

                // for all documents, fill out any linking relationships
                QueryDef querydef = new QueryDef("document");
                querydef.where("uid").in("?:uid");
                querydef.linkIf("procedure-result", null, true, true);
                Map varMap = new HashMap<String, String>();
                varMap.put("uid", item.getUid());
                varMap.put("pid", ((Document) item).getPid());
                item = patientRelatedDao.findOneByQuery(Document.class, querydef, varMap);
//            ArrayList<AbstractPatientObject> procItem = null;
//            if(((Document) item).getProcedures() != null && !((Document) item).getProcedures().isEmpty()) {
//                for(Object proc : ((Document) item).getProcedures()) {
//                    procItem.add(patientRelatedDao.findByUID(item.getUid()));
//                }
//            }
            }
        }

        if (item == null) throw new UidNotFoundException(domainClass, uid);
        if (!StringUtils.hasText(format) || "html".equalsIgnoreCase(format)) {
            Map<String, Object> fields = item.getData(JSONViews.JDBView.class);
            String domain = ClassUtils.getShortNameAsProperty(item.getClass());

        /* generate standard parameters available to all detail templates:
         * - params (all URL params, not just controller specified) 
         * - item (domain object) 
         * - fields (raw field data, merged with hit highlights (if any))
         * - ctx (spring app context for bean lookup if needed)
         * - runner (the CDS engine runtime)
         * - highlights (SOLR hit highlights for any/all fields)
         */
            LinkedHashMap<String, Object> map = new LinkedHashMap<>();
            map.put("params", new ParameterMap(request));
            map.put("fields", fields);
            map.put("item", item);
            map.put("ctx", applicationContext);
            map.put("runner", frameRunner);
            map.put("isChild", isChild);

            // include search highlights if requested
            if (StringUtils.hasText(searchTerm)) {
                Map<String, List<String>> ret = searchService.doSearchHighlight(uid, searchTerm);
                if (ret != null) {
                    map.put("highlights", ret);
                }
                ArrayList<Map<String, List<String>>> childret = new ArrayList<>();
                if (item.getClass().equals(Document.class)) {
                    if (((Document) item).getChildDocs() != null) {
                        for (Document child : ((Document) item).getChildDocs()) {
                            childret.add(searchService.doSearchHighlight(child.getUid(), searchTerm));
                        }
                    }
                    if (childret != null) {
                        map.put("childhighlights", childret);
                    }
                }
            }

            return new ModelAndView("/patientDomain/" + domain, map);
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCResponse.create(request, item));
        }
    }

    @RequestMapping(value = {"/medtabdetail", "/vpr/detail/medtabdetail"}, method = RequestMethod.GET)
    public ModelAndView renderMedTabDetail(HttpServletRequest request, HttpServletResponse response) {
        String params = "[" + StringUtils.arrayToCommaDelimitedString(request.getParameterMap().get("history")) + "]";
        JsonNode tmp = POMUtils.parseJSONtoNode(params);
        JsonNode value = tmp.path(0);
        ArrayList<AbstractPOMObject> items = new ArrayList<>();
        for (int i = 0; i < value.size(); i++) {
            String uid = value.path(i).path("uid").textValue();
            String start = value.path(i).path("overallStart").textValue();
            String stop = value.path(i).path("overallStop").textValue();
            String status = value.path(i).path("vaStatus").textValue();
            String dose = value.path(i).path("dose").textValue();
            String anchor = dose + " " + status + " " + start + " " + stop;
            if (!StringUtils.hasText(uid)) {
                return new ModelAndView("/exception/detailNotFound", singletonMap("error", singletonMap("message", "Unique ID not found; Is this a summary view?")));
            }

            Class domainClass = UidUtils.getDomainClassByUid(uid);
            if (domainClass == null)
                throw new BadRequestException("unknown domain class for " + uid);

            AbstractPOMObject temp = (AbstractPOMObject) patientRelatedDao.findByUID(domainClass, uid);
            if (temp == null) throw new UidNotFoundException(domainClass, uid);

            temp.setData("anchorLink", anchor);
            items.add(temp);
        }

        return new ModelAndView("/patientDomain/medicationhistory", singletonMap("items", items));
    }

    @RequestMapping(value = "/vpr/{pid}/detail/cwadf", method = RequestMethod.GET)
    public ModelAndView renderDetailAllForCwadf(@PathVariable String pid, HttpServletRequest request, HttpServletResponse response) {
        if (!StringUtils.hasText(pid)) {
            return new ModelAndView("/exception/detailNotFound", singletonMap("error", singletonMap("message", "PID not found")));
        }

        List<Map<String, Object>> items = patientRelatedDao.findAllByUrl("/vpr/" + pid + "/index/cwad");
        List<Map<String, Object>> allergyItems = new ArrayList<>();
        List<Map<String, Object>> noteItems = new ArrayList<>();
        separateCwadfByType((items == null ? new ArrayList<Map<String, Object>>() : items), allergyItems, noteItems);
        formatAllergyData(allergyItems, "products");
        formatAllergyData(allergyItems, "reactions");
        // formatAllergyData(allergyItems, "observations");
        formatNoteData(noteItems);

        List<Map<String, Object>> flags = findFlags(pid);

        LinkedHashMap<String, Object> map = new LinkedHashMap<>(3);
        map.put("allergies", allergyItems);
        map.put("notes", noteItems);
        map.put("flags", flags);
        return new ModelAndView("/patientDomain/cwadf", map);
    }

    private List<Map<String, Object>> findFlags(String pid) {
        PatientDemographics dems = patientDao.findByPid(pid);
        if (dems != null && dems.getPatientRecordFlag() != null) {
            int i = 0;
            List<Map<String, Object>> flagItems = new ArrayList<>();
            for (PatientRecordFlag flag : dems.getPatientRecordFlag()) {
                HashMap<String, Object> data = new HashMap<>(flag.getData(JSONViews.WSView.class));
                data.put("uid", dems.getUid() + ":flag:" + i++);
                flagItems.add(data);
            }
            return flagItems;
        }
        return Collections.emptyList();
    }

    private void formatAllergyData(List<Map<String, Object>> items, String key) {
        for (Map<String, Object> item : items) {
            StringBuilder rslt = new StringBuilder();
            Object values = item.get(key);
            if (values instanceof List && ((List) values).size() > 0) {
                boolean first = true;
                for (int i = 0; i < ((List) values).size(); i++) {
                    Object product = ((List) values).get(i);
                    if (first) first = false;
                    else rslt.append(", ");
                    rslt.append(product instanceof String ? VistaStringUtils.nameCase((String) product) : product instanceof Map ? VistaStringUtils.nameCase((String) ((Map) product).get("name")) : "");
                }
                item.put(key, rslt.toString());
            } else if (values == null) {
                item.put(key, "");
            }
        }

        if (key.equalsIgnoreCase("products")) {
            Collections.sort(items, new Comparator<Map<String, Object>>() {
                public int compare(Map<String, Object> x, Map<String, Object> y) {
                    return x.get("products").toString().compareTo(y.get("products").toString());
                }
            });
        }
    }

    private void formatNoteData(List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            if (item.containsKey("name") && !item.containsKey("kind")) {
                item.put("kind", item.get("name"));
            }
        }

        Collections.sort(items, new Comparator<Map<String, Object>>() {
            public int compare(Map<String, Object> x, Map<String, Object> y) {
                String xRefDt = x.get("referenceDateTime") != null ? x.get("referenceDateTime").toString() : "0";
                String yRefDt = y.get("referenceDateTime") != null ? y.get("referenceDateTime").toString() : "0";
                return yRefDt.compareTo(xRefDt);
            }
        });
    }

    private void separateCwadfByType(List<Map<String, Object>> docs, List<Map<String, Object>> allergies, List<Map<String, Object>> noteItems) {
        for (Map<String, Object> doc : docs) {
            String kind = doc.get("kind").toString().toLowerCase();
            if (kind.contains("allergy") || kind.contains("adverse reaction")) {
                allergies.add(doc);
            } else {
                noteItems.add(doc);
            }
        }
    }
}
