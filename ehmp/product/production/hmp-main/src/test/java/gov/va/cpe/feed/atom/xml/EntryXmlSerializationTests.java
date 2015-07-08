package gov.va.cpe.feed.atom.xml;

import gov.va.cpe.vpr.pom.POMXmlMapper;
import gov.va.hmp.feed.atom.Content;
import gov.va.hmp.feed.atom.Entry;
import gov.va.hmp.feed.atom.Text;
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

public class EntryXmlSerializationTests {
    @Before
    public void setUp() {
        XMLUnit.setIgnoreWhitespace(true);
    }

    @Test
    public void testMarshalMinimalEntry() throws IOException, SAXException {
        String expected = FileCopyUtils.copyToString(new InputStreamReader(this.getClass().getResourceAsStream("entry-min.xml")));

        Entry entry1 = new Entry();
        entry1.setId("http://example.com/blog/1234");
        entry1.setTitle(new Text("Atom-Powered Robots Run Amok"));
        entry1.setUpdated(new PointInTime(1975, 7, 23, 10, 13, 34, 0));

        String xml = new POMXmlMapper().writeValueAsString(entry1);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

    @Test
    public void testMarshalFullEntry() throws IOException, SAXException {
        String expected = FileCopyUtils.copyToString(new InputStreamReader(this.getClass().getResourceAsStream("entry-full.xml")));

        Entry entry = new Entry();
        entry.setId("http://example.com/blog/1234");
        entry.setTitle(new Text("Atom-Powered Robots Run Amok"));
        entry.setAuthor(AtomFactory.createPerson("Flintstone, Fred"));
        entry.setContent(new Content("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget tortor quam, mollis porta quam. Nam placerat sem consectetur magna semper bibendum. Duis pretium pellentesque nisi, id rhoncus augue porta eget. Nulla facilisi. Nam non augue sed leo auctor pretium. Curabitur et lacus odio, ac mattis velit. In eget dapibus metus. In condimentum, lacus ac fringilla hendrerit, turpis mauris imperdiet nulla, non mattis dolor quam vitae leo. Morbi nec velit sit amet odio commodo consectetur. Mauris semper nulla at mi vulputate malesuada."));
        entry.setLink(AtomFactory.createLink("alternate", "/blog/1234"));
        entry.setSummary(new Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit."));
        entry.setUpdated(new PointInTime(1975, 7, 23, 10, 13, 34, 0));
        entry.setPublished(new PointInTime(1984, 3, 11, 22, 43, 9));
        entry.addToCategories(AtomFactory.createCategory("Foo"));
        entry.addToCategories(AtomFactory.createCategory("Bar"));
        entry.addToContributors(AtomFactory.createPerson("Flintstone, Wilma"));
        entry.addToContributors(AtomFactory.createPerson("Rubble, Barney"));
        entry.setRights(AtomFactory.createText("html", "&copy; 1984 Fred Flintstone"));

        String xml = new POMXmlMapper().writerWithDefaultPrettyPrinter().writeValueAsString(entry);
        Diff xmlDiff = new Diff(expected, xml);
        Assert.assertTrue(xmlDiff.toString(), xmlDiff.similar());
    }

}
