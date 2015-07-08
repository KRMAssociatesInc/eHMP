package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import gov.va.hmp.healthtime.ISO8601PointInTimeSerializer;
import gov.va.hmp.healthtime.PointInTime;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@JacksonXmlRootElement(localName = "entry")
public class Entry implements Comparable {
    /**
     * Identifies the entry using a universally unique and permanent URI.
     */
    private String id;
    /**
     * Contains a human readable title for the entry.
     */
    private Text title;
    /**
     * Indicates the last time the entry was modified in a significant way. This value need not change after a typo is
     * fixed, only after a substantial modification. Generally, different entries in a feed will have different updated
     * timestamps.
     */
    @JsonSerialize(using = ISO8601PointInTimeSerializer.class, include = JsonSerialize.Inclusion.NON_NULL)
    private PointInTime updated;
    private List<Person> authors = new ArrayList<Person>();
    private Content content;
    /**
     * Identifies a related Web page. The type of relation is defined by the rel attribute.
     */
    private List<Link> links = new ArrayList<Link>();
    private Text summary;
    private List<Category> categories = new ArrayList<Category>();
    private List<Person> contributors = new ArrayList<Person>();
    @JsonSerialize(using = ISO8601PointInTimeSerializer.class, include = JsonSerialize.Inclusion.NON_NULL)
    private PointInTime published;
    @JsonIgnore
    private Feed source;
    private Text rights;

    @XmlTransient
    @JsonIgnore
    public Person getAuthor() {
        if (authors == null || authors.isEmpty()) return null;

        if (authors.size() == 1) {
            return authors.get(0);
        } else {
            throw new UnsupportedOperationException("unable to get entry's author - there is more than one!");
        }

    }

    public void setAuthor(Person author) {
        authors = new ArrayList<Person>(Arrays.asList(author));
    }

    @XmlTransient
    @JsonIgnore
    public Link getLink() {
        if (links == null || links.isEmpty()) return null;

        if (links.size() == 1) {
            return links.get(0);
        } else {
            throw new UnsupportedOperationException("unable to get entry's link - there is more than one!");
        }

    }

    public void setLink(Link link) {
        links = new ArrayList<Link>(Arrays.asList(link));
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "author")
    @XmlElement(name = "author")
    public List<Person> getAuthors() {
        final List<Person> persons = authors;
        return (persons != null && !persons.isEmpty()) ? persons : null;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "category")
    @XmlElement(name = "category")
    public List<Category> getCategories() {
        return (categories != null && !categories.isEmpty()) ? categories : null;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "contributor")
    @XmlElement(name = "contributor")
    public List<Person> getContributors() {
        final List<Person> persons = contributors;
        return (persons != null && !persons.isEmpty()) ? persons : null;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "link")
    @XmlElement(name = "link")
    public List<Link> getLinks() {
        return (links != null && !links.isEmpty()) ? links : null;
    }

    public void addToAuthors(Map props) {
        addToAuthors(new Person());
    }

    public void addToAuthors(Person author) {
        authors.add(author);
    }

    public void addToLinks(Map props) {
        addToLinks(new Link());
    }

    public void addToLinks(Link link) {
        links.add(link);
    }

    public void addToCategories(Map props) {
        addToCategories(new Category());
    }

    public void addToCategories(Category c) {
        categories.add(c);
    }

    public void addToContributors(Map props) {
        addToContributors(new Person());
    }

    public void addToContributors(Person contributor) {
        contributors.add(contributor);
    }

    /**
     * Compares to {Entry}s based on their <code>updated</code> property.  More recent entries compare earlier then later
     * ones.
     *
     * @param o
     * @return
     */
    public int compareTo(Object o) {
        Entry e = (Entry) o;
        return -updated.compareTo(e.updated);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Text getTitle() {
        return title;
    }

    public void setTitle(Text title) {
        this.title = title;
    }

    public PointInTime getUpdated() {
        return updated;
    }

    public void setUpdated(PointInTime updated) {
        this.updated = updated;
    }

    public void setAuthors(List<Person> authors) {
        this.authors = authors;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    public Text getSummary() {
        return summary;
    }

    public void setSummary(Text summary) {
        this.summary = summary;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public void setContributors(List<Person> contributors) {
        this.contributors = contributors;
    }

    public PointInTime getPublished() {
        return published;
    }

    public void setPublished(PointInTime published) {
        this.published = published;
    }

    public Feed getSource() {
        return source;
    }

    public void setSource(Feed source) {
        this.source = source;
    }

    public Text getRights() {
        return rights;
    }

    public void setRights(Text rights) {
        this.rights = rights;
    }
}
