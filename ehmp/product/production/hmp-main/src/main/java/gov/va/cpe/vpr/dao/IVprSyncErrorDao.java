package gov.va.cpe.vpr.dao;

import gov.va.cpe.vpr.sync.SyncError;

import java.util.List;

public interface IVprSyncErrorDao {
	public SyncError save(SyncError error);
    List<SyncError> getAllSyncErrors();
    Integer getErrorCountForPid(String pid);
    Integer getErrorPatientCount();
    List<SyncError> getAllSyncErrorsForPid(String pid);
    SyncError getOneByJMSMessageId(String id);
    long getSyncErrorCount();
    void deleteByJMSMessageId(String id);
    void purge();
}
