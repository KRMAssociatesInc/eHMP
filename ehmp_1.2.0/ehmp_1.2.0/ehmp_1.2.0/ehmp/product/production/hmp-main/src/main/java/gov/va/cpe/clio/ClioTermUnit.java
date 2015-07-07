package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * User: Brian
 * Date: 6/13/13
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */


public class ClioTermUnit extends AbstractPOMObject {
	
	public ClioTermUnit() {
		super(null);
	}
	
    public ClioTermUnit(Map<String, Object> vals) {
        super(vals);
    }

    private ClioBaseTerminology unitTerm;

    private Integer maxValue;

    private Integer minValue;

    private Integer refHigh;

    private Integer refLow;
}
