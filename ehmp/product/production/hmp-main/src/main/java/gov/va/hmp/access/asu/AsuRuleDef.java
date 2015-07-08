package gov.va.hmp.access.asu;

import com.fasterxml.jackson.annotation.JsonProperty;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.jds.JdsCollectionName;

import java.util.Map;

/**
 * Representation of ASU rules.
 *
 * @see "VistA FileMan USR AUTHORIZATION/SUBSCRIPTION(8930.1)"
 */
@JdsCollectionName("asu-rule")
public class AsuRuleDef extends AbstractPOMObject {
    private String actionName;
    private String actionUid;
    private String docDefName;
    private String docDefUid;
    private Boolean isAnd = Boolean.FALSE;
    private String localId;
    private String statusName;
    private String statusUid;
    private String userClassName;
    private String userClassUid;
    private String userRoleName;
    private String userRoleUid;
    private String description;

    public AsuRuleDef() {
        super();
    }

    public AsuRuleDef(Map<String, Object> vals) {
        super(vals);
    }

    public String getStatusName() {
        return statusName;
    }

    public String getStatusUid() {
        return statusUid;
    }

    public String getUserClassName() {
        return userClassName;
    }

    public String getUserClassUid() {
        return userClassUid;
    }

    public String getUserRoleName() {
        return userRoleName;
    }

    public String getUserRoleUid() {
        return userRoleUid;
    }

    public String getDocDefUid() {
        return docDefUid;
    }

    public String getDocDefName() {
        return docDefName;
    }

    public String getActionUid() {
        return actionUid;
    }

    public String getActionName() {
        return actionName;
    }

    public String getDescription() {
        return description;
    }

    @JsonProperty("isAnd")
    public Boolean isAnd() {
        return isAnd;
    }

    @Override
    public String getSummary() {
        return getDescription();
    }
}
