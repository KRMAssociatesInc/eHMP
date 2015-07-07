package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.VLERDocument;
import gov.va.cpe.vpr.VLERDocumentAuthor;
import gov.va.cpe.vpr.VLERDocumentSection;
import gov.va.cpe.vpr.VLERDocumentTemplateId;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.jmeadows.IJMeadowsPatientService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.pom.POMUtils.convertObjectToNode;
import static gov.va.hmp.util.NullChecker.isNullish;

public class SyncDodMessageHandler extends SecondarySiteSyncMessageHandler {

    public final static String SITE_ID = "DOD";
    public static final String TIMER_NAME = MessageDestinations.SYNC_DOD_QUEUE;
    private static Logger LOGGER = LoggerFactory.getLogger(SyncDodMessageHandler.class);
    
    @Override
    protected String getPid(PatientIds patientIds) {
        return PidUtils.getPid(SITE_ID, patientIds.getEdipi());
    }
    
    private IJMeadowsPatientService jMeadowsPatientService;

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
    public void setJMeadowsPatientService(IJMeadowsPatientService jMeadowsPatientService) {
        this.jMeadowsPatientService = jMeadowsPatientService;
    }

    /**
     * Retrieves patient DoD data from jMeadows.
     * @param patientIds PatientIds instance.
     * @return List of DoD data (mapped as VistaDataChunks).
     */
    @Override
    protected List<VistaDataChunk> fetchData(PatientIds patientIds, PatientDemographics pt) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: JMeadows is enabled - checking JMeadows for data now.");
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: pid: " + patientIds.getPid());
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: patient.icn: " + patientIds.getIcn());
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: patient.uid: " + patientIds.getUid());
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: patient.edipi " + patientIds.getEdipi());
        }

        List<VistaDataChunk> vistaDataChunkList = jMeadowsPatientService.fetchDodPatientData(patientIds);

        //This chunk is for testing US2319. Its purpose is to ensure VLERDocuments can be stored properly in JDS.
        //This is temporary and will be removed in the future.
        /*
        VistaDataChunk vlerDocumentTestChunk = createVLERDocumentTestChunk();
        vistaDataChunkList.add(vlerDocumentTestChunk);
        */
        
        if (vistaDataChunkList != null) {
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: Received " + vistaDataChunkList.size() + " chunks(items) from JMeadows.");
        } else {
            LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: Received NO chunks(items) from JMeadows.");
        }

        LOGGER.debug("VistaPatientDataService.fetchJMeadowsDodData: JMeadows is enabled - done checking JMeadows for data.");

        return vistaDataChunkList;
    }
    
    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SyncDodMessageHandler.onMessage().  Entering method...");
        }
        super.onMessage(message, session);
    }

    @Override
    protected String getUid(PatientIds patientIds) {
        if (patientIds == null || isNullish(patientIds.getEdipi())) {
            throw new IllegalArgumentException("patientIds cannot be null and must have an edipi");
        }
        return "urn:va:patient:" + SITE_ID + ":" + patientIds.getEdipi();
    }

    private VistaDataChunk createVLERDocumentTestChunk()
    {
    	//Create templateIds
    			//Map<String, String> templateIds = new HashMap<String, String>();
    			Map<String, Object> templateIdMap = new HashMap<String, Object>();
    			templateIdMap.put("root", "15");
    			VLERDocumentTemplateId templateId = new VLERDocumentTemplateId(templateIdMap);
    			//templateIds.put("root", "15");
    			
    			List<VLERDocumentTemplateId> templateIds = new ArrayList<VLERDocumentTemplateId>();
    			templateIds.add(templateId);
    			
    			//Create JdsCode
    			JdsCode code = new JdsCode();
    			code.setCode("16");
    			code.setSystem("17");
    			code.setDisplay("18");
    			
    			//Create VLERDocumentSection		
    			Map<String, Object> sectionMap = new HashMap<String, Object>();
    			//sectionMap.put("templateIds", templateIds);
    			sectionMap.put("templateIds", templateIds);
    			sectionMap.put("code", code);
    			sectionMap.put("title", "19");
    			sectionMap.put("text", "20");
    			VLERDocumentSection section = new VLERDocumentSection(sectionMap);

    			//Create VLERDocumentAuthor
    			Map<String, Object> authorMap = new HashMap<String, Object>();
    			authorMap.put("institution", "6");
    			authorMap.put("name", "7");
    			VLERDocumentAuthor author = new VLERDocumentAuthor(authorMap);
    			
    			//Create VLERDocument
    			List<VLERDocumentAuthor> authorList = new ArrayList<VLERDocumentAuthor>();
    			authorList.add(author);
    			List<VLERDocumentSection> sectionList = new ArrayList<VLERDocumentSection>();
    			sectionList.add(section);
    			
    			PointInTime time = new PointInTime(2014,8,8,8,8,8);
    			
    			Map<String, Object> documentMap = new HashMap<String, Object>();
    			documentMap.put("uid", "urn:va:vlerdocument:DOD:0000000003:1900000522");
    			documentMap.put("pid", "DOD;0000000003");
    			documentMap.put("localId", "1900000522");
    			documentMap.put("kind", "vlerdocument");
    			//documentMap.put("summary", "5"); //Already generated by superclass???
    			documentMap.put("authorList", authorList);
    			documentMap.put("creationTime", time);
    			documentMap.put("documentUniqueId", "9");
    			documentMap.put("homeCommunityId", "10");
    			documentMap.put("mimeType", "11");
    			documentMap.put("name", "12");
    			documentMap.put("repositoryUniqueId", "13");
    			documentMap.put("sourcePatientId", "14");
    			documentMap.put("sections", sectionList);
    			
    			VLERDocument v = new VLERDocument(documentMap);
    	
    			VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk("DOD", "vrpcb://DOD/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", convertObjectToNode(v), "vlerdocument", 0, 1);
    			
    			return chunk;
    }
}
