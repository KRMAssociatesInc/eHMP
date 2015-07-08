package gov.va.hmp.jsonc;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import com.fasterxml.jackson.databind.JsonNode;
import gov.va.hmp.jsonc.JsonCCollection;
import org.junit.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class JsonCCollectionTests {

    public static final String MOCK_JSON = "{\"apiVersion\":\"2.3\",\"data\":{\"totalItems\":3,\"items\":[{\"name\":\"foo\"},{\"name\":\"bar\"},{\"name\":\"baz\"}]}}";

    @Test
    public void testCreateFromList() {
        List<String> items = new ArrayList<String>();
        items.add("foo");
        items.add("bar");
        items.add("baz");

        JsonCCollection<String> jsonc = JsonCCollection.create(items);

        assertThat(jsonc.getSuccess(), is(true));
        assertThat(jsonc.getCurrentItemCount(), is(items.size()));
        assertThat(jsonc.getTotalItems(), is(items.size()));
        assertThat(jsonc.getStartIndex(), is(0));
        assertThat(jsonc.getItemsPerPage(), is(items.size()));

        assertThat(jsonc.getItems().size(), is(items.size()));
        assertThat(jsonc.getItems().get(0), is(items.get(0)));
        assertThat(jsonc.getItems().get(1), is(items.get(1)));
        assertThat(jsonc.getItems().get(2), is(items.get(2)));
    }

    @Test
    public void testCreateFromPage() {
        List<String> items = new ArrayList<String>();
        items.add("foo");
        items.add("bar");
        items.add("baz");

        int total = 12;
        PageImpl<String> page = new PageImpl<String>(items, new PageRequest(3, 3), total);

        JsonCCollection<String> jsonc = JsonCCollection.create(page);

        assertThat(jsonc.getSuccess(), is(true));
        assertThat(jsonc.getCurrentItemCount(), is(items.size()));
        assertThat(jsonc.getTotalItems(), is(total));
        assertThat(jsonc.getStartIndex(), is(9));
        assertThat(jsonc.getItemsPerPage(), is(3));
        assertThat(jsonc.data.pageIndex, is(3));
        assertThat(jsonc.data.totalPages, is(4));

        assertThat(jsonc.getItems().size(), is(items.size()));
        assertThat(jsonc.getItems().get(0), is(items.get(0)));
        assertThat(jsonc.getItems().get(1), is(items.get(1)));
        assertThat(jsonc.getItems().get(2), is(items.get(2)));
    }

    @Test
    public void testCreateFromJsonString() {
        JsonCCollection<Map<String,Object>> jsonc = JsonCCollection.create(MOCK_JSON);

        assertMockJson(jsonc);
    }

    @Test
    public void testCreateFromJsonNode() throws IOException {
        JsonNode jsonNode = POMUtils.parseJSONtoNode(MOCK_JSON);

        JsonCCollection<Map<String,Object>> jsonc = JsonCCollection.create(jsonNode);

        assertMockJson(jsonc);
    }

    @Test
    public void testCreateFromJsonNodeAndItemType() throws IOException {
        JsonNode jsonNode = POMUtils.parseJSONtoNode(MOCK_JSON);

        JsonCCollection<NameyThingy> jsonc = JsonCCollection.create(NameyThingy.class,jsonNode);

        assertThat(jsonc.apiVersion, is("2.3"));
        assertThat(jsonc.getTotalItems(), is(3));
        assertThat(jsonc.getItems().size(), is(3));
        assertThat(jsonc.getItems().get(0).getName(), is("foo"));
        assertThat(jsonc.getItems().get(1).getName(), is("bar"));
        assertThat(jsonc.getItems().get(2).getName(), is("baz"));
    }

    @Test
    public void testCreateFromHttpServletRequestAndList() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setMethod("GET");
        mockRequest.setRequestURI("/foo/bar/baz");
        mockRequest.setParameter("foo", "fred");
        mockRequest.setParameter("bar", "barney");
        mockRequest.setParameter("baz", "betty");

        List<String> items = new ArrayList<String>();
        items.add("foo");
        items.add("bar");
        items.add("baz");

        JsonCCollection<String> jsonc = JsonCCollection.create(mockRequest, items);

        assertThat(jsonc.method, is("GET /foo/bar/baz"));
        assertThat(jsonc.params.get("foo").toString(), is("fred"));
        assertThat(jsonc.params.get("bar").toString(), is("barney"));
        assertThat(jsonc.params.get("baz").toString(), is("betty"));

        assertThat(jsonc.getSuccess(), is(true));
        assertThat(jsonc.getCurrentItemCount(), is(items.size()));
        assertThat(jsonc.getTotalItems(), is(items.size()));
        assertThat(jsonc.getStartIndex(), is(0));
        assertThat(jsonc.getItemsPerPage(), is(items.size()));

        assertThat(jsonc.getItems().size(), is(items.size()));
        assertThat(jsonc.getItems().get(0), is(items.get(0)));
        assertThat(jsonc.getItems().get(1), is(items.get(1)));
        assertThat(jsonc.getItems().get(2), is(items.get(2)));
    }

    @Test
    public void testCreateFromHttpServletRequestAndPage() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setMethod("GET");
        mockRequest.setRequestURI("/foo/bar/baz");
        mockRequest.setParameter("foo", "fred");
        mockRequest.setParameter("bar", "barney");
        mockRequest.setParameter("baz", "betty");

        List<String> items = new ArrayList<String>();
        items.add("foo");
        items.add("bar");
        items.add("baz");

        int total = 12;
        PageImpl<String> page = new PageImpl<String>(items, new PageRequest(3, 3), total);

        JsonCCollection<String> jsonc = JsonCCollection.create(mockRequest, page);

        assertThat(jsonc.method, is("GET /foo/bar/baz"));
        assertThat(jsonc.params.get("foo").toString(), is("fred"));
        assertThat(jsonc.params.get("bar").toString(), is("barney"));
        assertThat(jsonc.params.get("baz").toString(), is("betty"));

        assertThat(jsonc.getSuccess(), is(true));
        assertThat(jsonc.getCurrentItemCount(), is(items.size()));
        assertThat(jsonc.getTotalItems(), is(total));
        assertThat(jsonc.getStartIndex(), is(9));
        assertThat(jsonc.getItemsPerPage(), is(3));
        assertThat(jsonc.data.pageIndex, is(3));
        assertThat(jsonc.data.totalPages, is(4));

        assertThat(jsonc.getItems().size(), is(items.size()));
        assertThat(jsonc.getItems().get(0), is(items.get(0)));
        assertThat(jsonc.getItems().get(1), is(items.get(1)));
        assertThat(jsonc.getItems().get(2), is(items.get(2)));
    }

    private void assertMockJson(JsonCCollection<Map<String, Object>> jsonc) {
        assertThat(jsonc.apiVersion, is("2.3"));
        assertThat(jsonc.getTotalItems(), is(3));
        assertThat(jsonc.getItems().size(), is(3));
        assertThat(jsonc.getItems().get(0).get("name").toString(), is("foo"));
        assertThat(jsonc.getItems().get(1).get("name").toString(), is("bar"));
        assertThat(jsonc.getItems().get(2).get("name").toString(), is("baz"));
    }

    public static class NameyThingy extends AbstractPOMObject {

        private String name;

        public NameyThingy() {
            super(null);
        }

        public NameyThingy(Map<String, Object> vals) {
            super(vals);
        }

        public String getName() {
            return name;
        }
    }
}
