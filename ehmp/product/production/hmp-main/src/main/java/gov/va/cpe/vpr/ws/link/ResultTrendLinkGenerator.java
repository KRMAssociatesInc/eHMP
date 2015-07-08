package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.hmp.feed.atom.Link;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class ResultTrendLinkGenerator implements ILinkGenerator, InitializingBean {

    private ILinkService linkService;

    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    public void afterPropertiesSet() {
        Assert.notNull(linkService, "'linkService' must not be null");
    }

    public boolean supports(Object object) {
        return object instanceof Result;
    }

    public Link generateLink(Object object) {
        final Result result = (Result) object;
        UriComponentsBuilder uriComponents = UriComponentsBuilder.fromUriString(linkService.getPatientHref(result.getPid())).pathSegment("result", "all");
        if (StringUtils.hasText(result.getTypeCode())) {
            uriComponents = uriComponents.queryParam("typeCode", result.getTypeCode());
        } else {
            uriComponents = uriComponents.queryParam("typeName", result.getTypeName());
        }

        Link link = new Link(uriComponents.build().encode().toUriString(), LinkRelation.TREND.toString());
        return link;
    }
}
