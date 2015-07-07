package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class VitalSignTrendLinkGenerator implements ILinkGenerator {

    private ILinkService linkService;

    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "'linkService' must not be null");
    }

    public boolean supports(Object object) {
        return object instanceof VitalSign;
    }

    public Link generateLink(Object object) {
        VitalSign vitalSign = (VitalSign) object;
        String patientHref = linkService.getPatientHref(vitalSign.getPid());
        UriComponents uriComponents;
        if (StringUtils.hasText(vitalSign.getTypeCode())) {
            uriComponents = UriComponentsBuilder.fromUriString("{base}/vital/all?typeCode={typeCode}").buildAndExpand(patientHref, vitalSign.getTypeCode());
        } else {
            uriComponents = UriComponentsBuilder.fromUriString("{base}/vital/all?typeName={typeName}").buildAndExpand(patientHref, vitalSign.getTypeName());
        }

        Link link = new Link(uriComponents.encode().toUriString(), LinkRelation.TREND.toString());
        return link;
    }
}
