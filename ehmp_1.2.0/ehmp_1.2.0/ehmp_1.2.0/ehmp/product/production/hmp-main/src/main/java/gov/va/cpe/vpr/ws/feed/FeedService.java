package gov.va.cpe.vpr.ws.feed;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.cpe.vpr.ws.link.LinkRelation;
import gov.va.hmp.feed.atom.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedService {

    private ILinkService linkService;
    private ConversionService vprConversionService;

    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    @Autowired
    public void setVprConversionService(ConversionService vprConversionService) {
        this.vprConversionService = vprConversionService;
    }

    public Feed createFeed(PatientDemographics pt, String id, String title, List entries) {
        final Feed f = new Feed();
        f.setId(id);
        f.setTitle(new Text(title));
        f.setUpdated(pt.getLastUpdated());
        f.setAuthor(new Person(pt.getGivenNames() + " " + pt.getFamilyName(), linkService.getSelfHref(pt)));
        f.setLink(new Link(id, LinkRelation.SELF.toString(), "application/atom+xml"));

        for (Object it: entries) {
            Entry e = vprConversionService.convert(it, Entry.class);
            if (e != null) f.getEntries().add(e);
        }

        return f;
    }
}
