package gov.va.cpe.vpr;

import java.util.Map;

/**
 * An entry in the VistA PCE V TREATMENT file.
 * <p/>
 * Represents miscellaneous clinical data not fitting into any other V-file global. This file contains a record for each
 * treatment provided to a patient on a given patient visit. There will be multiple treatment records for the same
 * treatment (.01) field based on the date on which it was given.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V TREATMENT(9000010.15)"
 */
public class VisitTreatment extends VisitRelated {

    public VisitTreatment() {
    }

    public VisitTreatment(Map<String, Object> vals) {
        super(vals);
    }
}
