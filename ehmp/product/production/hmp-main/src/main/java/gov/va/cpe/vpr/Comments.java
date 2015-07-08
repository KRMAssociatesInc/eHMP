package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPatientObject;

import java.util.Map;

public class Comments extends AbstractPatientObject {

	public Comments() {
		super(null);
	}

	public Comments(Map<String, Object> vals) {
		super(vals);
	}
	
	public String author;
	public String comments;
	
}
