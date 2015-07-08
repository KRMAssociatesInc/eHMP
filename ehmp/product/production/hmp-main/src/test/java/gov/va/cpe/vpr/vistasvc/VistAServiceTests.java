package gov.va.cpe.vpr.vistasvc;

import gov.va.cpe.vpr.vistasvc.CacheMgr.CacheType;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import java.util.HashMap;

import static org.junit.Assert.*;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class VistAServiceTests {
	
	public static class TestURNMapper extends RPCURNMapper {
		@Override
		public String fetch(String urn, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			String what = getURNPart(urn, 2);
			if (what.equals("rosters")) {
				return tpl.executeForString("/HMP UI CONTEXT/HMP ROSTERS", "");
			} else if (what.equals("roster")) {
				return tpl.executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", getURNPart(urn, 3));
			}
			return null;
		}
		
		@Override
		public void store(String urn, String data, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			String what = getURNPart(urn, 2);
			if (what.equals("roster")) {
				tpl.executeForString("/HMP UI CONTEXT/HMP UPDATE ROSTER", new Object[] {data});
			}
		}

		@Override
		public boolean isKnown(String urn) {
			String s = urn.toString();
			return s.startsWith("urn:va:roster:") || s.equals("urn:va:rosters");
		}
	}
	
	public static class HashMapAnswers implements Answer {
		HashMap[] maps = new HashMap[] {new HashMap(), new HashMap(), new HashMap()};
		
		@Override
		public Object answer(InvocationOnMock invo) throws Throwable {
			Object[] args = invo.getArguments();
			String key = args[0].toString();
			
			int scope = ServletRequestAttributes.SCOPE_GLOBAL_SESSION; // app scope
			if (args.length == 3 && args[2] instanceof Integer) {
				scope = (Integer) args[2];
			} else if (args.length == 2 && args[1] instanceof Integer) {
				scope = (Integer) args[1];
			}
			
			String name = invo.getMethod().getName();
			if (name.equals("getAttribute")) {
				return maps[scope].get(key);
			} else if (name.equals("setAttribute")) {
				Object val = (args.length >= 2) ? args[1] : null;
				maps[scope].put(key, val);
				return null;
			} else if (name.equals("removeAttribute")) {
				maps[scope].remove(key);
			}
			return null;
		}
		
	}

	private RpcTemplate tplMock;
	private VistAService svc;
	private TestURNMapper mapper;
	private ServletContext ctxMock;
	private ServletRequestAttributes attsMock;
	
	@Before
    public void setUp() throws Exception {
		// Mock the RPC Template and create a TestURNMapper
        tplMock = mock(RpcTemplate.class);
		mapper = new TestURNMapper();
		
		// Mock the servlet context for get/put attributes that uses a simple map to back it
		Answer myAnswer = new HashMapAnswers();
		ctxMock = mock(ServletContext.class);
		when(ctxMock.getAttribute(anyString())).then(myAnswer);
		doAnswer(myAnswer).when(ctxMock).setAttribute(anyString(), anyObject());
		doAnswer(myAnswer).when(ctxMock).removeAttribute(anyString());
		
		// mock the session/request attributes as well (and inject it as the threadlocal)
		attsMock = mock(ServletRequestAttributes.class);
		when(attsMock.getAttribute(anyString(), anyInt())).then(myAnswer);
		doAnswer(myAnswer).when(attsMock).setAttribute(anyString(), anyObject(), anyInt());
		doAnswer(myAnswer).when(attsMock).removeAttribute(anyString(), anyInt());
		RequestContextHolder.setRequestAttributes(attsMock);
		
		// setup a vista service
        svc = new VistAService(tplMock);
        svc.setServletContext(ctxMock);
    }
	
	@Test
	public void testMapper() {
		// ensure it recognizes the correct URL's
		assertTrue(mapper.isKnown("urn:va:roster:1234"));
		assertTrue(mapper.isKnown("urn:va:rosters"));
		assertFalse(mapper.isKnown("urn:va:foo"));
		assertFalse(mapper.isKnown("urn:va:rosters:foo"));
	
		// test fetch
		when(tplMock.executeForString(eq("/HMP UI CONTEXT/HMP ROSTERS"), eq(""))).thenReturn("all rosters xml");
		when(tplMock.executeForString(eq("/HMP UI CONTEXT/HMP ROSTER PATIENTS"), anyString())).thenReturn("roster patients xml");
		assertEquals("roster patients xml", mapper.fetch("urn:va:roster:12345", svc));
		assertEquals("all rosters xml", mapper.fetch("urn:va:rosters", svc));
		
		// test store
		mapper.store("urn:va:roster:12345", "new roster definition", svc);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP UPDATE ROSTER", new Object[] {"new roster definition"});
	}
	
	@Test
	public void testURNPart() {
		// should never return null if null string or invalid index
		assertEquals("", TestURNMapper.getURNPart((String) null, 2));
		assertEquals("", TestURNMapper.getURNPart("", 3));
		assertEquals("", TestURNMapper.getURNPart("asdf.asdf.asdf", 10));
		assertEquals("", TestURNMapper.getURNPart("", -10));
		
		// parts are zero-based
		assertEquals("foo", TestURNMapper.getURNPart("foo:bar:baz", 0));
		assertEquals("bar", TestURNMapper.getURNPart("foo:bar:baz", 1));
		assertEquals("baz", TestURNMapper.getURNPart("foo:bar:baz", 2));
	}
	
	@Test
	public void testRegisterResolover() {
		String urn = "urn:va:rosters";
		
		// initally there is no resolver, after we add one, then there is
		assertEquals(0, svc.resolvers.size());
		assertNull(svc.getResolverFor(urn, false));
		svc.addResolver(mapper);
		assertEquals(mapper, svc.getResolverFor(urn, false));
		assertEquals(1, svc.resolvers.size());
		
		// if we register two, then the first one should be returned
		TestURNMapper m2 = new TestURNMapper();
		assertTrue(mapper.isKnown(urn));
		assertTrue(m2.isKnown(urn));
		svc.addResolver(m2);
		assertEquals(mapper, svc.getResolverFor(urn, false));
		assertEquals(2, svc.resolvers.size());
	}
	
	@Test
	public void testAppContext() {
		// ensure that the mock is mocking the application context correctly
		assertNull(svc.ctx.getAttribute("foo"));
		svc.ctx.setAttribute("foo", "bar");
		assertEquals("bar", svc.ctx.getAttribute("foo"));
		svc.ctx.removeAttribute("foo");
		assertNull(svc.ctx.getAttribute("foo"));
	}
	
	@Test
	@Ignore // not ready yet
	public void testAppScopeCache() {
		final String rosterContent = "<roster><patients>....</patients></roster>";
		CachePolicy appCachePolicy = new CachePolicy(CacheType.MEMORY, 60 * 1000);
		
		// should be empty, verify the RPC would be called and the cache was checked
		assertNull(svc.get("urn:va:roster:123", appCachePolicy, mapper));
		verify(ctxMock, times(1)).getAttribute("VISTA_CACHE.urn:va:roster:123");
		verify(tplMock, times(1)).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
		
		// store some junk data as the new roster, ensure its written to cache AND the RPC
		svc.put("urn:va:roster:123", rosterContent, appCachePolicy, mapper);
		verify(ctxMock).setAttribute("VISTA_CACHE.urn:va:roster:123", rosterContent);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP UPDATE ROSTER", new Object[] {rosterContent});
		
		// verify that it gets read back, ensure its read from cache and NOT from the RPC (no more executions)
		assertEquals(rosterContent, svc.get("urn:va:roster:123", appCachePolicy, mapper));
		verify(ctxMock, times(2)).getAttribute("VISTA_CACHE.urn:va:roster:123");
		verify(tplMock, times(1)).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
	}
	
	@Test
	@Ignore // not ready yet
	public void testSessionScopeCache() {
		final String rosterContent = "<roster><patients>....</patients></roster>";
		CachePolicy appCachePolicy = new CachePolicy(CacheType.SESSION, 60 * 1000);
		svc.addResolver(mapper);
		
		// should be empty, verify the RPC would be called and the cache was checked
		assertNull(svc.get("urn:va:roster:123", appCachePolicy));
		verify(attsMock).getAttribute("VISTA_CACHE.urn:va:roster:123", ServletRequestAttributes.SCOPE_SESSION);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
		
		// store some junk data as the new roster, ensure its written to cache AND the RPC
		svc.put("urn:va:roster:123", rosterContent, appCachePolicy);
		verify(attsMock).setAttribute("VISTA_CACHE.urn:va:roster:123", rosterContent, ServletRequestAttributes.SCOPE_SESSION);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP UPDATE ROSTER", new Object[] {rosterContent});
		
		// verify that it gets read back, ensure its read from cache and NOT from the RPC (no more executions)
		assertEquals(rosterContent, svc.get("urn:va:roster:123", appCachePolicy));
		verify(attsMock, times(2)).getAttribute("VISTA_CACHE.urn:va:roster:123", ServletRequestAttributes.SCOPE_SESSION);
		verify(tplMock, times(1)).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
	}
	
	@Test
	@Ignore // not ready yet
	public void testRequestScopeCache() {
		final String rosterContent = "<roster><patients>....</patients></roster>";
		CachePolicy appCachePolicy = new CachePolicy(CacheType.REQUEST, 60 * 1000);
		svc.addResolver(mapper);
		
		// should be empty, verify the RPC would be called and the cache was checked
		assertNull(svc.get("urn:va:roster:123", appCachePolicy));
		verify(attsMock).getAttribute("VISTA_CACHE.urn:va:roster:123", ServletRequestAttributes.SCOPE_REQUEST);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
		
		// store some junk data as the new roster, ensure its written to cache AND the RPC
		svc.put("urn:va:roster:123", rosterContent, appCachePolicy);
		verify(attsMock).setAttribute("VISTA_CACHE.urn:va:roster:123", rosterContent, ServletRequestAttributes.SCOPE_REQUEST);
		verify(tplMock).executeForString("/HMP UI CONTEXT/HMP UPDATE ROSTER", new Object[] {rosterContent});
		
		// verify that it gets read back, ensure its read from cache and NOT from the RPC (no more executions)
		assertEquals(rosterContent, svc.get("urn:va:roster:123", appCachePolicy));
		verify(attsMock, times(2)).getAttribute("VISTA_CACHE.urn:va:roster:123", ServletRequestAttributes.SCOPE_REQUEST);
		verify(tplMock, times(1)).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "123");
	}
	
	@Test
	@Ignore // not ready yet
	public void testAppScopeCacheTimeout() throws InterruptedException {
		CachePolicy appCachePolicy = new CachePolicy(CacheType.MEMORY, 1 * 1000);
		svc.addResolver(mapper);
		
		// store a key
		svc.put("urn:va:roster:456", "foo", appCachePolicy);
		
		// fetch it imediately (should come from cache not RPC)
		assertEquals("foo", svc.get("urn:va:roster:456", appCachePolicy));
		verify(tplMock, never()).executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "456");
		
		// wait 2 seconds for it to expire
		Thread.sleep(2000);
		
		// fetch it again (should come from RPC this time); so the data should not be the FOO value we stored before
		when(tplMock.executeForString("/HMP UI CONTEXT/HMP ROSTER PATIENTS", "456")).thenReturn("vista roster data");
		assertEquals("vista roster data", svc.get("urn:va:roster:456", appCachePolicy));
	}

}
