package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.*;

/**
 * This describes the interactions between the patient and clinicians.
 * Interaction includes both in-person and non-in-person encounters such as
 * telephone and email communication.
 *
 * @see <a
 *      href="http://wiki.hitsp.org/docs/C83/C83-3.html#_Ref232966055">HITSP/C83
 *      Encounter</a>
 */
public class Encounter extends AbstractPatientObject implements Comparable<Encounter>, IPatientObject {
	private static final long serialVersionUID = 1L;
	private static final Map<String, String> categoryCodeToKind;
	static {
	    Map<String, String> aMap = new HashMap<String, String>();
	    aMap.put("urn:va:encounter-category:AP", "Appointment");
	    aMap.put("urn:va:encounter-category:NS", "No-Show Appointment");
	    
	    aMap.put("urn:va:encounter-category:NH", "Admission"); // Nursing Home
	    aMap.put("urn:va:encounter-category:AD", "Admission"); // Admission
	    aMap.put("urn:va:encounter-category:TC", "Visit"); // Phone Contact
	    aMap.put("urn:va:encounter-category:OV", "Visit"); // Outpatient Visit
	    aMap.put("urn:va:encounter-category:CR", "Visit"); // Chart Review
	    aMap.put("urn:va:encounter-category:O", "Visit"); // Other
	    aMap.put("urn:va:encounter-category:U", "Visit"); // Unknown
	    
	    categoryCodeToKind = Collections.unmodifiableMap(aMap);
	}

	private Boolean current;

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
     * VistA visit number for this encounter, if applicable.
     */
    private String localId;
    /**
     * Free text describing the Encounter Type/emCode)
     *
     * @see "HITSP/C154 16.03 Encounter Free Text Type"
     */
    private String typeName;
    private String typeDisplayName;
    /**
     * This is a coded value describing the type of the Encounter
     * <p/>
     * Should be a CPT-4 code in the range 99200-99299 (E&M Code)
     *
     * @see "HITSP/C154 16.02 Encounter Type"
     */
    private String typeCode;
    /**
     * This is used to categorize patients by the site where the encounter
     * occurred , e.g., Emergency, Inpatient, or Outpatient.
     *
     * @see "HITSP/C154 16.10 Patient Class"
     */
//	private PatientClass patientClass;
    private String patientClassCode;
    private String patientClassName;
    /**
     * The date and time of the Encounter
     *
     * @see "HITSP/C154 16.04 Encounter Date/Time"
     */
    private PointInTime dateTime;
    /**
     * The duration of the Encounter
     *
     * @see "HITSP/C154 16.04 Encounter Date/Time"
     */
    private String duration;
    /**
     * For VistA: distinguishes appointments, past visits, telecom, etc.
     */
//	private EncounterCategory category;
    private String categoryCode;
    private String categoryName;
    /**
     * For VistA: the service field from the SPECIALTY file (42.4)
     */
    private String service;
    /**
     * C80 specifies a subset of SNOMED CT for this
     */
    private String specialty;
    /**
     * VistA Stop Code associated from the location
     */
    private String stopCode;
    /**
     * VistA Stop Code Name
     */
    private String stopCodeName;
    /**
     * VistA Appointment Status:
     * N=No-Show, C=Canceled, R=Scheduled/Kept, NT=No Action Taken
     */
    private String appointmentStatus;
    /**
     * VistA Hospital Location name.
     *
     * @see "HITSP/C154 16.11 In Facility Location"
     */
    private String locationUid;
    /**
     * VistA Hospital Location name.
     *
     * @see "HITSP/C154 16.11 In Facility Location"
     */
    private String locationName;

    private String shortLocationName;

    private String locationDisplayName;

    private Boolean locationOos;
    /**
     * Name of current room and/or bed (includes EDIS rooms)
     */
    private String roomBed;
    /**
     * Indicates the rationale for the encounter
     *
     * @see "HITSP/C154 16.13 Reason for Visit"
     */
    private String reason;
    /**
     * Coded rationale for the encounter. SNOMED CT for this.
     *
     * @see "HITSP/C154 16.13 Reason for Visit"
     */
    private String reasonCode;
    /**
     * Discharge Disposition (sometimes called “Discharge Status”) is the
     * person‟s anticipated location or status following the encounter (e.g.
     * death, transfer to home/hospice/snf/AMA)
     *
     * @see "HITSP/C154 16.09 Discharge Disposition"
     */
//	private DischargeDisposition disposition;
    private String dispositionCode;
    private String dispositionName;
    /**
     * Identifies where the patient was admitted.
     *
     * @see "HITSP/C154 16.06 Admission Source"
     */
//	private AdmissionSource source;
    /**
     * Names and other information for the persons or organizations that
     * performed or hosted the Encounter
     *
     * @see "HITSP/C154 16.05 Encounter Provider"
     */
    private LinkedHashSet<EncounterProvider> providers;
    
    
    private LinkedHashSet<EncounterMovement> movements;
    
