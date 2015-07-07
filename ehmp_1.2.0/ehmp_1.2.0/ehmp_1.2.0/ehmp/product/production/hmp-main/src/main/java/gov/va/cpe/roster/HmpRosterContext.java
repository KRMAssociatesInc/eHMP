package gov.va.cpe.roster;

import org.springframework.stereotype.Service;

/**
 * Singleton service bean used to inject a {@link RosterContext} instance into other service beans.  This allows clients
 * to not have to reference {@link RosterContextHolder} directly and rely on autowiring instead.
 */
@Service("rosterContext")
public class HmpRosterContext implements RosterContext {
    @Override
    public String getCurrentRosterUid() {
        RosterContext context = RosterContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentRosterUid();
    }

    @Override
    public Roster getCurrentRoster() {
        RosterContext context = RosterContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentRoster();
    }

    @Override
    public void setCurrentRosterUid(String currentRosterUid) {
        RosterContext context = RosterContextHolder.getContext();
        if (context != null) {
            context.setCurrentRosterUid(currentRosterUid);
        }
    }

    @Override
    public void setCurrentRoster(Roster roster) {
        RosterContext context = RosterContextHolder.getContext();
        if (context != null) {
            context.setCurrentRoster(roster);
        }
    }
}
