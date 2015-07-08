package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.util.NullChecker;
import gov.va.vlerdas.IVlerDasPatientService;
import gov.va.vlerdas.util.VlerDasVitalsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.ArrayList;
import java.util.List;

import static gov.va.hmp.util.NullChecker.isNullish;

public class SyncDasMessageHandler extends SecondarySiteSyncMessageHandler {

    public static final String SITE_ID = VlerDasVitalsMapper.SITE_ID;
    private static final String TIMER_NAME = MessageDestinations.SYNC_DAS_QUEUE;
    private static Logger LOGGER = LoggerFactory.getLogger(SyncDasMessageHandler.class);
    
    @Override
    protected String getPid(PatientIds patientIds) {
        String pid = "";
        if (NullChecker.isNotNullish(patientIds.getIcn())) {
            pid = PidUtils.getPid(SITE_ID, patientIds.getIcn());
        }
        else if (NullChecker.isNotNullish(patientIds.getEdipi())) {
            pid = PidUtils.getPid(SITE_ID, "E" + patientIds.getEdipi());
        }
        return pid;
    }
    
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
    
    private IVlerDasPatientService vlerDasPatientService;

    @Autowired
    public void setDasPatientService(IVlerDasPatientService vlerDasPatientService) {
        this.vlerDasPatientService = vlerDasPatientService;
    }
    
    @Override
    protected List<VistaDataChunk> fetchData(PatientIds patientIds, PatientDemographics pt) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: pid: " + patientIds.getPid());
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: patient.icn: " + patientIds.getIcn());
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: patient.uid: " + patientIds.getUid());
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: patient.edipi " + patientIds.getEdipi());
        }

        List<VistaDataChunk> vistaDataChunkList = null;
        vistaDataChunkList = vlerDasPatientService.fetchVlerDasPatientData(patientIds);

        if (vistaDataChunkList != null) {
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: Received " + vistaDataChunkList.size() + " chunks(items) from VLER DAS.");
        } else {
            vistaDataChunkList = new ArrayList<>();
            LOGGER.debug("SyncDasMessageHandler.fetchVlerData: Received NO chunks(items) from VLER DAS client.");
        }

        return vistaDataChunkList;
    }
    
    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SyncDasMessageHandler.onMessage().  Entering method...");
        }
        super.onMessage(message, session);
    }

    @Override
    protected String getUid(PatientIds patientIds) {
        if (patientIds == null || isNullish(patientIds.getIcn())) {
            throw new IllegalArgumentException("patientIds cannot be null and must have an icn");
        }
        return "urn:va:patient:" + SITE_ID + ":" + patientIds.getIcn();
    }

}
