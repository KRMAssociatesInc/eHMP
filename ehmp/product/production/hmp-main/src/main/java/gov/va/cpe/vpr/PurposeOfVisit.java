package gov.va.cpe.vpr;

import java.util.Map;

/**
 * An entry in the VistA PCE V POV file.
 * <p/>
 * Represents problems treated at a visit. At least one purpose of visit (POV) is required for workload and billing purposes
 * for each patient outpatient visit, regardless of the discipline of the provider (i.e. dental, CHN, mental health,
 * etc.). There is no limit to the number of POVs that can be entered for a patient for a given encounter
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V POV(9000010.07)"
 */
public class PurposeOfVisit extends VisitRelated {

    private String icdCode;
    private String type;

    public PurposeOfVisit() {
    }

    public PurposeOfVisit(Map<String, Object> vals) {
        super(vals);
    }

    public String getIcdCode() {
        return icdCode;
    }

    public String getType() {
        return type;
    }
}
