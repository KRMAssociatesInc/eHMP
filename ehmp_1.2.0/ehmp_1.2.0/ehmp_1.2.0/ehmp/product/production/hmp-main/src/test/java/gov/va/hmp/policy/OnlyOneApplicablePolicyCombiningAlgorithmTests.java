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

public class OnlyOneApplicablePolicyCombiningAlgorithmTests {

    private DecisionRequest mockRequest;

    @Before
    public void setUp() throws Exception {
        mockRequest = MocksFactory.createMockDecisionRequest("foo");
    }

    @Test
    public void testOnlyOneApplicable() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.PERMIT, Decision.NOT_APPLICABLE);
        assertThat(PolicyCombiningAlgorithms.onlyOneApplicable().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.PERMIT));

        mockPolicies = MocksFactory.mockPolicies(Decision.DENY, Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE);
        assertThat(PolicyCombiningAlgorithms.onlyOneApplicable().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.DENY));
    }

    @Test
    public void testAllNotApplicableEvaluatesToNotApplicable() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE, Decision.NOT_APPLICABLE);
        assertThat(PolicyCombiningAlgorithms.onlyOneApplicable().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.NOT_APPLICABLE));
    }

    @Test
    public void testMoreThanOneApplicableEvaluatesToIndeterminate() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.DENY, Decision.PERMIT, Decision.NOT_APPLICABLE);
        assertThat(PolicyCombiningAlgorithms.onlyOneApplicable().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.INDETERMINATE));
    }

    @Test
    public void testAtLeastOneIndeterminateEvaluatesToIndeterminate() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.INDETERMINATE);
        assertThat(PolicyCombiningAlgorithms.onlyOneApplicable().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.INDETERMINATE));
    }
}
