package gov.va.cpe.team;

import gov.va.cpe.ctx.AbstractThreadLocalContext;

public class ThreadLocalTeamContext extends AbstractThreadLocalContext<Team> implements TeamContext {

    public static final String TEAM_CONTEXT_USER_PREF_KEY = "cpe.context.team";
    private static final long serialVersionUID = 4764639747447571464L;

    @Override
    protected Class<Team> getObjectType() {
        return Team.class;
    }

    @Override
    protected String getUserPreferenceKey() {
        return TEAM_CONTEXT_USER_PREF_KEY;
    }

    @Override
    public String getCurrentTeamUid() {
        return getCurrentUid();
    }

    @Override
    public void setCurrentTeamUid(String teamUid) {
        setCurrentUid(teamUid);
    }

    public Team getCurrentTeam() {
        return getCurrentObject();
    }

    @Override
    protected Team fetchCurrentObject() {
        return fetchCurrentTeamObject();
    }

    private Team fetchCurrentTeamObject() {
        return jdsDao.findByUIDWithTemplate(Team.class, getCurrentUid(), Team.TEAM_PERSONS_LINK_JDS_TEMPLATE);
    }

    @Override
    public void setCurrentTeam(Team team) {
        setCurrentObject(team);
    }
}
