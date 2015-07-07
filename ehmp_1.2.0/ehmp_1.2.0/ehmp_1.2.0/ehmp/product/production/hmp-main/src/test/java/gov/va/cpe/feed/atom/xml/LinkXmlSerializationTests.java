package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Link;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

public class LinkXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testSerializeAtomLink() throws IOException, SAXException {
        String expected = "<atom:link xmlns:atom=\"http://www.w3.org/2005/Atom\" rel=\"self\" href=\"http://www.example.com\"/>";

        Link link1 = new Link();
        link1.setRel("self");
        link1.setHref("http://www.example.com");

        String xml = new POMXmlMapper().writeValueAsString(link1);

        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }
}
