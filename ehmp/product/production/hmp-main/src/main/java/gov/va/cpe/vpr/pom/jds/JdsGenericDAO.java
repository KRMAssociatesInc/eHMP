package gov.va.cpe.vpr.pom.jds;

import gov.va.cpe.team.Team;
import gov.va.cpe.vpr.DomainNameUtils;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.util.NullChecker;

import org.apache.commons.lang.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.data.domain.*;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

public class JdsGenericDAO extends JdsDaoSupport implements IGenericPOMObjectDAO, IGenericPatientObjectDAO {
    static final Logger logger = LoggerFactory.getLogger(JdsGenericDAO.class);

    @Override
    public <T extends IPOMObject> T save(T entity) {
        logger.debug("save:  Entered method.");
        if (isPatientDataEntity(entity)) {
            logger.debug("save:  Data is considered part of PatientDataEntity.");
            if (entity instanceof PatientDemographics) {
                logger.debug("save:  Data is of type Patient.");
                PatientDemographics patient = (PatientDemographics) entity;
                URI vprPtUri = jdsTemplate.postForLocation("/vpr", patient);
                // The original code from VA that follows this was not Multi-Facility friendly.  The URI that is being returned
                // may not be for the same facility that the data originated from.  Setting the pid blindly caused the wrong pid to be
                // associated with other data items.  If the pid existed before - leave it alone.  If it did not, then construct
                // it from the known good data from the UID and the Local ID.
                //-------------------------------------------------------------------------------------------------------------
//                String[] pieces = vprPtUri.getPath().split("/");
//                String pid = pieces[2];
                if (NullChecker.isNullish(patient.getPid())) {
                    logger.debug("save:  The pid did not exist in the PatientDemographics entity.   Trying to create it now.");
                    String vistaId = "";
                    String dfn = "";
                    if (NullChecker.isNotNullish(patient.getUid())) {
                        vistaId = UidUtils.getSystemIdFromPatientUid(patient.getUid());
                    }
                    if ((NullChecker.isNotNullish(vistaId)) && 
                        (NullChecker.isNotNullish(patient.getLocalId()))) {
                        patient.setData("pid", vistaId + ";" + patient.getLocalId());
                        logger.debug("save:  Created pid: " + vistaId + ";" + patient.getLocalId());
                    }
                    else {
                        logger.debug("save:  Did not have enough data to create the pid.  Leaving it empty.");
                    }
                }
                logger.debug("save: saved patient pid {}", patient.getPid());
            } else {
                logger.debug("save:  Data is NOT of type Patient.  It is an IPatientObject: " + entity.getClass().getCanonicalName());
                IPatientObject item = (IPatientObject) entity;
                Assert.hasText(item.getPid(), "[Assertion failed] - 'pid' must have text; it must not be null, empty, or blank");
                jdsTemplate.postForLocation("/vpr/" + item.getPid(), entity);
                logger.debug("save: saved {} with uid {}", getCollectionName(entity.getClass()), entity.getUid());
            }
            // call the save handler
            ((IPatientObject) entity).save(this);
            
        } else {
            logger.debug("save:  Data is NOT considered part of PatientDataEntity.");
            if (StringUtils.hasText(entity.getUid())) {
                logger.debug("save:  Data contained UID: " + entity.getUid());
                // TODO: do some uid validation here? match against an expected regex?
                String[] pieces = entity.getUid().split(":");
                String collectionName = pieces[2];

                jdsTemplate.postForLocation("/data", entity);
                logger.debug("save: saved {} with uid {}", collectionName, entity.getUid());
            } else {
                logger.debug("save:  Data did NOT contain UID.");
                String collectionName = getCollectionName(entity.getClass());
                logger.debug("save:  Data did NOT contain UID.  CollectionName: " + collectionName);
                URI itemUri = jdsTemplate.postForLocation("/data/" + collectionName, entity);
                String[] pieces = itemUri.getPath().split("/");
                String uid = pieces[2];
                entity.setData("uid", uid);
                logger.debug("save: saved {} with uid {}", collectionName, entity.getUid());
            }
        }
        return entity;
    }

    private <T extends IPOMObject> boolean isPatientDataEntity(T entity) {
        return isPatientDataEntity(entity.getClass());
    }

    private <T extends IPOMObject> boolean isPatientDataEntity(Class<T> type) {
        return IPatientObject.class.isAssignableFrom(type);
    }

