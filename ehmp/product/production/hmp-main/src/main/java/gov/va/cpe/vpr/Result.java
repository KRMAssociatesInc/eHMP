package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVDodLabsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
/**
 * This includes data about current and historical test results from laboratory or other diagnostic testing performed on the patient.
 * <p/>
 *
 * @see ResultOrganizer
 * @see <a href="http://wiki.hitsp.org/docs/C83/C83-3.html#_Ref232965713">HITSP/C83 Test Result</a>
 */
public class Result extends AbstractPatientObject implements IPatientObject {
    private static Logger log = LoggerFactory.getLogger(Result.class);
    private static final String SYSTEM_DOD_NCID = "DOD_NCID";
    private static final Map<String, String> interpretationCodeDisplayValues;

    static {
        Map<String, String> codesToDisplayVals = new HashMap<String, String>();
        codesToDisplayVals.put("urn:hl7:observation-interpretation:LL", "L*");
        codesToDisplayVals.put("urn:hl7:observation-interpretation:L", "L");
        codesToDisplayVals.put("urn:hl7:observation-interpretation:H", "H");
        codesToDisplayVals.put("urn:hl7:observation-interpretation:HH", "H*");
        interpretationCodeDisplayValues = Collections.unmodifiableMap(codesToDisplayVals);
    }

    public static String getDisplayInterpretationCode(String interpretationCode) {
        return interpretationCodeDisplayValues.get(interpretationCode);
    }

    private String localId;
    private Set<Modifier> modifiers;

    /**
     * The facility where the result occurred
     *
     * @see "HITSP/C154 16.17"
     */
    private String facilityCode;

    /**
     * The facility where the result occurred
     *
     * @see "HITSP/C154 16.18"
     */
    private String facilityName;

    private String groupName;

    private String groupUid;

    /**
     * Specific category of this set of results. <example> Ex: Laboratory
     */
    //private ResultCategory category;
    private String categoryCode;

    private String categoryName;

    /**
     * Status for this observation, e.g., complete, preliminary.
     *
     * @see "HITSP/C154 15.04 Result Status"
     */

    private String resultStatusCode;

    private String resultStatusName;

    /**
     * The biologically relevant date/time for the observation.
     *
     * @see "HITSP/C154 15.02 Result Date/Time"
     */
    private PointInTime observed;

    private PointInTime resulted;

    /**
     * Textual name of specimen.
     */
    private String specimen;

    /**
     * Order number, if known.
     */
    private String orderId;

    /**
     * Uid of encounter, if known.
     */
    private String encounterUid;

    private String comment;

    /**
     * Reference to a collection of results
     */
    private Set<ResultOrganizer> organizers;

    /**
     * A coded representation of the observation performed.
     * <p/>
     * LOINC for lab, CPT for radiology
     *
     * @see "HITSP/C154 15.03 Result Type"
     */
    private String typeCode;

    /**
     * Readable name of test/exam.
     */
    private String typeName;

    /**
     * local/print/display name of the test (ie: NA for Sodium)
     */
    private String displayName;

    /**
     * The value of the result
     *
     * @see "HITSP/C154 15.05 Result Value"
     */
    private String result;
    /**
     * The units of measurement of the result
     *
     * @see "HITSP/C154 15.05 Result Value"
     */
    private String units;
    /**
     * An abbreviated interpretation of the observation, e.g., normal, abnormal, high, etc.
     *
     * @see "HITSP/C154 15.06 Result Interpretation"
     */
    private String interpretationCode;

    private String interpretationName;
    /**
     * The low reference value for the observation
     *
     * @see "HITSP/C154 15.07 Result Reference Range"
     */
    private String low;
    /**
     * The high reference value for the observation
     *
     * @see "HITSP/C154 15.07 Result Reference Range"
     */
    private String high;

    // LOINC code
    private String method;

    // SNOMED CT code, if possible
    private String bodySite;
    
    @JsonIgnore
    private JLVHddDao oJLVHddDao = null;

    /**
     * Report text. Likley lazily loaded.
     * <p/>
     * (radiology, pathology, micro, etc.)
     */
    private Document document;
    
    private Set<String> lncCodes;
    private List<JdsCode> codes;

    public Result() {
        super(null);
    }

