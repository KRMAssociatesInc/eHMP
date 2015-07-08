package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVLoincMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.access.MissingAttributeException;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.*;

import static gov.va.cpe.vpr.DocumentClinician.Role;

/**
 * TODOC: document this class
 * <p/>
 * For HITSP, advance directives are kept in a separate place. If crisis & warning notes are not associated with a
 * specific encounter, Documents related to procedures are stored as results (Clinical Procedures, Surgical Reports,
 * Laboratory Reports).
 */
public class Document extends AbstractPatientObject implements IPatientObject {

    private static Logger log = LoggerFactory.getLogger(Document.class);

    private static final String SYSTEM_DOD_NCID = "DOD_NCID";

    public static final String SOLR_DOCUMENT_STATUS_FIELD = "document_status";
    public static final String SOLR_DOC_DEF_UID_FIELD = "document_def_uid";
    public static final String SOLR_LOCAL_TITLE_FIELD = "local_title";
    public static final String SOLR_AUTHOR_UID_FIELD = "author_uid";
    public static final String SOLR_SIGNER_UID_FIELD = "signer_uid";
    public static final String SOLR_COSIGNER_UID_FIELD = "cosigner_uid";
    public static final String SOLR_ATTENDING_UID_FIELD = "attending_uid";

    public static final String SOLR_IS_INTERDISCIPLINARY_FIELD = "is_interdisciplinary";
    public static final String SOLR_INTERDISCIPLINARY_TYPE_FIELD = "interdisciplinary_type";

    private String authorUid;
    private String author;
    private String authorDisplayName;
    private String cosignerUid;
    private String cosigner;
    private String cosignerDisplayName;
    private PointInTime cosignedDateTime;
    private String attendingUid;
    private String attending;
    private String attendingDisplayName;
    private String signerUid;
    private String signer;
    private String signerDisplayName;
    private PointInTime signedDateTime;
    private String urgency;
    private PointInTime entered;
    private String kind;
    private String summary;
    private ArrayList<DocumentText> text;
    private String documentDefUid;
    private String parentUid;
    private Map<String, Object> parent;
    private List<JdsCode> codes;

    @JsonIgnore
    private JLVHddDao oJLVHddDao = null;

    /**
     * Link to DoD complex note *
     */
    private String dodComplexNoteUri;

    private ArrayList<Document> childDocs;
    private String isInterdisciplinary;
    private String interdisciplinaryType;
    private ArrayList<Map<String, Object>> procedures;

    /**
     * The facility where the encounter occurred
     *
     * @see "HITSP/C154 16.17 Facility ID"
     */
    private String facilityCode;
    /**
     * The facility where the encounter occurred
     *
     * @see "HITSP/C154 16.18 Facility Name"
     */
    private String facilityName;

    private String localId;

    /**
     * Reference to the encounter to which this document is related.
     */
//    private Encounter encounter;
    private String encounterUid;
    private String encounterName;
    /**
     * Date/time of this document
     */
    private PointInTime referenceDateTime;
    /**
     * i.e. Progress Note, Discharge Summary
     */
    private String documentTypeCode;
    private String documentTypeName;
    private String documentClass;
    private String localTitle;
    private Map<String, Object> nationalTitle;
    // LOINC nationalTitleCode
    /**
     * For VistA: subject text
     */
    private String subject;
    /**
     * current document status, For VistA: status in TIU
     */
    private String status;

    private String statusDisplayName;

    /**
     * XML text of the full note, including sections and addenda.
     */
    private String content;
    
    private String documentDefUidVuid;

    public String getDocumentDefUidVuid() {
        return documentDefUidVuid;
    }

    public Document() {
        super(null);
    }

    @JsonCreator
    public Document(Map<String, Object> vals) {
        super(vals);
        this.setIsInterdisciplinary();
        this.setInterdisciplinaryType();
    }

    public ArrayList<Map<String, Object>> getProcedures() {
        return procedures;
    }

    public List<Document> getChildDocs() {
        return childDocs;
    }

    public String getParentUid() {
        return parentUid;
    }

