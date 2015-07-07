package gov.va.hmp.access;

/**
 * The system entity that evaluates applicable policy and renders an authorization decision.
 */
public interface IPolicyDecisionPoint {
    AuthorizationDecision evaluate(DecisionRequest request);
}
