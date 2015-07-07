package gov.va.cpe.team;

public interface TeamContext {
    String getCurrentTeamUid();
    Team getCurrentTeam();
    void setCurrentTeamUid(String currentTeamUid);
    void setCurrentTeam(Team team);
}
