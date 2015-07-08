package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.cpe.vpr.termeng.jlv.JLVDodAllergiesMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * This documents the allergies / adverse reactions for a patient.
 *
 * @see <a href="http://wiki.hitsp.org/docs/C83/C83-3.html#__Ref207780152">HITSP/C83 Allergy/Drug Sensitivity</a>
 */
public class Allergy extends AbstractPatientObject implements IPatientObject {
	private static final long serialVersionUID = 3249674700646292168L;
	static final Logger LOG = LoggerFactory.getLogger(Allergy.class);
	private static final String SYSTEM_DOD_ALLERGY_IEN = "DOD_ALLERGY_IEN";
	
    /**
     * The facility where the allergy was observed or recorded
     *
     * @see "HITSP/C154 16.17 Facility ID"
     */
    private String facilityCode;
    /**
     * The facility where the allergy was observed or recorded
     *
     * @see "HITSP/C154 16.18 Facility Name"
     */
    private String facilityName;
    /**
     * For VistA -- localId is the ien from 120.8 by itself
     */
    private String localId;
    /**
     * Text describing the type of allergy (adverse event or allergy)
     */
    //  private String adverseEventTypeName;        -> renamed to mechanism
    /**
     * SNOMED CT code describing the type of allergy / adverse event In VistA, this is derived from the Drug/Food/Other
     * set of codes <p/> <p> <i>For VistA</i>, the Allergy Type (120.8,3.1) and Mechanism are used to calculate the
     * value of adverseEventType. </p> <p/> <p> Mechanism + Allergy Type = SNOMED CT code </p>
     * <p/>
     * <pre>
     *   Allergy + D only = 416098002
     *   Allergy + F only = 414285001
     *   Allergy + O only = 419199007
     *   Allergy + multiple or no mechanisms = 419199007
     *
     * Otherwise (Mechanism is Pharmaceutic, Unknown, or empty):
     *
     *   D only = 419511003
     *   F only = 418471000
     *   O only = 418038007
     *   else     420134006
     * </pre>
     *
     * @see "HITSP/C154 6.02 Adverse Event Type"
     */
    private String adverseEventTypeCode;
    /**
     * The time that the allergy was entered or recorded.
     *
     * @see "HITSP/C154 6.01 Adverse Event Date"
     */
    private PointInTime entered;
    /**
     * UID of the person who originally entered the allergy.
     */
    private String enteredByUid;
    /**
     * Name of the person who originally entered the allergy.
     */
    //private String enteredByName;            -> renamed to originatorName
    /**
     * The time that the allergy was verified.
     */
    private PointInTime verified;
    /**
     * UID of the person who verified the allergy.
     */
    private String verifiedByUid;
    /**
     * Name of the person who verified the allergy.
     */
    //private String verifiedByName;        -> renamed to verifierName
    /**
     * Free text describing the severity of the reaction.
     *
     * @see "HITSP/C154 6.07 Severity Free-Text"
     */
    private String severityName;
    /**
     * SNOMED CT code describing the severity of the reaction.
     *
     * @see "HITSP/C154 6.08 Severity Code"
     */
    private String severityCode;
    /**
     * True if the allergy / adverse reaction was historical, otherwise assume observed
     */
    private Boolean historical;

    @SuppressWarnings("unused")
	private String kind;

    private String summary;

    /**
     * For VistA: reference contains the variable pointer to the causitive agent
     */
    private String reference;
    /**
     * List of products that describe the substance causing the allergy / adverse reaction
     *
     * @see "HITSP/C83 Allergy/Drug Sensitivity - Product Detail"
     */
    private List<AllergyProduct> products;
    /**
     * List of reactions to the substance
     *
     * @see "HITSP/C83 Allergy/Drug Sensitivity - Reaction"
     */
    private List<AllergyReaction> reactions;

    private List<AllergyComment> comments;


    // new (renamed) members for new patient bar - cwad
    private String originatorName;

    private String verifierName;

    private String mechanism;

    private List<AllergyDrugClass> drugClasses;

    private List<AllergyObservation> observations;

    private List<JdsCode> codes;

    public Allergy() {
        super(null);
    }

    @JsonCreator
    public Allergy(Map<String, Object> vals) {
        super(vals);
    }

    public void addToProducts(AllergyProduct product) {
        if (products == null) {
            products = new ArrayList<AllergyProduct>();
        }
        products.add(product);
    }

    public void addToReactions(AllergyReaction reaction) {
        if (reactions == null) {
            reactions = new ArrayList<AllergyReaction>();
        }
        reactions.add(reaction);
    }

    public void addToComments(AllergyComment comment) {
        if (comments == null) {
            comments = new ArrayList<AllergyComment>();
        }
        comments.add(comment);
    }

    public void addToDrugClasses(AllergyDrugClass drugClass) {
        if (drugClasses == null) {
            drugClasses = new ArrayList<AllergyDrugClass>();
        }
        drugClasses.add(drugClass);
    }

