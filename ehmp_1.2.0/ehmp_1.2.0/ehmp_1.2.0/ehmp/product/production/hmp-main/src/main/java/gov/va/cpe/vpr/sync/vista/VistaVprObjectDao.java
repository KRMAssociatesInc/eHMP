package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.team.Category;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_DELETE_OBJECT_RPC_URI;
import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_OBJECT_RPC_URI;

public class VistaVprObjectDao extends VistaDaoSupport implements IVistaVprObjectDao {

    private IGenericPOMObjectDAO jdsDao;
    
    @Autowired
    IBroadcastService svc;

    @Required
    public void setJdsDao(IGenericPOMObjectDAO jdsDao) {
        this.jdsDao = jdsDao;
    }

    @Override
    public <T extends IPOMObject> T save(T entity) {
        String requestJsonString = POMUtils.toJSON(entity);
        Map<String, Object> data = doSave(entity.getClass(), requestJsonString);
        entity.setData(data);
        return saveToJds(entity);
    }

    @Override
    public <T extends IPOMObject> T save(Class<T> entityType, Map<String, Object> data) {
        String requestJsonString = POMUtils.toJSON(data);
        Map<String, Object> vals = doSave(entityType, requestJsonString);
        T entity = POMUtils.newInstance(entityType, data);
        entity.setData(vals);
        return saveToJds(entity);
    }

    @Override
    public <T extends IPOMObject> void delete(T entity) {
        doDelete(entity.getClass(), entity.getUid());
        jdsDao.delete(entity);
    }

    @Override
    public <T extends IPOMObject> void deleteByUID(Class<T> type, String uid) {
        doDelete(type, uid);
        jdsDao.deleteByUID(type, uid);
    }

    private <T extends IPOMObject> T saveToJds(T entity) {
        Assert.hasText(entity.getUid(), "[Assertion failed] - 'uid' must have text; it must not be null, empty, or blank");
        entity = jdsDao.save(entity);
        
        // I just want to know when something has changed
        Map<String, Object> evt = new HashMap<String, Object>();
        evt.put("eventName", "domainChange");
        evt.put("domain", entity.getClass().getSimpleName());
    	svc.broadcastMessage(evt);

        return entity;
    }

    private <T extends IPOMObject> Map<String, Object> doSave(Class<T> entityType, String requestJsonString) {
    	Map<String, Object> obj = POMUtils.parseJSONtoMap(requestJsonString);
    	if(obj.get("uid")==null || obj.get("uid").toString().equals("")) {
    		if(!uniqueNameCheck(entityType, obj)) {
    			throw new DataRetrievalFailureException("Unable to save "+entityType.getSimpleName()+": Name is not unique.");
    		}
    	}
        JsonNode responseJson = executeForJsonAndSplitLastArg(VPR_PUT_OBJECT_RPC_URI, getCollectionName(entityType), requestJsonString);
        if (!responseJson.path("success").booleanValue()) {
            String message = responseJson.path("error").path("message").textValue();
            throw new DataRetrievalFailureException("Unable to save " + entityType.getName() + " to VPR OBJECT file: " + message);
        }
        return POMUtils.convertNodeToMap(responseJson.path("data"));
    }

    private <T extends IPOMObject> void doDelete(Class<T> entityType, String uid) {
        Assert.hasText(uid, "[Assertion failed] - 'uid' must have text; it must not be null, empty, or blank");
        if(!canDeleteDomain(entityType, uid)) {
        	throw new DataRetrievalFailureException("Unable to delete " + entityType.getSimpleName() + "; In use by "+getDeleteConstraintMessage(entityType, uid));
        }
        JsonNode responseJson = rpcTemplate.executeForJson(VPR_DELETE_OBJECT_RPC_URI, uid);
        if (!responseJson.path("success").booleanValue()) {
            String message = responseJson.path("error").path("message").textValue();
            throw new DataRetrievalFailureException("Unable to delete " + entityType.getName() + "; " + message);
        }
    }
    
