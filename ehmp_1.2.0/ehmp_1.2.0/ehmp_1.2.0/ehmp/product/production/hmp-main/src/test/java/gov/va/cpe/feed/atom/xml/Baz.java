package gov.va.cpe.feed.atom.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import gov.va.hmp.feed.atom.Content;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created with IntelliJ IDEA. User: sblaz Date: 7/12/13 Time: 12:17 PM To change this template use File | Settings |
 * File Templates.
 */
@JacksonXmlRootElement(localName = "baz")
@XmlRootElement(name = "baz")
public class Baz {
    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    private Content content;
}
