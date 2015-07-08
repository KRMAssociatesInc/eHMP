package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

public class AllergyComment extends AbstractPOMObject {
	/**
	 * Timestamp for when the comment was entered (required for VistA)
	 */
	private PointInTime entered;
	/**
	 * Raw value for the person who entered the comment
	 */
	private String enteredByName;
    /**
     * Display value for the person who entered the comment
     */
    private String enteredByDisplayName;
	/**
	 * Text of the comment. For VistA, this is
	 */
	private String comment;

    public AllergyComment() {
        super(null);
    }

    public AllergyComment(Map<String, Object> vals) {
        super(vals);
    }

    public PointInTime getEntered() {
		return entered;
	}

	public String getEnteredByName() {
		return enteredByName;
	}

    public String getEnteredByDisplayName() {
        if (enteredByDisplayName == null) {
            enteredByDisplayName = VistaStringUtils.nameCase(getEnteredByName());
        }
        return enteredByDisplayName;
    }

    public String getComment() {
		return comment;
	}
}
