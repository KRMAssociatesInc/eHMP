package gov.va.cpe.vpr.dao.jds;

import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.pom.jds.JdsPOMObjectDAO;
import gov.va.cpe.vpr.sync.SyncError;
import org.springframework.dao.DataRetrievalFailureException;

import java.util.HashMap;
import java.util.List;


public class JdsVprSyncErrorDao extends JdsPOMObjectDAO<SyncError> implements IVprSyncErrorDao {

    public JdsVprSyncErrorDao(IGenericPOMObjectDAO genericDao, JdsOperations jdsTemplate) {

        super(SyncError.class, genericDao, jdsTemplate);
    }

    @Override
    public List<SyncError> getAllSyncErrors() {

        return findAll();
    }

    @Override
    public Integer getErrorCountForPid(String pid) {
        return count("syncerror-pid-count", pid);
    }

    @Override
    public Integer getErrorPatientCount() {
        return count("syncerror-pid-count");
    }

    @Override
    public List<SyncError> getAllSyncErrorsForPid(String pid) {
        return findAllByUrl(SyncError.class, "/data/index/syncerror-pid?filter=eq(pid,"+pid+")", new HashMap<String, Object>());
    }

    @Override
    public SyncError getOneByJMSMessageId(String id) {
        return findOne("urn:va:syncerror:"+id);
    }

    @Override
    public long getSyncErrorCount() {
        long result = 0;

        try {
            result = count();
        }
        catch (DataRetrievalFailureException e) {
            return 0;
        }

        return result;
    }

    @Override
    public void deleteByJMSMessageId(String id) {

        delete("urn:va:syncerror:"+id);
    }

    @Override
    public void purge() {

        deleteAll();
    }
}
