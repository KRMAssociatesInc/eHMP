package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.List;
import java.util.Map;

public class MentalHealth extends AbstractPatientObject implements IPatientObject {
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
	 * the name of the item ordered from VistA the .01 of 601.71 file
	 */
	private String name;

	private PointInTime administeredDateTime;

//    private LinkedHashSet<MentalHealth> children;

    private String displayName;

    private boolean isCopyright;

    private String copyrightText;

    private String providerUid;
    private String providerName;

    private List<Map<String, Object>> responses;

    private List<Map<String, Object>> scales;
//    public Set<MentalHealth> getChildren() {
//		return children;
//	}

	public MentalHealth(){
		super(null);
	}

	@JsonCreator
	public MentalHealth(Map<String, Object> vals) {
		super(vals);
	}

	public String getLocalId() {
		return localId;
	}


	public String getName() {
		return name;
	}

    public String getDisplayName() {
		return displayName;
	}

    public Boolean getIsCopyright() {
        return isCopyright;
    }

    public String getCopyrightText() {
        return copyrightText;
    }

    public String getProviderUid() {
		return providerUid;
	}

    public String getProviderName() {
		return providerName;
	}

    public List<Map<String, Object>> getResponses() {
        return responses;
    }

    public PointInTime getAdministeredDateTime() {
		return administeredDateTime;
	}

	public List<Map<String, Object>> getScales() {
        return scales;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

	public String getKind() {
		return "Mental Health";
	}

	public List getTaggers() {
		// if (uid)
		// return manualFlush { Tagger.findAllByUrl(uid) }
		// else
		// return []
		return null;
		// TODO - fix this
	}

//    @JsonIgnore
//    public void loadLinkData(IGenericPatientObjectDAO dao) {
//    	Set<Order> newKids = new HashSet<Order>();
//    	if(children!=null)
//    	{	
//    		for(Order ord: children)
//    		{
//    			newKids.add(dao.findByUID(Order.class, ord.uid));
//    		}
//        	children = newKids;
//    	}
//    }
}
