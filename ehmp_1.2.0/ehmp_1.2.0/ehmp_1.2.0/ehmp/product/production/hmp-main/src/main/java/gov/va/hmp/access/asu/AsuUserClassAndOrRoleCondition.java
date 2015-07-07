package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.ICondition;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.MissingAttributeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;

/**
 * A policy engine {@link gov.va.hmp.access.ICondition} that implements the portion of an ASU rule that evaluates a user's user class and/or
 * user role with respect to a particular document.
 *
 * @see "VistA FileMan USR AUTHORIZATION/SUBSCRIPTION(8930.1)"
 * @see <a href="http://domain/vdl/documents/Clinical/CPRS-Auth_Subscr_Util_(ASU)/asutm.pdf">ASU Technical Manual</a>
 */
public class AsuUserClassAndOrRoleCondition implements ICondition<HmpUserDetails, DocumentAction, Object> {

    private static Logger LOGGER = LoggerFactory.getLogger(AsuUserClassAndOrRoleCondition.class);

    private String expectedUserClassName;
    private AsuRole expectedUserRole;
    private boolean requireBothUserClassAndUserRole = false;

    public AsuUserClassAndOrRoleCondition(String expectedUserClassName, AsuRole expectedUserRole) {
       this(expectedUserClassName, expectedUserRole, false);
    }

    public AsuUserClassAndOrRoleCondition(String expectedUserClassName, AsuRole expectedUserRole, boolean andFlag) {
        this.expectedUserClassName = expectedUserClassName;
        this.expectedUserRole = expectedUserRole;
        this.requireBothUserClassAndUserRole = andFlag;
    }

    public String getUserClassName() {
        return expectedUserClassName;
    }

    public AsuRole getUserRole() {
        return expectedUserRole;
    }

    @Override
    public ConditionValue evaluate(DecisionRequest<HmpUserDetails, DocumentAction, Object> request) throws Exception{
        try {
            boolean userClassExpected = StringUtils.hasText(expectedUserClassName);
            boolean userRoleExpected = expectedUserRole != null;
            ConditionValue userClassCondition = ConditionValue.INDETERMINATE;
            ConditionValue userRoleCondition = ConditionValue.INDETERMINATE;
            if (userRoleExpected) {
                Set<AsuRole> roles = getUserRolesForDocument(request.getSubject(), request.getResource());
                userRoleCondition = roles.contains(expectedUserRole) ? ConditionValue.TRUE : ConditionValue.FALSE;
            }
            if (userClassExpected) {
                userClassCondition = request.getSubject().hasVistaUserClass(expectedUserClassName) ? ConditionValue.TRUE : ConditionValue.FALSE;
            }
            if (userClassExpected && userRoleExpected) {
                return requireBothUserClassAndUserRole ? userClassCondition.and(userRoleCondition) : userClassCondition.or(userRoleCondition);
            } else if (userClassExpected && !userRoleExpected) {
                return userClassCondition;
            }  else if (userRoleExpected && !userClassExpected) {
                return userRoleCondition;
            } else {
                return ConditionValue.INDETERMINATE;
            }
        } catch (Exception e) {
            LOGGER.error("unable to evaluate rule condition", e);
            throw e;
        }
    }

    // TODO: what about surrogates, completers, transcribers? this logic is not fully complete...  see VistA USRROLE^TIULP
    Set<AsuRole> getUserRolesForDocument(HmpUserDetails user, Object document) {
        Set<AsuRole> roles = new HashSet<>();
        try {
            if (user.getUid().equalsIgnoreCase(Document.getAuthorUid(document))) {
                roles.add(AsuRole.AUTHOR_DICTATOR);
            }
        } catch (MissingAttributeException e) {
            // NOOP
        }
        try {
            if (user.getUid().equalsIgnoreCase(Document.getSignerUid(document))) {
                roles.add(AsuRole.EXPECTED_SIGNER);
            }
        } catch (MissingAttributeException e) {
            // NOOP
        }
        try {
            if (user.getUid().equalsIgnoreCase(Document.getCosignerUid(document))) {
                roles.add(AsuRole.EXPECTED_COSIGNER);
            }
        } catch (MissingAttributeException e) {
            // NOOP
        }
        try {
            if (user.getUid().equalsIgnoreCase(Document.getAttendingUid(document))) {
                roles.add(AsuRole.ATTENDING_PHYSICIAN);
            }
        } catch (MissingAttributeException e) {
            // NOOP
        }
        return roles;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("AsuCondition{");
        if (StringUtils.hasText(expectedUserClassName)) {
            sb.append("userClass='");
            sb.append(expectedUserClassName);
            sb.append("'");
        }
        if (StringUtils.hasText(expectedUserClassName) && expectedUserRole != null) {
            if (requireBothUserClassAndUserRole) {
                sb.append(" AND ");
            } else {
                sb.append(" OR ");
            }
        }
        if (expectedUserRole != null) {
            sb.append("role='");
            sb.append(expectedUserRole);
            sb.append("'");
        }
        sb.append("}");
        return sb.toString();
    }
}
