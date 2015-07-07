package gov.va.cpe.vpr.sync;

import com.google.gson.JsonObject;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.jms.JMSException;

import org.apache.solr.client.solrj.SolrServerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Service responsible for dispatching sync messages via JMS for processing by JMS listeners.
 */
public interface ISyncService {
    void sendImportVistaDataExtractItemMsg(VistaDataChunk item);

    void retryMsg(Map msg);
    void sendReindexPatientMsg(PatientDemographics pt);
    void sendReindexPatientMsg(String pid);
    void sendReindexAllPatientsMsg();
    void sendClearPatientMsg(PatientDemographics pt);
    void sendClearPatientMsg(String pid);
    void sendClearItemMsg(String uid);
    void sendClearAllPatientsMsg();
    void sendHdrPatientImportMsg(String pid, String division, String vistaId);
    void sendUpdateVprCompleteMsg(String serverId, String vistaId, String lastUpdate, Map<String, Set<String>> domainsByPatientId);
    void errorDuringMsg(Map msg, Throwable t, String level);

    long getSynchingPatientCount();
    long getOperationalImportQueueSize(); // consider moving this to SyncStats class?
    long getCommandQueueSize(); // consider moving this to SyncStats class?
    void cancelPendingMessages();
	Object getCommandQueueDetail();

    Page<SyncError> findAllErrors(Pageable pageable, Boolean includeWarnings, String searchString, String searchAreas);
    Page<SyncError> findAllErrors(Pageable pageable, Boolean includeWarnings, String searchString);
    List<SyncError> findAllErrors();
    List<SyncError> findAllErrors(Sort sort);
    Page<SyncError> findAllErrors(Pageable pageable);
    void deleteAllErrors();
    void deleteError(String id);
    void deleteError(SyncError err);
    long getErrorCount();
    SyncError findOneError(String id);
    int deleteErrorByPatientId(String pid);
    Page<SyncError> findAllErrorsByPatientId(String pid, Pageable pageable);
    Integer getPatientErrorCount(String pid);
    Integer getNumPatientsWithErrors();
    ArrayList<Map<String, Object>> getPatientQueueSizes() throws JMSException;

    void redeliverDeadLetter(String recId);

    void subscribePatient(String vistaId, String pid);
    void subscribePatient(String vistaId, PatientDemographics pt);
    void subscribePatient(JsonObject mvi, String pid, String edipi);
	void subscribePatient(String prioritySelect, List<String> sitesToSync, String pid);
    
    boolean isNotLoadedAndNotLoading(String pid);

    void subscribeOperational(String vistaId);

    boolean isOperationalSynching();

    void resetServerSubscriptions(String vistaId);

    SyncStatus getOperationalSyncStatus();
    SyncStatus getPatientSyncStatus(String pid);

    void setReindexAllComplete(boolean reindexComplete);
    boolean isReindexAllComplete();

    Map<String, Integer> getIndexAndJdsPatientCounts() throws SolrServerException;

    boolean isDataStreamEnabled();

    void setDataStreamEnabled(boolean b, String disabledMsg, Exception disabledException);

    Map<String, Object> getDataStreamErrorDetails();
    
    void expireSite(String pid, String vistaId, PointInTime time);


}
