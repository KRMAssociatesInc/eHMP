package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import org.apache.commons.lang.StringEscapeUtils;

public class Text {

    @JacksonXmlProperty(isAttribute = true)
    protected String type = "text";
    protected String text;

    public Text() {
        // NOOP
    }

    public Text(String text) {
        this.text = text;
    }

    @JacksonXmlText
    public String getText() {
        if ("xhtml".equalsIgnoreCase(type)) {
            return "<div xmlns=\"http://www.w3.org/1999/xhtml\">" + StringEscapeUtils.escapeXml(text) + "</div>";
        } else if ("html".equalsIgnoreCase(type)) {
            return StringEscapeUtils.escapeHtml(text);
        } else {
            return text;
        }

    }

    public void setText(String text) {
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
