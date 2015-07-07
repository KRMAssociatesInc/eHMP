package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.BroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.auth.UserContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_DEMOGRAPHICS_RPC_URI;

public class VistaVprPatientDemographicsObjectDao extends VistaDaoSupport implements IVistaVprPatientDemographicsObjectDao {

    private IPatientDAO jdsPatientDao;
    private IGenericPatientObjectDAO jdsGenericDao;
    private UserContext userContext;
    private static Logger log = LoggerFactory.getLogger(VistaVprPatientDemographicsObjectDao.class);

    @Autowired
    BroadcastService svc;

    @Required
    public void setJdsPatientDao(IPatientDAO jdsPatientDao) {
        this.jdsPatientDao = jdsPatientDao;
    }

    @Required
    public void setJdsGenericDao(IGenericPatientObjectDAO jdsGenericDao) {
        this.jdsGenericDao = jdsGenericDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Override
    public PatientDemographics update(PatientDemographics demographics) {
        Assert.hasText(demographics.getPid(), "[Assertion failed] - 'pid' must have text; it must not be null, empty, or blank");
        String localPatientId = getLocalPatientId(demographics.getPid(), userContext.getCurrentUser().getVistaId());
        String requestJsonString = POMUtils.toJSON(demographics);
        Map params = new HashMap();
        params.put("command", "updateDemographics");
        Map<String, Object> data = doUpdate(localPatientId, params, requestJsonString);
        demographics.setData((Map)((List)data.get("items")).get(0));
        return saveToJds(demographics);
    }

    private <T extends IPatientObject> Map<String, Object> doUpdate(String localPatientId, Map params, String requestJsonString) {
        JsonNode responseJson = executeForJsonAndSplitLastArg(VPR_PUT_DEMOGRAPHICS_RPC_URI, localPatientId, params, requestJsonString);
        if (!responseJson.path("success").booleanValue()) {
            log.error("Unsuccessful RPC call saving patient phone numbers to VPR PATIENT OBJECT file.", responseJson);
            throw new DataRetrievalFailureException("Unable to save patient phone numbers to VPR PATIENT OBJECT file.");
        }
        return POMUtils.convertNodeToMap(responseJson.path("data"));
    }

    private String getLocalPatientId(String pid, String vistaId) {
        PatientDemographics pt = jdsPatientDao.findByPid(pid);
        if (pt == null) throw new PatientNotFoundException(pid);
        return pt.getLocalPatientIdForSystem(vistaId);
    }

    private PatientDemographics saveToJds(PatientDemographics dem) {
        Assert.hasText(dem.getUid(), "[Assertion failed] - 'uid' must have text; it must not be null, empty, or blank");
        this.jdsPatientDao.save(dem);

        // I just want to know when something has changed
//        Map<String, Object> evt = new HashMap<String, Object>();
//        //String domain = dem.getClass().getSimpleName();
//        String domain = Patient.class.getSimpleName();
//        String pid = dem.getPid();
//        evt.put("domainChange", domain);
//        evt.put("pid", pid);
//        svc.broadcastMessage(evt);

        return dem;
    }
}
