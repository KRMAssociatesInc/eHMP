package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.hdr.IHdrExtractDAO;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 5/7/14
 * Time: 7:11 PM
 * To change this template use File | Settings | File Templates.
 */

@Service
public class HdrPatientImportMessageHandler implements SessionAwareMessageListener {

    private IVprSyncErrorDao errorDao;
    private ISyncService syncService;
    private IHdrExtractDAO hdrExtractDao;
    private IPatientDAO patientDao;

    private static Logger log = LoggerFactory.getLogger(HdrPatientImportMessageHandler.class);

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService=syncService;
    }

    @Autowired
    public void setHdrExtractDao(IHdrExtractDAO hdrExtractDao) {
        this.hdrExtractDao=hdrExtractDao;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao=patientDao;
    }

    @Autowired
    SimpleMessageConverter converter;

    public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            final String pid = (String) msg.get(SyncMessageConstants.PATIENT_ID);
            String vistaId = (String) msg.get(SyncMessageConstants.VISTA_ID);
            String division = (String) msg.get(SyncMessageConstants.DIVISION);
            if(StringUtils.hasText(pid)) {
                PatientDemographics patientDemographics = patientDao.findByPid(pid);
                if(patientDemographics!=null) {
                    for(String domain: UidUtils.getAllPatientDataDomains()) {
                        List<VistaDataChunk> hdrData = hdrExtractDao.fetchHdrData(vistaId,division,patientDemographics,domain);
                        for (VistaDataChunk chunk : hdrData) {
                            syncService.sendImportVistaDataExtractItemMsg(chunk);
                        }
                    }
                }
            }
        } catch(Exception e) {
            log.error("Unable to extract HDR data for patient", e);
            try {
                session.recover();
            } catch (JMSException e1) {
                e1.printStackTrace();
            }
        }
    }
}
