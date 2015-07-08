package gov.va.hmp.app;

public enum AcceptanceStatus {
    GOLD("Gold"),
    ACCEPTANCE_CANDIDATE("Acceptance Candidate"),
    STAGING("Staging"),
    INCUBATING("Incubating");

    private String displayName;

    private AcceptanceStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return super.toString().toLowerCase();
    }
}