    @JsonCreator
    public Result(Map<String, Object> vals) {
        super(vals);
    }

    @JsonView(JSONViews.SolrView.class)
    @Override
    public String getDomain() {
        return getClass().getSimpleName().toLowerCase();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonIgnore
    public Set<ResultOrganizer> getOrganizers() {
        return organizers;
    }

    public String getTypeCode() {
        return typeCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getTypeName() {
        return typeName;
    }

    /**
     * Solr alias for 'typeName'.
     * @see #getTypeName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getLabResultType() {
        return getTypeName();
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getResult() {
        return result;
    }
    
    /**
     * Returns a Float or Integer if either can be parsed.
     */
    public Number getResultNumber() {
    	return POMUtils.parseNumber(getResult());
    }

    public String getUnits() {
        return units;
    }

    @JsonView(JSONViews.SolrView.class)
    public String getQualifiedNameUnits() {
        return getQualifiedName()+(units==null?"":" "+units);
    }

    public String getInterpretationCode() {
        return interpretationCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getInterpretationName() {
        return interpretationName;
    }

    /**
     * Solr alias for 'interpretation'.
     * @see #getInterpretationName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getInterpretation() {
        return getInterpretationName();
    }

    public String getLow() {
        return low;
    }

    public String getHigh() {
        return high;
    }

    public String getMethod() {
        return method;
    }

    public String getBodySite() {
        return bodySite;
    }

    /** lazily loaded full report document for micro data */
    @JsonIgnore
    public Document getDocument() {
    	if (this.document != null) return this.document;
    	
    	// for micro data, load the document result (if any) and store in this.document
    	if (isMicro() && daoRef != null && daoRef.get() != null) {
    		List<String> results = getResultUid();
    		if (results != null && !results.isEmpty()) {
    			this.document = daoRef.get().findByUID(Document.class, results.get(0));
    		}
    	}
        return document;
    }

    public Set<Modifier> getModifiers() {
        return modifiers;
    }

    @JsonIgnore
    public ResultOrganizer getAccession() {
        if (organizers == null) return null;
        for (ResultOrganizer organizer : organizers) {
            if (organizer.getOrganizerType().equals("accession") ||
                    organizer.getOrganizerType().equals("GENERAL RADIOLOGY") ||
                    organizer.getOrganizerType().equals("panel")) {
                return organizer;
            }
        }
        return null;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getGroupName() {
        return groupName;
    }

    public String getGroupUid() {
        return groupUid;
    }

    /**
     * The biologically relevant date/time for the observation.
     *
     * @see ResultOrganizer
     * @see "HITSP/C154 15.02 Result Date/Time"
     */
    public PointInTime getObserved() {
        return observed;
    }

    public PointInTime getResulted() {
        return resulted;
    }

    public String getResultStatusCode() {
        return resultStatusCode;
    }

    public String getResultStatusName() {
        return resultStatusName;
    }

    public String getSpecimen() {
        return specimen;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getQualifiedName() {
        String qn = "";
        if (typeName != null) {
            qn = typeName;
            if (getSpecimen() != null) {
                qn += " (" + getSpecimen() + ")";
            }
        } else if (getSpecimen() != null) {
            qn = getSpecimen();
        }
        return qn;
    }

    public String getSummary() {
        String s = getQualifiedName();
        if (result != null) {
        	s += " " + result;
        }
        if (interpretationCode != null) {
            s += "<em>" + getDisplayInterpretationCode() + "</em>";
        }
        if (units != null) {
            s += " " + units;
        }
        return s;
    }
    
    public boolean isAbnormal() {
    	return (getInterpretationCode() != null);
    }

    private String getDisplayInterpretationCode() {
        return interpretationCodeDisplayValues.get(getInterpretationCode());
    }

    public String getOrderId() {
        return orderId;
    }

    public String getComment() {
        return comment;
    }

    public String getEncounterUid() {
        return encounterUid;
    }
    
    public void addToOrganizers(ResultOrganizer o) {
        if (organizers == null) {
            organizers = new HashSet<>();
        }
        if (!organizers.contains(o)) {
            organizers.add(o);
            if (o.getResults() == null || !o.getResults().contains(this)) {
                o.addToResults(this);
            }
        }
    }

    public void removeFromOrganizers(ResultOrganizer o) {
        if (organizers == null) return;
        organizers.remove(o);
        if (o.getResults().contains(this))
            o.removeFromResults(this);
    }
    
    /**
     * Private setter, mainly used by Jaxson to prevent it from trying to invoke getLNCCodes() when 
     * setting this property.
     * 
     * @param codes
     */
    @JsonSetter
    void setLNCCodes(Set<String> codes) {
    	this.lncCodes = codes;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.SolrView.class})
    public Set<String> getLNCCodes() {
    	log.debug("Result.getLNCCodes(): Entering method.");
    	// if they were already computed/stored, return it
    	if (this.lncCodes != null) {
//    		return this.lncCodes;
    	}
    	
    	// otherwise compute the values
    	TermEng eng = TermEng.getInstance();
    	Set<String> ret = new LinkedHashSet<String>();
    	
    	// Index the original typeCode and VUID (if any) 
    	String typeCode = getTypeCode();
    	Object vuid = getProperty("vuid");
        log.debug("Result.getLNCCodes(): Finding LOINC Codes for vuid: " + vuid);
        if (typeCode != null) {
            log.debug("Result.getLNCCodes(): For LOINC - Adding typeCode to return set: " + typeCode);
            ret.add(typeCode);
        }
        if (vuid != null) {
            log.debug("Result.getLNCCodes(): For LOINC - Adding vuid to return set: " + vuid);
    		ret.add(vuid.toString());
    	}
    	
    	if (eng != null) {
            log.debug("Result.getLNCCodes(): Finding concept for typeCode: " + typeCode);
            Concept c = eng.getConcept(typeCode);
            if (c != null) {
                log.debug("Result.getLNCCodes(): Found concept for adding ancestors to the set.");
                for (String sAncestor : c.getAncestorSet()) {
                    log.debug("Result.getLNCCodes(): Adding ancestor code: " + sAncestor);
                }
	   			ret.addAll(c.getAncestorSet());
	   		}
    	}
    	return this.lncCodes = ret;
    }
    
    public String getKind() {
        // we could potentially move this kind of logic to a "KindService(s)" if that is less smelly
        //categoryCodeToKind[category?.code] ?: "Unknown"
        if (getCategoryName() == null) {
            return "Unknown";
        }
        return getCategoryName();
    }

    public boolean isMicro() {
        return categoryCode != null && categoryCode.equals("urn:va:lab-category:MI");
    }
    
    @JsonIgnore
    public List<String> getResultUid() {
        List<String> ret = new ArrayList<>();
        @SuppressWarnings("unchecked")
        Collection<Map<?,?>> objs = (Collection<Map<?,?>>) getProperty("results");
        if (objs != null) {
            for (Map<?,?> map : objs) {
                String uid = (String) map.get("resultUid");
                if (uid != null) ret.add(uid);
            }
        }
        return ret;
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
    	log.debug("Result.getCodes(): Entering method.");
    	
    	// Check to see if this already contains the LOINC code.  If it does not, then see if we use the 
    	// terminology database to retrieve and add it.
    	//-----------------------------------------------------------------------------------------------------
    	if (!containsLoincCode()) {
        	log.debug("Result.getCodes(): Codes does not already contain a LOINC Code - Trying to find one now.");
    		JdsCode oLoincCode;
			try {
				oLoincCode = retrieveLoincCode();
	    		if (oLoincCode != null) {
	    			if (this.codes == null) {
	    				this.codes = new ArrayList<JdsCode>();
	    			}
	    			this.codes.add(oLoincCode);
	    		}
			} 
			catch (TermLoadException e) {
				// We do not want this kind of an error to stop processing on the result...  Just log the message.
				//------------------------------------------------------------------------------------------------
				log.error("Result.getCodes(): Failed to lookup LOINC code for this lab result.  Error: " + e.getMessage(), e);
			}
    	}
    	
    	log.debug("Result.getCodes(): Leaving method.");
    	
        return this.codes;
    }
    
	/**
     * This checks the codes attribute to see if it contains a LOINC code.  If it does, then TRUE is returned.  
     * Otherwise false is returned.
     * 
     * @return TRUE if the codes property contains a LOINC code/
     */
    private boolean containsLoincCode() {
    	boolean bReturnResult = false;
    	
    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((NullChecker.isNotNullish(oCode.getSystem())) &&
    				(oCode.getSystem().equals(JLVDodLabsMap.CODE_SYSTEM_LOINC))) {
    				bReturnResult = true;
    				break;
    			}
    		}
    	}
    	
		return bReturnResult;
	}

    /**
     * This method will retrieve the LOINC code for this lab result.  If this is a VA result, it will do the translation
     * using the VUID.  If this is a DoD allergy, it will use the DOD NCID for the conversion.
     * 
     * @return The LOINC code for this lab result.
     * @throws TermLoadException 
     */
    private JdsCode retrieveLoincCode() throws TermLoadException {
    	JdsCode oLoincCode = null;
    	setupJLVHddDao();
    	
    	if (isVAResult()) {
    		String sLoincCode = getLoincCode();
        	log.debug("Result.retrieveLoincCode(): Retrieving LOINC code information for VUID: " + sLoincCode);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.LabUseLOINCtoGetText, sLoincCode);
    		oLoincCode = convertMappedToJdsCode(oMappedCode);
    		if ((oLoincCode != null) &&
    			(NullChecker.isNotNullish(oLoincCode.getCode()))) {
    			log.debug("Result.retrieveLoincCode(): Found LOINC code information for LOINC Code: " + sLoincCode);
    		}
    		else {
    			log.debug("Result.retrieveLoincCode(): NO LOINC code mapping found for LOINC Code: " + sLoincCode);
    		}
    	}
    	else if (isDoDResult()) {
    		String sDodNcid = getLabDodNcid();
        	log.debug("Result.retrieveLoincCode(): Retrieving LOINC code for DOD NCID: " + sDodNcid);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.LabDODNcidToLOINC, sDodNcid);
    		oLoincCode = convertMappedToJdsCode(oMappedCode);
    		if ((oLoincCode != null) &&
    			(NullChecker.isNotNullish(oLoincCode.getCode()))) {
    			log.debug("Result.retrieveLoincCode(): Found LOINC code for DOD NCID: " + sDodNcid + " - LOINC code: " + oLoincCode.getCode());
    		}
    		else {
    			log.debug("Result.retrieveLoincCode(): NO LOINC code mapping found for DOD NCID: " + sDodNcid);
    		}
    	}
    	
		return oLoincCode;
	}
    
