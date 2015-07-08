package gov.va.hmp.feed.atom;

import gov.va.hmp.feed.atom.Entry;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.feed.atom.Person;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class EntryTests {
    @Test
    public void testAuthor() {
        Entry e = new Entry();
        Assert.assertNull(e.getAuthor());

        Person person = new Person();
        person.setName("Foo");

        e.setAuthor(person);
        Assert.assertSame(person, e.getAuthor());

        Person person1 = new Person();
        person1.setName("Bar");

        e.getAuthors().add(person1);
        try {
            e.getAuthor();
            fail("expected exception");
        } catch (UnsupportedOperationException ex) {
            // NOOP
        }

    }

    @Test
    public void testLink() {
        Entry e = new Entry();
        Assert.assertNull(e.getLink());

        Link link = new Link();
        link.setHref("http://www.example.org");

        e.setLink(link);
        Assert.assertSame(link, e.getLink());

        Link link1 = new Link();
        link1.setHref("http://www.google.com");

        e.getLinks().add(link1);
        try {
            e.getLink();
            fail("expected exception");
        } catch (UnsupportedOperationException ex) {
            // NOOP
        }

    }

    @Test
    public void testCompareTo() {
        Entry entry1 = new Entry();
        entry1.setUpdated(new PointInTime(1984, 3, 11));

        Entry entry2 = new Entry();
        entry2.setUpdated(new PointInTime(1975, 7, 23));

        assertTrue(entry1.compareTo(entry2) < 0);
        assertTrue(entry2.compareTo(entry1) > 0);
        assertTrue(entry2.compareTo(entry2) == 0);
    }

}
