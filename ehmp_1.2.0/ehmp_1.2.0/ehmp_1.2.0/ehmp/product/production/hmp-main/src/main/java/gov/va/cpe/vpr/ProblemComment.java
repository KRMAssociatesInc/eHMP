package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class ProblemComment extends AbstractPOMObject{

	private Long id;

	/**
	 * Timestamp for when the comment was entered (required for VistA)
	 */
	private PointInTime entered;
	/**
	 * Display value for the person who entered the comment
	 */
//	private String enteredBy;
	private String enteredByName;
	private String enteredByCode;
	/**
	 * Text of the comment. For VistA, this is
	 */
	private String comment;

	public ProblemComment() {
		super(null);
	}
	
	public ProblemComment(Map<String, Object> vals) {
		super(vals);
	}

	public Long getId() {
		return id;
	}

	public PointInTime getEntered() {
		return entered;
	}

	public String getEnteredByName() {
		return enteredByName;
	}

	public String getEnteredByCode() {
		return enteredByCode;
	}

	public String getComment() {
		return comment;
	}
}
