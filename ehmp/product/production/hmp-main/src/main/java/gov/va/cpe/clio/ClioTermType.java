package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * User: Brian Juergensmeyer
>>>>>>> Terminology
 * Date: 4/25/13
 * Time: 4:14 PM
 */
public class ClioTermType extends AbstractPOMObject{
    private Integer id;
    private String type;
    private String xmlTag;
    private String VUID;

    public ClioTermType(Map<String, Object> vals) {
        super(vals);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getXmlTag() {
        return xmlTag;
    }

    public void setXmlTag(String xmlTag) {
        this.xmlTag = xmlTag;
    }

    public String getVUID() {
        return VUID;
    }

    public void setVUID(String VUID) {
        this.VUID = VUID;
    }
}
