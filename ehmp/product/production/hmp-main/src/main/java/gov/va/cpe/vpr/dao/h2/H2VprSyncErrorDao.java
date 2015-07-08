package gov.va.cpe.vpr.dao.h2;

import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.sync.SyncError;
import org.h2.mvstore.MVMap;
import org.h2.mvstore.MVStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class H2VprSyncErrorDao implements IVprSyncErrorDao {

	public H2VprSyncErrorDao(String errorMvstorePath) {
        this.errorMvstorePath = errorMvstorePath;
    }

    private static Logger log = LoggerFactory.getLogger(H2VprSyncErrorDao.class);

    private final String errorMvstorePath;

    private MVStore syncStatusStore = null;


    @Override
    public synchronized SyncError save(SyncError error) {
        MVMap<String, SyncError> map = getSyncStatusStore().openMap("error");
        map.put(error.getId(), error);
        if(error.getPid()!=null) {
            MVMap<String, ArrayList<SyncError>> patmap = getSyncStatusStore().openMap("error_by_pid");
            ArrayList<SyncError> paterrors = patmap.get(error.getPid());
            if(paterrors==null) {paterrors = new ArrayList<>();  patmap.put(error.getPid(), paterrors);}
            paterrors.add(error);
        }
        getSyncStatusStore().commit();
        return error;
    }

    @Override
    public List<SyncError> getAllSyncErrors() {
        List<SyncError> rslt = new ArrayList<>();
        MVMap<String, SyncError> errorMap = getSyncStatusStore().openMap("error");
        for(String key: errorMap.keySet()) {
            rslt.add(errorMap.get(key));
        }
        return rslt;
    }

    @Override
    public Integer getErrorCountForPid(String pid) {
        ArrayList<SyncError> errs = getPatMap().get(pid);
        if(errs==null) {
            return 0;
        }
        return errs.size();
    }

    @Override
    public Integer getErrorPatientCount() {
        return getPatMap().keySet().size();
    }

    @Override
    public List<SyncError> getAllSyncErrorsForPid(String pid) {
        List<SyncError> rslt = getPatMap().get(pid);
        if(rslt==null) {rslt = new ArrayList<>();}
        return rslt;
    }

    @Override
    public SyncError getOneByJMSMessageId(String id) {
        return getJMSMap().get(id);  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public long getSyncErrorCount() {
        return getJMSMap().size();  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void deleteByJMSMessageId(String id) {
        SyncError err = getJMSMap().remove(id);

        if(err!=null && err.getPid()!=null) {
            getPatMap().get(err.getPid()).remove(err);
            syncStatusStore.commit();
        }
    }

    @Override
    public void purge() {
        getPatMap().clear();
        getJMSMap().clear();
    }

    private MVStore getSyncStatusStore() {
        synchronized(this) {
            if(syncStatusStore ==null) {
                try {
                    syncStatusStore = MVStore.open(errorMvstorePath);
                    syncStatusStore.openMap("error_by_pid");
                    syncStatusStore.openMap("error");
                } catch(Exception e) {
                    e.printStackTrace();
                    File f = new File(errorMvstorePath);
                    if(f.exists()) {
                        f.delete();
                        try {
                            syncStatusStore = MVStore.open(errorMvstorePath);
                            syncStatusStore.openMap("error_by_pid");
                            syncStatusStore.openMap("error");
                        } catch(Exception ex) {
                            e.printStackTrace();
                            log.error("Error initializing VPR sync error store at path: "+errorMvstorePath+"; Defaulting to in-memory store (will not be persisted)", e);
                            syncStatusStore = MVStore.open(null);
                        }
                    }
                }
            }
        }
        return syncStatusStore;
    }

    private MVMap<String, ArrayList<SyncError>> getPatMap() {
        MVMap<String, ArrayList<SyncError>> patMap = getSyncStatusStore().openMap("error_by_pid");
        return patMap;
    }

    private MVMap<String, SyncError> getJMSMap() {
        return getSyncStatusStore().openMap("error");
    }

}
