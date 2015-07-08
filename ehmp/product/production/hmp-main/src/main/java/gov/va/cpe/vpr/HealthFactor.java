package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

/**
 * An entry in the VistA PCE V HEALTH FACTORS file.
 * <p/>
 * Represents patient health factors as of the visit date.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V HEALTH FACTORS(9000010.23)"
 */
public  class HealthFactor extends AbstractPatientObject implements IPatientObject {

	private static final String HEALTH_FACTOR = "Health Factor";

	private String summary;

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
     * Free text field name of the Health Factor
     */
    private String name;
    /**
     * This is a coded value describing the type of the Encounter
     * <p>
     * Should be a CPT-4 code in the range 99200-99299 (E&M Code)
     * @see "HITSP/C154 16.02 Encounter Type"
     */
    private String comment;
    /**
     * The date and time of the HealthFactor
     */
    private PointInTime entered;
    /**
     * The encounter the Health Factor is associated with.
     */
    private String encounterUid;
    /**
     * The name of encounter the Health Factor is associated with.
     */
    private String encounterName;

    /**
     * The location the Health Factor is associated with.
     *
     * @see "VistA FileMan HOSPITAL LOCATION(44)"
     */
    private String locationUid;

    /**
     * The name of the location the Health Factor is associated with.
     *
     * @see "VistA FileMan HOSPITAL LOCATION(44)"
     */
    private String locationName;

    private String locationDisplayName;

    private String categoryUid;

    private String categoryName;

    @JsonCreator
	public HealthFactor(Map<String, Object> vals) {
		super(vals);
	}

    public String getKind() {
        return HEALTH_FACTOR;
    }

	@Override
	public String getSummary() {
		return summary;
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
	public String getName() {
		return name;
	}

    /**
     * Solr alias for 'name'.
     * @see #getName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getHealthFactorName() {
        return getName();
    }

    public String getComment() {
		return comment;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public PointInTime getEntered() {
		return entered;
	}

    /**
     * Solr alias for 'entered'.
     * @see #getEntered()
     */
    @JsonView(JSONViews.SolrView.class)
    public PointInTime getHealthFactorDateTime() {
        return getEntered();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getEncounterUid() {
		return encounterUid;
	}

    public String getEncounterName() {
        return encounterName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocationUid() {
        return locationUid;
    }

    public String getLocationName() {
        return locationName;
    }

    public String getLocationDisplayName() {
        if (locationDisplayName == null) {
           this.locationDisplayName = VistaStringUtils.nameCase(getLocationName());
        }
        return locationDisplayName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCategoryUid() {
        return categoryUid;
    }

    public String getCategoryName() {
        return categoryName;
    }
}
