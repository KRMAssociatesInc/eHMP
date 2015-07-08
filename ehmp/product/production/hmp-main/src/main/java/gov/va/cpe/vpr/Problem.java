package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVIcd9SnomedMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
public class Problem extends AbstractPatientObject implements IPatientObject {
    private static Logger log = LoggerFactory.getLogger(Problem.class);
	private static final String SYSTEM_DOD_MEDCIN = "DOD_MEDCIN";

    private static final String PROBLEM = "Problem";

    private String localId;
    private String predecessor;
    private String successor;
    private String facilityCode;
    private String facilityName;
    private String locationCode;
    private String locationName;
    private String locationDisplayName;
    private String service;
    private String providerName;
    private String providerDisplayName;
    private String providerCode;
    private String problemType;
    private String problemText;
    private String code; // what code does this refer to?
    private String icdCode;
    private String icdName;
    private String statusCode;
    private String statusName;
    private String statusDisplayName;
    private String acuityCode;
    private String acuityName;
    private String history;
    private Boolean unverified;
    private Boolean removed;
    private PointInTime entered;
    private PointInTime updated;
    private PointInTime onset;
    private PointInTime resolved;
    private Boolean serviceConnected;
    private List<ProblemComment> comments;
    private List<JdsCode> codes;

    @JsonIgnore
    private JLVHddDao oJLVHddDao = null;

    public Problem() {
        super(null);
    }

