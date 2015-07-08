package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Category;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

public class CategoryXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalMinimalCategory() throws IOException, SAXException {
        String expected = "\n<category xmlns=\"http://www.w3.org/2005/Atom\" term='foo'/>\n";
        Category category = new Category();
        category.setTerm("foo");

        String xml = new POMXmlMapper().writeValueAsString(category);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalFullCategory() throws IOException, SAXException {
        String expected = "\n<category xmlns=\"http://www.w3.org/2005/Atom\" term='bar' scheme=\"http://www.example.org/rels/bar\" label=\"This is a Bar.\"/>\n";
        Category category = new Category();
        category.setTerm("bar");
        category.setScheme("http://www.example.org/rels/bar");
        category.setLabel("This is a Bar.");

        String xml = new POMXmlMapper().writeValueAsString(category);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