    @Override
    public <T extends IPOMObject> void delete(T entity) {
        Assert.notNull(entity, "[Assertion failed] - 'entity' argument is required; it must not be null");

        deleteByUID(entity.getClass(), entity.getUid());
    }

    @Override
    public void deleteByUID(String uid) {
        Class clazz = UidUtils.getDomainClassByUid(uid);
        if (clazz == null) {
            throw new IllegalArgumentException("Unable to determine domain of uid '" + uid + "'");
        }
        deleteByUID(clazz, uid);
    }

    @Override
    public <T extends IPOMObject> void deleteByUID(Class<T> type, String uid) {
        Assert.notNull(type, "[Assertion failed] - 'type' argument is required; it must not be null");
        Assert.notNull(uid, "[Assertion failed] - 'uid' argument is required; it must not be null");

        if (IPatientObject.class.isAssignableFrom(type)) {
            jdsTemplate.delete("/vpr/uid/" + uid);
        } else {
            jdsTemplate.delete("/data/" + uid);
        }
    }

    @Override
    public <T extends IPOMObject> void deleteAll(Class<T> type) {
        Assert.notNull(type, "[Assertion failed] - 'type' argument is required; it must not be null");

        jdsTemplate.delete("/data/collection/" + getCollectionName(type));
    }

    @Override
    public void deleteCollectionByPIDAndSystem(String vistaCollectionName, String pid, String system) {
        Assert.notNull(vistaCollectionName, ";Assertian failed] - 'vistaCollectionName' argument is required; It must not be null");
        Assert.notNull(pid, ";Assertian failed] - 'pid' argument is required; It must not be null");
        Assert.notNull(system, ";Assertian failed] - 'system' argument is required; It must not be null");
        jdsTemplate.delete("/vpr/"+pid+"/collection/"+vistaCollectionName+"?system="+system);
    }

    @Override
    public <T extends IPOMObject> int count(Class<T> type) {
        String collectionName = getCollectionName(type);
        JsonCCollection<Map<String, Object>> jsonc = jdsTemplate.getForJsonC("/data/all/count/collection");
        for (Map item : jsonc.getItems()) {
            String topic = (String) item.get("topic");

            if (collectionName.equalsIgnoreCase(topic)) {
                Integer count = (Integer) item.get("count");
                return count;
            }
        }
        throw new DataRetrievalFailureException("Unable to retrieve count: collection '" + collectionName + "': is unknown.");
    }

    @Override
    public int count(String index) {
        List<Map<String,Object>> items = findAllByUrl("/data/count/" + index);

        if (items == null ) {
            return 0;
        }

        return items.size();
    }

    @Override
    public int count(String index, String topic) {
        List<Map<String,Object>> items = findAllByUrl("/data/count/" + index);

        if (items == null ) {
            return 0;
        }

        for (Map item : items) {

            if (topic.equals( (String) item.get("topic")) ) {
                Integer count = (Integer) item.get("count");
                return count;
            }
        }

        return 0;
    }

    @Override
    public <T extends IPOMObject> T findByUID(Class<T> type, String uid) {
        return findByUIDWithTemplate(type, uid, null);
    }

    @Override
    public <T extends IPOMObject> T findByUIDWithTemplate(Class<T> type, String uid, String templateName) {
        Assert.notNull(type, "[Assertion failed] - the 'type' argument is required; it must not be null");
        Assert.hasText(uid, "[Assertion failed] - 'uid' argument is required; it must not be null, empty, or blank");

        String uri = isPatientDataEntity(type) ? "/vpr/uid/" + uid : "/data/" + uid;
        if (StringUtils.hasText(templateName)) {
            uri += "/" + templateName;
        }
        logger.debug("findByUIDWithTemplate: uri: " + uri);
        if (PatientDemographics.class.isAssignableFrom(type)) {
            PatientDemographics patient = jdsTemplate.getForObject(PatientDemographics.class, uri);
            return (T) patient;
        } else {
            T item = jdsTemplate.getForObject(type, uri);
            return item;
        }
    }

    @Override
    public Map<String, Object> findByUIDWithTemplate(String uid, String template) {
        Assert.hasText(uid, "[Assertion failed] - 'uid' argument is required; it must not be null, empty, or blank");
        Assert.hasText(template, "[Assertion failed] - 'template' argument is required; it must not be null, empty, or blank");

        return jdsTemplate.getForObject(Map.class, "/data/" + uid + "/" + template);
    }