    public void addToAllergyObservations(AllergyObservation obs) {
        if (observations == null) {
            observations = new ArrayList<AllergyObservation>();
        }
        observations.add(obs);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    // replaced by getMechanism()
//    public String getAdverseEventTypeName() {
//        return adverseEventTypeName;
//    }

    public String getMechanism() {
        return mechanism;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getAdverseEventTypeCode() {
        return adverseEventTypeCode;
    }

    public PointInTime getEntered() {
        return entered;
    }

    public String getEnteredByUid() {
        return enteredByUid;
    }

    // replaced by getOriginatorName
//    public String getEnteredByName() {
//        return enteredByName;
//    }

    public String getOriginatorName() {
        return originatorName;
    }
    public PointInTime getVerified() {
        return verified;
    }

    public String getVerifiedByUid() {
        return verifiedByUid;
    }

    // replaced by getVerifierName()
//    public String getVerifiedByName() {
//        return verifiedByName;
//    }

    public String getVerifierName() {
        return verifierName;
    }

    public String getSeverityName() {
        return severityName;
    }

    /**
     * Solr alias for 'severityName'.
     *
     * @see #getSeverityName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getAllergySeverity() {
        return getSeverityName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSeverityCode() {
        return severityCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Boolean getHistorical() {
        return historical;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReference() {
        return reference;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<AllergyProduct> getProducts() {
        return products;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getAllergyProduct() {
        List<AllergyProduct> products = getProducts();
        if (products == null) return null;
        List<String> productNames = new ArrayList<>(products.size());
        for (AllergyProduct product : products) {
            productNames.add(product.getName());
        }
        return Collections.unmodifiableList(productNames);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<AllergyReaction> getReactions() {
        return reactions;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getAllergyReaction() {
        List<AllergyReaction> reactions = getReactions();
        if (reactions == null) return null;
        List<String> reactionNames = new ArrayList<>(reactions.size());
        for (AllergyReaction reaction : reactions) {
            reactionNames.add(reaction.getName());
        }
        return Collections.unmodifiableList(reactionNames);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<AllergyComment> getComments() {
        return comments;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getComment() {
        List<AllergyComment> comments = getComments();
        if (comments == null) return null;
        List<String> commentStrings = new ArrayList<>(comments.size());
        for (AllergyComment comment : comments) {
            commentStrings.add(comment.getComment());
        }
        return Collections.unmodifiableList(commentStrings);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<AllergyDrugClass> getDrugClasses() {
        return drugClasses;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getDrugClass() {
        List<AllergyDrugClass> drugClasses = getDrugClasses();
        if (drugClasses == null) return null;
        List<String> drugClassStrings = new ArrayList<>(drugClasses.size());
        for (AllergyDrugClass drugClass : drugClasses) {
            drugClassStrings.add(drugClass.getName());
        }
        return Collections.unmodifiableList(drugClassStrings);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<AllergyObservation> getObservations() {
        return observations;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getObservation() {
        List<AllergyObservation> observations = getObservations();
        if (observations == null) return null;
        List<String> observationsStrings = new ArrayList<>(observations.size());
        for (AllergyObservation obs : observations) {
            observationsStrings.add(obs.getSeverity());
        }
        return Collections.unmodifiableList(observationsStrings);
    }

    public String getKind() {
        return "Allergy/Adverse Reaction";
    }

    public String getSummary() {
        if (StringUtils.hasText(summary)) return summary;

        Set<String> productNames = new HashSet<String>();
        if (products != null) {
	        for (AllergyProduct p : products) {
	            productNames.add(p.getName());
	        }
        }
        return StringUtils.collectionToDelimitedString(productNames, ",");
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
    	LOG.debug("Allergy.getCodes(): Entering method.");
    	
    	// Check to see if this already contains the UMLS CUI code.  If it does not, then see if we use the 
    	// terminology database to retrieve and add it.
    	//-----------------------------------------------------------------------------------------------------
    	if (!containsUmlsCuiCode()) {
        	LOG.debug("Allergy.getCodes(): Codes does not already contain a UMLS CUI Code - Trying to find one now.");
    		JdsCode oUmlsCuiCode;
			try {
				oUmlsCuiCode = retrieveUmlsCuiCode();
	    		if (oUmlsCuiCode != null) {
	    			if (this.codes == null) {
	    				this.codes = new ArrayList<JdsCode>();
	    			}
	    			this.codes.add(oUmlsCuiCode);
	    		}
			} 
			catch (TermLoadException e) {
				// We do not want this kind of an error to stop processing on the result...  Just log the message.
				//------------------------------------------------------------------------------------------------
				LOG.error("Failed to lookup UMLS cui code for this allergy.  Error: " + e.getMessage(), e);
			}
    	}
    	
    	LOG.debug("Allergy.getCodes(): Leaving method.");
    	
        return this.codes;
    }

    /**
     * This method will retrieve the UMLS CUI code for this allergy.  If this is a VA allergy, it will do the translation
     * using the VUID.  If this is a DoD allergy, it will use the CHCS IEN for the conversion.
     * 
     * @return The UMLS CUI code for this allergy.
     * @throws TermLoadException 
     */
    private JdsCode retrieveUmlsCuiCode() throws TermLoadException {
    	JdsCode oUmlsCuiCode = null;
    	JLVHddDao oHDDDao = getHDDDao();
    	
    	if (isVAAllergy()) {
    		String sVuid = getAllergyVuid();
        	LOG.debug("Allergy.retrieveUmlsCuiCode(): Retrieving UMLS CUI code for VUID: " + sVuid);
    		JLVMappedCode oMappedCode = oHDDDao.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, sVuid);
    		oUmlsCuiCode = convertMappedToJdsCode(oMappedCode);
    		if ((oUmlsCuiCode != null) &&
    			(NullChecker.isNotNullish(oUmlsCuiCode.getCode()))) {
    			LOG.debug("Allergy.retrieveUmlsCuiCode(): Found UMLS CUI code for VUID: " + sVuid + " - UMLS CUI: " + oUmlsCuiCode.getCode());
    		}
    		else {
    			LOG.debug("Allergy.retrieveUmlsCuiCode(): NO UMLS CUI code mapping found for VUID: " + sVuid);
    		}
    	}
    	else if (isDoDAllergy()) {
    		String sChcsIen = getAllergyChcsIen();
        	LOG.debug("Allergy.retrieveUmlsCuiCode(): Retrieving UMLS CUI code for CHCS IEN: " + sChcsIen);
    		JLVMappedCode oMappedCode = oHDDDao.getMappedCode(MappingType.AllergyCHCSIenToUMLSCui, sChcsIen);
    		oUmlsCuiCode = convertMappedToJdsCode(oMappedCode);
    		if ((oUmlsCuiCode != null) &&
    			(NullChecker.isNotNullish(oUmlsCuiCode.getCode()))) {
    			LOG.debug("Allergy.retrieveUmlsCuiCode(): Found UMLS CUI code for CHCS IEN: " + sChcsIen + " - UMLS CUI: " + oUmlsCuiCode.getCode());
    		}
    		else {
    			LOG.debug("Allergy.retrieveUmlsCuiCode(): NO UMLS CUI code mapping found for CHCS IEN: " + sChcsIen);
    		}
    	}
    	
		return oUmlsCuiCode;
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
     * This method returns true of this is a DoD allergy.  This can be determined by checking to see if there
     * is a CHCS IEN code in the codes array.
     * 
     * @return TRUE if this is a DoD allergy.
     */
    private boolean isDoDAllergy() {
    	boolean bReturnResult = false;
    	
    	if (NullChecker.isNotNullish(getAllergyChcsIen())) {
    		bReturnResult = true;
    	}
    	
		return bReturnResult;
	}

	/**
     * If this is a DoD allergy, then this method returns the CHCS IEN for the allergy.  Otherwise it returns "".
     * 
     * @return The CHCS IEN for the allergy
     */
    private String getAllergyChcsIen() {
    	String sChcsIen = "";
    	LOG.debug("Allergy.getAllergyChcsIen(): Entering method.");
    	
    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((SYSTEM_DOD_ALLERGY_IEN.equalsIgnoreCase(oCode.getSystem())) &&
    				(NullChecker.isNotNullish(oCode.getCode()))) {
    				sChcsIen = oCode.getCode();
    				break;
    			}
    		}
    	}

    	return sChcsIen;
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
     * This method returns true if this is a VA allergy.  It does this by checking to see if there is a VUID
     * 
     * @return TRUE if this is a VA allergy.
     */
	private boolean isVAAllergy() {
		boolean bReturnResult = false;
		
		if (NullChecker.isNotNullish(getAllergyVuid())) {
			bReturnResult = true;
		}
		
		return bReturnResult;
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
	 * This returns the VUID for this allergy if it exists.  If it does not, then "" is returned.
	 *  
	 * @return The VUID for the allergy if it exists.  If it does not, then "" is returned.
	 */
	private String getAllergyVuid() {
		String sVuid = "";
		
		if (NullChecker.isNotNullish(this.products)) {
			for (AllergyProduct oProduct : this.products) {
				if (NullChecker.isNotNullish(oProduct.getVuid())) {
					sVuid = stripVuidFromUrn(oProduct.getVuid());
					break;
				}
			}
		}
		
		return sVuid;
	}

	/**
     * This checks the codes attribute to see if it contains a UMLS Cui code.  If it does, then TRUE is returned.  
     * Otherwise false is returned.
     * 
     * @return TRUE if the codes property contains a UMLS CUI code/
     */
    private boolean containsUmlsCuiCode() {
    	boolean bReturnResult = false;
    	
    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((NullChecker.isNotNullish(oCode.getSystem())) &&
    				(oCode.getSystem().equals(JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI))) {
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