    /**
     * Indicates this is a consult
     */
    private String referrerUid;
    private String referrerName;
    /**
     * Reference to an encounter that encompasses this one.
     */
    private Encounter parent;

    private PatientStay stay;

    private Set<Map<String, Object>> documentUids;

    public Encounter() {
	    super(null);
	}

	@JsonCreator
	public Encounter(Map<String, Object> vals) {
	    super(vals);
	}

	public Boolean getCurrent() {
		return current!=null?current:false;
	}

	//
    @JsonManagedReference("encounter-provider")
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public EncounterProvider getPrimaryProvider() {
        if (providers == null) return null;
        for (EncounterProvider provider : providers) {
            if (provider.getPrimary() != null && provider.getPrimary()) {
                return provider;
            }
        }
        return null;
    }
    
    @JsonManagedReference("encounter-movement")
    public Set<EncounterMovement> getMovements() {
    	return this.movements;
    }

    @JsonView(JSONViews.SolrView.class)
    public String getPrimaryProviderName() {
        EncounterProvider primaryProvider = getPrimaryProvider();
        if (primaryProvider == null) return null;
        return primaryProvider.getProviderName();
    }

    @JsonView(JSONViews.SolrView.class)
    @Override
    public String getDomain() {
        return getClass().getSimpleName().toLowerCase();
    }

    @Override
    public String getSummary() {
    	return getStopCodeName();
    }

    public String getKind() {
    	// if its recognized in categoryCodeToKind, return it
        if (categoryCode != null && categoryCodeToKind.containsKey(categoryCode)) {
        	return categoryCodeToKind.get(categoryCode);
        }
        
        // otherwise return categoryName or "Unknown"
        return (categoryName != null) ? categoryName : "Unknown";
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getTypeName() {
        return typeName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getTypeDisplayName() {
        if (typeDisplayName == null) {
            typeDisplayName = VistaStringUtils.nameCase(getTypeName());
        }
        return typeDisplayName;
    }

    /**
     * Solr alias for 'typeDisplayName'.
     * @see #getTypeDisplayName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getEncounterType() {
        return getTypeDisplayName();
    }

    public String getTypeCode() {
        return typeCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getPatientClassCode() {
        return patientClassCode;
    }

    public String getPatientClassName() {
        return patientClassName;
    }

    /**
     * Solr alias for 'patientClassName'.
     * @see #getPatientClassName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getPatientClass() {
        return getPatientClassName();
    }

    public PointInTime getDateTime() {
        return dateTime;
    }

    /**
     * Solr alias for 'dateTime'.
     * @see #getDateTime()
     */
    @JsonView(JSONViews.SolrView.class)
    public PointInTime getVisitDateTime() {
        return getDateTime();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getDuration() {
        return duration;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCategoryCode() {
        return categoryCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCategoryName() {
        return categoryName;
    }

    /**
     * Solr alias for 'categoryName'.
     * @see #getCategoryName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getEncounterCategory() {
        return getCategoryName();
    }

    public String getService() {
        return service;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSpecialty() {
        return specialty;
    }

    public String getStopCode() {
        return stopCode;
    }

    public String getStopCodeName() {
        return stopCodeName;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public String getLocationUid() {
        return locationUid;
    }

    public String getLocationName() {
        return locationName;
    }

    public String getShortLocationName() {
        return shortLocationName;
    }

    public String getLocationDisplayName() {
        if (locationDisplayName == null) {
            locationDisplayName = VistaStringUtils.nameCase(getLocationName());
        }
        return locationDisplayName;
    }

    /**
     * Marks this visit as having occurred in a location that is "Occasion of Service".
     */
    public Boolean getLocationOos() {
        return locationOos;
    }

    public String getRoomBed() {
        return roomBed;
    }

    public String getReason() {
        return reason;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReasonCode() {
        return reasonCode;
    }

    public String getDispositionCode() {
        return dispositionCode;
    }

    public String getDispositionName() {
        return dispositionName;
    }

    @JsonManagedReference("encounter-provider")
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Set<EncounterProvider> getProviders() {
        return providers;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReferrerUid() {
        return referrerUid;
    }

    public String getReferrerName() {
        return referrerName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Encounter getParent() {
        return parent;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PatientStay getStay() {
        return stay;
    }

    public void addToProviders(EncounterProvider provider) {
        if (provider == null) throw new IllegalArgumentException();

        if (this.providers == null) {
            this.providers = new LinkedHashSet<EncounterProvider>();
        }
        this.providers.add(provider);
        provider.setEncounter(this);
    }

    public void removeFromProviders(EncounterProvider provider) {

    }

    public Set<Map<String, Object>> getDocumentUids() {
        return documentUids;
    }

    public void setDocumentUids(Set<Map<String, Object>> documentUids) {
        this.documentUids = documentUids;
    }
    
	@Override
	public int compareTo(Encounter enc) {
		return this.getDateTime().compareTo(enc.getDateTime());
	}

}
