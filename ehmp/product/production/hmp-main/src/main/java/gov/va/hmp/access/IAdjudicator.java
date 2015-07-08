package gov.va.hmp.access;

/**
 * Base interface for components (rules, policies and policy-sets) of the policy engine that evaluate requests for decisions.
 *
 * @see IRule
 * @see IPolicy
 * @see IPolicySet
 */
public interface IAdjudicator<S, A, R> {
    ITarget<S,A,R> getTarget();

    AuthorizationDecision evaluate(DecisionRequest<S, A, R> request);
}
