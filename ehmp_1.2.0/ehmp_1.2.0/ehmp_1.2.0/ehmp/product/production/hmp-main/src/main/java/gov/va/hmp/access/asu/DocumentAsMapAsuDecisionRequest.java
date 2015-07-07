package gov.va.hmp.access.asu;


import gov.va.cpe.vpr.Document;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.MissingAttributeException;

import java.util.Map;

public class DocumentAsMapAsuDecisionRequest extends AsuDecisionRequest {

    public DocumentAsMapAsuDecisionRequest(HmpUserDetails user, DocumentAction action, Map<String, Object> document) {
        super(user, action, document);
    }

    public String getStatusName() {
        try {
            return Document.getStatusName(getResource());
        } catch (MissingAttributeException e) {
            return null;
        }
    }

    public String getDocDefUid() {
        try {
            return Document.getDocDefUid(getResource());
        } catch (MissingAttributeException e) {
            return null;
        }
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{user=" + getSubject().getUid() + ",action=" + getAction() + ",status=" + getStatusName() + ",docDefUid=" + getDocDefUid() + ",document=" +getResource()+ "}";
    }

}
