package gov.va.hmp.policy;

import gov.va.hmp.access.Decision;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.IPolicy;
import gov.va.hmp.access.PolicyCombiningAlgorithms;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static gov.va.hmp.policy.MocksFactory.createMockDecisionRequest;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PermitOverridesPolicyCombiningAlgorithmTests {

    private DecisionRequest mockRequest;

    @Before
    public void setUp() throws Exception {
        mockRequest = createMockDecisionRequest("foo");
    }

    @Test
    public void testPermitOverrides() throws Exception {
        List<IPolicy> mockPolicies = MocksFactory.mockPolicies(Decision.DENY, Decision.PERMIT, Decision.DENY);
        assertThat(PolicyCombiningAlgorithms.permitOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.PERMIT));

        mockPolicies = MocksFactory.mockPolicies(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);
        assertThat(PolicyCombiningAlgorithms.permitOverrides().evaluate(mockPolicies, mockRequest).getDecision(), is(Decision.PERMIT));
    }

    // TODO: fill in some more test cases here
}
