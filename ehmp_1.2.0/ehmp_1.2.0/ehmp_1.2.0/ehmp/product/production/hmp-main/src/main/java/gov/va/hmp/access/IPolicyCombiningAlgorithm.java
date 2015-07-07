package gov.va.hmp.access;

import java.util.List;

/**
 * The procedure for combining the decision and obligations from multiple policies.
 *
 * TODO: do we need an "obligation" implementation
 */
public interface IPolicyCombiningAlgorithm<S,A,R> {
    AuthorizationDecision evaluate(List<? extends IAdjudicator<S, A, R>> policies, DecisionRequest<S, A, R> request);
}
