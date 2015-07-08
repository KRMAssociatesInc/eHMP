package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.hmp.auth.HmpUserDetails;

public class DocumentAsuDecisionRequest extends AsuDecisionRequest {

    private Document document;

    public DocumentAsuDecisionRequest(HmpUserDetails user, DocumentAction action, Document document) {
        super(user, action, document);
        this.document = document;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{user=" + getSubject().getUid() + ",action=" + getAction() + ",status=" + document.getStatus() + ",docDefUid=" + document.getDocumentDefUid() + ",document=" +getResource()+ "}";
    }
}
