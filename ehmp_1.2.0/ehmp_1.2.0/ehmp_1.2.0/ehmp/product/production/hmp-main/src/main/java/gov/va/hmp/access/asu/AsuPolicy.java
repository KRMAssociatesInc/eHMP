package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.hmp.access.IRule;
import gov.va.hmp.access.Policy;
import gov.va.hmp.access.RuleCombiningAlgorithms;
import gov.va.hmp.auth.HmpUserDetails;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * {@link gov.va.hmp.access.IPolicy} implementation to set values of generics and increase readability.
 */
public class AsuPolicy extends Policy<HmpUserDetails, DocumentAction, Object> {

    private DocumentAction action;
    private DocumentStatus status;
    private DocumentDefinition documentDefinition;

    public AsuPolicy(Map<String, DocumentDefinition> documentDefinitionsByUid, DocumentAction action, DocumentStatus status, DocumentDefinition documentDefinition) {
       this(documentDefinitionsByUid, action, status, documentDefinition, Collections.<IRule<HmpUserDetails, DocumentAction, Object>>emptyList());
    }

    public AsuPolicy(Map<String, DocumentDefinition> documentDefinitionsByUid, DocumentAction action, DocumentStatus status, DocumentDefinition documentDefinition, List<? extends IRule<HmpUserDetails, DocumentAction, Object>> rules) {
        super(AsuTarget.create(documentDefinitionsByUid, action, status, documentDefinition), RuleCombiningAlgorithms.permitOverrides(), rules);
        this.action = action;
        this.status = status;
        this.documentDefinition = documentDefinition;
    }

    public DocumentAction getAction() {
        return action;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public DocumentDefinition getDocumentDefinition() {
        return documentDefinition;
    }

    public String getDocumentDefinitionUid() {
        return getDocumentDefinition().getUid();
    }

    @Override
    public String toString() {
        return "AsuPolicy{" +
                "action='" + action + "'" +
                ", status='" + status + "'" +
                ", docDefUid='" + getDocumentDefinition().getUid() + "'" +
                ", docDefName='" + getDocumentDefinition().getDisplayName() +  "'" +
                ", rules=" + getRules().size() +
                '}';
    }
}
