package gov.va.cpe.team;

import org.springframework.stereotype.Service;

/**
 * Singleton service bean used to inject a {@link TeamContext} instance into other service beans.  This allows clients
 * to not have to reference {@link TeamContextHolder} directly.
 */
@Service("teamContext")
public class HmpTeamContext implements TeamContext {

    @Override
    public Team getCurrentTeam() {
        TeamContext context = TeamContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentTeam();
    }

    @Override
    public String getCurrentTeamUid() {
        TeamContext context = TeamContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentTeamUid();
    }

    @Override
    public void setCurrentTeam(Team team) {
        TeamContext context = TeamContextHolder.getContext();

        if (context != null) {
            context.setCurrentTeam(team);
        }
    }

    @Override
    public void setCurrentTeamUid(String teamUid) {
        TeamContext context = TeamContextHolder.getContext();

        if (context != null) {
            context.setCurrentTeamUid(teamUid);
        }
    }
}
