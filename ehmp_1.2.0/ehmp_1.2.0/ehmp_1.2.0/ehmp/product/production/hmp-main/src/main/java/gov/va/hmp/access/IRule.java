package gov.va.hmp.access;

/**
 * A target, an effect and a condition.  A component of a {@link IPolicy}.
 */
public interface IRule<S,A,R> extends IAdjudicator<S,A,R> {
    /**
     * The intended consequence of a satisfied rule (either "Permit" or "Deny").
     */
    Effect getEffect();
}