    public Map<String, Object> getParent() {
        return parent;
    }

    public String getIsInterdisciplinary() {
        return this.isInterdisciplinary;
    }

    public String getInterdisciplinaryType() {
        return this.interdisciplinaryType;
    }

    public void setIsInterdisciplinary() {
        if(this.getLocalTitle() != null) {
            if (this.getLocalTitle().toLowerCase().contains("interdisciplinary")) {
                this.isInterdisciplinary = "true";
            } else {
                this.isInterdisciplinary = "false";
            }
        }
    }

    public void setInterdisciplinaryType() {
        if(this.isInterdisciplinary != null && this.isInterdisciplinary.equals("true")) {
            if(this.getParentUid() != null) {
                this.interdisciplinaryType = "child";
            } else {
                this.interdisciplinaryType = "parent";
            }
        }
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<DocumentText> getText() {
        return text;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getBody() {
        if (text == null || text.isEmpty()) return Collections.emptyList();
        List<String> body = new ArrayList<>(text.size());
        for (DocumentText t : text) {
            body.add(t.getContent());
        }
        return Collections.unmodifiableList(body);
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getAuthorUid() {
        if (authorUid == null) {
            DocumentClinician author = getClinicianForRole(Role.AUTHOR_DICTATOR);
            if (author != null)
                this.authorUid = author.getUid();
        }
        return authorUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getAuthor() {
        if (author == null) {
            DocumentClinician author = getClinicianForRole(Role.AUTHOR_DICTATOR);
            if (author != null)
                this.author = author.getName();
        }
        return author;
    }

    public String getAuthorDisplayName() {
        if (authorDisplayName == null) {
            DocumentClinician author = getClinicianForRole(Role.AUTHOR_DICTATOR);
            if (author != null)
                this.authorDisplayName = author.getDisplayName();
        }
        return authorDisplayName;
    }

    public String getSignerUid() {
        if (signerUid == null) {
            DocumentClinician signer = getClinicianForRole(Role.SIGNER);
            if (signer != null)
                this.signerUid = signer.getUid();
        }
        return signerUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSigner() {
        if (signer == null) {
            DocumentClinician signer = getClinicianForRole(Role.SIGNER);
            if (signer != null)
                this.signer = signer.getName();
        }
        return signer;
    }

    public String getSignerDisplayName() {
        if (signerDisplayName == null) {
            this.signerDisplayName = getClinicianDisplayNameForRole(Role.SIGNER);
        }
        return signerDisplayName;
    }

    public PointInTime getSignedDateTime() {
        if (signedDateTime == null) {
            DocumentClinician signer = getClinicianForRole(Role.SIGNER);
            if (signer != null) {
                this.signedDateTime = signer.getSignedDateTime();
            }
        }
        return signedDateTime;
    }

    public PointInTime getCosignedDateTime() {
        if (cosignedDateTime == null) {
            DocumentClinician cosigner = getClinicianForRole(Role.COSIGNER);
            if (cosigner != null) {
                this.cosignedDateTime = cosigner.getSignedDateTime();
            }
        }
        return cosignedDateTime;
    }

    public String getCosignerUid() {
        if (cosignerUid == null) {
            this.cosignerUid = getClinicianUidForRole(Role.COSIGNER);
        }
        return cosignerUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCosigner() {
        if (cosigner == null) {
            this.cosigner = getClinicianNameForRole(Role.COSIGNER);
        }
        return cosigner;
    }

    public String getCosignerDisplayName() {
        if (cosignerDisplayName == null) {
            this.cosignerDisplayName = getClinicianDisplayNameForRole(Role.COSIGNER);
        }
        return cosignerDisplayName;
    }

    public String getAttendingUid() {
        if (attendingUid == null) {
            this.attendingUid = getClinicianUidForRole(Role.ATTENDING_PHYSICIAN);
        }
        return attendingUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getAttending() {
        if (attending == null) {
            this.attending = getClinicianNameForRole(Role.ATTENDING_PHYSICIAN);
        }
        return attending;
    }

    public String getAttendingDisplayName() {
        if (attendingDisplayName == null) {
            this.attendingDisplayName = getClinicianDisplayNameForRole(Role.ATTENDING_PHYSICIAN);
        }
        return attendingDisplayName;
    }

    private String getClinicianUidForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getUid();
    }

    private String getClinicianNameForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getName();
    }

    private String getClinicianDisplayNameForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getDisplayName();
    }

    private DocumentClinician getClinicianForRole(Role role) {
        if (text == null) return null;
        for (DocumentText txt : text) {
            List<DocumentClinician> clinicians = txt.getClinicians();
            if (clinicians != null) {
                for (DocumentClinician clinician : clinicians) {
                    if (clinician.getRole() != null && clinician.getRole().equals(role)) {
                        return clinician;
                    }
                }
            }
        }
        return null;
    }

    public String getSummary() {
        return localTitle;
    }

    public String getKind() {
        // return kind;
        return getDocumentTypeName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    public PointInTime getReferenceDateTime() {
        return referenceDateTime;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getEncounterUid() {
        return encounterUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getEncounterName() {
        return encounterName;
    }

    public String getDocumentTypeCode() {
        return documentTypeCode;
    }

    public String getDocumentTypeName() {
        return documentTypeName;
    }

    /**
     * Solr alias for 'documentTypeName'.
     *
     * @see #getDocumentTypeName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getDocumentType() {
        return getDocumentTypeName();
    }

    public String getDocumentClass() {
        return documentClass;
    }

    public Map<String, Object> getNationalTitle() {
        return nationalTitle;
    }

    public String getLocalTitle() {
        return localTitle;
    }

    public String getUrgency() {
        return urgency;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getEntered() {
        return entered;
    }

    /**
     * Solr alias for 'entered'.
     *
     * @see #getEntered()
     */
    @JsonView(JSONViews.SolrView.class)
    public PointInTime getDocumentEntered() {
        return getEntered();
    }

    // Taken out because nationalTitle breaks JSON importing; Complex JSON data doesn't play nice with String data type.
//    public String getNationalTitle() {
//        return nationalTitle;
//    }
//
//    public void setNationalTitle(String nationalTitle) {
//        this.nationalTitle = nationalTitle;
//    }

    public String getSubject() {
        return subject;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatus() {
        return status;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusDisplayName() {
        if (statusDisplayName == null) {
            statusDisplayName = VistaStringUtils.nameCase(getStatus());
        }
        return statusDisplayName;
    }

    /**
     * Solr alias for 'status'.
     *
     * @see #getStatus()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getDocumentStatus() {
        return getStatus();
    }

    public String getDocumentDefUid() {
        return documentDefUid;
    }

    @Deprecated
    public String getContent() {
        return content;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Set<DocumentClinician> getClinicians() {
        Set<DocumentClinician> clinicians = new LinkedHashSet<DocumentClinician>();
        if (text != null) {
            for (DocumentText txt : text) {
                if (txt.getUid().equals(uid)) {
                    if (txt.getClinicians() != null) {
                        for (DocumentClinician clinician : txt.getClinicians()) {
                            clinicians.add(clinician);
                        }
                    }
                }
            }
        }
        return clinicians;
    }

    public static String getDocDefUid(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String documentDefUid = document.getDocumentDefUid();
            if (!StringUtils.hasText(documentDefUid)) {
                throw new MissingAttributeException(document.toString() + "missing a 'documentDefUid' attribute");
            }
            return documentDefUid;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_DOC_DEF_UID_FIELD, "documentDefUid", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    private static String getFieldValue(String solrFieldName, String jdsFieldName, Map<String, Object> document) throws MissingAttributeException {
        if (document.containsKey(solrFieldName)) {
            Object value = document.get(solrFieldName);
            if (value == null) {
                return null;
            } else if (value instanceof String) {
                return (String) value;
            } else if (value instanceof List) {
                value = ((List) value).get(0);
                return value.toString();
            }
        }
        if (document.containsKey(jdsFieldName)) {
            return (String) document.get(jdsFieldName);
        }
        throw new MissingAttributeException("Document with uid '" + document.get("uid") + "' is missing a '" + solrFieldName + "' or '" + jdsFieldName + "' attribute");
    }

    public static String getStatusName(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String documentStatus = document.getStatus();
            if (!StringUtils.hasText(documentStatus)) {
                throw new MissingAttributeException(document.toString() + " is missing a 'status' attribute");
            }
            return documentStatus;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_DOCUMENT_STATUS_FIELD, "status", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static String getLocalTitle(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String localTitle = document.getLocalTitle();
            if (!StringUtils.hasText(localTitle)) {
                throw new MissingAttributeException(document.toString() + " is missing a 'localTitle' attribute");
            }
            return localTitle;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_LOCAL_TITLE_FIELD, "localTitle", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static String getAuthorUid(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String authorUid = document.getAuthorUid();
            if (!StringUtils.hasText(authorUid)) {
                throw new MissingAttributeException(document.toString() + "missing a 'authorUid' attribute");
            }
            return authorUid;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_AUTHOR_UID_FIELD, "authorUid", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static String getSignerUid(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String signerUid = document.getSignerUid();
            if (!StringUtils.hasText(signerUid)) {
                throw new MissingAttributeException(document.toString() + "missing a 'authorUid' attribute");
            }
            return signerUid;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_SIGNER_UID_FIELD, "signerUid", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static String getCosignerUid(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String cosignerUid = document.getCosignerUid();
            if (!StringUtils.hasText(cosignerUid)) {
                throw new MissingAttributeException(document.toString() + "missing a 'cosignerUid' attribute");
            }
            return cosignerUid;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_COSIGNER_UID_FIELD, "cosignerUid", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static String getAttendingUid(Object item) throws MissingAttributeException {
        if (item instanceof Document) {
            Document document = (Document) item;
            String attendingUid = document.getAttendingUid();
            if (!StringUtils.hasText(attendingUid)) {
                throw new MissingAttributeException(document.toString() + "missing a 'attendingUid' attribute");
            }
            return attendingUid;
        } else if (item instanceof Map) {
            return getFieldValue(SOLR_ATTENDING_UID_FIELD, "attendingUid", (Map<String, Object>) item);
        }
        throw new IllegalArgumentException("resource must be an instance of '" + Document.class.getName() + "' or " + Map.class.getName());
    }

    public static boolean isTIU(Object item) {
        String uid = null;
        if (item instanceof Document) {
            uid = ((Document) item).getUid();
        } else if (item instanceof Map) {
            uid = (String) ((Map) item).get("uid");
        }
        return isTIU(uid);
    }

    public static boolean isTIU(String uid) {
        Assert.hasText(uid, "[Assertion failed] - 'uid' argument must have text; it must not be null, empty, or blank");
        if (UidUtils.getDomainClassByUid(uid) != Document.class) return false;
        String localId = VistaStringUtils.piece(uid, ":", 6);
        return org.apache.commons.lang.StringUtils.isNumeric(localId);
    }

    @JsonIgnore
    public void loadLinkData(IGenericPatientObjectDAO dao) {
        this.setIsInterdisciplinary();
        this.setInterdisciplinaryType();
    }

    public String getDodComplexNoteUri() {
        return dodComplexNoteUri;
    }

    public void setCodes(List<JdsCode> codes) {
        this.codes = codes;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesCode() {
        return JdsCode.getCodesCodeList(getCodes());
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesSystem() {
        return JdsCode.getCodesSystemList(getCodes());
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesDisplay() {
        return JdsCode.getCodesDisplayList(getCodes());
    }

    @JsonView(JSONViews.JDBView.class)
    public List<JdsCode> getCodes() {
        log.debug("Document.getCodes(): Entering method.");

        // Check to see if this already contains the LOINC code.  If it does not, then see if we use the
        // terminology database to retrieve and add it.
        //-----------------------------------------------------------------------------------------------------
        if (!containsLoincCode()) {
            log.debug("Document.getCodes(): Codes does not already contain a LOINC Code - Trying to find one now.");
            JdsCode oLoincCode;
            try {
                List<JdsCode> oLoincCodeList = retrieveLoincCodes();
                if (oLoincCodeList != null) {
                    if (this.codes == null) {
                        this.codes = new ArrayList<JdsCode>();
                    }
                    this.codes.addAll(oLoincCodeList);
                }
            }
            catch (TermLoadException e) {
                // We do not want this kind of an error to stop processing on the result...  Just log the message.
                //------------------------------------------------------------------------------------------------
                log.error("Document.getCodes(): Failed to lookup LOINC code for this result.  Error: " + e.getMessage(), e);
            }
        }

        log.debug("Document.getCodes(): Leaving method.");

        return this.codes;
    }

    /**
     * This method is put here so that we can pass in a mock HDD dao to be used.  If we try to do this
     * using the normal Mockito override mechanism - it breaks because Jackson cannot deal with the class in that
     * way.
     *
     * @param oJLVHddDao The handle to the JLVHddDao to be used.
     */
    protected void setJLVHddDao(JLVHddDao oJLVHddDao) {
        this.oJLVHddDao = oJLVHddDao;
    }

    /**
     * This checks the codes attribute to see if it contains a LOINC code.  If it does, then TRUE is returned.
     * Otherwise false is returned.
     *
     * @return TRUE if the codes property contains a LOINC code.
     */
    private boolean containsLoincCode() {
        boolean bReturnResult = false;

        if (NullChecker.isNotNullish(this.codes)) {
            for (JdsCode oCode : this.codes) {
                if ((NullChecker.isNotNullish(oCode.getSystem())) &&
                        (oCode.getSystem().equals(JLVLoincMap.CODE_SYSTEM_LOINC))) {
                    bReturnResult = true;
                    break;
                }
            }
        }

        return bReturnResult;
    }

    /**
     * This method will retrieve the LOINC codes for this document result.  If this is a VA result, it will do the translation
     * using the VUID Code.  If this is a DoD Document, it will use the NCID for the conversion.
     *
     * @return The LOINC codes list for this document result.
     * @throws TermLoadException
     */
    private List<JdsCode> retrieveLoincCodes() throws TermLoadException {
        List<JdsCode> oLoincCodeList = new ArrayList<>();
        setupJLVHddDao();

        if (isVAResult()) {
            String sVuid = getDocumentVuid();
            log.debug("Document.retrieveDocumentVuid(): Retrieving LOINC information for VUID: " + sVuid);
            if (NullChecker.isNotNullish(sVuid)) {
                List<JLVMappedCode> oMappedCodeList = oJLVHddDao.getMappedCodeList(JLVHddDao.MappingType.NotesVuidToLoinc, sVuid);
    
                if (oMappedCodeList != null) {
                    for(JLVMappedCode oMappedCode : oMappedCodeList) {
                        JdsCode oLoincCode = convertMappedToJdsCode(oMappedCode);
                        if ((oLoincCode != null) &&
                                (NullChecker.isNotNullish(oLoincCode.getCode()))) {
    
                            oLoincCodeList.add(oLoincCode);
    
                            log.debug("Document.retrieveLoincCodes(): Found LOINC code information for VUID: " + sVuid + "- LOINC code: " + oLoincCode.getCode());
                        }
                        else {
                            log.debug("Document.retrieveLoincCodes(): NO LOINC code mapping found for VUID: " + sVuid);
                        }
                    }
                }
            }
        }
        else if (isDoDResult()) {
            String sDodNcid = getNoteDodNcid();
            log.debug("Document.retrieveLoincCodes(): Retrieving LOINC code for DOD NCID ID: " + sDodNcid);
            JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(JLVHddDao.MappingType.NotesDodNcidToLoinc, sDodNcid);
            JdsCode oLoincCode = convertMappedToJdsCode(oMappedCode);
            if ((oLoincCode != null) &&
                    (NullChecker.isNotNullish(oLoincCode.getCode()))) {

                oLoincCodeList.add(oLoincCode);

                log.debug("Document.retrieveLoincCodes(): Found LOINC code for DOD NCID ID: " + sDodNcid + " - LOINC code: " + oLoincCode.getCode());
            }
            else {
                log.debug("Document.retrieveLoincCodes(): NO LOINC code mapping found for DOD NCID ID: " + sDodNcid);
            }
        }

        return oLoincCodeList;
    }

    /**
     * This method retrieves a handle to the HDDDao object.
     *
     * @return The handle to the HDDDao object.
     * @throws TermLoadException Exception thrown if the handle could not be created.
     */
    private void setupJLVHddDao() throws TermLoadException {
        if (this.oJLVHddDao == null) {
            this.oJLVHddDao = JLVHddDao.createInstance();
        }
    }

    /**
     * This method returns true if this is a VA result.  Right now it is doing this by checking to see if
     * the UID contains the word DOD.  If it does not - then it is assumed to be VA.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     *
     * @return TRUE if this is a VA result.
     */
    private boolean isVAResult() {
        return (! isDoDResult());
    }

    /**
     * This method returns true if this is a DoD result.  Right now it is doing this by checking to see if
     * the UID contains the word DOD.  If it does - then it is assumed to be DOD.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     *
     * @return TRUE if this is a VA result.
     */
    private boolean isDoDResult() {
        boolean bReturnResult = false;

        if ((NullChecker.isNotNullish(this.uid)) &&
                (this.uid.contains(":DOD:"))) {
            bReturnResult = true;
        }

        return bReturnResult;
    }

    /**
     * This returns the VUID Code for this result if it exists.  If it does not, then "" is returned.
     *
     * @return The VUID Code for the result if it exists.  If it does not, then "" is returned.
     */
    private String getDocumentVuid() {
        String sVuid = "";
        String vuidUrn = (String) this.documentDefUidVuid;
        if (NullChecker.isNotNullish(vuidUrn)) {
            sVuid = stripVuidFromUrn(vuidUrn);
        }
        log.debug("getDocumentVuid: documentDefUidVuid = " + sVuid);
        return sVuid;
    }

    /**
     * This routine strips off the prefix on the VUID if it exists.
     *
     * @param sVuidUrn The VUID URN.
     * @return The VUID without the URN prefix
     */
    private String stripVuidFromUrn(String sVuidUrn) {
        String sReturnValue = sVuidUrn;

        if ((NullChecker.isNotNullish(sVuidUrn)) &&
                (sVuidUrn.startsWith("urn:va:vuid:"))) {
            sReturnValue = sVuidUrn.substring("urn:va:vuid:".length());
        }

        return sReturnValue;
    }

    /**
     * This method takes the contents from the JLVMappedCode and places it in the JdsCode object.
     *
     * @param oMappedCode The JLVMappedCode object
     * @return The JdsCode object.
     */
    private JdsCode convertMappedToJdsCode(JLVMappedCode oMappedCode) {
        JdsCode oJdsCode = null;

        if (oMappedCode != null) {
            oJdsCode = new JdsCode();
            oJdsCode.setSystem(oMappedCode.getCodeSystem());
            oJdsCode.setCode(oMappedCode.getCode());
            oJdsCode.setDisplay(oMappedCode.getDisplayText());
        }

        return oJdsCode;
    }

    /**
     * If this is a DoD result, then this method returns the DOD NCID for the result.  Otherwise it returns "".
     *
     * @return The DOD NCID for the result
     */
    private String getNoteDodNcid() {
        String sDodNcid = "";
        log.debug("Document.getNoteDodNcid(): Entering method.");

        if (NullChecker.isNotNullish(this.codes)) {
            for (JdsCode oCode : this.codes) {
                if ((SYSTEM_DOD_NCID.equalsIgnoreCase(oCode.getSystem())) &&
                        (NullChecker.isNotNullish(oCode.getCode()))) {
                    sDodNcid = oCode.getCode();
                    break;
                }
            }
        }

        return sDodNcid;
    }
}
