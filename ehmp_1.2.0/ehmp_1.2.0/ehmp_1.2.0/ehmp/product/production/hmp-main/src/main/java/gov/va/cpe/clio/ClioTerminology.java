package gov.va.cpe.clio;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;

/**
 * User: Brian Juergensmeyer
 * Date: 4/23/13
 * Time: 11:41 AM
 */


/*
  Note: Also need to add enumerated types for Data Type, Term Type, Value Type, Multi Select Picklist
 */

public class ClioTerminology extends ClioBaseTerminology {

    public ClioTerminology(Map<String, Object> vals) {
        super(vals);
//        qualifiers = new ArrayList<ClioTermQualifier>();
//        units = new ArrayList<ClioTermUnit>();
//        childTerms = new ArrayList<ClioTermChild>();
    }

    private List<ClioTermQualifier> qualifiers;

    private List<ClioTermUnit> units;

    private List<ClioTermChild> childTerms;

    public ClioTermQualifier [] getQualifiers() {
        return qualifiers!=null?qualifiers.toArray((ClioTermQualifier[]) Array.newInstance(ClioTermQualifier.class,0)):new ClioTermQualifier[0];
    }

    public ClioTermUnit [] getUnits() {
        return units!=null?units.toArray((ClioTermUnit[]) Array.newInstance(ClioTermUnit.class,0)):new ClioTermUnit[0];
    }

    public ClioTermChild [] getChildTerms() {
        return childTerms!=null?childTerms.toArray((ClioTermChild[]) Array.newInstance(ClioTermChild.class,0)):new ClioTermChild[0];
    }
}
