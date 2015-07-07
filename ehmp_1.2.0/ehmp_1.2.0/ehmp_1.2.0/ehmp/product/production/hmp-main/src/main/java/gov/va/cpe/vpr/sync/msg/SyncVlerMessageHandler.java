package gov.va.cpe.vpr.sync.msg;


import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.jmeadows.IJMeadowsPatientService;
import gov.va.nhin.vler.service.IVlerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.List;

import static gov.va.hmp.util.NullChecker.isNullish;

public class SyncVlerMessageHandler extends SecondarySiteSyncMessageHandler {

    public final static String SITE_ID = "VLER";
    public static final String TIMER_NAME = MessageDestinations.SYNC_VLER_QUEUE;
    private static Logger LOGGER = LoggerFactory.getLogger(SyncVlerMessageHandler.class);
    
    @Override
    protected String getPid(PatientIds patientIds) {
        return PidUtils.getPid(SITE_ID, patientIds.getIcn());
    }
    
    private IVlerService vlerService;

    @Override
    protected String getSiteId() {
        return SITE_ID;
    }

    @Override
    protected String getTimerName() {
        return TIMER_NAME;
    }

    @Override
    protected Logger getLogger() {
        return LOGGER;
    }

    @Override
    protected void setLogger(Logger theLogger) {
        LOGGER = theLogger;
    }

    @Autowired
    public void setVlerService(IVlerService vlerService) {
        this.vlerService = vlerService;
    }

    /**
     * Retrieves patient VLER data from jMeadows.
     * @param patientIds PatientIds instance.
     * @return List of VLER data (mapped as VistaDataChunks).
     */
    @Override
    protected List<VistaDataChunk> fetchData(PatientIds patientIds, PatientDemographics pt) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("VistaPatientDataService.fetchVlerData: VLER is enabled - checking VLER for data now.");
            LOGGER.debug("VistaPatientDataService.fetchVlerData: pid: " + patientIds.getPid());
            LOGGER.debug("VistaPatientDataService.fetchVlerData: patient.icn: " + patientIds.getIcn());
            LOGGER.debug("VistaPatientDataService.fetchVlerData: patient.uid: " + patientIds.getUid());
        }

        List<VistaDataChunk> vistaDataChunkList = vlerService.fetchVlerData(patientIds);

        if (vistaDataChunkList != null) {
            LOGGER.debug("VistaPatientDataService.fetchVlerData: Received " + vistaDataChunkList.size() + " chunks(items) from VLER.");
        } else {
            LOGGER.debug("VistaPatientDataService.fetchVlerData: Received NO chunks(items) from VLER.");
        }

        LOGGER.debug("VistaPatientDataService.fetchVlerData: VLER is enabled - done checking VLER for data.");

        return vistaDataChunkList;
    }

    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SyncVlerMessageHandler.onMessage().  Entering method...");
        }
        super.onMessage(message, session);
    }

    @Override
    protected String getUid(PatientIds patientIds) {
        if (patientIds == null || isNullish(patientIds.getIcn())) {
            throw new IllegalArgumentException("patientIds cannot be null and must have an ICN");
        }
        return "urn:va:patient:" + SITE_ID + ":" + patientIds.getIcn();
    }
}
