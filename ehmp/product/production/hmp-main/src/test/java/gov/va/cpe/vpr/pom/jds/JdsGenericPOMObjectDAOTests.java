package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;

import java.net.URI;
import java.util.*;

import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class JdsGenericPOMObjectDAOTests {

    private ObjectMapper jsonMapper;

    private JdsGenericDAO dao;

    private JdsOperations mockJdsTemplate;

    @Before
    public void setUp() throws Exception {
        jsonMapper = new ObjectMapper();

        mockJdsTemplate = mock(JdsOperations.class);

        dao = new JdsGenericDAO();
        dao.setJdsTemplate(mockJdsTemplate);
    }

    @Test
    public void testSaveForNewUid() throws Exception {
        when(mockJdsTemplate.postForLocation(eq("/data/foo"), any(HttpEntity.class))).thenReturn(URI.create("/data/urn:va:foo:1234:42"));

        Foo foo = new Foo();
        dao.save(foo);

        verify(mockJdsTemplate).postForLocation("/data/foo", foo);

        assertThat(foo.getUid(), is("urn:va:foo:1234:42"));
    }

    @Test
    public void testSaveWithExistingUid() throws Exception {
        when(mockJdsTemplate.postForLocation(eq("/data"), any(HttpEntity.class))).thenReturn(URI.create("/data/urn:va:foo:1234:42"));

        Foo foo = new Foo();
        foo.setData("uid", "urn:va:foo:1234:42");

        dao.save(foo);

        verify(mockJdsTemplate).postForLocation("/data", foo);

        assertThat(foo.getUid(), is("urn:va:foo:1234:42"));
    }

    @Test
    public void testDeleteByUID() throws Exception {
        dao.deleteByUID(Foo.class, "urn:va:foo:1234:42");

        verify(mockJdsTemplate).delete("/data/urn:va:foo:1234:42");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDeleteByUIDNullArg() throws Exception {
        dao.deleteByUID(Foo.class, null);
    }

    @Test
    public void testDeleteAll() throws Exception {
        dao.deleteAll(Foo.class);

        verify(mockJdsTemplate).delete("/data/collection/foo");
    }

    @Test
    public void testFindByUID() throws Exception {
        String uid = "urn:va:foo:1234:42";

        Foo mockFoo = new Foo();
        mockFoo.setData("uid", uid);
        when(mockJdsTemplate.getForObject(Foo.class, "/data/" + uid)).thenReturn(mockFoo);

        Foo foo = dao.findByUID(Foo.class, uid);
        assertThat(foo, sameInstance(mockFoo));

        verify(mockJdsTemplate).getForObject(Foo.class, "/data/" + uid);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFindByUIDNullArg() throws Exception {
        dao.findByUID(Foo.class, null);
    }

    @Test
    public void testFindByUIDNotFound() throws Exception {
        String uid = "urn:va:foo:1234:42";

        when(mockJdsTemplate.getForObject(Foo.class, "/data/" + uid)).thenReturn(null);

        Foo foo = dao.findByUID(Foo.class, "urn:va:foo:1234:42");

        assertThat(foo, nullValue());

        verify(mockJdsTemplate).getForObject(Foo.class, "/data/" + uid);
    }

    @Test
    public void testFindTypeByUIDWithTemplate() throws Exception {
        String uid = "urn:va:foo:1234:42";

        Foo mockFoo = new Foo();
        mockFoo.setData("uid", uid);
        when(mockJdsTemplate.getForObject(Foo.class, "/data/" + uid + "/an-awesome-jds-template-here")).thenReturn(mockFoo);

        Foo foo = dao.findByUIDWithTemplate(Foo.class, uid, "an-awesome-jds-template-here");
        assertThat(foo, sameInstance(mockFoo));

        verify(mockJdsTemplate).getForObject(Foo.class, "/data/" + uid + "/an-awesome-jds-template-here");
    }

    @Test
    public void testFindMapByUIDWithTemplate() throws Exception {
        String uid = "urn:va:foo:1234:42";

        Foo mockFoo = new Foo();
        mockFoo.setData("uid", uid);
        when(mockJdsTemplate.getForObject(Map.class, "/data/" + uid + "/an-awesome-jds-template-here")).thenReturn(mockFoo.getData());

        Map<String,Object> foo = dao.findByUIDWithTemplate(uid, "an-awesome-jds-template-here");
        assertThat((String) foo.get("uid"), is(mockFoo.getUid()));

        verify(mockJdsTemplate).getForObject(Map.class, "/data/" + uid + "/an-awesome-jds-template-here");
    }

    @Test
    public void testFindAll() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        when(mockJdsTemplate.getForJsonC("/data/find/foo")).thenReturn(JsonCCollection.create(mockFoos));

        List<Foo> foos = dao.findAll(Foo.class);

        assertThat(foos.size(), is(3));
        verify(mockJdsTemplate).getForJsonC("/data/find/foo");
    }

    @Test
    public void testFindAllWithTemplate() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        when(mockJdsTemplate.getForJsonC("/data/find/foo/an-awesome-jds-template-here")).thenReturn(JsonCCollection.create(mockFoos));

        List<Foo> foos = dao.findAllWithTemplate(Foo.class, "an-awesome-jds-template-here");

        assertThat(foos.size(), is(3));
        verify(mockJdsTemplate).getForJsonC("/data/find/foo/an-awesome-jds-template-here");
    }


    @Test
    public void testFindAllWithEmptyCollection() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();

        when(mockJdsTemplate.getForJsonC("/data/find/foo")).thenReturn(JsonCCollection.create(mockFoos));

        List<Foo> foos = dao.findAll(Foo.class);

        assertThat(foos.size(), is(0));
        verify(mockJdsTemplate).getForJsonC("/data/find/foo");
    }

    @Test
    public void testFindAllByIndex() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        when(mockJdsTemplate.getForJsonC("/data/index/mockfooindex")).thenReturn(JsonCCollection.create(mockFoos));

        List<Foo> foos = dao.findAllByIndex(Foo.class, "mockfooindex");

        assertThat(foos.size(), is(3));
        verify(mockJdsTemplate).getForJsonC("/data/index/mockfooindex");
    }

    @Test
    public void testFindAllByIndexWithPagination() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        Pageable pageable = new PageRequest(0, 3);
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(new PageImpl(mockFoos, pageable, 9));

        when(mockJdsTemplate.getForJsonC("/data/index/mockfooindex?start=0&limit=3")).thenReturn(jsonc);

        Page<Foo> foos = dao.findAllByIndex(Foo.class, "mockfooindex", pageable);

        assertThat(foos.getNumberOfElements(), is(3));
        assertThat(foos.getTotalElements(), is(9L));
        verify(mockJdsTemplate).getForJsonC("/data/index/mockfooindex?start=0&limit=3");
    }

    @Test
    public void testFindAllByIndexAndRange() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        when(mockJdsTemplate.getForJsonC("/data/index/mockfooindex?range=jklmn")).thenReturn(JsonCCollection.create(mockFoos));

        List<Foo> foos = dao.findAllByIndexAndRange(Foo.class, "mockfooindex", "jklmn");

        assertThat(foos.size(), is(3));
        verify(mockJdsTemplate).getForJsonC("/data/index/mockfooindex?range=jklmn");
    }

    @Test
    public void testFindAllByIndexAndRangeWithPagination() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:42", "foo"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:64", "baz"), Map.class));

        Pageable pageable = new PageRequest(0, 3);
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(new PageImpl(mockFoos, pageable, 9));

        when(mockJdsTemplate.getForJsonC("/data/index/mockfooindex?range=jklmn&start=0&limit=3")).thenReturn(jsonc);

        Page<Foo> foos = dao.findAllByIndexAndRange(Foo.class, "mockfooindex", "jklmn", pageable);

        assertThat(foos.getNumberOfElements(), is(3));
        assertThat(foos.getTotalElements(), is(9L));
        verify(mockJdsTemplate).getForJsonC("/data/index/mockfooindex?range=jklmn&start=0&limit=3");
    }

    @Test
    public void testFindAllUIDs() {
        List<String> mockUids = Arrays.asList("urn:foo:bar", "urn:baz:spaz", "urn:maz:graz");
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        for (String mockUid : mockUids) {
            mockFoos.add(Collections.<String, Object>singletonMap("uid", mockUid));
        }
        when(mockJdsTemplate.getForJsonC("/data/find/foo/uid")).thenReturn(JsonCCollection.create(mockFoos));

        List<String> uids = dao.findAllUIDs(Foo.class);

        assertThat(uids, hasItems("urn:foo:bar", "urn:baz:spaz", "urn:maz:graz"));
    }

    @Test
    public void testFindOneByIndexAndRange() throws Exception {
        List<Map<String, Object>> mockFoos = new ArrayList<Map<String, Object>>();
        mockFoos.add(jsonMapper.convertValue(new Foo("urn:va:foo:1234:57", "bar"), Map.class));

        when(mockJdsTemplate.getForJsonC("/data/index/mockfooindex?range=jklmn")).thenReturn(JsonCCollection.create(mockFoos));

        Foo foo = dao.findOneByIndexAndRange(Foo.class, "mockfooindex", "jklmn");

        assertThat(foo, notNullValue());
        verify(mockJdsTemplate).getForJsonC("/data/index/mockfooindex?range=jklmn");
    }

    @Test
    public void testCount() throws Exception {
        Map<String, Object> mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "foo");
        mockFooCount.put("count", 23);

        when(mockJdsTemplate.getForJsonC("/data/all/count/collection")).thenReturn(JsonCCollection.create(singletonList(mockFooCount)));

        int num = dao.count(Foo.class);

        assertThat(num, is(23));
        verify(mockJdsTemplate).getForJsonC("/data/all/count/collection");
    }

    @Test
    public void testCountUnknownCollection() throws Exception {
        Map<String, Object> mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "bar");
        mockFooCount.put("count", 23);

        when(mockJdsTemplate.getForJsonC("/data/all/count/collection")).thenReturn(JsonCCollection.create(singletonList(mockFooCount)));

        try {
            dao.count(Foo.class);
            fail("expected " + DataRetrievalFailureException.class);
        } catch (DataRetrievalFailureException e) {
            // NOOP
        }

        verify(mockJdsTemplate).getForJsonC("/data/all/count/collection");
    }

    @Test
     public void testCountByIndex() throws Exception {
        Map<String, Object> mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "1012740284");
        mockFooCount.put("count", 23);

        when(mockJdsTemplate.getForJsonC("/data/count/syncerror-pid-count")).thenReturn(JsonCCollection.create(singletonList(mockFooCount)));

        int num = dao.count("syncerror-pid-count");

        assertThat(num, is(1));
    }

    @Test
    public void testCountByIndexNull() throws Exception {

        when(mockJdsTemplate.getForJsonC("/data/count/syncerror-pid-count")).thenReturn(null);

        int num = dao.count("syncerror-pid-count");

        assertThat(num, is(0));
    }

    @Test
     public void testCountByIndexAndTarget() throws Exception {
        List<Map<String, Object>> mockList = new ArrayList<>();

        Map<String, Object> mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "1012740284");
        mockFooCount.put("count", 23);
        mockList.add(mockFooCount);

        mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "5000000347");
        mockFooCount.put("count", 117);
        mockList.add(mockFooCount);

        when(mockJdsTemplate.getForJsonC("/data/count/syncerror-pid-count")).thenReturn(JsonCCollection.create(mockList));

        int num = dao.count("syncerror-pid-count","1012740284");
        assertThat(num, is(23));

        num = dao.count("syncerror-pid-count","5000000347");
        assertThat(num, is(117));

        verify(mockJdsTemplate, times(2) ).getForJsonC("/data/count/syncerror-pid-count");
    }

    @Test
    public void testCountByIndexAndTargetNotFound() throws Exception {
        List<Map<String, Object>> mockList = new ArrayList<>();

        Map<String, Object> mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "1012740284");
        mockFooCount.put("count", 23);
        mockList.add(mockFooCount);

        mockFooCount = new HashMap<String, Object>();
        mockFooCount.put("topic", "5000000347");
        mockFooCount.put("count", 117);
        mockList.add(mockFooCount);

        when(mockJdsTemplate.getForJsonC("/data/count/syncerror-pid-count")).thenReturn(JsonCCollection.create(mockList));

        int num = dao.count("syncerror-pid-count","5000000678");
        assertThat(num, is(0));
    }

    @Test
    public void testCountByIndexAndTargetNull() throws Exception {

        when(mockJdsTemplate.getForJsonC("/data/count/syncerror-pid-count")).thenReturn(null);

        int num = dao.count("syncerror-pid-count","1012740284");

        assertThat(num, is(0));
    }


    public static class Foo extends AbstractPOMObject {

        private String bar;

        public Foo() {
            super(null);
        }

        public Foo(Map<String, Object> data) {
            super(data);
        }

        public Foo(String uid) {
            super(null);
            this.setData("uid", uid);
        }

        public Foo(String uid, String bar) {
            super(null);
            this.setData("uid", uid);
            this.setData("bar", bar);
        }

        public String getBar() {
            return bar;
        }
    }
}
