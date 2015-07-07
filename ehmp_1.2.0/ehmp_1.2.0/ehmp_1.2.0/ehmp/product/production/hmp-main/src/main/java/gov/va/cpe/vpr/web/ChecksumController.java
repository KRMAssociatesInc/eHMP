package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.service.IChecksumService;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Controller
public class ChecksumController implements EnvironmentAware {

    private IVistaAccountDao vistaAccountDao;
    private IChecksumService checksumService;
    private IGenericPatientObjectDAO genericPatientObjectDao;
    private IVistaVprDataExtractEventStreamDAO vistaPatientDataService;
    private ISyncService syncService;
    private Environment environment;
    private AtomicLong requestId = new AtomicLong(0);

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setChecksumService(IChecksumService checksumService) {
        this.checksumService = checksumService;
    }

    @Autowired
    public void setVistaPatientDataService(IVistaVprDataExtractEventStreamDAO vistaPatientDataService) {
        this.vistaPatientDataService = vistaPatientDataService;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setGenericPatientObjectDao(IGenericPatientObjectDAO genericPatientObjectDao) {
        this.genericPatientObjectDao = genericPatientObjectDao;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @RequestMapping(value = "/check/getAccounts", method = RequestMethod.GET)
    public ModelAndView accounts(HttpServletRequest request) {
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        for (VistaAccount account : accounts) {
            String vistaId = account.getVistaId();
            String name = account.getName();
            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
            map.put("name", name);
            map.put("id", vistaId);
            list.add(map);

        }


        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, list));
    }

    @RequestMapping(value = "/check/getPatients", method = RequestMethod.GET)
    public ModelAndView patients(HttpServletRequest request) {
        String vistaId = request.getParameterMap().get("vistaId")[0].toString();
        List<PatientDemographics> patients = genericPatientObjectDao.findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded");
        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        for (PatientDemographics pt : patients) {
            String dfn = pt.getLocalPatientIdForSystem(vistaId);
            if (!StringUtils.hasText(dfn)) continue;
            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(3);
            map.put("name", pt.getFullName());
            map.put("pid", pt.getPid());
            map.put("dfn", dfn);
            list.add(map);
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(request, list));
    }

    @RequestMapping(value = "/check/getAllPatient", method = RequestMethod.GET)
    public ModelAndView getAllPatient(HttpServletRequest request) {
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
        String server = environment.getProperty(HmpProperties.SERVER_ID);
        ArrayList<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        for (VistaAccount account : accounts) {
            String vistaId = account.getVistaId();
            String vistaName = account.getName();
            List<PatientDemographics> patients = genericPatientObjectDao.findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded");
            for (PatientDemographics pt : patients) {
                String dfn = pt.getLocalPatientIdForSystem(vistaId);
                if (!StringUtils.hasText(dfn)) continue;
                String patientName = pt.getFullName();
                String pid = pt.getPid();
                String id = pt.getPid() + ":" + vistaId;
                HashMap<String, Object> results = new HashMap<String, Object>();
                results.put("idValue", id);
                results.put("pid", pid);
                results.put("vistaId", vistaId);
                results.put("vistaAccount", vistaName);
                results.put("patientName", patientName);
                results.put("dfn", dfn);
                results.put("server", server);
                list.add(results);
            }


        }

        JsonNode output = POMUtils.convertObjectToNode(list);
        return ModelAndViewFactory.contentNegotiatingModelAndView(output);

    }

    @RequestMapping(value = "/check/updateUid", method = RequestMethod.GET)
    public ModelAndView updateUid(@RequestParam String uid, @RequestParam String pid, @RequestParam String vistaId) {
        VistaDataChunk chunk = vistaPatientDataService.fetchOneByUid(vistaId, pid, uid);
        syncService.sendImportVistaDataExtractItemMsg(chunk);
        return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("success", true));
    }

    @RequestMapping(value = "/check/submitChecksum", method = RequestMethod.GET)
    public ModelAndView submitChecksum(@RequestParam String dfn, @RequestParam String pid, @RequestParam String vistaId) {
        String server = environment.getProperty(HmpProperties.SERVER_ID);
        Long localRequestId = requestId.incrementAndGet();
        checksumService.checkPatientData(pid, vistaId, server, localRequestId.toString());
        Map result = new HashMap();
        result.put("requestId", localRequestId);
        JsonNode output = POMUtils.convertObjectToNode(result);
        return ModelAndViewFactory.contentNegotiatingModelAndView(output);

    }

    @RequestMapping(value = "/check/checkChecksumStatus", method = RequestMethod.GET)
    public ModelAndView checkChecksumStatus(@RequestParam String request) {
        Map<String, Object> results = checksumService.fuPatientData(request);
        JsonNode output = POMUtils.convertObjectToNode(results);
        return ModelAndViewFactory.contentNegotiatingModelAndView(output);

    }

    @RequestMapping(value = "/check/getVistaChecksum", method = RequestMethod.GET)
    public ModelAndView vistaChecksum(@RequestParam String dfn, @RequestParam String vistaId) {
        String server = environment.getProperty(HmpProperties.SERVER_ID);
        JsonNode result = checksumService.getVistaChecksum(dfn, vistaId, server);
        return ModelAndViewFactory.contentNegotiatingModelAndView(result);

    }

    @RequestMapping(value = "/check/getJdsChecksum", method = RequestMethod.GET)
    public ModelAndView jdsChecksum(@RequestParam String pid, @RequestParam String vistaId) {
        JsonNode result = checksumService.getJdsChecksum(pid, vistaId);
        return ModelAndViewFactory.contentNegotiatingModelAndView(result);

    }
}
