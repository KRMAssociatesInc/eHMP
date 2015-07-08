package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.MissingAttributeException;

/**
 * Extends (@link DecisionRequest} to set values of the subject and action generics generics and increase readability.
 * The resource is left as a generic to support both Document instances and Maps.
 */
public class AsuDecisionRequest extends DecisionRequest<HmpUserDetails, DocumentAction, Object> {
    public AsuDecisionRequest(HmpUserDetails user, DocumentAction action, Object document) {
        super(user, action, document);
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "{subject=" + getSubject().getUid() + ", action=" + getAction() + ", resource=" + getResource() + "}";
    }

    public static String createDenyStatusMessage(DecisionRequest<HmpUserDetails, DocumentAction, Object> request) {
        try {
            String localTitle = Document.getLocalTitle(request.getResource());
            String status = Document.getStatusName(request.getResource());
            return "You may not " + request.getAction() + " this " + status + " " + localTitle + ".";
        } catch (MissingAttributeException e) {
            throw new IllegalArgumentException(e);
        }
    }
}
