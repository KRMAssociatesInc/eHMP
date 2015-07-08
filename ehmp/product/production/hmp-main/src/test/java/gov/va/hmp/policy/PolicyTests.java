package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static gov.va.hmp.access.Decision.*;
import static gov.va.hmp.access.MatchResult.Value.MATCH;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class PolicyTests {

    @Test
    public void testConstruct() throws Exception {
        ITarget mockTarget = mock(ITarget.class);
        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        List<IRule> rules = MocksFactory.mockRules(PERMIT);

        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm, rules);

        assertThat(policy.getTarget(), is(sameInstance(mockTarget)));
        assertThat(policy.getRuleCombiningAlgorithm(), is(sameInstance(mockCombiningAlgorithm)));
        assertThat((List<IRule>) policy.getRules(), hasItem(rules.get(0)));
    }

    @Test
    public void testTargetMatchProducesRuleCombiningAlgorithmDecision() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        List<IRule> rules = MocksFactory.mockRules(PERMIT);
        when(mockCombiningAlgorithm.evaluate(rules, mockRequest)).thenReturn(new AuthorizationDecision(this, PERMIT));

        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm, rules);

        assertThat(policy.evaluate(mockRequest).getDecision(), is(PERMIT));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockCombiningAlgorithm).evaluate(rules, mockRequest);
    }

    @Test
    public void testTargetMatchAndOneRuleIndeterminateProducesRuleCombiningAlgorithmDecision() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        List<IRule> rules = MocksFactory.mockRules(PERMIT, INDETERMINATE, DENY);
        when(mockCombiningAlgorithm.evaluate(rules, mockRequest)).thenReturn(new AuthorizationDecision(this, PERMIT));

        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm, rules);

        assertThat(policy.evaluate(mockRequest).getDecision(), is(PERMIT));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockCombiningAlgorithm).evaluate(rules, mockRequest);
    }

    @Test
    public void testTargetMatchAndAllRulesNotApplicableProducesNotApplicable() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        List<IRule> rules = MocksFactory.mockRules(NOT_APPLICABLE, NOT_APPLICABLE, NOT_APPLICABLE);
        when(mockCombiningAlgorithm.evaluate(rules, mockRequest)).thenReturn(new AuthorizationDecision(this, NOT_APPLICABLE));

        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm, rules);

        assertThat(policy.evaluate(mockRequest).getDecision(), is(NOT_APPLICABLE));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockCombiningAlgorithm).evaluate(rules, mockRequest);
    }

    @Test
    public void testTargetNoMatchProducesNotApplicable() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        Policy policy = new Policy(Targets.noneTarget(), RuleCombiningAlgorithms.denyOverrides());
        assertThat(policy.evaluate(mockRequest).getDecision(), is(NOT_APPLICABLE));
    }

    @Test
    public void testTargetIndeterminateProducesIndeterminate() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MatchResult.Value.INDETERMINATE));

        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        List<IRule> rules = MocksFactory.mockRules(PERMIT);
        when(mockCombiningAlgorithm.evaluate(rules, mockRequest)).thenReturn(new AuthorizationDecision(this, PERMIT));

        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm);
        assertThat(policy.evaluate(mockRequest).getDecision(), is(INDETERMINATE));
        verifyZeroInteractions(mockCombiningAlgorithm);
    }

//    @Test
//    public void testAddRule() throws Exception {
//        ITarget mockTarget = mock(ITarget.class);
//        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
//        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm);
//        Rule rule = new Rule(Effect.PERMIT);
//        policy.addRule(rule);
//        assertThat(rule.getPolicy(), is(sameInstance((IPolicy) policy)));
//        assertThat(policy.getRules().size(), is(1));
//        assertThat((Rule) policy.getRules().get(0), sameInstance(rule));
//    }
}
