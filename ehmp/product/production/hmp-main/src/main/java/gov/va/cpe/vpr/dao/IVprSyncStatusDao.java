package gov.va.cpe.vpr.dao;

import gov.va.cpe.vpr.pom.IPOMObjectDAO;
import gov.va.cpe.vpr.sync.SyncStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.List;

public interface IVprSyncStatusDao extends IPOMObjectDAO<SyncStatus> {
    SyncStatus findOneByPid(String pid);

    int countLoadingPatients();
    int countLoadedPatients();

    SyncStatus findOneForOperational();

    List<SyncStatus> findAllLoadingPatientStatii();
    List<SyncStatus> findAllPatientStatii();
    Page<SyncStatus> findAllPatientStatii(Pageable pageable);

    public SyncStatus saveMergeSyncStatus(SyncStatus syncStatus, HashSet<String> overwriteErrorMessageSitesList);
    List<String> listLoadingPatientIds();
    void delete(String pid, String vistaId);
    void reset(String pid, String vistaId);
    
}
