package gov.va.hmp.access;

import java.util.List;

/**
 * The procedure for combining decisions from multiple rules.
 */
public interface IRuleCombiningAlgorithm<S,A,R> {

    AuthorizationDecision evaluate(List<? extends IRule<S, A, R>> rules, DecisionRequest<S, A, R> request);
}
