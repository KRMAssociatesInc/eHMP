package gov.va.hmp.access;

/**
 * The result of evaluating a {@link Rule}, {@link Policy} or {@link PolicySet}
 */
public enum Decision {
    PERMIT("Permit"),
    DENY("Deny"),
    NOT_APPLICABLE("NotApplicable"),
    INDETERMINATE("Indeterminate");

    private String displayName;

    private Decision(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return getDisplayName();
    }

    public static Decision valueOf(Effect effect) {
        if (Effect.PERMIT.equals(effect)) return PERMIT;
        else return DENY;
    }
}
