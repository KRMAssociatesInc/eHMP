package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Order extends AbstractPatientObject implements IPatientObject {

    public static enum StatusCode {
        ACTIVE("urn:va:order-status:actv"),
        PENDING("urn:va:order-status:pend"),
        CANCELLED("foo1"), // TODO: find this code
        COMPLETE("urn:va:order-status:comp"),
        DISCONTINUED("foo2"), // TODO: find this code
        EXPIRED("foo3"),   // TODO: find this code
        LAPSED("foo4"),    // TODO: find this code
        SCHEDULED("foo5"), // TODO: find this code
        UNRELEASED("foo6"), // TODO: find this code
        DISCONTINUED_EDIT("foo7"); // TODO: find this code

        private String code;

        private StatusCode(String code) {
            this.code = code;
        }

        @Override
        public String toString() {
            return this.code;
        }

        public static StatusCode parse(String code) {
            for (StatusCode status : values()) {
                if (status.code.equalsIgnoreCase(code)) return status;
            }
            throw new IllegalArgumentException("'" + code + "' is not a recognized order status code");
        }
    }
    
    public static enum ServiceCode {
    	// for medication orders, use the same kind
    	PSJ(Medication.MedicationKind.I.toString()),
    	PSO(Medication.MedicationKind.O.toString()),
    	PSH(Medication.MedicationKind.N.toString()),
    	PSIV(Medication.MedicationKind.V.toString()),
    	PSG(Medication.MedicationKind.I.toString()),
    	GMRA("Allergy/Adverse Reaction"),
    	GMRC("Consult"),
    	RA("Radiology"),
    	FH("Dietetics Order"),
    	LR("Laboratory"),
    	OR("Nursing Order"),
    	VBEC("Blood Bank Order"),
    	ZZRV("ZZVITALS Order");
    	
    	private String desc;
    	private ServiceCode(String desc) {
    		this.desc = desc;
    	}
    	
        @Override
        public String toString() {
            return this.desc;
        }
    }

    /**
     * For VistA -- localId is the identifier from the order file
     */
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
     * the location name of the order
     */
    private String locationName;
    /**
     * the location IEN of the order
     */
    private String locationCode;
    /**
     * the name of the item ordered from VistA the .01 of Orderable Item file
     */
    private String name;
    /**
     * the id of the item ordered from VistA the IEN of the Orderable Item file
     */
    private String oiCode;

    private String oiName;

    private String oiPackageRef;
    /**
     * The text of the order for medication orders the sig.
     */
    private String content;
    /**
     * The date the order was written.
     */
    private PointInTime entered;
    /**
     * The date the order was started to be acted on
     */
    private PointInTime start;
    /**
     * The final stop date of the order
     */
    private PointInTime stop;
    /**
     * The type of order from VistA from the display group file.
     */
    private String displayGroup;
    /**
     * The status of the order from VistA
     */
//	private OrderStatus status;
    private String statusCode;
    private String statusName;
    private String statusVuid;

    private String providerUid;
    private String providerName;
    private String providerDisplayName;
    private String service;

    private List<JdsCode> codes;

    // TODO: Handle "results" node and "clinicians" nodes
    private LinkedHashSet<Order> children;
    
    public Set<Order> getChildren() {
        return children;
    }

    public Order() {
        super(null);
    }

    @JsonCreator
    public Order(Map<String, Object> vals) {
        super(vals);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocationName() {
        return locationName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocationCode() {
        return locationCode;
    }

    public String getName() {
        return name;
    }

    /**
     * Solr alias for 'name'.
     * @see #getName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getOrderName() {
        return getName();
    }

    @JsonView({JSONViews.SolrView.class, JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getOiCode() {
        return oiCode;
    }

    public String getOiName() {
        return oiName;
    }

    public String getOiPackageRef() {
        return oiPackageRef;
    }

    public String getContent() {
        return content;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getEntered() {
        return entered;
    }

    public PointInTime getStart() {
        return start;
    }

    /**
     * Solr alias for 'start'.
     * @see #getStart()
     */
    @JsonView(JSONViews.SolrView.class)
    public PointInTime getOrderStartDateTime() {
        return getStart();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getStop() {
        return stop;
    }

    public String getDisplayGroup() {
        return displayGroup;
    }

    /**
     * Solr alias for 'displayGroup'.
     * @see #getDisplayGroup() ()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getOrderGroupVa() {
        return getDisplayGroup();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusCode() {
        return statusCode;
    }

    public String getStatusName() {
        return statusName;
    }

    /**
     * Solr alias for 'statusName'.
     * @see #getStatusName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getOrderStatusVa() {
        return getStatusName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusVuid() {
        return statusVuid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderUid() {
        return providerUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderName() {
        return providerName;
    }

    public String getProviderDisplayName() {
        if (providerDisplayName == null) {
            providerDisplayName = VistaStringUtils.nameCase(getProviderName());
        }
        return providerDisplayName;
    }

    public String getSummary() {
        return content;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    @JsonView(JSONViews.SolrView.class)
    public String getDomain() {
       return getClass().getSimpleName().toLowerCase();
    }

    public String getKind() {
        return ServiceCode.valueOf(getService()).toString();
    }
    
    public String getService() {
		return service;
	}

    public List getTaggers() {
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
        return this.codes;
    }

}
