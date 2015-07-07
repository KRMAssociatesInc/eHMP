package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.service.IDomainService;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.codehaus.groovy.runtime.DefaultGroovyMethods;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Handles nearly all VPR web service requests for individual entities in a domain as well as collections of entities in
 * a domain.
 * <p/>
 * Collections of entities are fetched by default with: <code>/{apiVersion}/{pid}/{domain}/{queryName}</code>
 * <p/>
 */
@RequestMapping(value = {"/patientDomain/**", "/vpr/patientDomain/**"})
@Controller
public class PatientDomainController {

    private static Logger log = LoggerFactory.getLogger(PatientDomainController.class);
    private IDomainService patientDomainService;
    private IPatientDAO patientDao;
    private IGenericPatientObjectDAO genericPatientRelatedDao;
    private UserContext userContext;
    private IVistaVprPatientObjectDao vistaVprPatientObjectDao;

    @Autowired
    public void setPatientDomainService(IDomainService patientDomainService) {
        this.patientDomainService = patientDomainService;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setGenericPatientRelatedDao(IGenericPatientObjectDAO genericPatientRelatedDao) {
        this.genericPatientRelatedDao = genericPatientRelatedDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setVistaVprPatientObjectDao(IVistaVprPatientObjectDao vvDao) {
        this.vistaVprPatientObjectDao = vvDao;
    }

    /**
     * The list action retrieves a filtered list of VPR entities and returns them in pages.
     * <p/>
     * Required request parameters: <dl> <dt>pid</dt> <dd>Patient identifier.</dd>
     * <p/>
     * <dt>domain</dt> <dd>The domain of the VPR entity.  Valid values for the <code>domain</code> request parameter are:
     * <ol> <li>The 'logical property name' of the Grails Domain Class.  For example, the allergy <code>Allergy</code>
     * class' logical property name is <code>allergy<code></li> <li>The 'lower case hyphenated name' of the Grails Domain
     * Class.  For example, the allergy <code>HealthFactor</code> class' lower case hyphenated name is
     * <code>health-factor<code></li> <li>A value listed in the DOMAIN_ALIASES Map defined in this class.  For example, the
     * <code>lab</code> is an alias for <code>result<code></li> </ol> </dd>
     * <p/>
     * <dt>queryName</dt> <dd>TBD</dd> </dl> Optional request parameters: <dl> <dt>dateRange</dt> <dd>A date range to
     * restrict the list of items to.</dd>
     * <p/>
     * <dt>startIndex</dt> <dd>TBD</dd> <dt>count</dt> <dd>BD</dd> </dl>
     */
    @RequestMapping(value = "/vpr/{apiVersion}/{pid}/{domain}/{queryName}", method = RequestMethod.GET)
    public ModelAndView list(@PathVariable String apiVersion, @PathVariable String pid, @PathVariable String domain, @PathVariable String queryName, @RequestParam(required = false) IntervalOfTime dateRange, @RequestParam(required = false) String format, Pageable pageable, HttpServletRequest request) {
        PatientDemographics pt = getPatient(pid);// validate patient

        ParameterMap params = new ParameterMap(request);
        Page page = patientDomainService.queryForPage(pt, domain, dateRange, getRequestedQueryName(domain, params), getRemainingRequestParams(params), pageable);

        JsonCCollection jsonc = JsonCCollection.create(request, page);
        // TODO: add self, next and previous links to the collection

        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/findOne/{uid}", method = RequestMethod.GET)
    public ModelAndView getForUID(@PathVariable String uid) {
        IPatientObject obj = genericPatientRelatedDao.findByUID(uid);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }

    /**
     * Open for singular or set data updates. Might want to make list-specific endpoints at some point.
     *
     * @param value
     * @param domain
     * @return
     */
    @RequestMapping(value = "/{domain}", method = RequestMethod.POST)
    public ModelAndView post(@RequestParam(required = true) String value, @RequestParam(required = true) String pid, @PathVariable String domain) {
        Class clazz = patientDomainService.getDomainClass(domain);
        Map mp = POMUtils.parseJSONtoMap(value);

        Object data = mp.get("data");
        Object list = mp.get("list");
        if (data != null && data instanceof List) {
            ArrayList<Object> stuff = new ArrayList<Object>();
            for (Map obj : (List<Map>) data) {
                obj.put("pid", pid);
                stuff.add(vistaVprPatientObjectDao.save(clazz, obj));
            }

            return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("data", stuff));
        } else if (list != null && list instanceof List) {
            ArrayList<Object> stuff = new ArrayList<Object>();
            for (Map obj : (List<Map>) list) {
                obj.put("pid", pid);
                vistaVprPatientObjectDao.save(clazz, obj);
            }

            return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("list", stuff));
        } else {
            Map obj = POMUtils.parseJSONtoMap(value);
            obj.put("pid", pid);
            return ModelAndViewFactory.contentNegotiatingModelAndView(vistaVprPatientObjectDao.save(clazz, obj));
        }

    }

    private Map getRemainingRequestParams(ParameterMap params) {
        List<String> skip = new ArrayList<String>(Arrays.asList("format", "controller", "action", "pid", "domain", "dateRange", "queryName", "max", "offset", "start", "page", "limit", "startIndex", "count", "_dc"));
        Set<String> remainingKeys = new HashSet<String>();
        for (String key : params.keySet()) {
            if (!skip.contains(key)) {
                remainingKeys.add(key);
            }
       }

        Map remainingRequestParams = DefaultGroovyMethods.subMap(params, remainingKeys);
        return remainingRequestParams;
    }

    private String getRequestedQueryName(String domain, ParameterMap params) {
        Object name = params.get("queryName");
        String queryName = (name != null && StringUtils.hasText(name.toString())) ? name.toString() : "all";
        return queryName;
    }

    private PatientDemographics getPatient(String pid) {
        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) throw new PatientNotFoundException(pid);
        return pt;
    }

}
