package gov.va.hmp.access.asu;

import gov.va.hmp.access.*;
import gov.va.hmp.auth.HmpUserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static gov.va.hmp.access.Decision.*;

public class AsuRuleCombiningAlgorithm implements IRuleCombiningAlgorithm<HmpUserDetails, DocumentAction, Object> {

    private static final AtomicReference<AsuRuleCombiningAlgorithm> INSTANCE = new AtomicReference();

    public static AsuRuleCombiningAlgorithm instance() {
        if (INSTANCE.get() == null) {
            INSTANCE.set(new AsuRuleCombiningAlgorithm());
        }
        return INSTANCE.get();
    }

    private AsuRuleCombiningAlgorithm() {
    }

    @Override
    public AuthorizationDecision evaluate(List<? extends IRule<HmpUserDetails, DocumentAction, Object>> rules, DecisionRequest<HmpUserDetails, DocumentAction, Object> request) {
        List<AuthorizationDecision> trace = new ArrayList<>(rules.size());
        for (IRule rule : rules) {
            AuthorizationDecision result = rule.evaluate(request);
            trace.add(result);

            if (PERMIT.equals(result.getDecision())) {
                return new AuthorizationDecision(this, PERMIT, result.getStatus(), trace);
            }
            if (NOT_APPLICABLE.equals(result.getDecision())) {
                continue;
            }
            if (INDETERMINATE.equals(result.getDecision())) {
                return new AuthorizationDecision(this, INDETERMINATE, result.getStatus(), trace);
            }
        }
        return new AuthorizationDecision(this, DENY, Status.Code.OK, AsuDecisionRequest.createDenyStatusMessage(request), null, trace);
    }
}
