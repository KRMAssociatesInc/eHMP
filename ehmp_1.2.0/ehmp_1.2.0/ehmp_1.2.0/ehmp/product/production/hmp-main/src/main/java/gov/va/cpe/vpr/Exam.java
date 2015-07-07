package gov.va.cpe.vpr;

import java.util.Map;

/**
 * An entry in the VistA PCE V EXAM file.
 * <p/>
 * Represents exams done at a visit which do not map to a CPT code. This file contains exam information specific to a
 * particular visit for a particular patient.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V EXAM(9000010.13)"
 */
public class Exam extends VisitRelated {

    private String result;

    public Exam() {
    }

    public Exam(Map<String, Object> vals) {
        super(vals);
    }

    public String getResult() {
        return result;
    }
}
