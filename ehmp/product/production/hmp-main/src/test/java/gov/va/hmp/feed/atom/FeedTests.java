package gov.va.hmp.feed.atom;

import gov.va.hmp.feed.atom.Entry;
import gov.va.hmp.feed.atom.Feed;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.feed.atom.Person;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

public class FeedTests {
    @Test
    public void testAuthor() {
        Feed f = new Feed();
        Assert.assertNull(f.getAuthor());

        Person person = new Person();
        person.setName("Foo");

        f.setAuthor(person);

        Assert.assertSame(person, f.getAuthor());

        Person person1 = new Person();
        person1.setName("Bar");

        f.addToAuthors(person1);
        try {
            f.getAuthor();
            Assert.fail("expected exception");
        } catch (UnsupportedOperationException ex) {
            // NOOP
        }

    }

    @Test
    public void testLink() {
        Feed f = new Feed();
        Assert.assertNull(f.getLink());

        Link link = new Link();
        link.setHref("http://www.example.org");

        f.setLink(link);
        Assert.assertSame(link, f.getLink());

        Link link1 = new Link();
        link1.setHref("http://www.google.com");

        f.addToLinks(link1);
        try {
            f.getLink();
            Assert.fail("expected exception");
        } catch (UnsupportedOperationException ex) {
            // NOOP
        }

    }

    @Test
    public void testUpdated() {
        Feed f = new Feed();
        Assert.assertNull(f.getUpdated());

        Entry entry = new Entry();
        entry.setUpdated(new PointInTime(1984, 3, 11, 22, 24, 56));

        f.addToEntries(entry);
        Entry entry1 = new Entry();
        entry1.setUpdated(new PointInTime(1993, 6, 4, 2, 19, 12));

        f.addToEntries(entry1);

        Assert.assertThat(f.getUpdated(), CoreMatchers.equalTo(new PointInTime(1993, 6, 4, 2, 19, 12)));

        PointInTime lastUpdated = new PointInTime(1975, 7, 23, 10, 54, 23);
        f.setUpdated(lastUpdated);
        Assert.assertThat(lastUpdated, CoreMatchers.equalTo(f.getUpdated()));
    }

}
