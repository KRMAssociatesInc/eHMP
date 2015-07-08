package gov.va.hmp.access;

/**
 * The set of decision requests, identified by definitions for resource, subject and action, that a rule, policy or
 * policy set is intended to evaluate
 */
public interface ITarget<S,A,R> {
    MatchResult evaluate(DecisionRequest<S, A, R> request);
}
