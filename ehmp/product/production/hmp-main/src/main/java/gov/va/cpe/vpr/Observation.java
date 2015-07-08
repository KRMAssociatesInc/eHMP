package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class Observation extends AbstractPatientObject implements IPatientObject{

	private static final String CLINICAL_OBSERVATION = "Clinical Observation";

    private String facilityCode;

    private String facilityName;

    private String localId;

    private String typeCode;

    private String typeName;

    private String result;

    private String units;

    private String interpretationCode;

    private String interpretationName;

    private PointInTime observed;

    private PointInTime entered;

    private String statusCode;

    private String statusName;

    private String methodCode;

    private String methodName;

    private String bodySiteCode;

    private String bodySiteName;

    private String locationUid;
    private String locationName;

    private String comment;

    private String vaStatus;

    private String qualifierText;
    
    private List<ObservationQualifier> qualifiers;

    private String setID;

    private String setName;

    private PointInTime setStart;

    private String setType;

	public Observation() {
		super(null);
	}

	@JsonCreator
	public Observation(Map<String, Object> vals) {
		super(vals);
	}

    // organizers

    public void addToQualifiers(ObservationQualifier qualifier) {
    	if(this.qualifiers == null) {
    		qualifiers = new ArrayList<ObservationQualifier>();
    	}
    	qualifiers.add(qualifier);
    }
    
    public String getQualifierText() {
        StringBuffer x = new StringBuffer();
        if(qualifiers == null) {
        	return null;
        }
        for (ObservationQualifier qualifier : qualifiers) {
			x.append(qualifier.getType());
			x.append(": ");
			x.append(qualifier.getName());
			x.append(" ");
		}
        return x.toString().trim();
    }

    public void setQualifierText(String qualifierText) {
    	this.qualifierText = getQualifierText();
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getLocalId() {
		return localId;
	}

	public String getKind() {
		return CLINICAL_OBSERVATION;
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
     *
     * @see #getTypeName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getObsTypeName() {
        return getTypeName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getResult() {
		return result;
	}

    /**
     * Solr alias for 'result'.
     *
     * @see #getResult()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getObsResult() {
        return getResult();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getUnits() {
		return units;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getInterpretationCode() {
        return interpretationCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getInterpretationName() {
		return interpretationName;
	}

    /**
     * Solr alias for 'interpretationName'.
     *
     * @see #getInterpretationName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getObsFlag() {
        return getInterpretationName();
    }

	public PointInTime getObserved() {
		return observed;
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
    public PointInTime getObsEntered() {
        return getEntered();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatusCode() {
        return statusCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getStatusName() {
		return statusName;
	}

    /**
     * Solr alias for 'statusName'.
     *
     * @see #getStatusName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getObsStatus() {
        return getStatusName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getMethodCode() {
		return methodCode;
	}

	public String getMethodName() {
		return methodName;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getBodySiteCode() {
		return bodySiteCode;
	}

	public String getBodySiteName() {
		return bodySiteName;
	}

	public String getLocationUid() {
		return locationUid;
	}

	public String getLocationName() {
		return locationName;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getComment() {
		return comment;
	}

    /**
     * Solr alias for 'comment'.
     *
     * @see #getComment()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getObsComment() {
        return getComment();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getVaStatus() {
		return vaStatus;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public List<ObservationQualifier> getQualifiers() {
		return qualifiers;
	}

    @JsonProperty("setID")
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSetID() {
        return setID;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSetName() {
        return setName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getSetStart() {
        return setStart;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSetType() {
        return setType;
    }

    @Override
	public String getSummary() {
        StringBuffer x = new StringBuffer();
        x.append(typeName);
        x.append(" ");
        x.append(result);
        
        if (units != null) {
            x.append(" ");
        	x.append(units);
        }
        if (interpretationName != null && (!interpretationName.equals('N'))){
        	x.append(" (" + interpretationName + ")");
        }
        return x.toString();
    }

}
