package gov.va.cpe.vpr.vistasvc;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.vistasvc.CacheMgr.CacheType;
import gov.va.cpe.vpr.vistasvc.VistAServiceTests.HashMapAnswers;

import java.io.File;
import java.io.IOException;

import org.h2.mvstore.MVMap;
import org.h2.mvstore.MVStore;
import org.junit.*;
import org.junit.rules.TemporaryFolder;
import org.mockito.stubbing.Answer;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Ignore("This test class uses the filesystem and delays thread execution; it should be moved to an integration test source set")
public class CacheMgrTests extends EhCacheTestUtils {
	public static String NAMESPACE = "TESTING";

    private ServletRequestAttributes attsMock;

    @BeforeClass
    public static void init() throws IOException {
        EhCacheTestUtils.setUp();
        CacheMgr.MVSTORE_FILE = ehcacheDiskStoreDir.newFile("CacheMgr.data");
    }

    @AfterClass
    public static void shutdown() throws IOException {
        EhCacheTestUtils.tearDown();
    }

    @Before
	public void setup() {
        // setup a mock of the request/session context
		Answer<?> myAnswer = new HashMapAnswers();
		attsMock = mock(ServletRequestAttributes.class);
		when(attsMock.getAttribute(anyString(), anyInt())).then(myAnswer);
		doAnswer(myAnswer).when(attsMock).setAttribute(anyString(), anyObject(), anyInt());
		doAnswer(myAnswer).when(attsMock).removeAttribute(anyString(), anyInt());
		RequestContextHolder.setRequestAttributes(attsMock);
	}
    
    // large string, to fill up memory fast
    private static final String JUNK = ":abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789abcdefghijlkmnopqrstuvwxyz0123456789"; 
    
    
    @Test
    @Ignore // This fails due to H2/MVStore bug
    public void testRemoveAll() {
    	CacheMgr<String> c = new CacheMgr<String>("bla", CacheType.MVSTORE);
    	assertFalse(c.iterator().hasNext()); // starts as empty
    	assertEquals(0, c.getSize());
    	c.store("foo", "bar");
    	assertTrue(c.iterator().hasNext());
    	assertEquals(1, c.getSize());
    	c.close();
    	
    	// re-open, should still have 1 item it
    	c = new CacheMgr<String>("bla", CacheType.MVSTORE);
    	assertEquals(1, c.getSize());
    	c.removeAll();
    	assertEquals(0, c.getSize());
    	c.close();
    	
    	// re-open, should have 0 items
    	c = new CacheMgr<String>("bla", CacheType.MVSTORE);
    	assertEquals(0, c.getSize());
    	c.close();
    }
    
    /**
     * Bug report sent to H2 mailing list....
     */
    @Test
    @Ignore // This fails due to H2/MVStore bug
    public void testMVMapClearReOpen() {
    	// open MVMap
    	File f = new File(System.getProperty("java.io.tmpdir"), "cache.data");
    	MVStore store = new MVStore.Builder().fileName(f.getAbsolutePath()).open();
    	MVMap<String,Object> map = store.openMap("foo");
    	
    	// should initally be empty
    	assertTrue(map.isEmpty());
    	
    	// add one item and close
    	map.put("foo", "bar");
    	assertEquals(1, map.size());
    	
    	// re-open, should still have 1 item it, clear all items and close
    	map = store.openMap("foo");
    	assertEquals(1, map.size());
    	map.clear();
    	assertEquals(0, map.size());
    	
    	// re-open, should have 0 items
    	map = store.openMap("foo");
    	assertTrue(map.isEmpty());
    }
    
    @Test
	public void testBulkMVSTORE() {
		CacheMgr<String> c = new CacheMgr<String>("foo", CacheType.MVSTORE);
		
		// load 100K items (this would normally fill up the memory), commit every 5s or 10K items
		long lastDTM = 0;
		for (int i=0; i < 100000; i++) {
			c.store("foo"+i, i+JUNK);
			if (System.currentTimeMillis() - lastDTM > 5000 || i % 10000 == 0) {
				lastDTM = System.currentTimeMillis();
				c.flush();
			}
		}
		c.flush();

		// read them back out
		for (int i=0; i < 100000; i++) {
			String val = c.fetch("foo"+i);
			assertNotNull(val);
			assertEquals(i+JUNK, val);
		}
	}

