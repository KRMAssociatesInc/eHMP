package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.Result;
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

public class ResultToAtomEntry implements Converter<Result, Entry>, InitializingBean {
    private ILinkService linkService;

    @Required
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public Entry convert(final Result r) {
        Entry e = new Entry();

        e.setId(linkService.getSelfHref(r));
        e.setTitle(new Text(r.getSummary()));

        final PointInTime resulted = r.getResulted();
        e.setUpdated(resulted != null ? resulted : r.getObserved());

        if (r.getObserved() != null) e.setPublished(r.getObserved());

        Link link = new Link(linkService.getSelfHref(r), "alternate", "application/xml");
        e.setLink(link);

        if (StringUtils.hasText(r.getInterpretationName())) {
            e.addToCategories(new Category(r.getInterpretationName()));
        }

        if (StringUtils.hasText(r.getResultStatusName())) {
            e.addToCategories(new Category(r.getResultStatusName()));
        }

        e.addToCategories(new Category(r.getFacilityCode(), r.getFacilityName()));

        return e;
    }
}
