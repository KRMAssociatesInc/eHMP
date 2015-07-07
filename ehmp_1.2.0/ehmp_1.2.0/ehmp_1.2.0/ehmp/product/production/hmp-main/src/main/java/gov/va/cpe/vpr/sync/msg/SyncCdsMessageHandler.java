package gov.va.cpe.vpr.sync.msg;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.PATIENT_DFN;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.PATIENT_ICN;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.VISTA_ID;
import static gov.va.hmp.util.NullChecker.isNotNullish;
import static gov.va.hmp.util.NullChecker.isNullish;

import com.fasterxml.jackson.databind.JsonNode;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.cpe.vpr.util.ConnectionBuilder;
import gov.va.hmp.HmpProperties;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataRetrievalFailureException;

public class SyncCdsMessageHandler extends SecondarySiteSyncMessageHandler implements EnvironmentAware {

    public static final String SITE_ID = "CDS";
    private static final String TIMER_NAME = MessageDestinations.SYNC_CDS_QUEUE;
    private static Logger LOGGER = LoggerFactory.getLogger(SyncCdsMessageHandler.class);
    
    @Override
    protected String getPid(PatientIds patientIds) {
        return PidUtils.getPid(SITE_ID, patientIds.getIcn());
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

    private String hdrBaseUrl;
    private boolean hdrSsl;
    private String hdrUrlStyle;

    @Override
    protected List<VistaDataChunk> fetchData(PatientIds patientIds, PatientDemographics pt) throws Exception{
        LOGGER.debug("SyncCdsMessageHandler.fetchData(patientIds).  Entering method...");

        if (patientIds == null) {
            LOGGER.error("SyncCdsMessageHandler.fetchData called with null PatientIds.  No CDS data will be fetched.");
            return null;
        }

        if (pt != null) {
            LOGGER.debug("Fetching CDS data for patient: " + pt.toJSON());
            return fetchHdrData("500", pt);
        }
        else {
            LOGGER.debug("No patient was found for pid: : " + getPid(patientIds) + ".  No CDS data will be fetched.");
            return null;
        }
    }

    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SyncCdsMessageHandler.onMessage().  Entering method...");
        }
        super.onMessage(message, session);
    }
        
    private List<VistaDataChunk> fetchHdrData(String division, PatientDemographics pt) throws Exception{
        LOGGER.debug("SyncCdsMessageHandler.fetchHdrData(division, pt).  Entering method...  Division: " + division);
        List<VistaDataChunk> chunks = new LinkedList<VistaDataChunk>();
        for (String domain : UidUtils.getAllPatientDataDomains()) {
            chunks.addAll(fetchHdrData(division, pt, domain));
        }
        LOGGER.debug("SyncCdsMessageHandler.fetchHdrData(division, pt).  Leaving method...  Returning " + chunks.size() + " chunks ");
        return chunks;
    }

    
    private List<VistaDataChunk> fetchHdrData(String division, PatientDemographics pt, String domain) throws Exception {
        LOGGER.debug("fetchHdrData: fetching " + domain + " data for patient " + pt.getIcn() + "; request originates from division=" + division + ".");
        List<VistaDataChunk> rslt = new ArrayList<VistaDataChunk>();
        // BH: Timestamp format used here is according to HDR specification.
        String composedUrl = hdrBaseUrl + domain + "?_type=json&max=100&clientName=HMP&clientRequestInitiationTime=" + new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date())
                             + "&nationalId=" + pt.getIcn() + "&excludeIdentifier=" + pt.getPid() + "-" + division + "-USVHA"
                             + "&requestId=65756756&templateId=GenericObservationRead1&filterId=GENERIC_VISTA_LIST_DATA_FILTER";
        if (isNotNullish(hdrUrlStyle) && hdrUrlStyle.equalsIgnoreCase("old")) {
            composedUrl = hdrBaseUrl + "GenericObservationRead1/GENERIC_VISTA_LIST_DATA_FILTER/" + pt.getIcn() + "/" + domain 
                          + "?_type=json&max=100&clientName=HMP&excludedAssigningFacility=" + division + "&excludedAssigningAuthority=USVHA&requestId=65756756";
        }
        if (hdrSsl) {
            LOGGER.debug("fetchHdrData: using https connection and URL: " + composedUrl);
        } else {
            LOGGER.debug("fetchHdrData: using http connection and URL: " + composedUrl);
        }

        URL url = new URL(composedUrl);
        HttpURLConnection conn = null;
        if (hdrSsl) {
            conn = ConnectionBuilder.createConnection(url);
        } else {
            conn = (HttpURLConnection) url.openConnection();
        }
        if (conn == null) {
            LOGGER.warn("fetchHdrData: failed to create connection to " + composedUrl);
            return rslt;
        }
        if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
            LOGGER.warn("fetchHdrData: unexpected response code from CDS connection: " + conn.getResponseCode() + " " + conn.getResponseMessage());
            return rslt;
        }
        
        InputStream inputstream = conn.getInputStream();
        
        JsonNode node = POMUtils.parseJSONtoNode(inputstream);
        LOGGER.debug("fetchHdrData: json node contents: " + node.toString());
        rslt = createVistaDataChunks(composedUrl, node, domain, pt, null);
        LOGGER.debug("fetchHdrData: rslt contains " + rslt.size() + " chunks.");
        
        try{
            inputstream.close();
        } catch (IOException e) {
            LOGGER.error("fetchHdrData: Possible resource leak--Failed to close Input Stream", e);
        }
        
		return rslt;
    }

    private List<VistaDataChunk> createVistaDataChunks(String rpcUri, JsonNode jsonResponse, String domain, PatientDemographics pt, Map processorParams) {
        LOGGER.debug("createVistaDataChunks: entering method.");

        List<VistaDataChunk> chunks = new LinkedList<VistaDataChunk>();

        // Check to see if jsonResponse contains an array of sites.
        JsonNode sitesNode = jsonResponse.path("sites");
        if (sitesNode.isArray()) {
            LOGGER.debug("createVistaDataChunks: parsing an array of sites.");
            for (JsonNode site : sitesNode) {
                chunks.addAll(createVistaDataChunks(rpcUri, site, domain, pt, processorParams));
            }
        } else {
            JsonNode itemsNode = jsonResponse.path("data").path("items");
            if (itemsNode.isNull()) {
                String message = "missing 'data.items' node in JSON RPC response";
                LOGGER.warn("createVistaDataChunks: " + message);
                throw new DataRetrievalFailureException(message);
            }

            for (int i = 0; i < itemsNode.size(); i++) {
                LOGGER.debug("createVistaDataChunks: processing chunk " + Integer.toString(i+1) + " of " + itemsNode.size());
                JsonNode item = itemsNode.get(i);
                String vistaId = UidUtils.getSystemIdFromPatientUid(item.path("uid").asText());
                if (processorParams == null) {
                    processorParams = getProcessorParams(vistaId, pt.getPid(), pt.getIcn() != null);
                }
                chunks.add(VistaDataChunk.createVistaDataChunk(vistaId, rpcUri, item, domain, i, itemsNode.size(), pt, processorParams));
            }
        }

        return chunks;
    }

    private Map getProcessorParams(String vistaId, String pid, boolean icn) {
        Map m = new LinkedHashMap();
        m.put(VISTA_ID, vistaId);
        if (icn)
            m.put(PATIENT_ICN, pid);
        else
            m.put(PATIENT_DFN, pid);
        return m;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.hdrBaseUrl = environment.getProperty(HmpProperties.HDR_BASEURL);
        if(hdrBaseUrl==null) {
            hdrBaseUrl = "https://serverserver.server.domain.ext/repositories.domain.ext/fpds/";
        }
        this.hdrSsl = hdrBaseUrl.startsWith("https");
        this.hdrUrlStyle = environment.getProperty(HmpProperties.HDR_URLSTYLE);
    }

    @Override
    protected String getUid(PatientIds patientIds) {
        if (patientIds == null || isNullish(patientIds.getIcn())) {
            throw new IllegalArgumentException("patientIds cannot be null and must have an icn");
        }
        return "urn:va:patient:" + SITE_ID + ":" + patientIds.getIcn();
    }

}
