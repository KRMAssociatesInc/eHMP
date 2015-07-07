package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsMapAsuDecisionRequest;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import static gov.va.hmp.access.Decision.DENY;
import static gov.va.hmp.access.Decision.INDETERMINATE;

/**
 * Extends {@link gov.va.cpe.vpr.queryeng.query.JDSQuery} to screen out documents based on access control rules.
 */
public class ScreenedJDSQuery extends JDSQuery {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScreenedJDSQuery.class);

    public ScreenedJDSQuery(String pk, QueryDef qry) {
        super(pk, qry);
    }

    @Override
    protected boolean includeRow(RenderTask task, Map<String, Object> mappedRow) {
        if (Document.isTIU(mappedRow)) {
            IPolicyDecisionPoint pdp = task.getResource(IPolicyDecisionPoint.class);
            HmpUserDetails user = task.getResource(UserContext.class).getCurrentUser();
            DocumentAsMapAsuDecisionRequest request = new DocumentAsMapAsuDecisionRequest(user, DocumentAction.VIEW, mappedRow);

            AuthorizationDecision decision = pdp.evaluate(request);
            if (INDETERMINATE.equals(decision.getDecision())) {
                LOGGER.debug("excluding document '" + mappedRow.get("uid") + "' due to an Indeterminate decision");
                return false;
            } else if (DENY.equals(decision.getDecision())) {
                LOGGER.debug("excluding document '" + mappedRow.get("uid") + "' due to a Deny decision");
                return false;
            }
        }

        return true;
    }
}
