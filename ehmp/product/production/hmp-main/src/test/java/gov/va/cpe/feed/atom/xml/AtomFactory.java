package gov.va.cpe.feed.atom.xml;

import gov.va.hmp.feed.atom.*;
import gov.va.hmp.healthtime.PointInTime;

public class AtomFactory {
    static Category createCategory(String term) {
        Category category = new Category();
        category.setTerm(term);
        return category;
    }

    static Person createPerson(String name) {
        Person person = new Person();
        person.setName(name);
        return person;
    }

    static Link createLink(String rel, String href) {
        Link link = new Link();
        link.setRel(rel);
        link.setHref(href);
        return link;
    }

    static Text createText(String type, String content) {
        Text text = new Text();
        text.setType(type);
        text.setText(content);
        return text;
    }

    static Entry createEntry(String id, String title, PointInTime updated) {
        Entry entry = new Entry();
        entry.setId(id);
        entry.setTitle(new Text(title));
        entry.setUpdated(updated);
        return entry;
    }
}
