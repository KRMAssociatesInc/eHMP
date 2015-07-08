package gov.va.hmp.access;

public class PermitAllPolicyDecisionPoint implements IPolicyDecisionPoint {

	@Override
	public AuthorizationDecision evaluate(DecisionRequest request) {
		return new AuthorizationDecision(request.getSubject(), Decision.PERMIT);
	}

}
