package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Text;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

import static org.junit.Assert.assertTrue;

public class TextXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalPlainText() throws IOException, SAXException {
        String expected = "<foo><title type='text'>The quick brown fox jumps over the lazy dog.</title></foo>";
        Foo foo = new Foo();
        foo.setTitle(new Text("The quick brown fox jumps over the lazy dog."));

        String xml = new POMXmlMapper().writeValueAsString(foo);
        Diff xmlDiff = new Diff(expected, xml);
        assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalPlainTextWithXmlEntityCharacter() throws IOException, SAXException {
        String expected = "<foo><title type='text'>AT&amp;T bought by SBC!</title></foo>";
        Foo foo = new Foo();
        foo.setTitle(new Text("AT&T bought by SBC!"));

        String xml = new POMXmlMapper().writeValueAsString(foo);
        Diff xmlDiff = new Diff(expected, xml);
        assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalHtml() throws IOException, SAXException {
        String expected = "<foo><title type='html'>AT&amp;amp;T bought &amp;lt;b&amp;gt;by SBC&amp;lt;/b&amp;gt;!</title></foo>";
        Foo foo = new Foo();

        Text text = new Text();
        text.setText("AT&T bought <b>by SBC</b>!");
        text.setType("html");

        foo.setTitle(text);

        String xml = new POMXmlMapper().writeValueAsString(foo);
        Diff xmlDiff = new Diff(expected, xml);
        assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Ignore
    @Test
    public void testMarshalXhtml() throws IOException, SAXException {
        String expected = "<foo><title type='xhtml'><div xmlns=\"http://www.w3.org/1999/xhtml\">AT&amp;T bought <b>by SBC</b>!</div></title></foo>";
        Foo foo = new Foo();
        Text text = new Text();
        text.setText("AT&T bought <b>by SBC</b>!");text.setType("xhtml");
        foo.setTitle(text);

        String xml = new POMXmlMapper().writeValueAsString(foo);
        Diff xmlDiff = new Diff(expected, xml);
        assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
