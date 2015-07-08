package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "category")
@JacksonXmlRootElement(localName = "category", namespace = "http://www.w3.org/2005/Atom")
public class Category {
    @JacksonXmlProperty(isAttribute = true)
    @XmlAttribute(required = true)
    private String term;
    @JacksonXmlProperty(isAttribute = true)
    @XmlAttribute
    private String scheme;
    @JacksonXmlProperty(isAttribute = true)
    @XmlAttribute
    private String label;

    public Category() {
    }

    public Category(String term) {
        this.term = term;
    }

    public Category(String term, String label) {
        this.term = term;
        this.label = label;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
