package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.frameeng.IFrameRunner;
import gov.va.cpe.vpr.pom.*;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.auth.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_PATIENT_DATA_URI;

public class VistaVprPatientObjectDao extends VistaDaoSupport implements IVistaVprPatientObjectDao {

    private IPatientDAO jdsPatientDao;
    private IGenericPatientObjectDAO jdsGenericDao;
    private UserContext userContext;
    private IBroadcastService svc;
    private IFrameRunner runner;

    @Autowired
    public void setBroadcastService(IBroadcastService svc) {
        this.svc = svc;
    }
    
    @Autowired
    public void setFrameRunner(IFrameRunner runner) {
		this.runner = runner;
	}

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
    public <T extends IPatientObject> T save(T entity) {
        Assert.hasText(entity.getPid(), "[Assertion failed] - 'pid' must have text; it must not be null, empty, or blank");
        String localPatientId = getLocalPatientId(entity.getPid(), userContext.getCurrentUser().getVistaId());
        String requestJsonString = POMUtils.toJSON(entity);
        Map<String, Object> data = doSave(entity.getClass(), localPatientId, requestJsonString);
        entity.setData(data);
        
        // if any events were generated (for freshness update or sync), push them
        List<PatientEvent<IPatientObject>> events = entity.getEvents();
        if (events != null) {
            runner.pushEvents(events);
        }
        
        return saveToJds(entity);
    }

    @Override
    public <T extends IPatientObject> T save(Class<T> entityType, Map<String, Object> data) {
        String pid = (String) data.get("pid");
        Assert.hasText(pid, "[Assertion failed] - 'pid' must have text; it must not be null, empty, or blank");
        String localPatientId = getLocalPatientId(pid, userContext.getCurrentUser().getVistaId());
        String requestJsonString = POMUtils.toJSON(data);
        Map<String, Object> vals = doSave(entityType, localPatientId, requestJsonString);
        T entity = POMUtils.newInstance(entityType, data);
        entity.setData(vals);
        
        // if any events were generated (for freshness update or sync), push them
        List<PatientEvent<IPatientObject>> events = entity.getEvents();
        if (events != null) {
            runner.pushEvents(events);
        }
        
        return saveToJds(entity);
    }

    private <T extends IPatientObject> Map<String, Object> doSave(Class<T> entityType, String localPatientId, String requestJsonString) {
        JsonNode responseJson = executeForJsonAndSplitLastArg(VPR_PUT_PATIENT_DATA_URI, localPatientId, getCollectionName(entityType), requestJsonString);
        if (!responseJson.path("success").booleanValue()) {
            throw new DataRetrievalFailureException("Unable to save " + entityType.getName() + " to VPR PATIENT OBJECT file.");
        }
        return POMUtils.convertNodeToMap(responseJson.path("data"));
    }

    private String getLocalPatientId(String pid, String vistaId) {
        PatientDemographics pt = jdsPatientDao.findByPid(pid);
        if (pt == null) throw new PatientNotFoundException(pid);
        return pt.getLocalPatientIdForSystem(vistaId);
    }

    private <T extends IPatientObject> T saveToJds(T entity) {
        Assert.hasText(entity.getUid(), "[Assertion failed] - 'uid' must have text; it must not be null, empty, or blank");
        this.jdsGenericDao.save(entity);

        // I just want to know when something has changed
        Map<String, Object> evt = new HashMap<String, Object>();
        String domain = entity.getClass().getSimpleName();
        String pid = entity.getPid();
        evt.put("eventName", "domainChange");
        evt.put("domain", domain);
        evt.put("pid", pid);
        svc.broadcastMessage(evt);

        return entity;
    }
}
