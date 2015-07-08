package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Test;

import java.util.List;

import static gov.va.hmp.access.Decision.DENY;
import static gov.va.hmp.access.Decision.PERMIT;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class FirstApplicablePolicyCombiningAlgorithmTests {
    @Test
    public void testFirstApplicable() throws Exception {
        DecisionRequest mockRequest = MocksFactory.createMockDecisionRequest("foo");

        List<IRule> mockRules = MocksFactory.mockRules(PERMIT, PERMIT, DENY);
        AuthorizationDecision authorizationDecision = PolicyCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(PERMIT));
        assertThat(authorizationDecision.getTrace().size(), is(1));

        mockRules = MocksFactory.mockRules(DENY, PERMIT, DENY);
        authorizationDecision = PolicyCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(DENY));
        assertThat(authorizationDecision.getTrace().size(), is(1));

        mockRules = MocksFactory.mockRules(Decision.NOT_APPLICABLE, PERMIT, DENY);
        authorizationDecision = PolicyCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(PERMIT));
        assertThat(authorizationDecision.getTrace().size(), is(2));
    }
}