    @Override
    public <T extends IPOMObject> List<T> findAll(Class<T> type) {
        return findAll(type, (Sort) null);
    }

    @Override
    public <T extends IPOMObject> List<T> findAllWithTemplate(Class<T> type, String template) {
        Assert.hasText(template, "[Assertion failed] - 'template' argument is required; it must not be null, empty, or blank");

        String collectionName = getCollectionName(type);
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/find/" + collectionName + "/" + template);
        return findAllInternal(type, uri.build().toUriString()).getContent();
    }

    @Override
    public <T extends IPOMObject> List<T> findAll(Class<T> type, Sort sort) {
        String collectionName = getCollectionName(type);
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/find/" + collectionName);
        addSortQueryParams(sort, uri);
        return findAllInternal(type, uri.build().toUriString()).getContent();
    }

    @Override
    public <T extends IPOMObject> Page<T> findAll(Class<T> type, Pageable pageable) {
        String collectionName = getCollectionName(type);
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/find/" + collectionName);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(type, uri.build().toUriString());
    }

    @Override
    protected <T extends IPOMObject> Page<T> findAllInternal(Class<T> type, String uri) {
        Page<T> page = super.findAllInternal(type, uri);
        if (!page.hasContent()) return page;

        List<T> validatedItems = new ArrayList<T>(page.getNumberOfElements());
        for (T item : page.getContent()) {
            validatedItems.add(validateOne(item));
        }
        PageRequest pageable = page.getSize() > 0 ? new PageRequest(page.getNumber(), page.getSize(), page.getSort()) : null;
        return new PageImpl<T>(validatedItems, pageable, page.getTotalElements());
    }

