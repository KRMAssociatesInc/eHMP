package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Organizes a collection of results into a group.
 * <p/>
 * <p>
 * <i>For Laboratory:</i> <code>ResultOrganizer</code> is an accession,
 * <code>Result</code> is a single result. For micro, pathology, etc., the full
 * report is stored as the result in the document field.
 * </p>
 * <p/>
 * <p>
 * <i>For Radiology:</i> <code>ResultOrganizer</code> is a set of exams (70.02
 * multiple in file 70). Each exam is listed as a result. The impression is
 * stored in the value field, the primary diagnostic code text is stored as the
 * interpretation. The formatted report is stored in the document field. The
 * result status is the text of the exam status.
 * </p>
 *
 * @see Result
 */
public class ResultOrganizer extends AbstractPatientObject implements IPatientObject {

    /**
     * The ID of the facility where the result occurred
     *
     * @see "HITSP/C154 16.17"
     */
    private String facilityCode;

    /**
     * The name of the facility where the result occurred
     *
     * @see "HITSP/C154 16.18"
     */
    private String facilityName;

    private String localId;

    /**
     * The type of this organizer <example> Ex. accession, panel
     */
    private String organizerType;
    /**
     * Specific category of this set of results. <example> Ex: Laboratory
     */
    private String categoryCode;

    private String categoryName;
    /**
     * Status code for this observation, e.g., complete, preliminary.
     *
     * @see "HITSP/C154 15.04 Result Status"
     */
    private String statusCode;
    /**
     * The display name of the status for this observation, e.g., complete, preliminary.
     *
     * @see "HITSP/C154 15.04 Result Status"
     */
    private String statusName;

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
     * Reference to encounter, if known.
     */
    private String encounterUid;

    private String comment;

    private List<Result> results;

    private String summary;

    private String kind;

    public ResultOrganizer() {
        super(null);
    }

    public ResultOrganizer(Map<String, Object> vals) {
        super(vals);
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getLocalId() {
        return localId;
    }

    public String getOrganizerType() {
        return organizerType;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public String getStatusName() {
        return statusName;
    }

    public PointInTime getObserved() {
        return observed;
    }

    public PointInTime getResulted() {
        return resulted;
    }

    public String getSpecimen() {
        return specimen;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getEncounterUid() {
        return encounterUid;
    }

    public String getComment() {
        return comment;
    }

    public List<Result> getResults() {
        if (results == null) return null;
        matchResultsToResultOrganizer();
        return Collections.unmodifiableList(results);
    }

    private void matchResultsToResultOrganizer() {
        for (Result result : results) {
            result.setData("pid", getPid());
            result.setData("facilityCode", getFacilityCode());
            result.setData("facilityName",getFacilityName());
            result.setData("categoryCode",getCategoryCode());
            result.setData("categoryName",getCategoryName());
            result.setData("resultStatusCode",getStatusCode());
            result.setData("resultStatusName",getStatusName());
            result.setData("observed",getObserved());
            result.setData("resulted",getResulted());
            result.setData("specimen",getSpecimen());
            result.setData("orderId",getOrderId());
            result.setData("encounterUid",getEncounterUid());
            result.setData("comment",getComment());

            result.addToOrganizers(this);
        }
    }

    public void addToResults(Result result) {
        if (this.results == null) {
            this.results = new ArrayList<Result>();
        }
        if (!this.results.contains(result)) {
            this.results.add(result);
        }
        matchResultsToResultOrganizer();
    }

    public void removeFromResults(Result result) {
        if (this.results == null) return;

        this.results.remove(result);
        result.removeFromOrganizers(this);
    }

    @Override
    public String getSummary() {
        return summary;
    }

    public String getKind() {
        return kind;
    }
}