    @JsonCreator
    public Problem(Map<String, Object> vals) {
        super(vals);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getPredecessor() {
        return predecessor;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSuccessor() {
        return successor;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocationCode() {
		return locationCode;
	}

	public String getLocationName() {
		return locationName;
	}

	public String getService() {
        return service;
    }
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getProblemType() {
        return problemType;
    }

    public String getProviderName() {
		return providerName;
	}

    // not sure how to alias this in Solr so that it is called "provider_name" without colliding with getter
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderDisplayName() {
        if (providerDisplayName == null) {
            providerDisplayName = VistaStringUtils.nameCase(getProviderName());
        }
        return providerDisplayName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderCode() {
		return providerCode;
	}

    public String getProblemText() {
        return problemText;
    }

    // not sure how to alias this in Solr so that it is called "location_name" without colliding with getter
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocationDisplayName() {
        if (locationDisplayName == null) {
            locationDisplayName = VistaStringUtils.nameCase(getLocationName());
        }
        return locationDisplayName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCode() {
        return code;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusCode() {
        return statusCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusName() {
        return statusName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusDisplayName() {
        if (statusDisplayName == null) {
            statusDisplayName = VistaStringUtils.nameCase(getStatusName());
        }
        return statusDisplayName;
    }

    /**
     * Solr alias for 'statusDisplayName'.
     * @see #getStatusDisplayName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getProblemStatus() {
        return getStatusDisplayName();
    }

    public String getAcuityCode() {
		return acuityCode;
	}

	public String getAcuityName() {
		return acuityName;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getHistory() {
        return history;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Boolean getUnverified() {
        return unverified;
    }

    public Boolean getRemoved() {
        return removed;
    }

    public PointInTime getEntered() {
        return entered;
    }

    public PointInTime getUpdated() {
        return updated;
    }

    public PointInTime getOnset() {
        return onset;
    }

    public PointInTime getResolved() {
        return resolved;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Boolean getServiceConnected() {
    	return (serviceConnected == null)?Boolean.FALSE:serviceConnected;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<ProblemComment> getComments() {
        return comments;
    }

    /** Consolidated comment record, only used by SOLR */
    @JsonView(JSONViews.SolrView.class)
    public List<String> getComment() {
        if (comments == null || comments.isEmpty()) return Collections.emptyList();
        List<String> commentStrings = new ArrayList<>(comments.size());
        for (ProblemComment comment : this.getComments()) {
            commentStrings.add(comment.getComment());
        }
        return Collections.unmodifiableList(commentStrings);
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getKind() {
        // we could potentially move this kind of logic to a "KindService(s)" if that is less smelly
        return PROBLEM;
    }

    @Override
    public String getSummary() {
        return problemText;
    }

    public List getTaggers() {
//        if (uid)
//            return manualFlush { Tagger.findAllByUrl(uid) }
//        else
//            return []
        return null;
        //TODO - fix this
    }

    public String getIcdCode() {
        return icdCode;
    }

    public String getIcdName() {
        return icdName;
    }
    
    /**
     * Get the ICD9 group code.
     * 
     * Example: "E819.9" => E819, 799.9 => 799
     */
    public String getIcdGroup() {
    	if (icdCode != null && icdCode.startsWith("urn:icd:") 
    			&& icdCode.length() >= 11 && icdCode.indexOf('.') > 0) {
    		return icdCode.substring(8, icdCode.indexOf('.'));
    	}
    	return null;
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
    	log.debug("Problem.getCodes(): Entering method.");
    	
    	// Check to see if this already contains the SNOMED CT code.  If it does not, then see if we use the 
    	// terminology database to retrieve and add it.
    	//-----------------------------------------------------------------------------------------------------
    	if (!containsSnomedCTCode()) {
        	log.debug("Problem.getCodes(): Codes does not already contain a SNOMED CT Code - Trying to find one now.");
    		JdsCode oSnomedCTCode;
			try {
				oSnomedCTCode = retrieveSnomedCTCode();
	    		if (oSnomedCTCode != null) {
	    			if (this.codes == null) {
	    				this.codes = new ArrayList<JdsCode>();
	    			}
	    			this.codes.add(oSnomedCTCode);
	    		}
			} 
			catch (TermLoadException e) {
				// We do not want this kind of an error to stop processing on the result...  Just log the message.
				//------------------------------------------------------------------------------------------------
				log.error("Problem.getCodes(): Failed to lookup SNOMED CT code for this result.  Error: " + e.getMessage(), e);
			}
    	}
    	
    	log.debug("Problem.getCodes(): Leaving method.");
    	
        return this.codes;
    }
    
	/**
     * This checks the codes attribute to see if it contains a SNOMED CT code.  If it does, then TRUE is returned.  
     * Otherwise false is returned.
     * 
     * @return TRUE if the codes property contains a SNOMED CT code.
     */
    private boolean containsSnomedCTCode() {
    	boolean bReturnResult = false;
    	
    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((NullChecker.isNotNullish(oCode.getSystem())) &&
    				(oCode.getSystem().equals(JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT))) {
    				bReturnResult = true;
    				break;
    			}
    		}
    	}
    	
		return bReturnResult;
	}
    
    /**
     * This method will retrieve the SNOMED CT code for this problem result.  If this is a VA result, it will do the translation
     * using the ICD9 Code.  If this is a DoD Problem, it will use the MEDCIN ID for the conversion.
     * 
     * @return The SNOMED CT code for this problem result.
     * @throws TermLoadException 
     */
    private JdsCode retrieveSnomedCTCode() throws TermLoadException {
    	JdsCode oSnomedCTCode = null;
    	setupJLVHddDao();
    	
    	if (isVAResult()) {
    		String sIcd9Code = getProblemIcd9Code();
        	log.debug("Problem.retrieveSnomedCTCode(): Retrieving SNOMED CT code information for ICD-9: " + sIcd9Code);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.ProblemsIcd9ToSnomedCT, sIcd9Code);
    		oSnomedCTCode = convertMappedToJdsCode(oMappedCode);
    		if ((oSnomedCTCode != null) &&
    			(NullChecker.isNotNullish(oSnomedCTCode.getCode()))) {
    			log.debug("Problem.retrieveSnomedCTCode(): Found SNOMED CT code information for ICD-9 Code: " + sIcd9Code);
    		}
    		else {
    			log.debug("Problem.retrieveSnomedCTCode(): NO SNOMED CT code mapping found for ICD-9 Code: " + sIcd9Code);
    		}
    	}
    	else if (isDoDResult()) {
    		String sDodMedcinId = getProblemDodMedcinId();
        	log.debug("Problem.retrieveSnomedCTCode(): Retrieving SNOMED CT code for DOD MEDCIN ID: " + sDodMedcinId);
    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.ProblemsMedcinIdToSnomedCT, sDodMedcinId);
    		oSnomedCTCode = convertMappedToJdsCode(oMappedCode);
    		if ((oSnomedCTCode != null) &&
    			(NullChecker.isNotNullish(oSnomedCTCode.getCode()))) {
    			log.debug("Problem.retrieveSnomedCTCode(): Found SNOMED CT code for DOD MEDCIN ID: " + sDodMedcinId + " - SNOMED CT code: " + oSnomedCTCode.getCode());
    		}
    		else {
    			log.debug("Problem.retrieveSnomedCTCode(): NO SNOMED CT code mapping found for DOD MEDCIN ID: " + sDodMedcinId);
    		}
    	}
    	
		return oSnomedCTCode;
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
	 * This returns the ICD9 Code for this result if it exists.  If it does not, then "" is returned.
	 *  
	 * @return The ICD9 Code for the result if it exists.  If it does not, then "" is returned.
	 */
	private String getProblemIcd9Code() {
		String sIcd9Code = "";
		
		if (NullChecker.isNotNullish(this.icdCode)) {
			sIcd9Code = stripIcd9CodeFromUrn(this.icdCode);
		}
		
		return sIcd9Code;
	}

	/**
	 * This routine strips off the prefix on the ICD9 Code if it exists.
	 * 
	 * @param sIcd9Urn The ICD9 Code URN.
	 * @return The ICD9 code without the URN prefix
	 */
	private String stripIcd9CodeFromUrn(String sIcd9Urn) {
		String sReturnValue = sIcd9Urn;
		
		if ((NullChecker.isNotNullish(sIcd9Urn)) &&
			(sIcd9Urn.startsWith("urn:icd:"))) {
			sReturnValue = sIcd9Urn.substring("urn:icd:".length());
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
     * If this is a DoD result, then this method returns the DOD MEDCIN ID for the result.  Otherwise it returns "".
     * 
     * @return The DOD MEDCIN ID for the result
     */
    private String getProblemDodMedcinId() {
    	String sDodMedcinId = "";
    	log.debug("Problem.getProblemDodMedcinId(): Entering method.");
    	
    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((SYSTEM_DOD_MEDCIN.equalsIgnoreCase(oCode.getSystem())) &&
    				(NullChecker.isNotNullish(oCode.getCode()))) {
    				sDodMedcinId = oCode.getCode();
    				break;
    			}
    		}
    	}

    	return sDodMedcinId;
	}
}
