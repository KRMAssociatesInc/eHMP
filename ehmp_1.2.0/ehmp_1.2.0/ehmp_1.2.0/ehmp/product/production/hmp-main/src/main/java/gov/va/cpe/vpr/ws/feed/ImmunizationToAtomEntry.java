package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.Immunization;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.Category;
import gov.va.hmp.feed.atom.Entry;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.feed.atom.Text;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.Assert;

public class ImmunizationToAtomEntry implements Converter<Immunization, Entry>, InitializingBean {
    private ILinkService linkService;

    @Required
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public Entry convert(final Immunization i) {
        Entry e = new Entry();

        e.setId(linkService.getSelfHref(i));
        e.setTitle(new Text(i.getName()));
        e.setSummary(new Text(i.getSummary()));
        e.setUpdated(i.getAdministeredDateTime());
        e.setPublished(i.getAdministeredDateTime());

        Link link = new Link(linkService.getSelfHref(i), "alternate", "application/xml");
        e.setLink(link);

        e.addToCategories(new Category(i.getName()));
        return e;
    }
}
