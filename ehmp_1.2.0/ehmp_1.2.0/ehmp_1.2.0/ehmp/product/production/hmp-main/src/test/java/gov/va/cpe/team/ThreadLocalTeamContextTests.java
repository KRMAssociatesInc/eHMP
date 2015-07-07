package gov.va.cpe.team;

import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.hmp.auth.UserContext;
import org.junit.Before;
import org.junit.Test;

import java.io.*;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class ThreadLocalTeamContextTests {

    private IGenericPOMObjectDAO mockJdsDao;
    private IParamService mockParamService;
    private UserContext mockUserContext;
    private ThreadLocalTeamContext teamContext;

    @Before
    public void setUp() throws Exception {
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        mockParamService = mock(IParamService.class);
        mockUserContext = mock(UserContext.class);

        teamContext = new ThreadLocalTeamContext();
        teamContext.setJdsDao(mockJdsDao);
        teamContext.setUserContext(mockUserContext);
        teamContext.setParamService(mockParamService);
        reset(mockParamService);
    }

    @Test
    public void testEqualsAndHashCode() throws Exception {
        assertThat(teamContext.equals(teamContext), is(true));

        ThreadLocalTeamContext teamContext2 = new ThreadLocalTeamContext();
        teamContext2.setJdsDao(mockJdsDao);
        teamContext2.setParamService(mockParamService);
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);

        // both contexts have null team
        assertThat(teamContext.equals(teamContext2), is(true));
        assertThat(teamContext2.equals(teamContext), is(true));
        assertThat(teamContext2.hashCode(), is(teamContext.hashCode()));

        // one context has team uid set, one has null team
        teamContext.setCurrentTeamUid("urn:va:team:ABCD:1234");

        assertThat(teamContext.equals(teamContext2), is(false));
        assertThat(teamContext2.equals(teamContext), is(false));
        assertThat(teamContext2.hashCode(), is(not(teamContext.hashCode())));

        // both contexts have the same UID
        teamContext2.setCurrentTeamUid("urn:va:team:ABCD:1234");
        assertThat(teamContext.equals(teamContext2), is(true));
        assertThat(teamContext2.equals(teamContext), is(true));
        assertThat(teamContext2.hashCode(), is(teamContext.hashCode()));
    }

    @Test
    public void testGetCurrentTeam() throws Exception {
        assertThat(teamContext.getCurrentTeam(), is(nullValue()));
        assertThat(teamContext.getCurrentTeamUid(), is(nullValue()));

        verifyZeroInteractions(mockJdsDao, mockParamService);

        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);

        // now test when team uid is non-null
        teamContext.setCurrentTeamUid("urn:va:team:ABCD:1234");

        Team team = teamContext.getCurrentTeam();
        assertThat(team, is(sameInstance(mockTeam)));

        verify(mockJdsDao).findByUID(Team.class, "urn:va:team:ABCD:1234");
    }

    @Test
    public void testSetCurrentTeamUid() throws Exception {
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);
        teamContext.setCurrentTeamUid("urn:va:team:ABCD:1234");
        assertThat(teamContext.getCurrentTeamUid(), is("urn:va:team:ABCD:1234"));
        assertThat(teamContext.getCurrentTeam(), sameInstance(mockTeam));
        verify(mockParamService).setUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY, "urn:va:team:ABCD:1234");
        verify(mockJdsDao).findByUID(Team.class,"urn:va:team:ABCD:1234");
    }

    @Test
    public void testSetCurrentTeamUidToNull() throws Exception {
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);

        // set up an existing context
        teamContext.setCurrentTeamUid("urn:va:team:ABCD:1234");
        assertThat(teamContext.getCurrentTeam(), sameInstance(mockTeam));
        verify(mockJdsDao).findByUID(Team.class, "urn:va:team:ABCD:1234");
        reset(mockJdsDao, mockParamService);

        // set team to null
        teamContext.setCurrentTeamUid(null);
        assertThat(teamContext.getCurrentTeamUid(), is(nullValue()));
        verify(mockParamService).setUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY, "");
        verifyZeroInteractions(mockJdsDao);
    }

    @Test
    public void testSetCurrentTeam() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        teamContext.afterPropertiesSet();
        reset(mockJdsDao, mockParamService);

        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);

        teamContext.setCurrentTeam(mockTeam);
        assertThat(teamContext.getCurrentTeamUid(), is("urn:va:team:ABCD:1234"));
        verify(mockParamService).setUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY, "urn:va:team:ABCD:1234");

        Team team = teamContext.getCurrentTeam();
        assertThat(team, is(sameInstance(mockTeam)));

        verifyZeroInteractions(mockJdsDao, mockParamService);
    }

    @Test
    public void testSetCurrentTeamToNull() throws Exception {
        // set up an existing context
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        teamContext.setCurrentTeam(mockTeam);
        reset(mockJdsDao, mockParamService);

        // set team to null
        teamContext.setCurrentTeam(null);
        assertThat(teamContext.getCurrentTeamUid(), is(nullValue()));
        assertThat(teamContext.getCurrentTeam(), is(nullValue()));
        verify(mockParamService).setUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY, "");
        verifyZeroInteractions(mockJdsDao);
    }

    @Test
    public void testSerializeDeserialize() throws Exception {
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUID(Team.class, "urn:va:team:ABCD:1234")).thenReturn(mockTeam);
        teamContext.setCurrentTeamUid("urn:va:team:ABCD:1234");

        ByteArrayOutputStream bytesOut = new ByteArrayOutputStream();
        ObjectOutput s = new ObjectOutputStream(bytesOut);
        s.writeObject(teamContext);

        ByteArrayInputStream bytesIn = new ByteArrayInputStream(bytesOut.toByteArray());
        ObjectInput t = new ObjectInputStream(bytesIn);

        ThreadLocalTeamContext deserializedTeamContext = (ThreadLocalTeamContext) t.readObject();
        assertThat(deserializedTeamContext.getCurrentTeamUid(), is("urn:va:team:ABCD:1234"));

        assertThat(teamContext.equals(deserializedTeamContext), is(true));
    }

    @Test
    public void testAfterPropertiesSet() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        when(mockParamService.getUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY)).thenReturn("urn:va:team:ABCD:1234");
        Team mockTeam = new Team(Collections.<String, Object>singletonMap("uid", "urn:va:team:ABCD:1234"));
        when(mockJdsDao.findByUIDWithTemplate(Team.class, "urn:va:team:ABCD:1234", Team.TEAM_PERSONS_LINK_JDS_TEMPLATE)).thenReturn(mockTeam);

        teamContext.afterPropertiesSet();

        assertThat(teamContext.getCurrentTeamUid(), is("urn:va:team:ABCD:1234"));
        assertThat(teamContext.getCurrentTeam(), sameInstance(mockTeam));
        verify(mockParamService).getUserPreference(ThreadLocalTeamContext.TEAM_CONTEXT_USER_PREF_KEY);
        verify(mockJdsDao).findByUIDWithTemplate(Team.class, "urn:va:team:ABCD:1234", Team.TEAM_PERSONS_LINK_JDS_TEMPLATE);

        teamContext.afterPropertiesSet();
        verifyZeroInteractions(mockJdsDao, mockParamService);
    }
}
