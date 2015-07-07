package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.hmp.access.IAdjudicator;
import gov.va.hmp.access.PolicyCombiningAlgorithms;
import gov.va.hmp.access.PolicySet;
import gov.va.hmp.access.Targets;
import gov.va.hmp.auth.HmpUserDetails;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * {@link gov.va.hmp.access.IPolicySet} implementation to set values of generics and increase readability.
 */
public class AsuPolicySet extends PolicySet<HmpUserDetails, DocumentAction, Object> {

    private DocumentAction action;
    private DocumentStatus status;

    private AsuPolicySet(DocumentAction action, DocumentStatus status) {
        super(Targets.with(Targets.anySubjects(HmpUserDetails.class), Targets.equalTo(action), new AsuTarget.DocumentStatusMatcher(status)), PolicyCombiningAlgorithms.firstApplicable());
        this.action = action;
        this.status = status;
    }

    public DocumentAction getAction() {
        return action;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public Set<DocumentDefinition> getDocumentDefinitions() {
        Set<DocumentDefinition> docDefs = new HashSet<>();
        for (IAdjudicator adjudicator : getAdjudicators()) {
            if (adjudicator instanceof AsuPolicy) {
                docDefs.add(((AsuPolicy) adjudicator).getDocumentDefinition());
            }
        }
        return Collections.unmodifiableSet(docDefs);
    }

    public static AsuPolicySet create(DocumentAction action, DocumentStatus status, List<AsuPolicy> policies) {
        Set<DocumentDefinition> docDefs = new HashSet<>();
        for (AsuPolicy policy : policies) {
            docDefs.add(policy.getDocumentDefinition());
        }
        AsuPolicySet policySet = new AsuPolicySet(action, status);
        for (AsuPolicy policy : policies) {
            policySet.addPolicy(policy);
        }
        return policySet;
    }
}
