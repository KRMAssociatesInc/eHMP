package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.SiteAndPid;
import gov.va.hmp.healthtime.PointInTime;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.JsonObject;

/**
 * API to the VPR extract event stream in VistA.
 */
public interface IVistaVprDataExtractEventStreamDAO {
    /**
     * Interface to <code>VPR GET VERSION</code> Remote Procedure Call.
     * @param vistaId
     * @return
     */
    String fetchVprVersion(String vistaId);
    VistaDataChunk fetchPatientDemographicsWithDfn(String vistaId, String ptDfn);
    VistaDataChunk fetchPatientDemographicsWithIcn(String vistaId, String ptIcn);
    VistaDataChunk fetchOneByUid(String vistaId, String pid, String uid);

    void subscribePatient(String vistaId, String pid, boolean cascade);
    void subscribePatient(JsonObject mvi, String pid, String edipi);
	void subscribePatient(String prioritySelect, List<String> sitesToSync,
			String pid);
	
    void unsubscribePatient(String vistaId, String pid, boolean cascade,boolean resetSync);
    void unsubscribePatient(String vistaId, PatientDemographics pt, boolean cascade);
    public JsonNode getVistaHealthCheck(String vistaId, String division);

    VprUpdateData fetchUpdates(String vistaId, String division, String lastUpdate);

    List<SiteAndPid> getPatientVistaSites(String pid);

    void processPatientsWithAppointments(String vistaId);

    void expireSite(String pid, String vistaId, PointInTime time);

}