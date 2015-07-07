package gov.va.hmp.access.asu;

import gov.va.hmp.access.*;
import gov.va.hmp.auth.HmpUserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static gov.va.hmp.access.Decision.*;

public class AsuPolicyCombiningAlgorithm implements IPolicyCombiningAlgorithm<HmpUserDetails, DocumentAction, Object> {

    private static final AtomicReference<AsuPolicyCombiningAlgorithm> INSTANCE = new AtomicReference();

    public static AsuPolicyCombiningAlgorithm instance() {
        if (INSTANCE.get() == null) {
            INSTANCE.set(new AsuPolicyCombiningAlgorithm());
        }
       return INSTANCE.get();
    }

    private AsuPolicyCombiningAlgorithm() {
    }

    @Override
    public AuthorizationDecision evaluate(List<? extends IAdjudicator<HmpUserDetails, DocumentAction, Object>> policies, DecisionRequest<HmpUserDetails, DocumentAction, Object> request) {
        List<AuthorizationDecision> trace = new ArrayList<>(policies.size());

        for (IAdjudicator policy : policies) {
            AuthorizationDecision result = policy.evaluate(request);
            trace.add(result);

            if (result.getDecision().equals(DENY)) {
                return new AuthorizationDecision(this, DENY,result.getStatus(), trace);
            }
            if (result.getDecision().equals(PERMIT)) {
                return new AuthorizationDecision(this, PERMIT, result.getStatus(), trace);
            }
            if (result.getDecision().equals(NOT_APPLICABLE)) {
                continue;
            }
            if (result.getDecision().equals(INDETERMINATE)) {
                return new AuthorizationDecision(this, INDETERMINATE, result.getStatus(), trace);
            }
        }

        return new AuthorizationDecision(this, DENY, Status.Code.OK, AsuDecisionRequest.createDenyStatusMessage(request), null, trace);
    }

    @Override
    public String toString() {
        return "asu-policy-combining-algorithm";
    }
}
