package gov.va.hmp.access.asu;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.hmp.access.*;
import gov.va.hmp.auth.HmpUserDetails;

/**
 * PolicySet that ind
 */
public class AsuBasePolicySet extends PolicySet<HmpUserDetails, DocumentAction, Object> {

    private Table<DocumentAction, DocumentStatus, PolicySet> policySetsByActionAndStatus = HashBasedTable.create();

    public AsuBasePolicySet() {
        super(Targets.anyTarget(), PolicyCombiningAlgorithms.onlyOneApplicable());

        for (DocumentAction action : DocumentAction.values()) {
            for (DocumentStatus status : DocumentStatus.values()) {
                policySetsByActionAndStatus.put(action, status, new PolicySet(targetForActionAndStatus(action, status), AsuPolicyCombiningAlgorithm.instance()));
            }
        }
    }

    public void addPolicy(AsuPolicy policy) {
       getPolicySet(policy.getAction(), policy.getStatus()).addPolicy(policy);
       super.addPolicy(policy);
    }

    public void addPolicySet(AsuPolicySet policySet) {
        getPolicySet(policySet.getAction(), policySet.getStatus()).addPolicySet(policySet);
        super.addPolicySet(policySet);
    }

    public PolicySet getPolicySet(DocumentAction action, String status) {
        return getPolicySet(action, DocumentStatus.forName(status));
    }

    public PolicySet getPolicySet(DocumentAction action, DocumentStatus status) {
        return policySetsByActionAndStatus.get(action, status);
    }

    @Override
    public AuthorizationDecision evaluate(DecisionRequest<HmpUserDetails, DocumentAction, Object> request) {
        try {
            String status = Document.getStatusName(request.getResource());
            PolicySet policySet = getPolicySet(request.getAction(), status);
            AuthorizationDecision decision = policySet.evaluate(request);
            return decision;
        } catch (MissingAttributeException e) {
            return AuthorizationDecision.valueOf(this, e);
        }
    }

    public static ITarget<HmpUserDetails, DocumentAction, Document> targetForActionAndStatus(DocumentAction action, DocumentStatus status) {
        return Targets.with(Targets.anySubjects(HmpUserDetails.class), Targets.equalTo(action), new AsuTarget.DocumentStatusMatcher(status));
    }
}
