package gov.va.cpe.vpr;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVVitalsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VitalSign extends AbstractPatientObject implements IPatientObject {
    private static Logger log = LoggerFactory.getLogger(Result.class);
    private static final String SYSTEM_DOD_NCID = "DOD_NCID";

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

    /**
     * Status for this observation, e.g., complete, preliminary.
     *
     * @see "HITSP/C154 14.04 Vital Sign Result Status"
     */
    private String resultStatusCode;

    private String resultStatusName;

    /**
     * The biologically relevant date/time for the observation.
     * <p/>
     * In VistA, this corresponds to the 'taken' time.
     *
     * @see "HITSP/C154 14.02 Vital Sign Result Date/Time"
     */
    private PointInTime observed;

    /**
     * In VistA, this corresponds to the 'entered' time.
     */
    private PointInTime resulted;

    /**
     * Reference to encounter, if known.
     */
    private Encounter encounter;

    private String locationCode;
    private String locationName;

    private String kind;
    private String summary;

    /**
     * Reference to a collection of vital signs
     */
    private VitalSignOrganizer organizer;
    private String organizerUid;

    /**
     * A coded representation of the observation performed.
     *
     * @see "HITSP/C154 14.03 Vital Sign Result Type"
     */
    private String typeCode;

    /**
     * Readable name of test/exam.
     */
    private String typeName;

   /**
    * Abbreviated name of test/exam.
    */
    private String displayName;

    /**
     * The value of the result
     *
     * @see "HITSP/C154 14.05 Vital Sign Result Value"
     */
    private String result;
    /**
     * The units of measurement of the result
     *
     * @see "HITSP/C154 14.05 Vital Sign Result Value"
     */
    private String units;

    private String metricResult;

    private String metricUnits;

    /**
     * An abbreviated interpretation of the observation, e.g., normal, abnormal, high, etc.
     *
     * @see "HITSP/C154 14.06 Vital Sign Result Interpretation"
     */
    private String interpretationCode;

    private String interpretationName;

    /**
     * The low reference value for the observation
     *
     * @see "HITSP/C154 14.07 Vital Sign Result Reference Range"
     */
    private String low;
    /**
     * The high reference value for the observation
     *
     * @see "HITSP/C154 14.07 Vital Sign Result Reference Range"
     */
    private String high;

    // LOINC code
    private String method;

    // SNOMED CT code, if possible
    private String bodySite;

    /**
     * Report text.
     */
    private String document;
    
    // True if vitals is patient generated data
    private boolean patientGeneratedDataFlag;

    private List<JdsCode> codes;
    
    @JsonIgnore
    private JLVHddDao oJLVHddDao = null;

    @JsonCreator
    public VitalSign(Map<String, Object> vals) {
        super(vals);
    }

    public VitalSign() {
        super(null);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    //      @JsonIgnore
    @JsonBackReference("vitalSignsOrganizer-vitalSign")
    public VitalSignOrganizer getOrganizer() {
        return organizer;
    }

    void setOrganizer(VitalSignOrganizer organizer) {
        this.organizer = organizer;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
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
    public String getVitalSignType() {
        return getTypeName();
    }

    public String getResult() {
        return result;
    }

    public String getUnits() {
        return units;
    }

    public String getMetricResult() {
        return metricResult;
    }

    public String getMetricUnits() {
        return metricUnits;
    }

    public String getInterpretationCode() {
        return interpretationCode;
    }

    public String getInterpretationName() {
        return interpretationName;
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

    public String getDocument() {
        return document;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }
    

    /**
     * The biologically relevant date/time for the observation.
     * <p/>
     * In VistA, this corresponds to the 'taken' time.
     *
     * @see "HITSP/C154 14.02 Vital Sign Result Date/Time"
     */
    public PointInTime getObserved() {
        return observed;
    }

    /**
     * @see VitalSignOrganizer
     */
    public PointInTime getResulted() {
        return resulted;
    }

    /**
     * @see VitalSignOrganizer
     */
    public String getResultStatusCode() {
        return resultStatusCode;
    }

    public String getResultStatusName() {
        return resultStatusName;
    }

    public String getSummary() {
        StringBuffer s = new StringBuffer("");
        if (typeName != null) {
            s.append(typeName);
        }

        if (result != null) {
            s.append(" ");
            s.append(result);
        }

        if (interpretationCode != null) {
            s.append(interpretationCode);
        }

        if (units != null) {
            s.append(" ");
            s.append(units);
        }
        return s.toString();
    }

    public String getKind() {
        return "Vital Sign";
    }

    public List getTaggers() {
//TODO - fix this    	
//        if (uid)
//            return manualFlush { Tagger.findAllByUrl(uid) }
//        else
//            return []
        return null;
    }

    public Encounter getEncounter() {
        return encounter;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public String getLocationName() {
        return locationName;
    }

    //Solr index will be created for typeName as qualified_name
    public String getQualifiedName() {
        return typeName;
    }

    public String getDisplayName() {
        return displayName;
    }
    
    public boolean getPatientGeneratedDataFlag () {
    	if ((locationCode != null) && (!locationCode.isEmpty())) {
    		patientGeneratedDataFlag = locationCode.equals("PGD");
    	}
    	return patientGeneratedDataFlag;
    }
    
    public void setPatientGeneratedDataFlag(boolean pgd) {
    	patientGeneratedDataFlag = pgd;
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
    	log.debug("VitalSign.getCodes(): Entering method.");
    	
    	// Check to see if this already contains the LOINC code.  If it does not, then see if we use the 
    	// terminology database to retrieve and add it.
    	//-----------------------------------------------------------------------------------------------------
    	if (!containsLoincCode()) {
        	log.debug("VitalSign.getCodes(): Codes does not already contain a LOINC Code - Trying to find one now.");
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
				log.error("VitalSign.getCodes(): Failed to lookup LOINC code for this result.  Error: " + e.getMessage(), e);
			}
    	}
    	
    	log.debug("VitalSign.getCodes(): Leaving method.");
    	
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
    				(oCode.getSystem().equals(JLVVitalsMap.CODE_SYSTEM_LOINC))) {
    				bReturnResult = true;
    				break;
    			}
    		}
    	}
    	
		return bReturnResult;
	}

    /**
     * This method will retrieve the LOINC code for this vitals result.  If this is a VA result, it will do the translation
     * using the VUID.  If this is a DoD result, it will use the DOD NCID for the conversion.
     * 
     * @return The LOINC code for this vitals result.
     * @throws TermLoadException 
     */
    private JdsCode retrieveLoincCode() throws TermLoadException {
    	JdsCode oLoincCode = null;
    	setupJLVHddDao();
    	
    	if (isVAResult()) {
    		String sVuidCode = getVitalsVuid();
        	log.debug("VitalSign.retrieveLoincCode(): Retrieving LOINC code information for VUID: " + sVuidCode);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.VitalsVuidToLoinc, sVuidCode);
    		oLoincCode = convertMappedToJdsCode(oMappedCode);
    		if ((oLoincCode != null) &&
    			(NullChecker.isNotNullish(oLoincCode.getCode()))) {
    			log.debug("VitalSign.retrieveLoincCode(): Found LOINC code information for LOINC Code: " + sVuidCode);
    		}
    		else {
    			log.debug("VitalSign.retrieveLoincCode(): NO LOINC code mapping found for LOINC Code: " + sVuidCode);
    		}
    	}
    	else if (isDoDResult()) {
    		String sDodNcid = getVitalsDodNcid();
        	log.debug("VitalSign.retrieveLoincCode(): Retrieving LOINC code for DOD NCID: " + sDodNcid);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.VitalsDODNcidToLoinc, sDodNcid);
    		oLoincCode = convertMappedToJdsCode(oMappedCode);
    		if ((oLoincCode != null) &&
    			(NullChecker.isNotNullish(oLoincCode.getCode()))) {
    			log.debug("VitalSign.retrieveLoincCode(): Found LOINC code for DOD NCID: " + sDodNcid + " - LOINC code: " + oLoincCode.getCode());
    		}
    		else {
    			log.debug("VitalSign.retrieveLoincCode(): NO LOINC code mapping found for DOD NCID: " + sDodNcid);
    		}
    	}
    	
		return oLoincCode;
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
     * This method returns true if this is a VA result.  Right now it is doing this by checking to see if 
     * the UID contains the word DOD.  If it does not - then it is assumed to be VA.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     * 
     * @return TRUE if this is a VA vital result.
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
     * @return TRUE if this is a VA vital result.
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
	 * This returns the VUID for this result if it exists.  If it does not, then "" is returned.
	 *  
	 * @return The VUID for the result if it exists.  If it does not, then "" is returned.
	 */
	private String getVitalsVuid() {
		String sVuid = "";
		
		if (NullChecker.isNotNullish(this.typeCode)) {
			sVuid = stripVuidFromUrn(this.typeCode);
		}
		
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
    private String getVitalsDodNcid() {
    	String sDodNcid = "";
    	log.debug("VitalSign.getVitalsDodNcid(): Entering method.");
    	
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
