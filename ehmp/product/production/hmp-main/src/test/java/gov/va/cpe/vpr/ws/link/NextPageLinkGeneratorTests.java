package gov.va.cpe.vpr.ws.link;

import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.jsonc.JsonCCollection;
import groovy.lang.IntRange;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

public class NextPageLinkGeneratorTests {

    private NextPageLinkGenerator generator;

    @Before
    public void setUp() {
        generator = new NextPageLinkGenerator();
    }

    @Test
    public void testSupports() {
        Assert.assertTrue(generator.supports(JsonCCollection.create(createMockPage(0, 20, 42))));
        Assert.assertTrue(generator.supports(JsonCCollection.create(createMockPage(20, 20, 42))));
        Assert.assertFalse(generator.supports(JsonCCollection.create(createMockPage(40, 20, 42))));
        Assert.assertFalse(generator.supports(new IntRange(1, 10)));
    }

    @Test
    public void testGenerateLink() {
        JsonCCollection jsonc = JsonCCollection.create(createMockPage(0, 20, 42));
        jsonc.setSelfLink("http://www.example.org/mock/collection");
        Link link = generator.generateLink(jsonc);
        Assert.assertEquals(LinkRelation.NEXT.toString(), link.getRel());
        Assert.assertEquals("http://www.example.org/mock/collection?startIndex=20&count=20", link.getHref());
    }

    private Page createMockPage(int startIndex, int itemsPerPage, int total) {
        return new PageImpl(new IntRange(startIndex, (startIndex + Math.min(itemsPerPage - 1, total - startIndex))), new PageRequest((int) (startIndex / itemsPerPage), itemsPerPage), total);
    }
}
