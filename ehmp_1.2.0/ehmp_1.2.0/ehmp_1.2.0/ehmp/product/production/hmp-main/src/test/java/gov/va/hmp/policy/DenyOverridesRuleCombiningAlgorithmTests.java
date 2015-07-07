package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static gov.va.hmp.access.Decision.*;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class DenyOverridesRuleCombiningAlgorithmTests {

    private DecisionRequest mockRequest;

    @Before
    public void setUp() throws Exception {
        mockRequest = MocksFactory.createMockDecisionRequest("foo");
    }

    @Test
    public void testDenyOverrides() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(PERMIT, PERMIT, DENY);
        AuthorizationDecision authDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authDecision.getDecision(), is(DENY));
        assertThat(authDecision.getTrace().size(), is(3));

        mockRules = MocksFactory.mockRules(PERMIT, INDETERMINATE, DENY);
        authDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authDecision.getDecision(), is(DENY));
        assertThat(authDecision.getTrace().size(), is(3));
    }

    @Test
    public void testDenyOverridesWithAllPermitsEvaluatesToPermit() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(PERMIT, PERMIT, PERMIT);
        AuthorizationDecision authDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authDecision.getDecision(), is(PERMIT));
        assertThat(authDecision.getTrace().size(), is(3));
    }

    @Test
    public void testDenyOverridesIgnoresNotApplicable() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(NOT_APPLICABLE, PERMIT, PERMIT);
        AuthorizationDecision authDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authDecision.getDecision(), is(PERMIT));
        assertThat(authDecision.getTrace().size(), is(3));

        mockRules = MocksFactory.mockRules(NOT_APPLICABLE, DENY, PERMIT);
        authDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authDecision.getDecision(), is(DENY));
        assertThat(authDecision.getTrace().size(), is(2));
    }

    @Test
    public void testDenyOverridesIndeterminateEvaluatesToIndeterminate() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(INDETERMINATE, INDETERMINATE, INDETERMINATE);
        AuthorizationDecision authorizationDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(INDETERMINATE));
        assertThat(authorizationDecision.getTrace().size(), is(3));
    }

    @Test
    public void testDenyOverridesNotApplicableEvaluatesToNotApplicable() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(NOT_APPLICABLE, NOT_APPLICABLE, NOT_APPLICABLE);
        AuthorizationDecision authorizationDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(NOT_APPLICABLE));
        assertThat(authorizationDecision.getTrace().size(), is(3));
    }

    @Test
    public void testDenyOverridesIndeterminateAndOnePermitEvaluatesToPermit() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(NOT_APPLICABLE, PERMIT, INDETERMINATE);
        AuthorizationDecision authorizationDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(PERMIT));
        assertThat(authorizationDecision.getTrace().size(), is(3));
    }

    @Test
    public void testDenyOverridesIndeterminatePotentialDenyAndOnePermitEvaluatesToIndeterminate() throws Exception {
        List<IRule> mockRules = MocksFactory.mockRules(INDETERMINATE, PERMIT);
        when(mockRules.get(0).getEffect()).thenReturn(Effect.DENY);
        AuthorizationDecision authorizationDecision = RuleCombiningAlgorithms.denyOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(INDETERMINATE));
        assertThat(authorizationDecision.getTrace().size(), is(2));
    }

}
