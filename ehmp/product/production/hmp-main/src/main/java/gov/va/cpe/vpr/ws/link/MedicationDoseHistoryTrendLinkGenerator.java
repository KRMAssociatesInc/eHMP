package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.cpe.vpr.pom.DefaultNamingStrategy;
import gov.va.cpe.vpr.pom.INamingStrategy;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class MedicationDoseHistoryTrendLinkGenerator implements ILinkGenerator {

    private INamingStrategy namingStrategy = new DefaultNamingStrategy();

    private ILinkService linkService;

    public ILinkService getLinkService() {
        return linkService;
    }

    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "'linkService' must not be null");
    }

    public boolean supports(Object object) {
        return object instanceof Medication;
    }

    public Link generateLink(Object object) {
        final Medication med = (Medication) object;

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(linkService.getPatientHref(med.getPid()));
        uriBuilder.pathSegment(namingStrategy.collectionName(Medication.class), "all");
        uriBuilder.queryParam("qualifiedName", med.getQualifiedName());

        Link link = new Link(uriBuilder.build().encode().toString(), LinkRelation.TREND.toString());
        return link;
    }
}
