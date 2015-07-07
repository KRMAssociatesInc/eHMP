package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.EncounterProvider;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.*;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public class EncounterToAtomEntry implements Converter<Encounter, Entry>, InitializingBean {
    private ILinkService linkService;

    @Required
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public Entry convert(final Encounter e) {
        Entry entry = new Entry();
        entry.setId(linkService.getSelfHref(e));
        entry.setTitle(new Text(e.getTypeName() + ", " + e.getLocationDisplayName()));
        if (e.getStay() != null) {
            entry.setPublished(e.getStay().getArrivalDateTime());
            entry.setUpdated(e.getStay().getDischargeDateTime());
        } else {
            entry.setUpdated(e.getDateTime());
        }

        for (EncounterProvider p : e.getProviders()) {
            entry.addToAuthors(new Person(p.getProviderName()));
        }

        Link link = new Link(linkService.getSelfHref(e), "alternate", "application/xml");
        entry.setLink(link);

        if (StringUtils.hasText(e.getPatientClassName())) {
            entry.addToCategories(new Category(e.getPatientClassName()));
        }

        if (StringUtils.hasText(e.getLocationDisplayName())) {
            entry.addToCategories(new Category(e.getLocationDisplayName()));
        }

        if (StringUtils.hasText(e.getReason())) {
            entry.addToCategories(new Category(e.getReason()));
        }

        entry.addToCategories(new Category(e.getFacilityCode(), e.getFacilityName()));
        return entry;
    }
}
