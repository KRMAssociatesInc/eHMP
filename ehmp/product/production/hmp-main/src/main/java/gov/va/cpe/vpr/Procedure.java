package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class Procedure extends AbstractPatientObject implements IPatientObject {
    private String kind;
    //    private String summary;
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
    private String typeName;
    private String typeCode;
    private PointInTime dateTime;


    public String getUrgency() {
        return urgency;
    }

    public String getStatusName() {

        return statusName;
    }

    public String getPlace() {

        return place;
    }

    public String getPatientClassName() {

        return patientClassName;
    }

    public String getPatientClassCode() {

        return patientClassCode;
    }

    public String getOrderName() {

        return orderName;
    }

    public String getFromService() {

        return fromService;
    }

    public PointInTime getEarliestDate() {

        return earliestDate;
    }

    private PointInTime earliestDate;
    private String fromService;
    private String orderName;
    private String patientClassCode;
    private String patientClassName;
    private String place;
    private String statusName; //TODO: duplicate??
    private String urgency;

    public List<Map> getActivity() {
        return activity;
    }

    private List<Map> activity;





    private String category;
    private Integer bodySite;
    private String status;
    private String reason;
    //private Encounter encounter;
    private String encounterUid;
    // fields added for Consults
    private String consultProcedure;
    private String service;
    private String orderUid;

    private List<ProcedureProvider> providers;
    private String providerUid;
    private String providerName;
    private String providerDisplayName;

    private List<ProcedureResult> results;
    //    private Set<UidLink> results;
    private List<ProcedureLink> links;

    private List<Modifier> modifiers;

    /**
     * Added for radiology support
     */
    private String imagingTypeUid;
    private String locationUid;
    private Boolean hasImages;
    private String imageLocation;
    private Boolean verified;

    @JsonCreator
    public Procedure(Map<String, Object> data) {
        super(data);
    }

    public Procedure() {
        super(null);
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

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getTypeName() {
        return typeName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getTypeCode() {
        return typeCode;
    }

    /**
     * Solr alias for 'typeName'.
     * @see #getTypeName()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getProcedureType() {
        return getTypeName();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getDateTime() {
        return dateTime;
    }

    /**
     * Solr alias for 'dateTime'.
     * @see #getDateTime()
     */
    @JsonView(JSONViews.SolrView.class)
    public PointInTime getProcedureDateTime() {
        return getDateTime();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getCategory() {
        return category;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Integer getBodySite() {
        return bodySite;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getStatus() {
        return status;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getReason() {
        return reason;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getConsultProcedure() {
        return consultProcedure;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getService() {
        return service;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getOrderUid() {
        return orderUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderUid() {
        if (providerUid == null) {
            ProcedureProvider provider = getFirstProvider();
            if (provider != null) {
                providerUid = provider.getUid();
            }
        }
        return providerUid;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderName() {
        if (providerName == null) {
            ProcedureProvider provider = getFirstProvider();
            if (provider != null) {
                providerName = provider.getProviderName();
            }
        }
        return providerName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProviderDisplayName() {
        if (providerDisplayName == null) {
            providerDisplayName = VistaStringUtils.nameCase(getProviderName());
        }
        return providerDisplayName;
    }

    private ProcedureProvider getFirstProvider() {
        if (providers != null && !providers.isEmpty()) {
            return providers.get(0);
        } else {
            return null;
        }
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<ProcedureProvider> getProviders() {
        return providers;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonManagedReference("procedure-result")
    public List<ProcedureResult> getResults() {
        return results;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<ProcedureLink> getLinks() {
        return links;
    }

    public List<Modifier> getModifiers() {
        return modifiers;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getKind() {
        // we could potentially move this kind of logic to a "KindService(s)" if
        // that is less smelly
        if (kind != null) {
            return kind;
        }
        if (category.equals("C")) {
            return "Consult";
        } else if (category.equals("RA")) {
            return "Imaging";
        }

        return "Procedure";
    }

    public String getSummary() {
        return typeName != null ? typeName : "";
    }

    public List getTaggers() {
        // if (uid)
        // return manualFlush { Tagger.findAllByUrl(uid) }
        // else
        // return []
        return null;
        // TODO - fix this.
    }

    public String getEncounterUid() {
        return encounterUid;
    }

    public String getImagingTypeUid() {
        return imagingTypeUid;
    }

    public String getLocationUid() {
        return locationUid;
    }

    public Boolean getHasImages() {
        return hasImages;
    }

    public String getImageLocation() {
        return imageLocation;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public Boolean getVerified() {
        return verified;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getBody() {
        if (results == null || results.isEmpty()) return Collections.emptyList();
        List<String> body = new ArrayList<>(results.size());
        for (ProcedureResult r : results) {
            body.add(r.getReport());
        }
        return Collections.unmodifiableList(body);
    }

    public void addToProviders(ProcedureProvider provider) {
        if (providers == null) {
            providers = new ArrayList<ProcedureProvider>();
        }
        providers.add(provider);
    }

    public void removeFromProviders(ProcedureProvider provider) {
        if (providers == null) return;
        providers.remove(provider);
    }

    public void addToResults(ProcedureResult result) {
        if (results == null) {
            results = new ArrayList<ProcedureResult>();
        }
        results.add(result);
        result.setProcedure(this);
    }

    public void removeFromResults(ProcedureResult result) {
        if (results == null) return;
        results.remove(result);
    }

    public void addToLinks(ProcedureLink link) {
        if (links == null) {
            links = new ArrayList<ProcedureLink>();
        }
        links.add(link);
    }

    public void addToModifiers(Modifier modifier) {
        if (modifiers == null) {
            modifiers = new ArrayList<Modifier>();
        }
        modifiers.add(modifier);
    }

    public void removeFromModifiers(Modifier modifier) {
        if (modifiers == null) return;
        modifiers.remove(modifier);
    }
    
    /** Package-private method to get the DAO that loaded the procedure, used by the ProcedureResult to lazily load documents */
    IGenericPOMObjectDAO getDAO() {
    	return (daoRef != null) ? daoRef.get() : null;
    }
}
