package gov.va.hmp.audit;

import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.springframework.core.env.Environment;

import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class UserAuditServiceTests {

    private UserAuditService userAuditService;
    private Logger mockLogger;
    private Environment mockEnvironment;
    private UserContext mockUserContext;

    @Before
    public void setUp() throws Exception {
        mockLogger = mock(Logger.class);
        mockEnvironment = mock(Environment.class);
        mockUserContext = mock(UserContext.class);

        userAuditService = new UserAuditService();
        userAuditService.setLogger(mockLogger);
        userAuditService.setEnvironment(mockEnvironment);
        userAuditService.setUserContext(mockUserContext);

        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn("mock.hmp.instance.id");
    }

    @Test
    public void testAuditWithLoggedInUser() throws Exception {
        String userUid = setUpLoggedInUser();

        userAuditService.audit("check", "cereal");

        verify(mockLogger).info(anyString(), eq("Jerry Seinfeld (" + userUid + ")"), eq("checked"), eq("cereal"), eq("mock.hmp.instance.id"));
    }

    @Test
    public void testAuditNullObject() throws Exception {
        String userUid = setUpLoggedInUser();

        userAuditService.audit("exclaim", null);

        verify(mockLogger).info(anyString(), eq("Jerry Seinfeld (" + userUid + ")"), eq("exclaimed"), eq("mock.hmp.instance.id"));
    }

    @Test
    public void testAuditWithNoLoggedInUser() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(false);

        userAuditService.audit("vomit", "half-eaten cereal");

        verify(mockLogger).info(anyString(), eq("mock.hmp.instance.id"), eq("vomited"), eq("half-eaten cereal"), eq("mock.hmp.instance.id"));
    }

    private String setUpLoggedInUser() {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
        when(mockUser.getDisplayName()).thenReturn("Jerry Seinfeld");
        String userUid = UidUtils.getUserUid("ABCD", "1234");
        when(mockUser.getUid()).thenReturn(userUid);
        return userUid;
    }


}
