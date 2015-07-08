package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Test;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import static gov.va.hmp.access.Decision.*;
import static gov.va.hmp.access.Targets.anySubjects;
import static gov.va.hmp.access.Targets.hasEntry;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RuleTests {
    @Test
    public void testTargetMatchProducesEffect() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        Rule rule = new Rule(Targets.with(anySubjects(), hasEntry("actionId", "7"), hasEntry("status", "untranscribed")), Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(PERMIT));

        rule = new Rule(Targets.with(anySubjects(), hasEntry("actionId", "7"), hasEntry("status", "untranscribed")), Effect.DENY);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(DENY));
    }

    @Test
    public void testTargetNoMatchProducesNotApplicable() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        Rule rule = new Rule(Targets.with(anySubjects(), hasEntry("actionId", "7"), hasEntry("status", "unsigned")), Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(NOT_APPLICABLE));
    }

    @Test
    public void testTargetIndeterminateProducesIndeterminate() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        Rule rule = new Rule(Targets.with(anySubjects(), null, null), Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(INDETERMINATE));

    }

    @Test
    public void testTargetMatchAndConditionTrueProducesEffect() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        ICondition mockCondition = mock(ICondition.class);
        ITarget target = Targets.with(anySubjects(Map.class), hasEntry("actionId", "7"), hasEntry("status", "untranscribed"));

        when(mockCondition.evaluate(mockRequest)).thenReturn(ICondition.ConditionValue.TRUE);
        Rule rule = new Rule(target, mockCondition, Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(PERMIT));

        rule = new Rule(target, mockCondition, Effect.DENY);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(DENY));
    }

    @Test
    public void testTargetMatchAndConditionFalseProducesNotApplicable() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        ICondition mockCondition = mock(ICondition.class);
        ITarget target = Targets.with(anySubjects(Map.class), hasEntry("actionId", "7"), hasEntry("status", "untranscribed"));

        when(mockCondition.evaluate(mockRequest)).thenReturn(ICondition.ConditionValue.FALSE);
        Rule rule = new Rule(target, mockCondition, Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(NOT_APPLICABLE));
    }

    @Test
    public void testTargetMatchAndConditionIndeterminateProducesIndeterminate() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        ICondition mockCondition = mock(ICondition.class);
        ITarget target = Targets.with(anySubjects(Map.class), hasEntry("actionId", "7"), hasEntry("status", "untranscribed"));

        when(mockCondition.evaluate(mockRequest)).thenReturn(ICondition.ConditionValue.INDETERMINATE);
        Rule rule = new Rule(target, mockCondition, Effect.PERMIT);
        assertThat(rule.evaluate(mockRequest).getDecision(), is(INDETERMINATE));
    }

    @Test
    public void testRuleTargetNotSetUsesPolicyTarget() {
        ITarget target = mock(ITarget.class);
        IRuleCombiningAlgorithm ruleCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);

        Policy policy = new Policy(target, ruleCombiningAlgorithm);
        Rule rule = new Rule(Effect.PERMIT);
        assertThat(rule.getTarget(), nullValue());

        rule.setPolicy(policy);
        assertThat(rule.getTarget(), sameInstance(policy.getTarget()));
    }

    @Test
    public void testTargetMatchAndConditionThrowsExceptionProducesIndeterminate() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "untranscribed");

        ICondition mockCondition = mock(ICondition.class);
        ITarget target = Targets.with(anySubjects(Map.class), hasEntry("actionId", "7"), hasEntry("status", "untranscribed"));

        MissingAttributeException missingAttributeException = new MissingAttributeException("there was a missing attribute, yo!");
        when(mockCondition.evaluate(mockRequest)).thenThrow(missingAttributeException);
        Rule rule = new Rule(target, mockCondition, Effect.PERMIT);
        AuthorizationDecision authorizationDecision = rule.evaluate(mockRequest);
        assertThat(authorizationDecision.getDecision(), is(INDETERMINATE));
        assertThat(authorizationDecision.getStatus().getCode(), is(Status.Code.MISSING_ATTRIBUTE));
        assertThat(authorizationDecision.getStatus().getMessage(), is(missingAttributeException.getMessage()));

        StringWriter sw = new StringWriter();
        missingAttributeException.printStackTrace(new PrintWriter(sw));
        assertThat(authorizationDecision.getStatus().getDetail(), is(sw.toString()));
    }
}
