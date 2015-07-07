package gov.va.hmp.policy;

import gov.va.hmp.access.Decision;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.IRule;
import gov.va.hmp.access.RuleCombiningAlgorithms;
import org.junit.Test;

import java.util.List;

import static gov.va.hmp.access.Decision.DENY;
import static gov.va.hmp.access.Decision.PERMIT;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class FirstApplicableRuleCombiningAlgorithmTests {
    @Test
    public void testFirstApplicable() throws Exception {
        DecisionRequest mockRequest = MocksFactory.createMockDecisionRequest("foo");

        List<IRule> mockRules = MocksFactory.mockRules(PERMIT, PERMIT, DENY);
        assertThat(RuleCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest).getDecision(), is(PERMIT));

        mockRules = MocksFactory.mockRules(DENY, PERMIT, DENY);
        assertThat(RuleCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest).getDecision(), is(DENY));

        mockRules = MocksFactory.mockRules(Decision.NOT_APPLICABLE, PERMIT, DENY);
        assertThat(RuleCombiningAlgorithms.firstApplicable().evaluate(mockRules, mockRequest).getDecision(), is(PERMIT));
    }
}
