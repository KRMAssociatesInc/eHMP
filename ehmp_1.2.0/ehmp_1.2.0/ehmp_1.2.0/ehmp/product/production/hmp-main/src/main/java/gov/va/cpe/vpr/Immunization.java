package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVImmunizationsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;

public class Immunization extends AbstractPatientObject implements IPatientObject {
    static final Logger LOG = LoggerFactory.getLogger(Immunization.class);
    private String summary;
    private String localId;
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
    private String name;
    private PointInTime administeredDateTime;
    private Boolean contraindicated;
    private String location;
    private String seriesName;
    private String seriesUid;
    private String reactionName;
    private String reactionUid;
    private String comments;
    private String cptCode;
    private String cptName;
    private Clinician performer;
    private String performerUid;
    private String encounterUid;

    private List<JdsCode> codes;

    public String getPerformerUid() {
        return performerUid;
    }

    public String getEncounterUid() {
        return encounterUid;
    }

    @JsonCreator
    public Immunization(Map<String, Object> data) {
        super(data);
    }

    public Immunization() {
        super(null);
    }

    public String getSummary() {
        return getName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getName() {
        return name;
    }

    /**
     * Solr alias for 'name'.
     *
     * @see #getName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getImmunizationName() {
        return getName();
    }

    public PointInTime getAdministeredDateTime() {
        return administeredDateTime;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Boolean getContraindicated() {
        return contraindicated;
    }

    public String getLocation() {
        return location;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSeriesUid() {
        return seriesUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReactionUid() {
        return reactionUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSeriesName() {
        return seriesName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReactionName() {
        return reactionName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getComments() {
        return comments;
    }

    /**
     * Solr alias for 'comments'.
     *
     * @see #getComments()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getComment() {
        return getComments();
    }

    public String getCptCode() {
        return cptCode;
    }

    public String getCptName() {
        return cptName;
    }

    public Clinician getPerformer() {
        return performer;
    }

    public String getKind() {
        return "Immunization";
    }

    public List getTaggers() {
//        if (uid)
//            return manualFlush { Tagger.findAllByUrl(uid) }
//        else
//            return []
        //TODO - fix this
        return null;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
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
        LOG.debug("Immunization.getCodes(): Entering method.");

        // Check to see if this already contains the CVX code.  If it does not, then see if we use the
        // terminology database to retrieve and add it.
        //-----------------------------------------------------------------------------------------------------
        if (!containsCvxCode()) {
            LOG.debug("Immunization.getCodes(): Codes does not already contain a CVX Code - Trying to find one now.");
            JdsCode oCvxCode;
            try {
                oCvxCode = retrieveCvxCode();
                if (oCvxCode != null) {
                    if (this.codes == null) {
                        this.codes = new ArrayList<JdsCode>();
                    }
                    this.codes.add(oCvxCode);
                }
            }
            catch (TermLoadException e) {
                // We do not want this kind of an error to stop processing on the result...  Just log the message.
                //------------------------------------------------------------------------------------------------
                LOG.error("Failed to lookup CVX code for this Immunization.  Error: " + e.getMessage(), e);
            }
        }

        LOG.debug("Immunization.getCodes(): Leaving method.");

        return this.codes;
    }

    /**
     * This method will retrieve the CVX code for this allergy.  If this is a VA immunization, it will do the translation
     * using the CPT. DoD immunizations should already have a CVX code.
     *
     * @return The CVX code for this allergy.
     * @throws TermLoadException
     */
    private JdsCode retrieveCvxCode() throws TermLoadException {
        JdsCode oCvxCode = null;
        JLVHddDao oHDDDao = getHDDDao();

        if (isVAImmunization()) {
            String sCpt = getImmunizationCptCode();
            LOG.debug("Immunization.retrieveCvxCode(): Retrieving CVX code for CPT: " + sCpt);
            JLVMappedCode oMappedCode = oHDDDao.getMappedCode(MappingType.ImmunizationCptToCvx, sCpt);
            oCvxCode = convertMappedToJdsCode(oMappedCode);
            if ((oCvxCode != null) &&
                    (NullChecker.isNotNullish(oCvxCode.getCode()))) {
                LOG.debug("Immunization.retrieveCvxCode(): Found CVX code for CPT: " + sCpt + " - CVX: " + oCvxCode.getCode());
            }
            else {
                LOG.debug("Immunization.retrieveCvxCode(): NO CVX code mapping found for CPT: " + sCpt);
            }
        }

        return oCvxCode;
    }

    /**
     * This returns the CPT for this immunization if it exists.  If it does not, then "" is returned.
     *
     * @return The CPT for the immunization if it exists.  If it does not, then "" is returned.
     */
    private String getImmunizationCptCode() {
        String sCpt = "";

        if (NullChecker.isNotNullish(this.cptCode)) {
            sCpt = stripCptFromUrn(this.cptCode);
        }

        return sCpt;
    }

    /**
     * This routine strips off the prefix on the CPT if it exists.
     *
     * @param sCptUrn The CPT URN.
     * @return The CPT without the URN prefix
     */
    private String stripCptFromUrn(String sCptUrn) {
        String sReturnValue = sCptUrn;

        if ((NullChecker.isNotNullish(sCptUrn)) &&
                (sCptUrn.startsWith("urn:cpt:"))) {
            sReturnValue = sCptUrn.substring("urn:cpt:".length());
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
     * This method returns true if this is a VA immunization.  It does this by checking to see if there is a CPT code.
     *
     * @return TRUE if this is a VA immunization.
     */
    private boolean isVAImmunization() {
        boolean bReturnResult = false;

        if (NullChecker.isNotNullish(this.cptCode)) {
            bReturnResult = true;
        }

        return bReturnResult;
    }

    /**
     * This method retrieves a handle to the HDDDao object.
     *
     * @return The handle to the HDDDao object.
     * @throws TermLoadException Exception thrown if the handle could not be created.
     */
    protected JLVHddDao getHDDDao() throws TermLoadException {
        return JLVHddDao.createInstance();
    }


    /**
     * This checks the codes attribute to see if it contains a CVX code.  If it does, then TRUE is returned.
     * Otherwise false is returned.
     *
     * @return TRUE if the codes property contains a CVX code/
     */
    private boolean containsCvxCode() {
        boolean bReturnResult = false;

        if (NullChecker.isNotNullish(this.codes)) {
            for (JdsCode oCode : this.codes) {
                if ((NullChecker.isNotNullish(oCode.getSystem())) &&
                        (oCode.getSystem().equals(JLVImmunizationsMap.CODE_SYSTEM_CVX))) {
                    bReturnResult = true;
                    break;
                }
            }
        }

        return bReturnResult;
    }

    public void setCodes(List<JdsCode> codes) {
        this.codes = codes;
    }
}
