package gov.va.cpe.team;

import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.UidUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class HmpTeamContextTests {

    private TeamContext mockThreadLocalTeamContext;
    private HmpTeamContext teamContext;

    @Before
    public void setUp() throws Exception {
        mockThreadLocalTeamContext = mock(TeamContext.class);
        TeamContextHolder.setContext(mockThreadLocalTeamContext);

        teamContext = new HmpTeamContext();
    }

    @After
    public void tearDown() throws Exception {
        TeamContextHolder.clearContext();
    }

    @Test
    public void testGetContext() throws Exception {
        Team mockTeam = new Team();
        when(mockThreadLocalTeamContext.getCurrentTeam()).thenReturn(mockTeam);

        Team team = teamContext.getCurrentTeam();
        assertThat(team, is(sameInstance(mockTeam)));
        verify(mockThreadLocalTeamContext).getCurrentTeam();
    }

    @Test
    public void testSetContextToNull() throws Exception {
        teamContext.setCurrentTeam(null);

        verify(mockThreadLocalTeamContext).setCurrentTeam(null);
    }

    @Test
    public void testSetContext() throws Exception {
        Team team = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:F484:32"));

        teamContext.setCurrentTeam(team);

        verify(mockThreadLocalTeamContext).setCurrentTeam(team);
    }
}
