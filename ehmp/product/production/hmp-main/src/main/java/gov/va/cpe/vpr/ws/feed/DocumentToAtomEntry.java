package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentClinician;
import gov.va.cpe.vpr.DocumentText;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.*;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.util.LinkedHashMap;

public class DocumentToAtomEntry implements Converter<Document, Entry>, InitializingBean {

    private ILinkService linkService;

    @Required
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "linkService must not be null");
    }

    public Entry convert(final Document d) {
        Entry e = new Entry();
        e.setId(linkService.getSelfHref(d));
        e.setTitle(new Text(d.getLocalTitle()));
        e.setUpdated(d.getReferenceDateTime());// TODO: maybe find latest signedDate for this
        e.setPublished(d.getReferenceDateTime());
        for (DocumentClinician s : d.getClinicians()) {
            e.addToAuthors(new Person(s.getClinician().getDisplayName()));
        }

        if (StringUtils.hasText(d.getSubject())) {
            e.setSummary(new Text(d.getSubject()));
        }
        Link link = new Link(linkService.getSelfHref(d), "alternate", "application/xml");
        e.setLink(link);

        e.setContent(new Content());
        e.getContent().setType("xhtml");
        StringBuilder body = new StringBuilder();
        for (DocumentText text: d.getText()) {
            body.append(text.getContent());
        }
        e.getContent().setText("<pre>" + HtmlUtils.htmlEscape(body.toString()) + "</pre>");

        if (StringUtils.hasText(d.getDocumentClass())) {
            e.addToCategories(new Category(d.getDocumentClass()));
        }

        if (StringUtils.hasText(d.getStatus())) {
            LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(1);
            e.addToCategories(new Category(d.getStatus()));
        }

        e.addToCategories(new Category(d.getFacilityCode(), d.getFacilityName()));
        return e;
    }
}
