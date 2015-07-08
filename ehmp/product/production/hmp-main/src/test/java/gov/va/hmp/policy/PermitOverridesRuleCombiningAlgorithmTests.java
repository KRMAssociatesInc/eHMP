package gov.va.hmp.policy;

import gov.va.hmp.access.*;
import org.junit.Test;

import java.util.List;

import static gov.va.hmp.policy.MocksFactory.createMockDecisionRequest;
import static gov.va.hmp.policy.MocksFactory.mockRules;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PermitOverridesRuleCombiningAlgorithmTests {
    @Test
    public void testPermitOverrides() throws Exception {
        DecisionRequest mockRequest = createMockDecisionRequest("foo");

        List<IRule> mockRules = mockRules(Decision.DENY, Decision.PERMIT, Decision.DENY);
        AuthorizationDecision authorizationDecision = RuleCombiningAlgorithms.permitOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(Decision.PERMIT));
        assertThat(authorizationDecision.getTrace().size(), is(2));

        mockRules = mockRules(Decision.PERMIT, Decision.INDETERMINATE, Decision.DENY);
        authorizationDecision = RuleCombiningAlgorithms.permitOverrides().evaluate(mockRules, mockRequest);
        assertThat(authorizationDecision.getDecision(), is(Decision.PERMIT));
        assertThat(authorizationDecision.getTrace().size(), is(1));
    }
}
