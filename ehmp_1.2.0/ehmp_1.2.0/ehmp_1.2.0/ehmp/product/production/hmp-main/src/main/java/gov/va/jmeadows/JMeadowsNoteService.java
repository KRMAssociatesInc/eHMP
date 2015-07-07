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
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import java.io.IOException;
import java.io.StringReader;
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
public class JMeadowsNoteService implements IJMeadowsNoteService {

    public static final String DOMAIN_DOCUMENT = "document";

    private static final String NOTE_TYPE_RTF = "RTF";
    private static final String NOTE_TYPE_CDA = "CDA";

    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsNoteService.class);
    private JMeadowsData jMeadowsClient;

    private IDodDocumentService dodDocumentService;
    private Boolean dodDocServiceEnabled;

    /**
     * Constructs a JMeadowsClinicalNoteService instance.
     */
    @Autowired
    public JMeadowsNoteService(JMeadowsConfiguration jMeadowsConfiguration) {
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
     * This routine will calculate the total number of notes that are in the result set.  It does this by
     * counting all the notes that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaNotes The list of notes returned.
     * @return The number of notes that are from a DoD site.
     */
    private int calculateNumNotes(List<ProgressNote> oaNotes) {
        int iNumNotes = 0;

        if ((oaNotes != null) && (oaNotes.size() > 0)) {
            iNumNotes = oaNotes.size();
        }

        return iNumNotes;
    }

    /**
     * Retrieve the clinical note data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param eNoteType   Type of clinical note to fetch.
     * @param oQuery      JMeadows oQuery bean.
     * @param oPatientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the clinical notes data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception
     *                                  If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodNotes(NoteType eNoteType, JMeadowsQuery oQuery, PatientIds oPatientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsClinicalNoteService.fetchDodNotes - Entering method...");

        if (eNoteType == null)
            throw new IllegalArgumentException("eNoteType is null");

        validateParams(oQuery, oPatientIds, USER, PATIENT);

        switch (eNoteType) {
            case OUTPATIENT:
                return processProgressNote(eNoteType, jMeadowsClient.getPatientProgressNotes(oQuery), oPatientIds);
            case INPATIENT:
                return processProgressNote(eNoteType, jMeadowsClient.getPatientDischargeSummaries(oQuery), oPatientIds);
        }

        throw new IllegalArgumentException("Unsupported NoteType: " + eNoteType.getName());
    }

    /**
     * Processes jMeadows note response of type ProgressNote (as opposed to Consult).
     *
     * @param eNoteType      Type of clinical note to process.
     * @param oProgressNotes List of jMeadows progress notes
     * @param oPatientIds    Patient identifier bean.
     * @return The VistaDataChunk list that contains the clinical notes data.
     */
    private List<VistaDataChunk> processProgressNote(NoteType eNoteType, List<ProgressNote> oProgressNotes, PatientIds oPatientIds) {

        List<VistaDataChunk> oaDocumentChunk = new ArrayList<>();

        if (LOG.isDebugEnabled() && oProgressNotes != null) {
            LOG.debug("JMeadowsNoteService.fetchDodNotes: eNoteType: " + eNoteType.getName() + " " +
                    ((oProgressNotes == null) ? "NO" : "" + oProgressNotes.size()) +
                    " results retrieved from JMeadows.");
        }

        if ((oProgressNotes != null) && (oProgressNotes.size() > 0)) {

            //remove DoD adaptor status report
            oProgressNotes = (List<ProgressNote>) filterOnSourceProtocol(oProgressNotes, SOURCE_PROTOCOL_DODADAPTER);

            int iNumNotes = calculateNumNotes(oProgressNotes);

            Map<Document, Future<Document>> queuedDodDocumentServiceRequestMap = new LinkedHashMap<>();

            //transform jMeadows progress note into VPR documents
            List<Document> oaVprDocuments = new ArrayList<>();
            for (ProgressNote oProgressNote : oProgressNotes) {
                LOG.debug("JMeadowsNoteService.fetchDodNotes: Found DoD " + eNoteType.getName() + " progress note - Transforming it...");
                Document oVprDocument = transformNote(oProgressNote, "DOD", oPatientIds.getEdipi());

                if (oVprDocument != null) {

                    //queue DoD document processing request if dod document service enabled flag is true
                    if (dodDocServiceEnabled &&
                            NOTE_TYPE_RTF.equalsIgnoreCase(oProgressNote.getStatus())) {

                        LOG.debug("queuing RTF document processing.");

                        Future<Document> documentFuture =
                                queueRTFDocumentServiceRequest(oProgressNote.getComplexDataUrl(),
                                        oPatientIds, getEventId(oVprDocument.getUid()), oVprDocument);

                        queuedDodDocumentServiceRequestMap.put(oVprDocument, documentFuture);
                    }
                    //queue CDA document processing request if dod document service enabled flag is true
                    else if (dodDocServiceEnabled &&
                            NOTE_TYPE_CDA.equalsIgnoreCase(oProgressNote.getStatus()) &&
                            StringUtils.isNotBlank(oProgressNote.getNoteText())) {

                        LOG.debug("queuing CDA document processing.");

                        Future<Document> documentFuture =
                                queueCDADocumentServiceRequest(oProgressNote.getNoteText(),
                                    oPatientIds, getEventId(oVprDocument.getUid()), oVprDocument);

                        queuedDodDocumentServiceRequestMap.put(oVprDocument, documentFuture);
                    }
                    //otherwise assume note is plain-text and add immediately to VPR document list
                    else {

                        //inform user that DoD document service is disabled.
                        //if note has complex URL or of type CDA
                        if (NOTE_TYPE_RTF.equalsIgnoreCase(oProgressNote.getStatus()) ||
                                (StringUtils.isNotBlank(oProgressNote.getNoteText()) &&
                                        NOTE_TYPE_CDA.equalsIgnoreCase(oProgressNote.getStatus()))) {
                            oVprDocument.setData("dodComplexNoteUri",
                                    "Complex note unavailable: DoD Document Service is disabled.");
                        }

                        oaVprDocuments.add(oVprDocument);
                    }
                }
            }

            //block until all complex documents are finished processing
            //TODO perform processing and JDS caching of complex documents in separate queue
            for (Map.Entry<Document, Future<Document>> entry : queuedDodDocumentServiceRequestMap.entrySet())

                try {
                    LOG.debug("Processing DoD document with UID: " + entry.getKey().getUid());
                    Future<Document> future = entry.getValue();
                    Document oVprDocument = future.get();
                    oaVprDocuments.add(oVprDocument);
                } catch (Exception e) {

                    //retain note without plain-text or link to HTML rendering.
                    oaVprDocuments.add(entry.getKey());

                    LOG.error("An error occurred while processing complex DoD note. The note text and attached note will be excluded from result.::" + e.getMessage(), e);
                }

            //transform VPR document to JSON
            int iCurNoteIdx = 1;        // One based index

            for (Document oVprDocument : oaVprDocuments) {
                LOG.debug("JMeadowsNoteService.fetchDodNotes: Found DoD " + eNoteType.getName() + " progress note - Processing it... idx: " + iCurNoteIdx);
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
        LOG.debug("JMeadowsNoteService.transformDocumentChunk - Entering method...");
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
//        LOG.debug("JMeadowsNoteService.transformDocumentChunk - Returning JSON String: " + sDocumentJson);
        oDocumentChunk.setContent(sDocumentJson);

        return oDocumentChunk;
    }


    /**
     * Parses XML String
     * @param xmlResponse XML String representation
     * @return Parsed XML Document
     * @throws ParserConfigurationException
     * @throws IOException
     * @throws SAXException
     */
    protected org.w3c.dom.Document parseXMLDocument(String xmlResponse) throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://javax.xml.XMLConstants/feature/secure-processing", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        
        DocumentBuilder builder = factory.newDocumentBuilder();

        InputSource is = new InputSource(new StringReader(xmlResponse));

        return builder.parse(is);
    }

    /**
     * This method will transform the clinical note from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oNote     The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi    The patient EDIPI
     * @return The VPR Document transformation.
     */
    private Document transformNote(ProgressNote oNote, String sSystemId, String sEdipi) {
        LOG.debug("JMeadowsNoteService.transformNoteJson - Entering method...");

        String sNoteDateTime = null;
        if (oNote.getNoteDate() != null) {
            sNoteDateTime = formatCalendar(oNote.getNoteDate().toGregorianCalendar());
        }
        //extract note datetime from CDA document
        else if (NOTE_TYPE_CDA.equalsIgnoreCase(oNote.getStatus()) && StringUtils.isNotBlank(oNote.getNoteText())) {
            XPathFactory xPathfactory = XPathFactory.newInstance();
            XPath xpath = xPathfactory.newXPath();

            XPathExpression exprDateTime;

            try {
                exprDateTime = xpath.compile("//ClinicalDocument/author/time/@value");
                LOG.debug("Retrieving note datetime from CDA document.");
                sNoteDateTime = (String) exprDateTime.evaluate(parseXMLDocument(oNote.getNoteText()), XPathConstants.STRING);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        String eventId = oNote.getCdrEventId();
        //notes originating from SHARE/Essentris or TMDS do not have an eventId, only notes originating in the CDR.
        if (StringUtils.isBlank(eventId)) {

            //utilize note text as unique hash source
            String sHashSource = oNote.getNoteText();

            //if note text is empty then use complex note URL as the hash source
            if (StringUtils.isBlank(sHashSource) && StringUtils.isNotBlank(oNote.getComplexDataUrl())) {
                sHashSource = oNote.getComplexDataUrl();
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
                    LOG.error("An error occurred while generated note hash value.", e);
                }
            }
        }

        String uid = UidUtils.getDocumentUid(sSystemId, sEdipi, eventId);

        Document oVprDocument = new Document();
        oVprDocument.setData("uid", uid);
        oVprDocument.setData("localTitle", oNote.getNoteTitle());
        oVprDocument.setData("documentTypeName", oNote.getNoteType());
        oVprDocument.setData("author", oNote.getProvider());
        oVprDocument.setData("authorDisplayName", oNote.getProvider());
        oVprDocument.setData("status", "completed");
        oVprDocument.setData("statusName", "completed");

        oVprDocument.setData("referenceDateTime", sNoteDateTime);
        oVprDocument.setData("facilityName", sSystemId);
        oVprDocument.setData("facilityCode", sSystemId);

        //if note has a plain-text value and is not a RTF document
        if (StringUtils.isNotBlank(oNote.getNoteText()) &&
                !NOTE_TYPE_RTF.equalsIgnoreCase(oNote.getStatus())) {
            DocumentText docText = new DocumentText();
            docText.setData("content", oNote.getNoteText());
            docText.setData("dateTime", sNoteDateTime);
            docText.setData("status", "completed");
            docText.setData("uid", uid);
            List<DocumentText> docTextList = new ArrayList<>();
            docTextList.add(docText);

            oVprDocument.setData("text", docTextList);
        }

        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oNote.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oNote.getCodes()) {
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
     * Utilizes DoD Document Service to queue request to convert and store DoD CDA document.
     *
     * @param sCDANote        CDA note.
     * @param oPatientIds     Patient IDs
     * @param sEventId        DoD document event ID.
     * @param oVprDocument    VPR Document instance.
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    private Future<Document> queueCDADocumentServiceRequest(String sCDANote, PatientIds oPatientIds, String sEventId, Document oVprDocument) {
        return dodDocumentService.convertAndStoreCDADocument(sCDANote, oPatientIds,
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

    /**
     * Note type enumeration.
     */
    public enum NoteType {
        OUTPATIENT("outpatient"),
        INPATIENT("inpatient");

        private String name;

        NoteType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
