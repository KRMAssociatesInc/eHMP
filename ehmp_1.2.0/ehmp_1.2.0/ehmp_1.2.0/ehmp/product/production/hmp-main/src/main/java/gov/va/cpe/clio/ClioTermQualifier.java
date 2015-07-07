package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * User: Brian Juergensmeyer
 * Date: 6/12/13
 * Time: 11:10 AM
 */

public class ClioTermQualifier extends AbstractPOMObject {

	public ClioTermQualifier(){
		super(null);
	}
	
    public ClioTermQualifier(Map<String, Object> vals) {
        super(vals);
    }

    private ClioBaseTerminology qualTerm;

    private Integer qualifierOrder;

    private Integer qualifierRanking;

    public ClioBaseTerminology getQualTerm() {
        return qualTerm;
    }

    public Integer getQualifierOrder() {
        return qualifierOrder;
    }

    public Integer getQualifierRanking() {
        return qualifierRanking;
    }
}
