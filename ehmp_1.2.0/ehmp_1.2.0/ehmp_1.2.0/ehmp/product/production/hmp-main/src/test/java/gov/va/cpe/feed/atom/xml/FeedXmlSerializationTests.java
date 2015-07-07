package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.Feed;
import gov.va.hmp.feed.atom.Generator;
import gov.va.hmp.feed.atom.Person;
import gov.va.hmp.feed.atom.Text;
import gov.va.cpe.vpr.pom.POMXmlMapper;
import gov.va.hmp.healthtime.PointInTime;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.util.FileCopyUtils;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStreamReader;

public class FeedXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalMinimalFeed() throws IOException, SAXException {
        String expected = FileCopyUtils.copyToString(new InputStreamReader(this.getClass().getResourceAsStream("feed-min.xml")));

        Feed feed = new Feed();
        feed.setId("http://example.com/blog/1234");
        feed.setTitle(new Text("Atom-Powered Robots Run Amok"));
        feed.setUpdated(new PointInTime(1975, 7, 23, 10, 13, 34, 0));

        String xml = new POMXmlMapper().writeValueAsString(feed);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalFullFeed() throws IOException, SAXException {
        String expected = FileCopyUtils.copyToString(new InputStreamReader(this.getClass().getResourceAsStream("feed-full.xml")));

        Person author = new Person();
        author.setName("John Doe");
        author.setEmail("JohnDoe@example.com");
        author.setUri("http://example.com/~johndoe");

        Generator generator = new Generator();
        generator.setUri("/myblog.php");
        generator.setVersion("1.0");
        generator.setText("Example Toolkit");

        Feed feed = new Feed();
        feed.setId("http://example.com/blog/1234");
        feed.setTitle(new Text("Atom-Powered Robots Run Amok"));
        feed.setUpdated(new PointInTime(1975, 7, 23, 10, 13, 34, 0));
        feed.setAuthor(author);
        feed.setLink(AtomFactory.createLink("self", "/feed"));
        feed.setGenerator(generator);
        feed.setIcon("/icon.jpg");
        feed.setLogo("/logo.jpg");
        feed.setRights(AtomFactory.createText("html", "&copy; 2005 John Doe"));
        feed.setSubtitle(new Text("all your examples are belong to us"));
        feed.addToCategories(AtomFactory.createCategory("sports"));
        feed.addToContributors(AtomFactory.createPerson("Jane Doe"));
        feed.addToEntries(AtomFactory.createEntry("http://example.com/blog/1234/entries/5678", "Hello world", new PointInTime(1975, 7, 23, 10, 13, 34, 0)));

        String xml = new POMXmlMapper().writerWithDefaultPrettyPrinter().writeValueAsString(feed);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
