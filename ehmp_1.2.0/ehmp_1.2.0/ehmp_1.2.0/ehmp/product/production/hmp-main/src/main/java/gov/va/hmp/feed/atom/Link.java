package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@JacksonXmlRootElement(localName = "link", namespace = "http://www.w3.org/2005/Atom")
@XmlRootElement(name = "link", namespace = "http://www.w3.org/2005/Atom")
public class Link {
    /**
     * The URI of the referenced resource.
     */
    @XmlAttribute(required = true)
    @JacksonXmlProperty(isAttribute = true)
    private String href;
    /**
     * Contains a single link relationship type. It can be a full URI (see extensibility), or one of the following
     * predefined values: <ul> <li><code>alternate</code>: an alternate representation of the entry or feed, for example a
     * permalink to the html version of the entry, or the front page of the weblog.</li> <li><code>enclosure</code>: a
     * related resource which is potentially large in size and might require special handling, for example an audio or video
     * recording.</li> <li><code>related</code>: an document related to the entry or feed.</li> <li><code>self</code>: the
     * feed itself.</li> <li><code>via</code>: the source of the information provided in the entry.</li> </ul>
     */
    @XmlAttribute
    @JacksonXmlProperty(isAttribute = true)
    private String rel;
    /**
     * indicates the media type of the resource.
     */
    @XmlAttribute
    @JacksonXmlProperty(isAttribute = true)
    private String type;
    /**
     * Human readable information about the link, typically for display purposes.
     */
    @XmlAttribute
    @JacksonXmlProperty(isAttribute = true)
    private String title;
    /**
     * Indicates the language of the referenced resource.
     */
    @XmlAttribute
    @JacksonXmlProperty(isAttribute = true)
    private String hreflang;
    /**
     * The length of the resource, in bytes.
     */
    @XmlAttribute
    @JacksonXmlProperty(isAttribute = true)
    private Long length;

    public Link() {
    }

    public Link(String href, String rel) {
        this.href = href;
        this.rel = rel;
    }

    public Link(String href, String rel, String type) {
        this.href = href;
        this.rel = rel;
        this.type = type;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getRel() {
        return rel;
    }

    public void setRel(String rel) {
        this.rel = rel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHreflang() {
        return hreflang;
    }

    public void setHreflang(String hreflang) {
        this.hreflang = hreflang;
    }

    public Long getLength() {
        return length;
    }

    public void setLength(Long length) {
        this.length = length;
    }
}
