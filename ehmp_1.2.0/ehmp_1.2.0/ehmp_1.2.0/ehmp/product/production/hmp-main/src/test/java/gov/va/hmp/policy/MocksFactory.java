package gov.va.hmp.policy;

import gov.va.hmp.access.*;

import java.util.*;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class MocksFactory {

    public static DecisionRequest<Map, String, Map> createMockDecisionRequest(String actionName) {
        return new DecisionRequest(new HashMap(), actionName, new HashMap());
    }

    public static DecisionRequest<Map, String, Map> createMockDecisionRequest(String actionMapKey, String actionMapValue) {
        return new DecisionRequest(new HashMap(), Collections.singletonMap(actionMapKey, actionMapValue), new HashMap());
    }

    public static DecisionRequest<Map, Map, Map> createMockDecisionRequest(String actionMapKey, String actionMapValue, String resourceMapKey, String resourceMapValue) {
        return new DecisionRequest(new HashMap(), Collections.singletonMap(actionMapKey, actionMapValue), Collections.singletonMap(resourceMapKey, resourceMapValue));
    }

    public static List<IRule> mockRules(Decision... decisions) {
        List<IRule> rules = new ArrayList<>();
        for (Decision decision : decisions) {
            IRule rule = mock(IRule.class);
            when(rule.evaluate(any(DecisionRequest.class))).thenReturn(new AuthorizationDecision(MocksFactory.class, decision));
            rules.add(rule);
        }
        return Collections.unmodifiableList(rules);
    }

    public static List<IPolicy> mockPolicies(Decision... decisions) {
        List<IPolicy> policies = new ArrayList<>();
        for (Decision decision : decisions) {
            IPolicy policy = mock(IPolicy.class);
            when(policy.evaluate(any(DecisionRequest.class))).thenReturn(new AuthorizationDecision(MocksFactory.class, decision));
            ITarget target = mockTarget(decision);
            when(policy.getTarget()).thenReturn(target);
            policies.add(policy);
        }
        return Collections.unmodifiableList(policies);
    }

    public static ITarget mockTarget(Decision decision) {
        ITarget target = mock(ITarget.class);
        if (Decision.NOT_APPLICABLE.equals(decision)) {
            when(target.evaluate(any(DecisionRequest.class))).thenReturn(MatchResult.valueOf(MatchResult.Value.NO_MATCH));
        } else {
            when(target.evaluate(any(DecisionRequest.class))).thenReturn(MatchResult.valueOf(MatchResult.Value.MATCH));
        }
        return target;
    }
}
