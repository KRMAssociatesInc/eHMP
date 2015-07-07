package gov.va.cpe.vpr.ws.link;

import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.jsonc.JsonCCollection;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

// TODO: I suspect this logic should get folded into JsonCCollection somehow
@Component
public class NextPageLinkGenerator implements ILinkGenerator {

    public boolean supports(Object object) {
        if (!(object instanceof JsonCCollection)) return false;

        JsonCCollection cr = (JsonCCollection) object;
        return cr.getStartIndex() + cr.getItemsPerPage() < cr.getTotalItems();
    }

    public Link generateLink(Object object) {
        final JsonCCollection cr = (JsonCCollection) object;
        final String url = getUrl(cr);
        if (!StringUtils.hasText(url)) return null;

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(url);
        uriBuilder.queryParam("startIndex", cr.getStartIndex() + cr.getItemsPerPage());
        uriBuilder.queryParam("count", cr.getItemsPerPage());

        Link link = new Link(uriBuilder.build().encode().toString(), LinkRelation.NEXT.toString());
        return link;
    }

    private String getUrl(JsonCCollection jsonc) {
        return jsonc.getSelfLink();
    }

}
