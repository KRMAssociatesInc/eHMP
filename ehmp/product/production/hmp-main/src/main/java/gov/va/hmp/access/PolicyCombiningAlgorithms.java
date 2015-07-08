package gov.va.hmp.access;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static gov.va.hmp.access.Decision.*;

public class PolicyCombiningAlgorithms {

    private static final AtomicReference<IPolicyCombiningAlgorithm> DENY_OVERRIDES = new AtomicReference<>();
    private static final AtomicReference<IPolicyCombiningAlgorithm> PERMIT_OVERRIDES = new AtomicReference<>();
    private static final AtomicReference<IPolicyCombiningAlgorithm> FIRST_APPLICABLE = new AtomicReference<>();
    private static final AtomicReference<IPolicyCombiningAlgorithm> ONLY_ONE_APPLICABLE = new AtomicReference<>();

    public static IPolicyCombiningAlgorithm denyOverrides() {
        if (DENY_OVERRIDES.get() == null) {
            DENY_OVERRIDES.set(new DenyOverrides());
        }
        return DENY_OVERRIDES.get();
    }

    public static IPolicyCombiningAlgorithm permitOverrides() {
        if (PERMIT_OVERRIDES.get() == null) {
            PERMIT_OVERRIDES.set(new PermitOverrides());
        }
        return PERMIT_OVERRIDES.get();
    }

    public static IPolicyCombiningAlgorithm firstApplicable() {
        if (FIRST_APPLICABLE.get() == null) {
            FIRST_APPLICABLE.set(new FirstApplicable());
        }
        return FIRST_APPLICABLE.get();
    }

    public static IPolicyCombiningAlgorithm onlyOneApplicable() {
        if (ONLY_ONE_APPLICABLE.get() == null) {
            ONLY_ONE_APPLICABLE.set(new OnlyOneApplicable());
        }
        return ONLY_ONE_APPLICABLE.get();
    }

    static class DenyOverrides<S,A,R> implements IPolicyCombiningAlgorithm<S,A,R> {
        @Override
        public AuthorizationDecision evaluate(List<? extends IAdjudicator<S, A, R>> policies, DecisionRequest<S, A, R> request) {
            boolean atLeastOnePermit = false;
            for (IAdjudicator policy : policies) {
                AuthorizationDecision result = policy.evaluate(request);
                if (result.getDecision().equals(DENY)) {
                    return new AuthorizationDecision(this, DENY, result.getStatus(), null);
                }
                if (result.getDecision().equals(PERMIT)) {
                    atLeastOnePermit = true;
                    continue;
                }
                if (result.getDecision().equals(NOT_APPLICABLE)) {
                    continue;
                }
                if (result.getDecision().equals(INDETERMINATE)) {
                    return new AuthorizationDecision(this, DENY, result.getStatus(), null);
                }
            }
            if (atLeastOnePermit) {
                return new AuthorizationDecision(this, PERMIT);
            }
            return new AuthorizationDecision(this, NOT_APPLICABLE);
        }

        @Override
        public String toString() {
            return "policy-combining-algorithm:deny-overrides";
        }
    }

    static class PermitOverrides<S,A,R> implements IPolicyCombiningAlgorithm<S,A,R> {
        @Override
        public AuthorizationDecision evaluate(List<? extends IAdjudicator<S, A, R>> policies, DecisionRequest<S, A, R> request) {
            boolean atLeastOneError = false;
            boolean atLeastOneDeny = false;
            for (IAdjudicator policy : policies) {
                AuthorizationDecision result = policy.evaluate(request);
                if (result.getDecision().equals(DENY)) {
                    atLeastOneDeny = true;
                    continue;
                }
                if (result.getDecision().equals(PERMIT)) {
                    return new AuthorizationDecision(this, PERMIT,result.getStatus(), null);
                }
                if (result.getDecision().equals(NOT_APPLICABLE)) {
                    continue;
                }
                if (result.getDecision().equals(INDETERMINATE)) {
                    atLeastOneError = true;
                    continue;
                }
            }
            if (atLeastOneDeny) {
                return new AuthorizationDecision(this, DENY);
            }
            if (atLeastOneError) {
                return new AuthorizationDecision(this, INDETERMINATE);
            }
            return new AuthorizationDecision(this, NOT_APPLICABLE);
        }

        @Override
        public String toString() {
            return "policy-combining-algorithm:permit-overrides";
        }
    }

    static class FirstApplicable<S,A,R> implements IPolicyCombiningAlgorithm<S,A,R>{
        @Override
        public AuthorizationDecision evaluate(List<? extends IAdjudicator<S, A, R>> policies, DecisionRequest<S, A, R> request) {
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
            return new AuthorizationDecision(this, NOT_APPLICABLE, Status.OK, trace);
        }

        @Override
        public String toString() {
            return "policy-combining-algorithm:first-applicable";
        }
    }

    static class OnlyOneApplicable<S,A,R> implements IPolicyCombiningAlgorithm<S,A,R> {
        @Override
        public AuthorizationDecision evaluate(List<? extends IAdjudicator<S, A, R>> policies, DecisionRequest<S, A, R> request) {
            //boolean atLeastOne = false;
            IAdjudicator selectedPolicy = null;
            MatchResult applicableResult;

            for (IAdjudicator policy : policies) {
                ITarget target = policy.getTarget();
                applicableResult = target.evaluate(request);

                if (MatchResult.Value.INDETERMINATE.equals(applicableResult.getValue())) {
                    return new AuthorizationDecision(this, INDETERMINATE, applicableResult.getStatus(), null);
                }
                if (MatchResult.Value.MATCH.equals(applicableResult.getValue())) {
                    if (selectedPolicy != null) {
                        return new AuthorizationDecision(this, INDETERMINATE);
                    } else {
                        //atLeastOne = true;
                        selectedPolicy = policy;
                    }
                }
                if (MatchResult.Value.NO_MATCH.equals(applicableResult.getValue())) {
                    continue;
                }
            }
            if (selectedPolicy != null) {
                return selectedPolicy.evaluate(request);
            } else {
                return new AuthorizationDecision(this, NOT_APPLICABLE);
            }
        }

        @Override
        public String toString() {
            return "policy-combining-algorithm:only-one-applicable";
        }
    }
}
