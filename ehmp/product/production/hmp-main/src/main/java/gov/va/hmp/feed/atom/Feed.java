package gov.va.hmp.feed.atom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import gov.va.hmp.healthtime.ISO8601PointInTimeSerializer;
import gov.va.hmp.healthtime.PointInTime;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.*;

@JacksonXmlRootElement(localName = "feed")
@XmlRootElement(name = "feed", namespace = "http://www.w3.org/2005/Atom")
public class Feed {
    /**
     * Identifies the feed using a universally unique and permanent URI.
     */
    private String id;
    /**
     * Contains a human readable title for the feed.
     */
    private Text title;
    private PointInTime updated;
    private List<Link> links = new ArrayList<Link>();
    private List<Person> authors = new ArrayList<Person>();
    private List<Category> categories = new ArrayList<Category>();
    @XmlElement
    private Generator generator;
    @XmlElement
    private String icon;
    @XmlElement
    private String logo;
    @XmlElement
    private Text rights;
    @XmlElement
    private Text subtitle;
    private List<Person> contributors = new ArrayList<Person>();
    private List<Entry> entries = new ArrayList<Entry>();

    /**
     * Indicates the last time the feed was modified in a significant way.  If this property has been set explicitly, that
     * value is returned.  Otherwise returns the most recent entrie's updated field
     *
     * @return
     */
    @XmlElement
    @JsonSerialize(using = ISO8601PointInTimeSerializer.class, include = JsonSerialize.Inclusion.NON_NULL)
    public PointInTime getUpdated() {
        if (updated != null) return updated;
        if (entries == null || entries.isEmpty()) return null;
        Collections.sort(entries);
        return entries.get(0).getUpdated();
    }

    public void setUpdated(PointInTime updated) {
        this.updated = updated;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "link")
    @XmlElement(name = "link", type = Link.class)
    public List<Link> getLinks() {
        return (links != null && !links.isEmpty()) ? links : null;
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
    @XmlElementRef
    public List<Category> getCategories() {
        return (categories != null && !categories.isEmpty()) ? categories : null;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "entry")
    @XmlElement(name = "entry")
    public List<Entry> getEntries() {
        return (entries != null && !entries.isEmpty()) ? entries : null;
    }

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "contributor")
    @XmlElement(name = "contributor")
    public List<Person> getContributors() {
        final List<Person> persons = contributors;
        return (persons != null && !persons.isEmpty()) ? persons : null;
    }

    @XmlTransient
    @JsonIgnore
    public Person getAuthor() {
        if (authors == null || authors.isEmpty()) return null;

        if (authors.size() == 1) {
            return authors.get(0);
        } else {
            throw new UnsupportedOperationException("unable to get feed's author - there is more than one!");
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
            throw new UnsupportedOperationException("unable to get feed's link - there is more than one!");
        }

    }

    public void setLink(Link link) {
        links = new ArrayList<Link>(Arrays.asList(link));
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

    public void addToEntries(Entry entry) {
        entries.add(entry);
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

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    public void setAuthors(List<Person> authors) {
        this.authors = authors;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public Generator getGenerator() {
        return generator;
    }

    public void setGenerator(Generator generator) {
        this.generator = generator;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Text getRights() {
        return rights;
    }

    public void setRights(Text rights) {
        this.rights = rights;
    }

    public Text getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(Text subtitle) {
        this.subtitle = subtitle;
    }

    public void setContributors(List<Person> contributors) {
        this.contributors = contributors;
    }

    public void setEntries(List<Entry> entries) {
        this.entries = entries;
    }
}
