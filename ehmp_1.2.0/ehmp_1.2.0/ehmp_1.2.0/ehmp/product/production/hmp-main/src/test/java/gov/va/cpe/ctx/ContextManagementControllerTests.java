package gov.va.cpe.ctx;

import gov.va.cpe.board.BoardContext;
import gov.va.cpe.encounter.EncounterContext;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.roster.RosterContext;
import gov.va.cpe.team.TeamContext;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ContextManagementControllerTests {

    private ContextManagementController controller;

    private MockHttpServletRequest mockRequest;
    private IPatientSelectDAO mockPatientSelectDAO;
    private PatientContext mockPatientContext;
    private BoardContext mockBoardContext;
    private RosterContext mockRosterContext;
    private TeamContext mockTeamContext;
    private EncounterContext mockEncounterContext;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockPatientSelectDAO = mock(IPatientSelectDAO.class);
        mockPatientContext = mock(PatientContext.class);
        mockBoardContext = mock(BoardContext.class);
        mockRosterContext = mock(RosterContext.class);
        mockTeamContext = mock(TeamContext.class);
        mockEncounterContext = mock(EncounterContext.class);

        controller = new ContextManagementController();
        controller.setPatientContext(mockPatientContext);
        controller.setPatientSelectDAO(mockPatientSelectDAO);
        controller.setBoardContext(mockBoardContext);
        controller.setRosterContext(mockRosterContext);
        controller.setTeamContext(mockTeamContext);
        controller.setEncounterContext(mockEncounterContext);
    }

    @Test
    public void testSetPatientContext() throws Exception {
        String pid = "ABCD;1234";
        PatientSelect mockPatientSelect = new PatientSelect(Collections.<String, Object>singletonMap("pid", pid));
        when(mockPatientSelectDAO.findOneByPid(pid)).thenReturn(mockPatientSelect);
        PatientDemographics mockPatientDemographics = new PatientDemographics(Collections.<String, Object>singletonMap("pid", pid));
        when(mockPatientContext.getCurrentPatient()).thenReturn(mockPatientDemographics);

        ModelAndView mav = controller.set(pid, mockRequest);

        verify(mockPatientContext).setCurrentPatientPid(pid);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        // TODO: test all extra patient context stuff included in model?
    }

    @Test
    public void testSetBoardContext() throws Exception {
        String boardUid = "urn:va:foo:bar:baz";
        ModelAndView mav =controller.set("board", boardUid, mockRequest);
        verify(mockBoardContext).setCurrentBoardUid(boardUid);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
    }

    @Test
    public void testSetRosterContext() throws Exception {
        String rosterUid = "urn:va:foo:bar:baz";
        ModelAndView mav =controller.set("roster", rosterUid, mockRequest);
        verify(mockRosterContext).setCurrentRosterUid(rosterUid);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
    }

    @Test
    public void testSetTeamContext() throws Exception {
        String teamUid = "urn:va:foo:bar:baz";
        ModelAndView mav = controller.set("team", teamUid, mockRequest);
        verify(mockTeamContext).setCurrentTeamUid(teamUid);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
    }

    @Test
    public void testSetMultipleContexts() throws Exception {
        String rosterUid = "urn:va:roster:foo";
        String boardUid = "urn:va:board:foo";
        String teamUid = "urn:va:team:foo";
        String encounterUid = "urn:va:encounter:foo";

        ModelAndView mav = controller.set(rosterUid, boardUid, teamUid, encounterUid, mockRequest);

        verify(mockRosterContext).setCurrentRosterUid(rosterUid);
        verify(mockBoardContext).setCurrentBoardUid(boardUid);
        verify(mockTeamContext).setCurrentTeamUid(teamUid);
        verify(mockEncounterContext).setCurrentEncounterUid(encounterUid);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
    }
}
