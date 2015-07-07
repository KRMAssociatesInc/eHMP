package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.Category;
import gov.va.hmp.feed.atom.Entry;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.feed.atom.Text;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public class MedicationToAtomEntry implements Converter<Medication, Entry>, InitializingBean {
    private ILinkService linkService;

    @Required
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public Entry convert(final Medication m) {
        Entry e = new Entry();

        e.setId(linkService.getSelfHref(m));
        e.setTitle(new Text(m.getQualifiedName()));
        e.setSummary(new Text(m.getSummary()));

        final PointInTime start = m.getOverallStart();
        e.setUpdated(start != null ? start : PointInTime.today());
        e.setPublished(start != null? start : PointInTime.today());

        Link link = new Link(linkService.getSelfHref(m), "alternate", "application/xml");
        e.setLink(link);

        if (StringUtils.hasText(m.getProductFormName()))
            e.addToCategories(new Category(m.getProductFormName()));
        if (StringUtils.hasText(m.getVaType()))
            e.addToCategories(new Category(m.getVaType()));
        if (StringUtils.hasText(m.getVaStatus()))
            e.addToCategories(new Category(m.getVaStatus()));
        if (StringUtils.hasText(m.getMedStatusName()))
            e.addToCategories(new Category(m.getMedStatusName()));

        return e;
    }
}
