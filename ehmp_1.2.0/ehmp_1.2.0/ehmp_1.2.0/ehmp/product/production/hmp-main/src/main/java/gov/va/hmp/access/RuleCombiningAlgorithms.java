package gov.va.hmp.access;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static gov.va.hmp.access.Decision.*;

public class RuleCombiningAlgorithms {

    private static final AtomicReference<IRuleCombiningAlgorithm> DENY_OVERRIDES = new AtomicReference<>();
    private static final AtomicReference<IRuleCombiningAlgorithm> PERMIT_OVERRIDES = new AtomicReference<>();
    private static final AtomicReference<IRuleCombiningAlgorithm> FIRST_APPLICABLE = new AtomicReference<>();

    public static IRuleCombiningAlgorithm denyOverrides() {
        if (DENY_OVERRIDES.get() == null) {
            DENY_OVERRIDES.set(new DenyOverrides());
        }
        return DENY_OVERRIDES.get();
    }

    public static IRuleCombiningAlgorithm permitOverrides() {
        if (PERMIT_OVERRIDES.get() == null) {
            PERMIT_OVERRIDES.set(new PermitOverrides());
        }
        return PERMIT_OVERRIDES.get();
    }

    public static IRuleCombiningAlgorithm firstApplicable() {
        if (FIRST_APPLICABLE.get() == null) {
            FIRST_APPLICABLE.set(new FirstApplicable());
        }
        return FIRST_APPLICABLE.get();
    }

    static class DenyOverrides<S,A,R> implements IRuleCombiningAlgorithm<S,A,R> {
        @Override
        public AuthorizationDecision evaluate(List<? extends IRule<S, A, R>> rules, DecisionRequest<S, A, R> request) {
            List<AuthorizationDecision> trace = new ArrayList<>(rules.size());

            AuthorizationDecision atLeastOneError = null;
            boolean potentialDeny = false;
            AuthorizationDecision atLeastOnePermit = null;
            for (IRule rule : rules) {
                AuthorizationDecision result = rule.evaluate(request);
                trace.add(result);

                if (result.getDecision().equals(DENY)) {
                    return new AuthorizationDecision(this, DENY, Status.OK, trace);
                }
                if (result.getDecision().equals(PERMIT)) {
                    atLeastOnePermit = result;
                    continue;
                }
                if (result.getDecision().equals(NOT_APPLICABLE)) {
                    continue;
                }
                if (result.getDecision().equals(INDETERMINATE)) {
                    atLeastOneError = result;

                    if (Effect.DENY.equals(rule.getEffect())) {
                        potentialDeny = true;
                    }
                    continue;
                }
            }
            if (atLeastOneError != null && potentialDeny) {
                return new AuthorizationDecision(this, INDETERMINATE, atLeastOneError.getStatus(), trace);
            }
            if (atLeastOnePermit != null) {
                return new AuthorizationDecision(this, PERMIT, atLeastOnePermit.getStatus(), trace);
            }
            if (atLeastOneError != null) {
                return new AuthorizationDecision(this, INDETERMINATE, atLeastOneError.getStatus(), trace);
            }
            return new AuthorizationDecision(this, NOT_APPLICABLE, Status.OK, trace);
        }

        @Override
        public String toString() {
            return "rule-combining-algorithm:deny-overrides";
        }
    }

    static class PermitOverrides<S,A,R> implements IRuleCombiningAlgorithm<S,A,R> {
        @Override
        public AuthorizationDecision evaluate(List<? extends IRule<S, A, R>> rules, DecisionRequest<S, A, R> request) {
            List<AuthorizationDecision> trace = new ArrayList<>(rules.size());

            AuthorizationDecision atLeastOneError = null;
            Boolean potentialPermit = false;
            AuthorizationDecision atLeastOneDeny = null;
            for (IRule rule : rules) {
                AuthorizationDecision result = rule.evaluate(request);
                trace.add(result);

                if (result.getDecision().equals(DENY)) {
                    atLeastOneDeny = result;
                    continue;
                }
                if (result.getDecision().equals(PERMIT)) {
                    return new AuthorizationDecision(this, PERMIT, result.getStatus(), trace);
                }
                if (result.getDecision().equals(NOT_APPLICABLE)) {
                    continue;
                }
                if (result.getDecision().equals(INDETERMINATE)) {
                    atLeastOneError = result;

                    if (Effect.PERMIT.equals(rule.getEffect())) {
                        potentialPermit = true;
                    }
                    continue;
                }
            }
            if (atLeastOneError != null && potentialPermit) {
                return new AuthorizationDecision(this, INDETERMINATE, atLeastOneError.getStatus(), trace);
            }
            if (atLeastOneDeny != null) {
                return new AuthorizationDecision(this, DENY, atLeastOneDeny.getStatus(), trace);
            }
            if (atLeastOneError != null) {
                return new AuthorizationDecision(this, INDETERMINATE, atLeastOneError.getStatus(), trace);
            }
            return new AuthorizationDecision(this, NOT_APPLICABLE, Status.OK, trace);
        }

        @Override
        public String toString() {
            return "rule-combining-algorithm:permit-overrides";
        }
    }

    static class FirstApplicable<S,A,R> implements IRuleCombiningAlgorithm<S,A,R>{
        @Override
        public AuthorizationDecision evaluate(List<? extends IRule<S, A, R>> rules, DecisionRequest<S, A, R> request) {
            for (IRule rule: rules) {
                AuthorizationDecision result = rule.evaluate(request);
                if (DENY.equals(result.getDecision())) {
                    return new AuthorizationDecision(this, DENY, result.getStatus(), null);
                }
                if (PERMIT.equals(result.getDecision())) {
                    return new AuthorizationDecision(this, PERMIT, result.getStatus(), null);
                }
                if (NOT_APPLICABLE.equals(result.getDecision())) {
                    continue;
                }
                if (INDETERMINATE.equals(result.getDecision())) {
                    return new AuthorizationDecision(this, INDETERMINATE, result.getStatus(), null);
                }
            }
            return new AuthorizationDecision(this, INDETERMINATE);
        }
    }
}
