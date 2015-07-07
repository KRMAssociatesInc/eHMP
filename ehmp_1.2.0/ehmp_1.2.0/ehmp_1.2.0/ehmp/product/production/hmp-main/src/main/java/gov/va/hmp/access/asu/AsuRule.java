package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.hmp.access.*;
import gov.va.hmp.auth.HmpUserDetails;
import org.apache.commons.lang.StringUtils;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.springframework.util.StringUtils.hasText;

public class AsuRule extends Rule<HmpUserDetails, DocumentAction, Object> {

    /**
     * Creates one or two AsuRule instances for one AsuRuleDef.
     *
     * Due to the differences in mapping ASU rules and rule evaluation onto the policy engine's model, it is possible for one
     * ASU rule definition (an entry in VistA FileMan USR AUTHORIZATION/SUBSCRIPTION(8930.1)) to result in two policy engine rules,
     * one that results in a Permit and one that results in a Deny.
     *
     * @param documentDefinitionsByUid
     * @param asuRuleDef
     * @return
     */
    public static List<AsuRule> create(Map<String, DocumentDefinition> documentDefinitionsByUid, AsuRuleDef asuRuleDef) {
        Assert.notNull(documentDefinitionsByUid);
        AsuTarget permitTarget = AsuTarget.create(documentDefinitionsByUid, asuRuleDef);
        AsuRule rule = new AsuRule(asuRuleDef.getUid(), permitTarget, createCondition(asuRuleDef), Effect.PERMIT);
        rule.setDescription(asuRuleDef.getDescription());
        if (hasText(asuRuleDef.getUserClassName()) && !"USER".equalsIgnoreCase(asuRuleDef.getUserClassName())) {
            AsuTarget denyTarget =new AsuTarget(documentDefinitionsByUid, DocumentAction.forName(asuRuleDef.getActionName()), DocumentStatus.forName(asuRuleDef.getStatusName()), permitTarget.getDocumentDefinition(), asuRuleDef.getUserClassName(), true);
            AsuRule denyRule = new AsuRule(asuRuleDef.getUid(), denyTarget, Effect.DENY);
            return Arrays.asList(rule, denyRule);
        }
        return Arrays.asList(rule);
    }

    private static AsuUserClassAndOrRoleCondition createCondition(AsuRuleDef asuRuleDef) {
        AsuRole expectedUserRole = StringUtils.isNotEmpty(asuRuleDef.getUserRoleName()) ? AsuRole.forName(asuRuleDef.getUserRoleName()) : null;
        return new AsuUserClassAndOrRoleCondition(asuRuleDef.getUserClassName(), expectedUserRole, asuRuleDef.isAnd());
    }

    private String uid;

    private AsuRule(String uid, ITarget<HmpUserDetails, DocumentAction, Object> target, Effect effect) {
        this(uid, target, null, effect);
    }

    private AsuRule(String uid, ITarget<HmpUserDetails, DocumentAction, Object> target, ICondition<HmpUserDetails, DocumentAction, Object> condition, Effect effect) {
        super(target, condition, effect);
        this.uid = uid;
    }

    public String getUid() {
        return uid;
    }

    public DocumentAction getAction() {
        return ((AsuTarget) getTarget()).getAction();
    }

    public DocumentStatus getStatus() {
        return ((AsuTarget) getTarget()).getStatus();
    }

    public DocumentDefinition getDocumentDefinition() {
      return ((AsuTarget) getTarget()).getDocumentDefinition();
    }

    public String getDocumentDefinitionUid() {
        return getDocumentDefinition().getUid();
    }

    public AsuRole getUserRole() {
        return getCondition() != null ? ((AsuUserClassAndOrRoleCondition) getCondition()).getUserRole() : null;
    }

    public String getUserClassName() {
        return ((AsuTarget) getTarget()).getUserClassName();
    }

    @Override
    protected String createStatusMessage(DecisionRequest<HmpUserDetails, DocumentAction, Object> request) {
        if (getEffect().equals(Effect.DENY)) {
            try {
                return AsuDecisionRequest.createDenyStatusMessage(request);
            } catch (IllegalArgumentException e) {
                return super.createStatusMessage(request);
            }
        } else {
            return super.createStatusMessage(request);
        }
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() +
                "{uid='"+getUid()+
                "', action=" + getAction() +
                ", status='" + getStatus() + "'" +
                ", docDefUid='" + getDocumentDefinition().getUid() + "'" +
                ", docDefName='" + getDocumentDefinition().getDisplayName() +  "'" +
                ", userClassName='" + getUserClassName() +  "'" +
                ", userRole='" + getUserRole() +"'}";
    }
}
