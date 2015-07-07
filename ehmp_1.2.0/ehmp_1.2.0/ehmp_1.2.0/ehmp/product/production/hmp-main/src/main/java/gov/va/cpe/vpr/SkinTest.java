package gov.va.cpe.vpr;

import java.util.Map;

/**
 * An entry in the VistA PCE V SKIN TEST file.
 * <p/>
 * Represents skin tests done at a visit. There will be one record for each type of skin test given to a patient on a given
 * visit. The record is normally created when a skin test is given, and the results, if available, are entered at a
 * later date and matched to the original record. If results are entered and a skin test given does not exist, a new
 * record is created.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V SKIN TEST(9000010.12)"
 */
public class SkinTest extends VisitRelated {
    private String comment;

    public SkinTest() {
    }

    public SkinTest(Map<String, Object> vals) {
        super(vals);
    }

    public String getComment() {
        return comment;
    }
}
