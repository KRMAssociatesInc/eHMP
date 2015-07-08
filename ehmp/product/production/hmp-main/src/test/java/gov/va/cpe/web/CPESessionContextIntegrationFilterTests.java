package gov.va.cpe.web;

import gov.va.cpe.team.TeamContextHolder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.StaticWebApplicationContext;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class CPESessionContextIntegrationFilterTests {

    private CPESessionContextIntegrationFilter filter;
    private MockHttpSession mockSession;
    private MockHttpServletRequest mockRequest;
    private MockHttpServletResponse mockResponse;
    private MockFilterChain mockFilterChain;
    private WebApplicationContext mockWebApplicationContext;

    @Before
    public void setUp() throws Exception {
        mockWebApplicationContext = new StaticWebApplicationContext();
        mockSession = new MockHttpSession();
        mockRequest = new MockHttpServletRequest();
        mockRequest.setSession(mockSession);
        mockRequest.getServletContext().setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, mockWebApplicationContext);

        mockResponse = new MockHttpServletResponse();

        mockFilterChain = new MockFilterChain();

        filter = new CPESessionContextIntegrationFilter();
    }

    @After
    public void tearDown() throws Exception {
        TeamContextHolder.clearContext();
    }

    @Test
    public void testPatientContextIntegration() throws Exception {
        mockSession.setAttribute("pid", "foo");

//        filter.doFilter(mockRequest, mockResponse, mockFilterChain);

//        PatientContext context = PatientC
//        assertThat();
    }

    @Test
    public void testTeamContextIntegration() throws Exception {
//        mockSession.setAttribute(CPESessionContextIntegrationFilter.CPE_TEAM_CONTEXT_KEY, "foo");

        filter.doFilter(mockRequest, mockResponse, mockFilterChain);

        assertThat(TeamContextHolder.getContext(), is(notNullValue()));
    }
}