	/**
     * If this is a DoD allergy, then this method returns the CHCS IEN for the allergy.  Otherwise it returns "".
     * 
     * @return The CHCS IEN for the allergy
     */
    private String getLabDodNcid() {
    	String sDodNcid = "";
    	log.debug("Result.getLabDodNcid(): Entering method.");
    	
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
    
    
    /**
     * On VA Results, the loinc code, if it exists, should be the message already.  It will either be in the typeCode or in the 
     * codes array.
     * 
     * @return The LOINC code that was extracted.
     */
	private String getLoincCode() {
		String sLoincCode = "";
		
		if ((NullChecker.isNotNullish(this.typeCode)) &&
			(this.typeCode.startsWith("urn:lnc:"))) {
			sLoincCode = this.typeCode.substring("urn:lnc:".length());
		}
		else if (NullChecker.isNotNullish(this.lncCodes)) {
			for (String sCode : this.lncCodes) {
				// There may be multiple LOINC codes.  The first one should be the parent loinc code.
				//------------------------------------------------------------------------------------
				if ((NullChecker.isNotNullish(sCode)) &&
					(sCode.startsWith("urn:lnc:"))) {
					sLoincCode = sCode.substring("urn:lnc:".length());
					break;
				}
			}
		}

		return sLoincCode;
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
     * This method returns true if this is a VA lab result.  Right now it is doing this by checking to see if 
     * the UID contains the word DOD.  If it does not - then it is assumed to be VA.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     * 
     * @return TRUE if this is a VA lab result.
     */
	private boolean isVAResult() {
		return (! isDoDResult());
	}
	
	/**
     * This method returns true if this is a DoD lab result.  Right now it is doing this by checking to see if 
     * the UID contains the word DOD.  If it does - then it is assumed to be DOD.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     * 
     * @return TRUE if this is a VA lab result.
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
}
