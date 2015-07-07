package gov.va.hmp.policy;

import gov.va.hmp.access.Decision;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.IPolicy;
import gov.va.hmp.access.PolicyCombiningAlgorithms;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class DenyOverridesPolicyCombiningAlgorithmTests {
    private DecisionRequest mockRequest;

    @Before
    public void setUp() throws Exception {
        mockRequest = MocksFactory.createMockDecisionRequest("foo");
    }

    @Test
    public void testDenyOverrides() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.PERMIT, Decision.DENY);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));

        mockPolicies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));
    }

    @Test
    public void testDenyOverridesWithAllPermitsEvaluatesToPermit() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.PERMIT, Decision.PERMIT);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.PERMIT));
    }

    @Test
    public void testDenyOverridesIgnoresNotApplicable() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.PERMIT, Decision.PERMIT);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.PERMIT));

        mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.DENY, Decision.PERMIT);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));
    }

    @Test
    public void testDenyOverridesIndeterminateEvaluatesToDeny() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.INDETERMINATE, Decision.INDETERMINATE, Decision.INDETERMINATE);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));
    }

    @Test
    public void testDenyOverridesNotApplicableEvaluatesToNotApplicable() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.NOT_APPLICABLE));
    }

    @Test
    public void testDenyOverridesIndeterminateAndOnePermitEvaluatesToDeny() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.PERMIT, Decision.INDETERMINATE);
        assertThat(PolicyCombiningAlgorithms.denyOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));
    }
}
