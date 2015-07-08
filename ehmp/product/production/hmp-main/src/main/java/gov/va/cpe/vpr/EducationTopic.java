package gov.va.cpe.vpr;

import java.util.Map;

/**
 * An entry in the VistA PCE V PATIENT ED file.
 * <p/>
 * Represents patient education done at a visit.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V PATIENT ED(9000010.13)"
 */
public class EducationTopic extends VisitRelated {

    private String result;

    public EducationTopic() {
    }

    public EducationTopic(Map<String, Object> vals) {
        super(vals);
    }

    public String getResult() {
        return result;
    }
}
