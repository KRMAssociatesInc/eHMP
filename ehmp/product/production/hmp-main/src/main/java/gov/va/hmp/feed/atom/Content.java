package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "content", namespace = "http://www.w3.org/2005/Atom")
public class Content extends Text {

    @JacksonXmlProperty(isAttribute = true)
    @XmlAttribute
    private String src;

    public Content() {
        super(null);
        this.type = null;
    }

    public Content(String text) {
        super(text);
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }
}
