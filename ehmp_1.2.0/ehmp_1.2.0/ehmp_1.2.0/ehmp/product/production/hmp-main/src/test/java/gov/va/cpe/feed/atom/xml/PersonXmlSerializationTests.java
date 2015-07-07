package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Person;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;

public class PersonXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalPersonWithName() throws IOException, SAXException {
        String expected = "<bar>\n<fred>\n<name>flintstone</name>\n</fred>\n</bar>\n";
        Bar bar = new Bar();
        Person person = new Person();
        person.setName("flintstone");
        bar.setFred(person);

        String xml = new POMXmlMapper().writeValueAsString(bar);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalPerson() throws IOException, SAXException {
        String expected = "<bar><fred><name>flintstone</name><uri>http://www.example.org</uri><email>fred@example.org</email></fred></bar>";

        Bar bar = new Bar();
        Person person = new Person();
        person.setName("flintstone");
        person.setEmail("fred@example.org");
        person.setUri("http://www.example.org");
        bar.setFred(person);

        String xml = new POMXmlMapper().writeValueAsString(bar);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
