package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * User: Brian Juergensmeyer
 * Date: 6/13/13
 * Time: 11:12 AM
 * To change this template use File | Settings | File Templates.
 */

public class ClioTermChild extends AbstractPOMObject {

	public ClioTermChild(){
		super(null);
	}
	
    public ClioTermChild(Map<String, Object> vals) {
        super(vals);
    }

    private ClioBaseTerminology childTerm;

    private Integer childOrder;

    private Integer childUnitId;

    public ClioBaseTerminology getChildTerm() {
        return childTerm;
    }

    public Integer getChildOrder() {
        return childOrder;
    }

    public Integer getChildUnitId() {
        return childUnitId;
    }

    public ClioValuetype getValueType() {
        return valueType;
    }

    public Character getValueDelimiter() {
        return valueDelimiter;
    }

    public Integer getValueStartPosition() {
        return valueStartPosition;
    }

    public Integer getValueStopPosition() {
        return valueStopPosition;
    }

    public String getDescription() {
        return description;
    }

    private ClioValuetype valueType;

    private Character valueDelimiter;

    private Integer valueStartPosition;

    private Integer valueStopPosition;

    private String description;
}
