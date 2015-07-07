package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;


/**
 * User: Brian Juergensmeyer
 * Date: 6/12/13
 * Time: 7:39 AM
 * To change this template use File | Settings | File Templates.
 */


public class ClioBaseTerminology extends AbstractPOMObject{
    private String id;
    private String term;
    private String abbreviation;
    private String displayName;
    private String active; //Note: may need to be Boolean later
    private ClioDatatype dataType;
    private ClioValuetype valueType;
    private String description;
    private String helpText;
    private String booleanValueTrue;
    private String booleanValueFalse;
    private String multiSelectPicklist; //Note: may need to be Boolean later
    private String VUID;

    public String getuid() {
        return "urn:va:clioterminology:" + id;
    }

    public ClioBaseTerminology() {
    	super(null);
    }

    public ClioBaseTerminology(Map<String, Object> vals) {
        super(vals);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getActive() {
        return active;
    }

    public void setActive(String active) {
        this.active = active;
    }

    public ClioDatatype getDataType() {
        return dataType;
    }

    public void setDataType(ClioDatatype dataType) {
        this.dataType = dataType;
    }

    public ClioValuetype getValueType() {
        return valueType;
    }

    public void setValueType(ClioValuetype valueType) {
        this.valueType = valueType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHelpText() {
        return helpText;
    }

    public void setHelpText(String helpText) {
        this.helpText = helpText;
    }

    public String getBooleanValueTrue() {
        return booleanValueTrue;
    }

    public void setBooleanValueTrue(String booleanValueTrue) {
        this.booleanValueTrue = booleanValueTrue;
    }

    public String getBooleanValueFalse() {
        return booleanValueFalse;
    }

    public void setBooleanValueFalse(String booleanValueFalse) {
        this.booleanValueFalse = booleanValueFalse;
    }

    public String getMultiSelectPicklist() {
        return multiSelectPicklist;
    }

    public void setMultiSelectPicklist(String multiSelectPicklist) {
        this.multiSelectPicklist = multiSelectPicklist;
    }

    public String getVUID() {
        return VUID;
    }

    public void setVUID(String VUID) {
        this.VUID = VUID;
    }
}
