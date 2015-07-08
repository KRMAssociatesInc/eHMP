package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.util.NullChecker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.*;

public class JdsPatientDAO extends JdsPatientObjectDAO<PatientDemographics> implements IPatientDAO {
    static final Logger logger = LoggerFactory.getLogger(JdsPatientDAO.class);

    @Override
    public int count() {
        JsonCCollection<Map<String, Object>> jsonC = jdsTemplate.getForJsonC("/vpr/all/count/patient");
        if (jsonC.getItems().size() == 0) {
            return 0;
        }
        Map<String, Object> topicCount = jsonC.getItems().get(0);
        return (Integer) topicCount.get("count");
    }

	public JdsPatientDAO() {
        super(PatientDemographics.class);
    }

    @Override
    public PatientDemographics findByIcn(String icn) {
        if (StringUtils.isEmpty(icn)) return null;
        return jdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + icn);
    }

    @Override
    public PatientDemographics findByPid(String pid) {
        if (StringUtils.isEmpty(pid)) return null;
        PatientDemographics pt = jdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + pid);
        if (!isLoaded(pt)) return null;
        return pt;
    }

    @Override
    public List<PatientDemographics> findListByPid(String pid) {
        if (StringUtils.isEmpty(pid)) return null;
        //HMP S64 MERGE NOTE: This now has a check for loaded - this caused us problems previously
        List<PatientDemographics> pt = jdsTemplate.getForList(PatientDemographics.class, "/vpr/mpid/" + pid);
        if (!isLoaded(pt)) return null;
        return pt;
    }

    @Override
    public PatientDemographics findByUid(String uid) {
        if (StringUtils.isEmpty(uid)) return null;
        PatientDemographics pt = jdsTemplate.getForObject(PatientDemographics.class, "/vpr/uid/" + uid);
        if (!isLoaded(pt)) return null;
        return pt;
    }

    @Override
    public PatientDemographics findByLocalId(String systemOrFacilityCode, String localPatientId) {
        if (StringUtils.isEmpty(localPatientId)) return null;

        String pid = getQualifiedDfn(systemOrFacilityCode, localPatientId);
        PatientDemographics pt = jdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + pid);
        if (!isLoaded(pt)) return null;
        return pt;
    }

    private boolean isLoaded(PatientDemographics pt) {
        return (pt != null);
    }

    private boolean isLoaded(List<PatientDemographics> oaPt) {
        return (NullChecker.isNotNullish(oaPt));
    }

    private String getQualifiedDfn(String vistaIdOrFacilityCode, String dfn) {
        return vistaIdOrFacilityCode + PidUtils.SEPARATOR + dfn;
    }

    @Override
    public Page<PatientDemographics> findAll(Pageable pageable) {
        return genericDao.findAll(PatientDemographics.class, pageable);
    }

    @Override
    public List<String> listLoadedPatientIds() {
        JsonCCollection<Map<String, Object>> jsonC = jdsTemplate.getForJsonC("/data/index/status-loaded");
        ArrayList<String> rslt = new ArrayList<String>();
        for (Map<String, Object> pt : jsonC.getItems()) {
            if (pt.containsKey("pid")) {
                String pid = pt.get("pid").toString();
                if (StringUtils.hasText(pid))
                    rslt.add(pid);
            }
        }
        return rslt;
    }

    @Override
    public Map<String, Object> getSynchedCollectionCounts(String pid) {
        Map<String, Object> rslt = new HashMap<>();
        JsonCCollection<Map<String, Object>> jsonc = jdsTemplate.getForJsonC("/vpr/"+pid+"/count/collection");
        if (jsonc == null) {
            return rslt;
        }
        for(Map<String, Object> row: jsonc.getItems()) {
            String key = row.get("topic").toString();
            Integer value = Integer.valueOf(row.get("count").toString());
            rslt.put(key, value);
        }
        return rslt;
    }

    @Override
    public PatientDemographics save(PatientDemographics pt) {
        return genericDao.save(pt);
        // HMP S64 MERGE NOTE:  The following is previous code.  Not sure if the save works
        //                      properly.  Here is the old code in case.
        // pt.setLastUpdated(PointInTime.now());
        // genericDao.save(pt);
        // return this.findDemographicsByVprUid(pt.getUid());
    }

    @Override
    public PatientDemographics save(String pid, PatientDemographics pt) {

        if (NullChecker.isNullish(pid) ||  pt == null){
            return null;
        }

        jdsTemplate.postForLocation("/vpr/"+pid, pt);

        return pt;
    }

}
