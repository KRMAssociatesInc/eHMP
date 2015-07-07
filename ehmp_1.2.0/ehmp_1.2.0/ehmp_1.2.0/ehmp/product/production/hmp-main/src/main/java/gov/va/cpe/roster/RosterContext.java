package gov.va.cpe.roster;

public interface RosterContext {
    String getCurrentRosterUid();
    Roster getCurrentRoster();
    void setCurrentRosterUid(String currentRosterUid);
    void setCurrentRoster(Roster roster);
}
