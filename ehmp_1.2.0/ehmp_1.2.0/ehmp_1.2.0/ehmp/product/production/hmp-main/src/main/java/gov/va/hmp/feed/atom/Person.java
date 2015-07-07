package gov.va.hmp.feed.atom;

import javax.xml.bind.annotation.XmlElement;

public class Person {

    @XmlElement(required = true)
    private String name;
    @XmlElement
    private String uri;
    @XmlElement
    private String email;

    public Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public Person(String name, String uri) {
        this.name = name;
        this.uri = uri;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