	@Test
	public void testInstanceObjectMEMORY() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.MEMORY));
	}
	
	@Test
	public void testInstanceObjectDISK() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.DISK));
	}

	@Test
	public void testInstanceObjectREQUEST() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.REQUEST));
	}
	
	@Test
	public void testInstanceObjectSESSION() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.SESSION));
	}
	
	@Test
	public void testInstanceObjectSESSION_MEMORY() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.SESSION_MEMORY));
	}
	
	@Test
	public void testInstanceObjectMVSTORE() {
		testInstanceObject(new CacheMgr<String>(NAMESPACE, CacheType.MVSTORE));
	}
	
	@Test
	public void testInstanceObjectNONE() {
		ICacheMgr<String> cache = new CacheMgr<String>(NAMESPACE, CacheType.NONE);
		
		// this one is special in that it basically never stores anything and fetch
		// always returns null
		assertEquals(0, cache.getSize());
		assertEquals("bar", cache.store("foo", "bar"));
		assertEquals(0, cache.getSize());
		assertNull(cache.fetch("foo"));
		assertFalse(cache.contains("foo"));
	}
	
	// generic test, run for each CacheType
	public void testInstanceObject(ICacheMgr<String> mgr) {
		// store a simple value
		String val = mgr.store("foo", "bar");
		assertEquals("bar", val);
		
		// fetch it back out
		val = mgr.fetch("foo");
		assertNotNull(val);
		assertEquals("bar", val);
		assertEquals(1, mgr.getSize());
		
		// remove it, should be gone from cache
		assertTrue(mgr.contains("foo"));
		mgr.remove("foo");
		assertNull(mgr.fetch("foo"));
		assertFalse(mgr.contains("foo"));
		assertEquals(0, mgr.getSize());
		
		// remove an non-existant key is ok, but contains will be false
		assertFalse(mgr.contains("asdfasdfasdf"));
		mgr.remove("asdfasdfasdf");
		assertNull(mgr.fetch("asdfasdfasdf"));
		assertFalse(mgr.contains("asdfasdfasdf"));
		
		// insert 2 keys
		mgr.store("foo", "a");
		mgr.store("bar", "b");
		assertEquals(2, mgr.getSize());
		assertNotNull(mgr.fetch("foo"));
		assertNotNull(mgr.fetch("bar"));
		mgr.removeAll();
		assertEquals(0, mgr.getSize());
		assertNull(mgr.fetch("foo"));
		assertNull(mgr.fetch("bar"));
		
		// store null value is ok, but it still exists
		if (!(((CacheMgr<String>) mgr).getType() == CacheType.MVSTORE)) {
			mgr.store("foo", null);
			assertNull(mgr.fetch("foo"));
			assertTrue(mgr.contains("foo"));
			mgr.remove("foo");
		}
		
		// null key is not ok for store/fetch/remove/contains
		try {
			mgr.store(null, "asdf");
			fail("Expected NPE");
		} catch (NullPointerException ex) {
			// expected
		}
		try {
			mgr.fetch(null);
			fail("Expected NPE");
		} catch (NullPointerException ex) {
			// expected
		}
		try {
			mgr.remove((String[]) null);
			fail("Expected NPE");
		} catch (NullPointerException ex) {
			// expected
		}
		
		// null safe add function avoids NPEs, and skips null values
		assertEquals(0, mgr.getSize());
		mgr.storeUnlessNull(null, null);
		mgr.storeUnlessNull("foo", null);
		mgr.storeUnlessNull(null, "bar");
		assertEquals(0, mgr.getSize());
		
		// test TTL
		try {
			// store something for 1 second, should be available immediately,
			// but after waiting for >1s, should return null
			mgr.store("foo", "bar", 1);
			assertNotNull(mgr.fetch("foo"));
			Thread.sleep(1100);
			assertNull(mgr.fetch("foo"));
		} catch (Exception ex) {
			// ignore
		}
		
	}
}
