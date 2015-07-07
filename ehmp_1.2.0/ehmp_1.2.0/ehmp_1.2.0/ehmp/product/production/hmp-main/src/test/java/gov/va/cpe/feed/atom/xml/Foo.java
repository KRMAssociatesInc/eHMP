package gov.va.cpe.feed.atom.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import gov.va.hmp.feed.atom.Text;

/**
 * Created with IntelliJ IDEA. User: sblaz Date: 7/12/13 Time: 12:17 PM To change this template use File | Settings |
 * File Templates.
 */
@JacksonXmlRootElement(localName = "foo")
public class Foo {
    public Text getTitle() {
        return title;
    }

    public void setTitle(Text title) {
        this.title = title;
    }

    private Text title;
}
