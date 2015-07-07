package gov.va.cpe.vpr;

import java.math.BigDecimal;
import java.util.Map;

/**
 * An entry in the VistA PCE V CPT file.
 * <p/>
 * Represents CPT-related services performed at a visit.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 * @see "VistA FileMan V CPT(9000010.18)"
 */
public class VisitCPTCode extends VisitRelated {

    private String cptCode;
    private BigDecimal quantity;
    private String type;

    public VisitCPTCode() {
    }

    public VisitCPTCode(Map<String, Object> vals) {
        super(vals);
    }

    public String getCptCode() {
        return cptCode;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getType() {
        return type;
    }
}
