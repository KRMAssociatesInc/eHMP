package gov.va.cpe.feed.atom.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import gov.va.hmp.feed.atom.Person;

/**
 * Created with IntelliJ IDEA. User: sblaz Date: 7/12/13 Time: 12:17 PM To change this template use File | Settings |
 * File Templates.
 */
@JacksonXmlRootElement(localName = "bar")
public class Bar {
    public Person getFred() {
        return fred;
    }

    public void setFred(Person fred) {
        this.fred = fred;
    }

    private Person fred;
}
