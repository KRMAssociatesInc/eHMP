package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentText;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.jmeadows.util.document.IDodDocumentService;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.Future;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Note Retriever Service
 */
@Service
public class JMeadowsConsultNoteService implements IJMeadowsConsultNoteService {

    public static final String DOMAIN_DOCUMENT = "document";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsNoteService.class);
    private JMeadowsData jMeadowsClient;

    private IDodDocumentService dodDocumentService;
    private Boolean dodDocServiceEnabled;

    /**
     * Constructs a JMeadowsClinicalNoteService instance.
     */
    @Autowired
    public JMeadowsConsultNoteService(JMeadowsConfiguration jMeadowsConfiguration) {
        jMeadowsClient = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);
        dodDocServiceEnabled = jMeadowsConfiguration.isDodDocServiceEnabled();
    }

    @Autowired
    public void setDodDocumentService(IDodDocumentService dodDocumentService) {
        this.dodDocumentService = dodDocumentService;
    }

    /**
     * Sets JMeadowsClient
     *
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient) {
        this.jMeadowsClient = jMeadowsClient;
    }

    /**
     * This routine will calculate the total number of consults that are in the result set.  It does this by
     * counting all the consults that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaConsults The list of consults returned.
     * @return The number of consults that are from a DoD site.
     */
    private int calculateNumConsults(List<Consult> oaConsults) {
        int iNumNotes = 0;

        if ((oaConsults != null) && (oaConsults.size() > 0)) {
            iNumNotes = oaConsults.size();
        }

        return iNumNotes;
    }

    /**
     * Retrieve the clinical note data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param oQuery      JMeadows oQuery bean.
     * @param oPatientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the clinical notes data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception
     *                                  If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodConsults(JMeadowsQuery oQuery, PatientIds oPatientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsClinicalNoteService.fetchDodNotes - Entering method...");

        validateParams(oQuery, oPatientIds, USER, PATIENT);

        List<VistaDataChunk> oaDocumentChunk = new ArrayList<>();

        List<Consult> oConsults = jMeadowsClient.getPatientConsultRequests(oQuery);

        if (LOG.isDebugEnabled() && oConsults != null) {
            LOG.debug("JMeadowsConsultNoteService.fetchDodConsults: " +
                    ((oConsults == null) ? "NO" : "" + oConsults.size()) +
                    " results retrieved from JMeadows.");
        }

        if ((oConsults != null) && (oConsults.size() > 0)) {

            //remove DoD adaptor status report
            oConsults = (List<Consult>) filterOnSourceProtocol(oConsults, SOURCE_PROTOCOL_DODADAPTER);

            int iNumNotes = calculateNumConsults(oConsults);

            Map<Document, Future<Document>> queuedDodDocumentServiceRequestMap = new LinkedHashMap<>();


            //transform jMeadows progress note into VPR documents
            List<Document> oaVprDocuments = new ArrayList<>();
            for (Consult oConsult : oConsults) {
                LOG.debug("JMeadowsConsultNoteService.fetchDodConsults: Found DoD consult note - Transforming it...");
                Document oVprDocument = transformConsult(oConsult, "DOD", oPatientIds.getEdipi());

                if (oVprDocument != null) {

                    //queue DoD document processing request if dod document service enabled flag is true
                    if (dodDocServiceEnabled &&
                            StringUtils.isNotBlank(oConsult.getComplexDataUrl())) {
                        Future<Document> documentFuture = queueRTFDocumentServiceRequest(oConsult.getComplexDataUrl(),
                                oPatientIds, getEventId(oVprDocument.getUid()), oVprDocument);

                        queuedDodDocumentServiceRequestMap.put(oVprDocument, documentFuture);
                    }
                    //plain-text notes get immediately added to list
                    else {
                        //inform user that DoD document service is disabled.
                        if (StringUtils.isNotBlank(oConsult.getComplexDataUrl())) {
                            oVprDocument.setData("dodComplexNoteUri",
                                    "Complex note unavailable: DoD Document Service is disabled.");
                        }

                        oaVprDocuments.add(oVprDocument);
                    }
                }

            }

            //block until all RTF documents are finished processing
            //TODO perform processing and JDS caching of RTF documents in separate queue
            for (Map.Entry<Document, Future<Document>> entry : queuedDodDocumentServiceRequestMap.entrySet())

                try {
                    LOG.debug("Processing DoD RTF for document with UID: " + entry.getKey().getUid());
                    Future<Document> future = entry.getValue();
                    Document oVprDocument = future.get();
                    oaVprDocuments.add(oVprDocument);
                } catch (Exception e) {

                    //retain note without plain-text or link to HTML rendering.
                    oaVprDocuments.add(entry.getKey());

                    LOG.error("An error occurred while processing DoD RTF note. The note text and attached note will be excluded from result.::" + e.getMessage(), e);
                }

            //transform VPR document to JSON
            int iCurNoteIdx = 1;        // One based index

            for (Document oVprDocument : oaVprDocuments) {
                LOG.debug("JMeadowsProgressNoteService.fetchDodConsults: Found DoD consult note - Processing it... idx: " + iCurNoteIdx);
                VistaDataChunk oNoteChunk = transformDocumentChunk(oVprDocument, oPatientIds, iNumNotes, iCurNoteIdx);
                if (oNoteChunk != null) {
                    oaDocumentChunk.add(oNoteChunk);
                    iCurNoteIdx++;
                }
            }
        }

        return oaDocumentChunk;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this note.
     *
     * @param oVprDocument The VPR Document transformation.
     * @param oPatientIds  Patient identifiers.
     * @param iNumNotes    The number of notes
     * @param iCurNoteIdx  The index of this note in the list.
     * @return The VistaDataChunk for this note.
     */
    private VistaDataChunk transformDocumentChunk(Document oVprDocument, PatientIds oPatientIds, int iNumNotes, int iCurNoteIdx) {
        LOG.debug("JMeadowsConsultNoteService.transformDocumentChunk - Entering method...");
        VistaDataChunk oDocumentChunk = new VistaDataChunk();

        oDocumentChunk.setBatch(false);
        oDocumentChunk.setDomain(DOMAIN_DOCUMENT);
        oDocumentChunk.setItemCount(iNumNotes);
        oDocumentChunk.setItemIndex(iCurNoteIdx);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oDocumentChunk.setLocalPatientId(sLocalPatientId);
            oDocumentChunk.setSystemId(sSystemId);

            Map<String, String> oParams = new HashMap<>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oDocumentChunk.setParams(oParams);
        }

        oDocumentChunk.setPatientIcn(oPatientIds.getIcn());
        oDocumentChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oDocumentChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oDocumentChunk.setType(VistaDataChunk.NEW_OR_UPDATE);
        String sDocumentJson = oVprDocument.toJSON(JSONViews.JDBView.class);
        LOG.debug("JMeadowsConsultNoteService.transformDocumentChunk - Returning JSON String: " + sDocumentJson);
        oDocumentChunk.setContent(sDocumentJson);

        return oDocumentChunk;
    }

    /**
     * This method will transform the clinical note from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oConsult  The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi    The patient EDIPI
     * @return The VPR Document transformation.
     */
    private Document transformConsult(Consult oConsult, String sSystemId, String sEdipi) {
        LOG.debug("JMeadowsProgressNoteService.transformNoteJson - Entering method...");

        String sNoteDateTime = null;
        if (oConsult.getRequestDate() != null) {
            sNoteDateTime = formatCalendar(oConsult.getRequestDate().toGregorianCalendar());
        }

        String eventId = oConsult.getCdrEventId();
        //notes originating from SHARE/Essentris or TMDS do not have an eventId, only notes originating in the CDR.
        if (StringUtils.isBlank(eventId)) {

            //utilize note text as unique hash source
            String sHashSource = oConsult.getReport();

            //if note text is empty then use complex note URL as the hash source
            if (StringUtils.isBlank(sHashSource) && StringUtils.isNotBlank(oConsult.getComplexDataUrl())) {
                sHashSource = oConsult.getComplexDataUrl();
            }

            //Generate uniqueId: SHA-1 hash of source combined with note date
            if (StringUtils.isNotBlank(sHashSource)) {
                try {
                    MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
                    messageDigest.update(sHashSource.getBytes("UTF-8"));
                    byte[] bHash = messageDigest.digest();
                    BigInteger bigInteger = new BigInteger(1, bHash);
                    String sHash = bigInteger.toString(16);
                    eventId = String.format("%s_%s", sHash, sNoteDateTime == null ? "" : sNoteDateTime);
                } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
                    LOG.error("An error occurred while generated consult note hash value.", e);
                }
            }
        }

        String uid = UidUtils.getDocumentUid(sSystemId, sEdipi, eventId);

        Document oVprDocument = new Document();
        oVprDocument.setData("uid", uid);
        oVprDocument.setData("localTitle", oConsult.getService());
        oVprDocument.setData("documentTypeName", oConsult.getProcedureConsult());
        oVprDocument.setData("status", "COMPLETED");
        oVprDocument.setData("statusDisplayName", "Completed");

        oVprDocument.setData("referenceDateTime", sNoteDateTime);
        oVprDocument.setData("facilityName", sSystemId);
        oVprDocument.setData("facilityCode", sSystemId);

        //if note has a plain-text value and is not a RTF document
        if (StringUtils.isNotBlank(oConsult.getReport()) &&
                StringUtils.isBlank(oConsult.getComplexDataUrl())) {
            DocumentText docText = new DocumentText();
            docText.setData("content", oConsult.getReport());
            docText.setData("dateTime", sNoteDateTime);
            docText.setData("status", "completed");
            docText.setData("uid", uid);
            List<DocumentText> docTextList = new ArrayList<>();
            docTextList.add(docText);

            oVprDocument.setData("text", docTextList);
        }

        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oConsult.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oConsult.getCodes()) {
                boolean bHasData = false;
                JdsCode oJdsCode = new JdsCode();
                if (StringUtils.isNotEmpty(oCode.getCode())) {
                    oJdsCode.setCode(oCode.getCode());
                    bHasData = true;
                }
                if (StringUtils.isNotEmpty(oCode.getSystem())) {
                    JLVTerminologySystem termSystem = JLVTerminologySystem.getSystemByName(oCode.getSystem());

                    //pass OID urn if one exists
                    if (termSystem != null) {
                        oJdsCode.setSystem(termSystem.getUrn());
                    }
                    //default to code system display name
                    else oJdsCode.setSystem(oCode.getSystem());

                    bHasData = true;
                }
                if (StringUtils.isNotEmpty(oCode.getDisplay())) {
                    oJdsCode.setDisplay(oCode.getDisplay());
                    bHasData = true;
                }
                if (bHasData) {
                    oaJdsCode.add(oJdsCode);
                }
            }

            if (CollectionUtils.isNotEmpty(oaJdsCode)) {
                oVprDocument.setData("codes", oaJdsCode);
            }
        }

        return oVprDocument;
    }

    /**
     * Utilizes DoD Document Service to queue request to retrieve, convert, and store DoD RTF document.
     *
     * @param sComplexDataUrl DoD document complex note image (RTF) URL.
     * @param oPatientIds     Patient IDs
     * @param sEventId        DoD document event ID.
     * @param oVprDocument    VPR Document instance.
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    private Future<Document> queueRTFDocumentServiceRequest(String sComplexDataUrl, PatientIds oPatientIds, String sEventId, Document oVprDocument) {
        return dodDocumentService.retrieveConvertAndStoreRTFDocument(sComplexDataUrl, oPatientIds,
                sEventId, oVprDocument);
    }

    /**
     * Returns eventId portion of unique identifier.
     * @param uid Unique identifier.
     * @return EventId
     */
    private String getEventId(String uid) {
        return uid.substring(uid.lastIndexOf(":")+1);
    }
}