    @Override
    public <T extends IPOMObject> List<T> findAllByIndex(Class<T> clazz, String indexName) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName);
        return findAllInternal(clazz, uri.build().toUriString()).getContent();
    }

    @Override
    public <T extends IPOMObject> Page<T> findAllByIndex(Class<T> clazz, String indexName, Pageable pageable) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    @Override
    public <T extends IPOMObject> List<T> findAllByIndexAndRange(Class<T> clazz, String indexName, String range) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName);
        uri.queryParam("range", range);
        String uriString = uri.build().toUriString();
        return findAllInternal(clazz, uriString).getContent();
    }

    @Override
    public <T extends IPOMObject> Page<T> findAllByIndexAndRange(Class<T> clazz, String indexName, String range, Pageable pageable) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName);
        uri.queryParam("range", range);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    @Override
    public <T extends IPOMObject> List<T> findAllByIndexAndRangeWithTemplate(Class<T> clazz, String indexName, String range, String templateName) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName + "/" + templateName);
        uri.queryParam("range", range);
        String uriString = uri.build().toUriString();
        return findAllInternal(clazz, uriString).getContent();
    }

    @Override
    public <T extends IPOMObject> Page<T> findAllByIndexAndRangeWithTemplate(Class<T> clazz, String indexName, String range, String templateName, Pageable pageable) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/index/" + indexName + "/" + templateName);
        uri.queryParam("range", range);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    @Override
    public <T extends IPOMObject> List<T> findAllByQuery(Class<T> clazz, String qry, Map<String, Object> uriVariables) {
        return findAllByUrl(clazz, qry, uriVariables);
    }

    @Override
    public <T extends IPOMObject> List<T> findAllByQuery(Class<T> clazz, QueryDef qry, Map<String, Object> uriVariables) {
        // make the HTTP request
        String url = qry.getQueryString(uriVariables, qry.getSkip(), qry.getLimit());
        return findAllByUrl(clazz, url, uriVariables);
    }

    @Override
    public List<String> findAllUIDs(Class<? extends IPOMObject> clazz) {
        JsonCCollection<Map<String, Object>> response = jdsTemplate.getForJsonC("/data/find/" + getCollectionName(clazz) + "/uid");
        List<String> uids = new ArrayList<String>(response.getCurrentItemCount());
        for (Map item : response.getItems()) {
            uids.add(item.get("uid").toString());
        }
        return uids;
    }

    @Override
    public <T extends IPOMObject> T findOneByIndexAndRange(Class<T> clazz, String indexName, String range) {
        List<T> ret = findAllByIndexAndRange(clazz, indexName, range);
        return (ret.isEmpty()) ? null : ret.get(0);
    }

    @Override
    public <T extends IPOMObject> T findOneByQuery(Class<T> clazz, String qry, Map<String, Object> uriVariables) {
        List<T> ret = findAllByQuery(clazz, qry, uriVariables);
        return (ret.isEmpty()) ? null : ret.get(0);
    }

    @Override
    public void deleteCollectionBySystem(String domain, String system) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("system", system);
        jdsTemplate.delete("/data/collection/"+domain, params);
    }

    @Override
    public <T extends IPOMObject> T findOneByQuery(Class<T> clazz, QueryDef qry, Map<String, Object> uriVariables) {
        List<T> ret = findAllByQuery(clazz, qry, uriVariables);
        return (ret.isEmpty()) ? null : ret.get(0);
    }

    // TODO: probably should have validation out somewhere other than the DAO where it is unit-testable
    private <T extends IPOMObject> T validateOne(T val) {
        if (val instanceof Team) {
            Team t = (Team) val;
            if (t.getStaff() != null) {
                for (Team.StaffAssignment sa : t.getStaff()) {
                    String buid = sa.getBoardUid();
                    if (buid != null && !buid.equals("")) {
                        ViewDefDef vdd = findByUID(ViewDefDef.class, buid);
                        if (vdd == null) {
                            sa.setBoard(new ViewDefDef());
                        }
                    }
                }
            }
        }
        return val;
    }

    public <T extends IPatientObject> void deleteByPID(Class<T> clazz, String pid) {
        if (PatientDemographics.class.isAssignableFrom(clazz)) {
            jdsTemplate.delete("/vpr/" + pid);
        } else {
            throw new NotImplementedException();
        }
    }

    public <T extends IPatientObject> int countByPID(Class<T> clazz, String pid) {
        if (PatientDemographics.class.isAssignableFrom(clazz)) {
            throw new NotImplementedException();
        } else {
            JsonCCollection<Map<String, Object>> json = jdsTemplate.getForJsonC("/vpr/" + pid + "/count/domain");
            Set<String> domains = DomainNameUtils.getDomainsForClass(clazz);
            for (Map<String, Object> domainCount : json.getItems()) {
                if (domains.contains(domainCount.get("topic").toString())) {
                    Integer count = (Integer) domainCount.get("count");
                    return count;
                }
            }
            //throw new IllegalArgumentException("Unknown domain class '" + clazz + "'");
            return 0;//Instead of throwing an exception return zero - jds collections are dynamic.
        }
    }

    public <T extends IPatientObject> T findByUID(String uid) {
        final Class domainClassByUid = UidUtils.getDomainClassByUid(uid);
        Assert.notNull(domainClassByUid, "[Assertion failed] - couldn't find a domain class corresponding to uid=" + uid +". Check uid mappings in " + UidUtils.class.getName());
        return (T) this.findByUID(domainClassByUid, uid);
    }

    public <T extends IPatientObject> T findByUidWithTemplate(Class<T> clazz, String uid, String templateName) {
        Assert.notNull(clazz, "[Assertion failed] - the 'clazz' argument is required; it must not be null");
        Assert.hasText(uid, "[Assertion failed] - the 'uid' argument must have text; it must not be null, empty, or blank");

        String uri = "/vpr/uid/" + uid;
        if (StringUtils.hasText(templateName)) {
            uri += "/" + templateName;
        }

        if (PatientDemographics.class.isAssignableFrom(clazz)) {
            PatientDemographics patient = jdsTemplate.getForObject(PatientDemographics.class, uri);
            patient.load(this);
            return (T) patient;
        } else {
            T item = jdsTemplate.getForObject(clazz, uri);
            item.load(this);
            return item;
        }
    }

    public <T extends IPatientObject> T findByUidWithTemplate(String uid, String templateName) {
        final Class domainClassByUid = UidUtils.getDomainClassByUid(uid);
        Assert.notNull(domainClassByUid, "[Assertion failed] - couldn't find a domain class corresponding to uid=" + uid +". Check uid mappings in " + UidUtils.class.getName());
        return (T) this.findByUidWithTemplate(domainClassByUid, uid, templateName);
    }

    public <T extends IPatientObject> Page<T> findAllByPID(Class<T> clazz, String pid, Pageable page) {
//    	if(page == null)
//    		throw new IllegalArgumentException("method requires argument of type " + Pageable.class + " not to be null");

//    	QueryDef qry = new QueryDef(getDomain(clazz));
//
//    	int startRange = page.getOffset();
//    	int endRange = page.getOffset() + page.getPageSize();
//		qry.namedIndexRange(getDomain(clazz), String.valueOf(startRange), String.valueOf(endRange));
//    	qry.addCriteria(new QueryDefCriteria(getDomain(clazz));
//    	qry.addCriteria(QueryDefCriteria.where("pid").is(pid));
//    	qry.skip(page.getOffset());
//    	qry.limit(page.getPageSize());
//
//    	//pid is required to build url.
//    	HashMap<String,Object> params = new HashMap<String,Object>();
//    	params.put("pid", pid);
//
//   	List<T> ret = findAllByQuery(clazz, qry, params );
//    	/vpr/" + MOCK_PID + "/index/result?range=0..100&start=0&limit=100")).thenReturn(jsonc);
//    	String startRange = String.valueOf(page.getOffset());
//    	String endRange = String.valueOf(page.getOffset() + page.getPageSize());
//
//        T item = jdsTemplate.getForObject("/vpr/" + pid +"/index/" + getDomain(clazz) + "?" + );
        List<T> ret = findAllByUrl(clazz, "/vpr/" + pid + "/index/" + getCollectionName(clazz), new HashMap<String, Object>());
        return new PageImpl<T>(ret, page, ret.size());
    }

    public <T extends IPatientObject> List<T> findAllByPID(Class<T> clazz, String pid) {
        List<T> ret = findAllByUrl(clazz, "/vpr/" + pid + "/index/" + getCollectionName(clazz), new HashMap<String, Object>());
        return ret;
    }

    public <T extends IPatientObject> List<T> findAllByIndex(Class<T> clazz, String pid, String indexName, String start, String end, Map<String, Object> where) {
        HashMap<String, Object> params = new HashMap<String, Object>();
        if (where != null && where.size() > 0) {
            params.putAll(where);
        }
        params.put("pid", pid);
        QueryDef qryDef = new QueryDef();//no collection use index instead
        qryDef.namedIndexRange(indexName, start, end);
        return findAllByQuery(clazz, qryDef, params);
    }

    public <T extends IPatientObject> Page<T> findAllByPIDAndIndex(Class<T> clazz, String pid, String indexName, Pageable pageable) {
        Assert.hasText(pid, "[Assertion failed] - 'pid' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/" + pid + "/index/" + indexName);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    public <T extends IPatientObject> List<T> findAllByPIDIndexAndRange(Class<T> clazz, String pid, String indexName, String range) {
        Assert.hasText(pid, "[Assertion failed] - 'pid' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/" + pid + "/index/" + indexName);
        uri.queryParam("range", range);
        return findAllInternal(clazz, uri.build().toUriString()).getContent();
    }

    public <T extends IPatientObject> Page<T> findAllByPIDIndexAndRange(Class<T> clazz, String pid, String indexName, String range, Pageable pageable) {
        Assert.hasText(pid, "[Assertion failed] - 'pid' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/" + pid + "/index/" + indexName);
        uri.queryParam("range", range);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    public <T> void delete(Class<T> domainClass, T item) {
        if (item instanceof IPatientObject)
            delete((IPatientObject) item);
        else
            throw new IllegalArgumentException("'item' must implemented" + IPatientObject.class);
    }

    public <T extends IPatientObject> List<T> findAllCrossPatientByIndex(Class<T> clazz, String indexName) {
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        return findAllInternal(clazz, "/vpr/all/index/" + indexName).getContent();
    }

    public <T extends IPatientObject> Page<T> findAllCrossPatientByIndex(Class<T> clazz, String indexName, Pageable pageable) {
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/all/index/" + indexName);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    public <T extends IPatientObject> List<T> findAllCrossPatientByIndexAndRange(Class<T> clazz, String indexName, String range) {
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/all/index/" + indexName);
        uri.queryParam("range", range);
        return findAllInternal(clazz, uri.build().toUriString()).getContent();
    }

    public <T extends IPatientObject> Page<T> findAllCrossPatientByIndexAndRange(Class<T> clazz, String indexName, String range, Pageable pageable) {
        Assert.hasText(indexName, "[Assertion failed] - 'indexName' argument must have text; it must not be null, empty, or blank");

        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/vpr/all/index/" + indexName);
        uri.queryParam("range", range);
        addPaginationQueryParams(pageable, uri);
        return findAllInternal(clazz, uri.build().toUriString());
    }

    public List<Map<String, Object>> findAllByUrl(String uri) {
        JsonCCollection<Map<String, Object>> response = jdsTemplate.getForJsonC(uri);
        return (response != null) ? response.getItems() : null;
    }
}
