package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Content;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

public class ContentXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalText() throws IOException, SAXException {
        String expected = "<baz><content type=\"text\">The quick brown fox jumps over the lazy dog.</content></baz>";
        Baz baz = new Baz();
        baz.setContent(new Content("The quick brown fox jumps over the lazy dog."));

        String xml = new POMXmlMapper().writeValueAsString(baz);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalSrc() throws IOException, SAXException {
        String expected = "<baz><content src=\"http://www.example.org/blogs/123\"/></baz>";
        Content content = new Content();
        content.setSrc("http://www.example.org/blogs/123");

        Baz baz = new Baz();
        baz.setContent(content);

        String xml = new POMXmlMapper().writeValueAsString(baz);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalSrcAndType() throws IOException, SAXException {
        String expected = "<baz><content type=\"text/html\" src=\"http://www.example.org/blogs/123\"/></baz>";
        Baz baz = new Baz();
        Content content = new Content();
        content.setSrc("http://www.example.org/blogs/123");
        content.setType("text/html");
        baz.setContent(content);

        String xml = new POMXmlMapper().writeValueAsString(baz);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
