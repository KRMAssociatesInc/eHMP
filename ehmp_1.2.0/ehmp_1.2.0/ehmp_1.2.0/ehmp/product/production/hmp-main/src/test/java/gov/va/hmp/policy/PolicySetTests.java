package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static gov.va.hmp.access.MatchResult.Value.MATCH;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.*;

public class PolicySetTests {

    private ITarget mockTarget;
    private IPolicyCombiningAlgorithm mockPolicyCombiningAlgorithm;
    private PolicySet policySet;

    @Before
    public void setUp() throws Exception {
        mockTarget = mock(ITarget.class);
        mockPolicyCombiningAlgorithm = mock(IPolicyCombiningAlgorithm.class);
        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm);
    }

    @Test
    public void testConstruct() throws Exception {
        assertThat(policySet.getTarget(), is(sameInstance(mockTarget)));
        assertThat(policySet.getPolicyCombiningAlgorithm(), is(sameInstance(mockPolicyCombiningAlgorithm)));
    }

    @Test
    public void testTargetMatchProducesRuleCombiningAlgorithmDecision() throws Exception {
        List<IPolicy> policies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);

        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        when(mockPolicyCombiningAlgorithm.evaluate(policies, mockRequest)).thenReturn(new AuthorizationDecision(this, Decision.PERMIT));

        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm, policies);

        Assert.assertThat(policySet.evaluate(mockRequest).getDecision(), is(Decision.PERMIT));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockPolicyCombiningAlgorithm).evaluate(policies, mockRequest);
    }

    @Test
    public void testTargetMatchAndAllPoliciesNotApplicableProducesNotApplicable() throws Exception {
        List<IPolicy> policies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE);

        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        when(mockPolicyCombiningAlgorithm.evaluate(policies, mockRequest)).thenReturn(new AuthorizationDecision(this, Decision.NOT_APPLICABLE));

        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm, policies);

        Assert.assertThat(policySet.evaluate(mockRequest).getDecision(), is(Decision.NOT_APPLICABLE));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockPolicyCombiningAlgorithm).evaluate(policies, mockRequest);
    }

    @Test
    public void testTargetMatchAndOnePolicyIndeterminateProducesProducesCombiningAlgorithmDecision() throws Exception {
        List<IPolicy> policies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);

        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MATCH));

        when(mockPolicyCombiningAlgorithm.evaluate(policies, mockRequest)).thenReturn(new AuthorizationDecision(this, Decision.PERMIT));

        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm, policies);

        Assert.assertThat(policySet.evaluate(mockRequest).getDecision(), is(Decision.PERMIT));
        verify(mockTarget).evaluate(mockRequest);
        verify(mockPolicyCombiningAlgorithm).evaluate(policies, mockRequest);
    }

    @Test
    public void testTargetNoMatchProducesNotApplicable() throws Exception {
        List<IPolicy> policies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);

        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MatchResult.Value.NO_MATCH));

        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm, policies);

        Assert.assertThat(policySet.evaluate(mockRequest).getDecision(), is(Decision.NOT_APPLICABLE));
        verify(mockTarget).evaluate(mockRequest);
        verifyZeroInteractions(mockPolicyCombiningAlgorithm);
    }

    @Test
    public void testTargetIndeterminateProducesIndeterminate() throws Exception {
        List<IPolicy> policies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);

        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo");

        ITarget mockTarget = mock(ITarget.class);
        when(mockTarget.evaluate(mockRequest)).thenReturn(MatchResult.valueOf(MatchResult.Value.INDETERMINATE));

        policySet = new PolicySet(mockTarget, mockPolicyCombiningAlgorithm, policies);

        Assert.assertThat(policySet.evaluate(mockRequest).getDecision(), is(Decision.INDETERMINATE));
        verify(mockTarget).evaluate(mockRequest);
        verifyZeroInteractions(mockPolicyCombiningAlgorithm);
    }

    @Test
    public void testAddPolicy() throws Exception {
        ITarget mockTarget = mock(ITarget.class);
        IRuleCombiningAlgorithm mockCombiningAlgorithm = mock(IRuleCombiningAlgorithm.class);
        Policy policy = new Policy(mockTarget, mockCombiningAlgorithm);

        policySet.addPolicy(policy);
        Assert.assertThat(policySet.getPolicies().size(), is(1));
        Assert.assertThat(policySet.getAdjudicators().size(), is(1));
        Assert.assertThat(policySet.getPolicySets().size(), is(0));
        Assert.assertThat((Policy) policySet.getAdjudicators().get(0), sameInstance(policy));
    }

    @Test
    public void testAddPolicySet() throws Exception {
        ITarget mockTarget2 = mock(ITarget.class);
        IPolicyCombiningAlgorithm mockCombiningAlgorithm2 = mock(IPolicyCombiningAlgorithm.class);
        PolicySet policySet2 = new PolicySet(mockTarget2, mockCombiningAlgorithm2);
        policySet.addPolicySet(policySet2);

        Assert.assertThat(policySet.getPolicies().size(), is(0));
        Assert.assertThat(policySet.getAdjudicators().size(), is(1));
        Assert.assertThat(policySet.getPolicySets().size(), is(1));
        Assert.assertThat((PolicySet) policySet.getAdjudicators().get(0), sameInstance(policySet2));
    }
}