    public List<IPOMObject> getReverseLinkedObjects(Class clazz, String uid) {
    	List<IPOMObject> results = new ArrayList<IPOMObject>();
    	ArrayList<String> row = getClassToReverseIndexMap().get(clazz);
    	if(row!=null) {
			QueryDef qd = new QueryDef(row.get(0));
			qd.setForPatientObject(false);
			qd.linkIf(row.get(1), "revlink", false, true);
			qd.where("uid").is(uid);
			Map<String, Object> parms = new HashMap<String, Object>();
			parms.put("revlink", Boolean.TRUE);
			IPOMObject rslt = jdsDao.findOneByQuery(clazz, qd, parms);
			Object revlnk = rslt.getData().get(row.get(2));
			if(revlnk!=null && revlnk instanceof List) {
				for(Object lnk: ((List)revlnk)) {
					if(lnk instanceof Map && ((Map)lnk).get("uid")!=null) {
						String lnkUid = ((Map)lnk).get("uid").toString();
						results.add(jdsDao.findByUID(UidUtils.getDomainClassByUid(lnkUid), lnkUid));
	    			}
				}
			}
    	}
    	return results;
    }
    
    private boolean canDeleteDomain(Class clazz, String uid) {
    	List<IPOMObject> stuff = getReverseLinkedObjects(clazz, uid);
    	return stuff.size()==0;
    }
    
    private String getDeleteConstraintMessage(Class clazz, String uid) {
    	StringBuilder bob = new StringBuilder();
    	List<IPOMObject> stuff = getReverseLinkedObjects(clazz, uid);
    	for(IPOMObject item: stuff) {
    		bob.append(bob.length()==0?"":", ");
    		bob.append(item.getClass().getSimpleName());
    		bob.append(": ");
    		bob.append(item.getSummary()!=null && !item.getSummary().equals("")?item.getSummary():"uid="+item.getUid());
    	}
    	return bob.toString();
    }
    
    private boolean uniqueNameCheck(Class clazz, Map<String, Object> jsonData) {
    	String className = clazz.getSimpleName().toLowerCase();
    	List<String> row = getUniqueFieldConstraintMap().get(clazz);
    	if(row!=null) { 
    		QueryDef qd = new QueryDef(row.get(0));
    		qd.setForPatientObject(false);
    		for(int i = 1; i<row.size(); i++) {
    			qd.where(row.get(i)).is(jsonData.get(row.get(i)));
    		}
    		IPOMObject rslt = jdsDao.findOneByQuery(clazz, qd, new HashMap<String, Object>());
    		if(rslt!=null) {
    			return false;
    		}
    	}
    	return true;
    }
    
    /**
     * This allows checking for reverse indices on things to see if they are in use. 
     * We are using this to be sure something is not being used anywhere before we delete that thing.
     * Domain lowercase, then index, then link name, then reverse link field to check
     */
    private static Map<Class, ArrayList<String>> classToReverseIndexMap = null;
    
    private Map<Class, ArrayList<String>> getClassToReverseIndexMap() {
    	if(classToReverseIndexMap==null) {
    		classToReverseIndexMap = new HashMap<Class, ArrayList<String>>();
    		ArrayList<String> stuff = new ArrayList<String>();
    		stuff.add("categories");
    		stuff.add("team-category-link");
    		stuff.add("teams");
    		classToReverseIndexMap.put(Category.class, stuff);
    	}
    	return classToReverseIndexMap;
    }
    
    /**
     * This will check against existing DB entries to be sure the new item can be saved without conflicting with unique fields.
     * Maybe this really should be in the JDS itself, with a check available ahead of time.
     */
    private static Map<Class, ArrayList<String>> uniqueFieldConstraintMap = null;
    
    private Map<Class, ArrayList<String>> getUniqueFieldConstraintMap() {
    	if(uniqueFieldConstraintMap==null) {
    		uniqueFieldConstraintMap = new HashMap<Class, ArrayList<String>>();
    		ArrayList<String> stuff = new ArrayList<String>();
    		stuff.add("categories");
    		stuff.add("name");
    		stuff.add("domain");
    		uniqueFieldConstraintMap.put(Category.class, stuff);
    	}
    	return uniqueFieldConstraintMap;
    }
}
