package gov.va.cpe.param;

import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.cpe.vpr.vistasvc.CacheMgrTests;
import gov.va.cpe.vpr.vistasvc.EhCacheTestUtils;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.junit.*;
import org.mockito.Matchers;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ParamServiceTests {

    private ParamService s;
    private RpcOperations mockRPC;
	private HmpUserDetails mockUser;
	private UserContext mockContext;
    
	String str = "{\"a\":1, \"b\":2, \"c\":3}";

    @BeforeClass
    public static void init() throws IOException {
        EhCacheTestUtils.setUp();
    }

    @AfterClass
    public static void shutdown() throws IOException {
        EhCacheTestUtils.tearDown();
    }

    @Before
	public void setUp() throws IOException {
		new CacheMgrTests().setup();
		
		mockContext = mock(UserContext.class);
		mockUser = mock(HmpUserDetails.class);
		mockRPC = mock(RpcOperations.class);
		s = new ParamService();
		s.rpcTemplate = mockRPC;
		s.userContext = mockContext;
		
		Answer<String> rpcAnswer = new Answer<String>() {
			Map<String, String> data = new HashMap<String, String>();
			@Override
			public String answer(InvocationOnMock invo) throws Throwable {
				Map<String, String> map = (Map) invo.getArguments()[1];
				String cmd = map.get("command");
				String uid = map.get("uid");
				Object value = map.get("value");
				String ret = null;
				if (cmd.equals(ParamService.GET_PARAM_COMMAND)) {
					ret = data.get(uid); 
				} else if (cmd.equals(ParamService.GET_ALL_PARAMS_COMMAND)) {
					if (value instanceof List) {
						StringBuffer sb = new StringBuffer();
						List<Object> list = (List<Object>) value;
						for (Object o : list){ 
							sb.append(o.toString());
						}
						data.put(uid, sb.toString());
					}
				} else if (cmd.equals(ParamService.CLEAR_PARAM_COMMAND)) {
					data.remove(uid);
				}
				return ret;
			}
		};
		
		when(mockContext.getCurrentUser()).thenReturn(mockUser);
		when(mockUser.getDUZ()).thenReturn("1234");
		when(mockUser.getVistaId()).thenReturn("AB12");
		when(mockRPC.executeForString(eq("/HMP UI CONTEXT/HMPCRPC RPC"), Matchers.anyMap())).then(rpcAnswer);
	}

    @After
    public void tearDown() throws Exception {
        s.clearCache();
    }

    @Test
    public void testGetUserPreference() {
        s.setUserParam(ParamService.VPR_USER_PREF, null, str);

        assertThat((Integer) s.getUserPreference("a"), is(1));
        assertThat((Integer) s.getUserPreference("b"), is(2));
        assertThat((Integer) s.getUserPreference("c"), is(3));
    }

    @Test
    public void testSetUserPreference() {
        s.setUserParam(ParamService.VPR_USER_PREF, null, str);

        s.setUserPreference("b", "foobar");
        assertThat((String) s.getUserPreference("b"), is("foobar"));
        assertThat((String) s.getUserPreferences().get("b"), is("foobar"));
    }

    @Test
    public void testGetUserPreferences() {
        s.setUserParam(ParamService.VPR_USER_PREF, null, str);

        Map prefs = s.getUserPreferences();
        assertThat((Integer) prefs.get("a"), is(1));
        assertThat((Integer) prefs.get("b"), is(2));
        assertThat((Integer) prefs.get("c"), is(3));
    }

    @Test
    public void testGetUID() {
    	// no inst should default to 0
    	assertEquals("urn:va:param:AB12:1234:FOO:0", s.getUserParamUid("FOO", null));
    	assertEquals("urn:va:param:AB12:1234:FOO:789", s.getUserParamUid("FOO", "789"));
    }
    
    @Test
    public void testGetUserParam() {
    	// non-existant params return null;
    	assertNull(s.getUserParam("FOO"));
    	s.setUserParam("FOO", null, str);
    	assertNotNull(s.getUserParam("FOO"));
    	
    	// all the different ways to get the same mocked param value
    	assertEquals(str, s.getUserParam("FOO"));
    	assertEquals(str, s.getUserParam("FOO", "0"));
    	
    	// also test that we can get the map value 
    	Map map = s.getUserParamMap("FOO", null);
    	assertEquals(1, map.get("a"));
    	assertEquals(2, map.get("b"));
    	assertEquals(3, map.get("c"));
    	
    	// and the individual keys as expected
    	assertEquals(1, s.getUserParamVal("FOO", "a", null));
    	assertEquals(2, s.getUserParamVal("FOO", "b", null));
    	assertEquals(3, s.getUserParamVal("FOO", "c", null));
    }
    
    @Test
    public void testSetUserParam() {
    	
    	// setup a few values and ensure they exist
    	s.setUserParam("FOO", null, str);
    	assertEquals(str, s.getUserParam("FOO"));
    	
    	// add a few more values
    	Map map = new HashMap();
    	map.put("x", 1);
    	map.put("y", 2);
    	s.setUserParamVals("FOO", null, map);
    	s.setUserParamVal("FOO", null, "z", "3");
    	
    	// the new values should exist
    	map = s.getUserParamMap("FOO", null);
    	assertEquals(1, map.get("x"));
    	assertEquals(2, map.get("y"));
    	assertEquals("3", map.get("z"));
    	
    	// the originals should be there too
    	assertEquals(1, map.get("a"));
    	assertEquals(2, map.get("b"));
    	assertEquals(3, map.get("c"));
    }
    
    @Test
    public void testClearUserParam() {
    	assertEquals(null, s.getUserParam("BLA"));
    	s.setUserParam("BLA", null, str);
    	assertNotNull(s.getUserParam("BLA"));
    	s.clearUserParam("BLA", null);
    	assertNull(s.getUserParam("BLA"));
    }
}
