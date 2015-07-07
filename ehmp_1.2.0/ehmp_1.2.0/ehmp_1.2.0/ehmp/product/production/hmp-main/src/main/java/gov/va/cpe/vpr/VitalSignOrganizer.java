package gov.va.cpe.vpr;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class VitalSignOrganizer extends AbstractPatientObject implements IPatientObject {

	private static final String VITAL_SIGN_ORGANIZER = "Vital Sign Organizer";

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

    private List<VitalSign> vitalSigns;

    
    public VitalSignOrganizer(Map<String, Object> vals) {
		super(vals);
	}
    
    public VitalSignOrganizer() {
		super(null);
	}

    public void addToVitalSigns(VitalSign vitalSign) {
        if (vitalSigns == null) {
            vitalSigns = new ArrayList<VitalSign>();
        }
        vitalSigns.add(vitalSign);
        if (vitalSign.getOrganizer() != this) {
            vitalSign.setOrganizer(this);
        }
        matchVitalSignsToOrganizer();
    }

    public void removeFromVitalSigns(VitalSign vitalSign) {
        if (vitalSigns == null) return;

        vitalSigns.remove(vitalSign);
        if (vitalSign.getOrganizer() == this)
            vitalSign.setOrganizer(null);
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getKind() {
        return VITAL_SIGN_ORGANIZER;
    }

    public String getLocalId() {
        return localId;
    }

    public PointInTime getObserved() {
        return observed;
    }

    public PointInTime getResulted() {
        return resulted;
    }

    public Encounter getEncounter() {
        return encounter;
    }

    @JsonManagedReference("vitalSignsOrganizer-vitalSign")
    public List<VitalSign> getVitalSigns() {
        if (vitalSigns == null) return null;
        matchVitalSignsToOrganizer();
        return Collections.unmodifiableList(vitalSigns);
    }

    private void matchVitalSignsToOrganizer() {
        for (VitalSign vitalSign : vitalSigns) {
            vitalSign.setData("pid", getPid());
            vitalSign.setData("facilityCode",getFacilityCode());
            vitalSign.setData("facilityName",getFacilityName());
            vitalSign.setData("resultStatusCode",getResultStatusCode());
            vitalSign.setData("resultStatusName",getResultStatusName());
            vitalSign.setData("observed",getObserved());
            vitalSign.setData("resulted",getResulted());
            vitalSign.setData("encounted",getEncounter());
            vitalSign.setData("locationCode",getLocationCode());
            vitalSign.setData("locationName", getLocationName());
            vitalSign.setOrganizer(this);
            vitalSign.setData("organizerUid", this.getUid());
        }
    }


    public String getResultStatusCode() {
        return resultStatusCode;
    }

    public String getResultStatusName() {
        return resultStatusName;
    }

	public String getLocationCode() {
		return locationCode;
	}

	public String getLocationName() {
		return locationName;
	}
}
