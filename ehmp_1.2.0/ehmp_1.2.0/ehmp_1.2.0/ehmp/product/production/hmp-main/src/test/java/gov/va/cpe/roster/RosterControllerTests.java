package gov.va.cpe.roster;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class RosterControllerTests {

    public static final String MOCK_PID = "42";
    public static final String MOCK_ROSTER_UID = "urn:va:roster:ABCD:1234";

    private RosterController controller;
    private IRosterService mockRosterService;
    private IPatientDAO mockPatientDao;
    private MockHttpServletRequest mockRequest;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockRosterService = mock(IRosterService.class);
        mockPatientDao = mock(IPatientDAO.class);

        controller = new RosterController();
        controller.setRosterService(mockRosterService);
        controller.setPatientDao(mockPatientDao);
    }

    @Test
    public void testUpdateOne() throws Exception {
        MockHttpSession mockHttpSession = new MockHttpSession();
        mockHttpSession.setAttribute("rosters", "fefefef");

        Roster mockRoster = new Roster();
        mockRoster.setData("uid", MOCK_ROSTER_UID);
        when(mockRosterService.updateRoster(new String[] {"foo", "bar", "baz"})).thenReturn(mockRoster);

        ModelAndView mav = controller.update("{\"id\":\"" + MOCK_ROSTER_UID + "\",\"def\":[\"foo\",\"bar\",\"baz\"]}", mockHttpSession, mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mockHttpSession.getAttribute("rosters"), nullValue());

        assertThat(mav.getModel(), is(mockRoster.getData(JSONViews.WSView.class)));
    }

    @Test
    public void testList() throws Exception {
        Roster roster1 = new Roster();
        Roster roster2 = new Roster();
        Roster roster3 = new Roster();
        List<Roster> rosterList = Arrays.asList(roster1, roster2, roster3);

        Pageable pageable = new PageRequest(0, 3);
        Page<Roster> rosters = new PageImpl<Roster>(rosterList, pageable, 10);
        when(mockRosterService.getRosters(pageable)).thenReturn(rosters);

        ModelAndView mav = controller.list(pageable, mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Roster> jsonC = (JsonCCollection) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonC.getStartIndex(), is(0));
        assertThat(jsonC.getCurrentItemCount(), is(3));
        assertThat(jsonC.getTotalItems(), is(10));

        assertThat(jsonC.getItems().get(0), sameInstance(roster1));
        assertThat(jsonC.getItems().get(1), sameInstance(roster2));
        assertThat(jsonC.getItems().get(2), sameInstance(roster3));

        verify(mockRosterService).getRosters(pageable);
    }

    @Test
    public void testPing() throws Exception {
        PatientDemographics mockPatient = MockPatientUtils.create(MOCK_PID);
        mockPatient.setLastUpdated(new PointInTime(2013, 11, 1, 3, 10, 37));
        mockPatient.setData("domainUpdated", "foo");

        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(mockPatient);

        ModelAndView mav = controller.ping(MOCK_PID);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        List<Map> items = (List<Map>) mav.getModel().get("items");
        assertThat(items.size(), is(1));
        assertThat((PointInTime) items.get(0).get("lastUpdated"), is(mockPatient.getLastUpdated()));
        assertThat((String) items.get(0).get("domainsUpdated"), is(mockPatient.getDomainUpdated()));

        verify(mockPatientDao).findByPid(MOCK_PID);
    }

    @Test(expected = PatientNotFoundException.class)
    public void testPingPatientNotFound() throws Exception {
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(null);

        controller.ping(MOCK_PID);
    }

    @Test
    public void testDelete() throws Exception {
        MockHttpSession mockHttpSession = new MockHttpSession();
        mockHttpSession.setAttribute("rosters", "fefefef");
        when(mockRosterService.deleteRoster(MOCK_ROSTER_UID)).thenReturn("foo");

        String responseBody = controller.delete(MOCK_ROSTER_UID, mockHttpSession);

        assertThat(responseBody, is("foo"));
        assertThat(mockHttpSession.getAttribute("rosters"), nullValue());
        verify(mockRosterService).deleteRoster(MOCK_ROSTER_UID);
    }

    @Test
    public void testSource() throws Exception {
        Map<String, Object> pt1 = MockPatientUtils.create(MOCK_PID).getData(JSONViews.WSView.class);
        Map<String, Object> pt2 = MockPatientUtils.create("23").getData(JSONViews.WSView.class);
        Map<String, Object> pt3 = MockPatientUtils.create("10104").getData(JSONViews.WSView.class);

        List<Map<String, Object>> patients = Arrays.asList(pt1, pt2, pt3);
        when(mockRosterService.searchRosterSource("Ward", "foo")).thenReturn(patients);

        ModelAndView mav = controller.source("Ward", "foo");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get("type"), is("Ward"));
        assertThat((String) mav.getModel().get("query"), is("foo"));
        assertThat((List<Map<String, Object>>) mav.getModel().get("data"), sameInstance(patients));

        verify(mockRosterService).searchRosterSource("Ward", "foo");
    }

    @Test
    public void testPatientSource() throws Exception {
        Map<String, Object> pt1 = MockPatientUtils.create(MOCK_PID).getData(JSONViews.WSView.class);
        Map<String, Object> pt2 = MockPatientUtils.create("23").getData(JSONViews.WSView.class);
        Map<String, Object> pt3 = MockPatientUtils.create("10104").getData(JSONViews.WSView.class);

        List<Map<String, Object>> patients = Arrays.asList(pt1, pt2, pt3);
        when(mockRosterService.searchRosterSource("Patient", "fubar")).thenReturn(patients);

        ModelAndView mav = controller.source("Patient", "fubar");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get("type"), is("Patient"));
        assertThat((String) mav.getModel().get("query"), is("fubar"));
        assertThat((List<Map<String, Object>>) mav.getModel().get("data"), sameInstance(patients));

        verify(mockRosterService).searchRosterSource("Patient", "fubar");
    }

    @Test
    public void testPatientSourceWithShortQuery() throws Exception {
        ModelAndView mav = controller.source("Patient", "foo");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get("type"), is("Patient"));
        assertThat((String) mav.getModel().get("query"), is("foo"));
        assertThat(((List) mav.getModel().get("data")).isEmpty(), is(true));

        verifyZeroInteractions(mockRosterService);
    }
}
