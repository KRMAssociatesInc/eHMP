package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.Matcher;
import gov.va.hmp.access.MissingAttributeException;
import gov.va.hmp.access.Targets;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * {@link gov.va.hmp.access.ITarget} implementation for ASU rules
 */
public class AsuTarget extends Targets.DefaultTarget<HmpUserDetails, DocumentAction, Object> {

    public static AsuTarget create(Map<String, DocumentDefinition> documentDefinitionsByUid, DocumentAction action, DocumentStatus status, DocumentDefinition docDef) {
        Assert.notNull(documentDefinitionsByUid);

        return new AsuTarget(documentDefinitionsByUid, action, status, docDef, null, false);
    }

    public static AsuTarget create(Map<String, DocumentDefinition> documentDefinitionsByUid, AsuRuleDef asuRuleDef) {
        Assert.notNull(documentDefinitionsByUid);

        DocumentDefinition docDef = documentDefinitionsByUid.get(asuRuleDef.getDocDefUid());
        return new AsuTarget(documentDefinitionsByUid, DocumentAction.forName(asuRuleDef.getActionName()), DocumentStatus.forName(asuRuleDef.getStatusName()), docDef, asuRuleDef.getUserClassName(), false);
    }

    private static Matcher<List<? extends HmpUserDetails>> userClassSubjectMatcher(String userClassName, boolean matchComplementOfUserClass) {
        if (!StringUtils.hasText(userClassName)) {
            return Targets.anySubjects(HmpUserDetails.class);
        }
        if (matchComplementOfUserClass) {
            return new DoesNotHaveUserClassMatcher(userClassName);
        } else {
            return new HasUserClassMatcher(userClassName);
        }
    }

    private DocumentAction action;
    private DocumentStatus status;
    private DocumentDefinition documentDefinition;
    private String userClassName;
    private Map<String, DocumentDefinition> documentDefinitionsByUid;

    AsuTarget(Map<String, DocumentDefinition> documentDefinitionsByUid, DocumentAction action, DocumentStatus status, DocumentDefinition docDef, String userClassName, boolean matchComplementOfUserClass) {
        super(userClassSubjectMatcher(userClassName, matchComplementOfUserClass), Targets.equalTo(action), new DocumentDefinitionAndStatusMatcher(documentDefinitionsByUid, docDef.getUid(), status));
        this.documentDefinitionsByUid = documentDefinitionsByUid;
        this.action = action;
        this.status = status;
        this.documentDefinition = docDef;
        this.userClassName = userClassName;
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
        return documentDefinition.getUid();
    }

    public String getUserClassName() {
        return userClassName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AsuTarget)) return false;

        AsuTarget target = (AsuTarget) o;

        if (action != target.action) return false;
        if (!status.equals(target.status)) return false;
        if (!getDocumentDefinitionUid().equals(target.getDocumentDefinitionUid())) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = action.hashCode();
        result = 31 * result + status.hashCode();
        result = 31 * result + getDocumentDefinitionUid().hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "AsuTarget{" +
                "action=" + action +
                ", status='" + status + "'" +
                ", docDef='" + getDocumentDefinition() +  "'" +
                ", userClassName='" + getUserClassName() + "'" +
                '}';
    }


    public static class DocumentDefinitionAndStatusMatcher implements Matcher<Object> {

        private String expectedDocDefUid;
        private DocumentStatus expectedStatus;
        private Map<String, DocumentDefinition> documentDefinitionsByUid;

        public DocumentDefinitionAndStatusMatcher(Map<String, DocumentDefinition> documentDefinitionsByUid, String expectedDocDefUid, DocumentStatus expectedStatus) {
            this.documentDefinitionsByUid = documentDefinitionsByUid;
            this.expectedDocDefUid = expectedDocDefUid;
            this.expectedStatus = expectedStatus;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            String status = Document.getStatusName(item);
            String docDefUid = Document.getDocDefUid(item);
            return expectedStatus.getName().equalsIgnoreCase(status) && matchesDocDefUid(docDefUid);
        }

        private boolean matchesDocDefUid(String docDefUid) {
            if (expectedDocDefUid.equalsIgnoreCase(docDefUid)) return true;
            if (documentDefinitionsByUid != null) {
                DocumentDefinition docDef = documentDefinitionsByUid.get(docDefUid);
                DocumentDefinition parentDocDef = getParent(docDef);
                while (parentDocDef != null) {
                    if (expectedDocDefUid.equalsIgnoreCase(parentDocDef.getUid())) return true;

                    parentDocDef = getParent(parentDocDef);
                }
            }
            return false;
        }

        private DocumentDefinition getParent(DocumentDefinition docDef) {
            String parentDocDefUid = docDef.getParentUid();
            if (!StringUtils.hasText(parentDocDefUid)) return null;
            return documentDefinitionsByUid.get(parentDocDefUid);
        }

        @Override
        public String toString() {
            return "with(status=" + expectedStatus + ",docDefUid=" + expectedDocDefUid + ")";
        }
    }

    public static class DocumentStatusMatcher implements Matcher<Document> {

        private DocumentStatus expectedStatus;

        public DocumentStatusMatcher(DocumentStatus expectedStatus) {
            this.expectedStatus = expectedStatus;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            String status = Document.getStatusName(item);
            return expectedStatus.getName().equalsIgnoreCase(status);
        }

        @Override
        public String toString() {
            return "with(status=" + expectedStatus + ")";
        }
    }

    public static class DoesNotHaveUserClassMatcher implements Matcher<List<? extends HmpUserDetails>> {

        private String expectedUserClassName;

        public DoesNotHaveUserClassMatcher(String expectedUserClassName) {
            this.expectedUserClassName = expectedUserClassName;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            HmpUserDetails userDetails = ((List<HmpUserDetails>) item).get(0);
            return !userDetails.hasVistaUserClass(expectedUserClassName);
        }

        @Override
        public String toString() {
            return "doesNotHaveUserClass(" + expectedUserClassName.toString() + ")";
        }
    }

    public static class HasUserClassMatcher implements Matcher<List<? extends HmpUserDetails>> {
        private String expectedUserClassName;

        public HasUserClassMatcher(String expectedUserClassName) {
            this.expectedUserClassName = expectedUserClassName;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            HmpUserDetails userDetails = ((List<HmpUserDetails>) item).get(0);
            return userDetails.hasVistaUserClass(expectedUserClassName);
        }


        @Override
        public String toString() {
            return "hasUserClass(" + expectedUserClassName.toString() + ")";
        }
    }
}
