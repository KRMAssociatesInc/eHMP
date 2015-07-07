package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import gov.va.hmp.access.Effect;
import gov.va.hmp.access.Status;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AsuRuleTests {

    private Map<String, DocumentDefinition> docDefsByUid = new HashMap<>();

    @Before
    public void setUp() throws Exception {
        DocumentDefinition docDef = new DocumentDefinition();
        docDef.setData("uid", "urn:va:doc-def:F484:3");
        docDef.setData("name", "PROGRESS NOTES");

        DocumentDefinition docDef2 = new DocumentDefinition();
        docDef.setData("uid", "urn:va:doc-def:F484:22");
        docDef.setData("name", "PROGRESS NOTES");

        docDefsByUid.put("urn:va:doc-def:F484:3", docDef);
        docDefsByUid.put("urn:va:doc-def:F484:22", docDef2);
    }

    @Test
    public void testCreatePermitRuleFromUserClassBasedAsuRuleForAllUsers() throws Exception {
        AsuRuleDef asuRuleDef = new AsuRuleDef();
        asuRuleDef.setData("uid", "urn:va:asu-rule:F484:17");
        asuRuleDef.setData("actionName", "VIEW");
        asuRuleDef.setData("statusName", "COMPLETED");
        asuRuleDef.setData("docDefName", "PROGRESS NOTES");
        asuRuleDef.setData("docDefUid", "urn:va:doc-def:F484:3");
        asuRuleDef.setData("userClassName", "USER");
        asuRuleDef.setData("userClassUid", "urn:va:asu-class:F484:561");
        asuRuleDef.setData("description", "A progress note with a status of Completed may be viewed by all users of the system.");
        asuRuleDef.setData("isAnd", false);
        asuRuleDef.setData("localId", 17);

        List<AsuRule> rules = AsuRule.create(docDefsByUid, asuRuleDef);
        assertThat(rules.size(), is(1));

        AsuRule rule = rules.get(0);
        assertThat(rule.getUid(), is(asuRuleDef.getUid()));
        assertThat(rule.getAction(), is(DocumentAction.forName(asuRuleDef.getActionName())));
        assertThat(rule.getStatus(), is(DocumentStatus.forName(asuRuleDef.getStatusName())));
        assertThat(rule.getDocumentDefinition(), is(sameInstance(docDefsByUid.get("urn:va:doc-def:F484:3"))));
        assertThat(rule.getCondition(), is(instanceOf(AsuUserClassAndOrRoleCondition.class)));
        assertThat(rule.getUserClassName(), is(asuRuleDef.getUserClassName()));
        assertThat(rule.getUserRole(), is(nullValue()));
        assertThat(rule.getEffect(), is(Effect.PERMIT));
        assertThat(rule.getDescription(), is(asuRuleDef.getDescription()));
    }

    @Test
    public void testCreatePermitAndDenyRulesFromUserClassBasedAsuRule() throws Exception {
        AsuRuleDef asuRuleDef = new AsuRuleDef();
        asuRuleDef.setData("uid", "urn:va:asu-rule:F484:119");
        asuRuleDef.setData("actionName", "VIEW");
        asuRuleDef.setData("statusName", "UNSIGNED");
        asuRuleDef.setData("docDefName", "PROGRESS NOTES");
        asuRuleDef.setData("docDefUid", "urn:va:doc-def:F484:3");
        asuRuleDef.setData("userClassName", "CHIEF, MIS");
        asuRuleDef.setData("userClassUid", "urn:va:asu-class:F484:48");
        asuRuleDef.setData("description", "Progress notes with a status of Unsigned may be viewed by individuals who are members of Chief,MIS User Class.");
        asuRuleDef.setData("isAnd", false);
        asuRuleDef.setData("localId", 119);

        List<AsuRule> rules = AsuRule.create(docDefsByUid, asuRuleDef);
        assertThat(rules.size(), is(2));

        AsuRule permitRule = rules.get(0);
        assertThat(permitRule.getUid(), is(asuRuleDef.getUid()));
        assertThat(permitRule.getAction(), is(DocumentAction.forName(asuRuleDef.getActionName())));
        assertThat(permitRule.getStatus(), is(DocumentStatus.forName(asuRuleDef.getStatusName())));
        assertThat(permitRule.getDocumentDefinition(), is(sameInstance(docDefsByUid.get("urn:va:doc-def:F484:3"))));
        assertThat(permitRule.getCondition(), is(instanceOf(AsuUserClassAndOrRoleCondition.class)));
        assertThat(permitRule.getUserClassName(), is(asuRuleDef.getUserClassName()));
        assertThat(permitRule.getUserRole(), is(nullValue()));
        assertThat(permitRule.getEffect(), is(Effect.PERMIT));
        assertThat(permitRule.getDescription(), is(asuRuleDef.getDescription()));

        AsuRule denyRule = rules.get(1);
        assertThat(denyRule.getUid(), is(asuRuleDef.getUid()));
        assertThat(denyRule.getAction(), is(DocumentAction.forName(asuRuleDef.getActionName())));
        assertThat(denyRule.getStatus(), is(DocumentStatus.forName(asuRuleDef.getStatusName())));
        assertThat(denyRule.getDocumentDefinition(), is(sameInstance(docDefsByUid.get("urn:va:doc-def:F484:3"))));
        assertThat(denyRule.getCondition(), is(nullValue()));
        assertThat(denyRule.getUserClassName(), is(asuRuleDef.getUserClassName()));
        assertThat(denyRule.getUserRole(), is(nullValue()));
        assertThat(denyRule.getEffect(), is(Effect.DENY));
//        assertThat(denyRule.getDescription(), is(asuRuleDef.getDescription()));
    }

    @Test
    public void testCreatePermitRuleFromUserRoleBasedAsuRule() throws Exception {
        AsuRuleDef asuRuleDef = new AsuRuleDef();
        asuRuleDef.setData("uid", "urn:va:asu-rule:F484:109");
        asuRuleDef.setData("actionName", "EDIT RECORD");
        asuRuleDef.setData("statusName", "UNCOSIGNED");
        asuRuleDef.setData("docDefName", "PROGRESS NOTES");
        asuRuleDef.setData("docDefUid", "urn:va:doc-def:F484:3");
        asuRuleDef.setData("userRoleName", "EXPECTED COSIGNER");
        asuRuleDef.setData("description", "A progress note with the status of Uncosigned may be edited by the individual designated as the expected cosigner of the note.");
        asuRuleDef.setData("isAnd", false);
        asuRuleDef.setData("localId", 109);

        List<AsuRule> rules = AsuRule.create(docDefsByUid, asuRuleDef);
        assertThat(rules.size(), is(1));

        AsuRule rule = rules.get(0);
        assertThat(rule.getUid(), is(asuRuleDef.getUid()));
        assertThat(rule.getAction(), is(DocumentAction.forName(asuRuleDef.getActionName())));
        assertThat(rule.getStatus(), is(DocumentStatus.forName(asuRuleDef.getStatusName())));
        assertThat(rule.getDocumentDefinition(), is(sameInstance(docDefsByUid.get("urn:va:doc-def:F484:3"))));
        assertThat(rule.getCondition(), is(instanceOf(AsuUserClassAndOrRoleCondition.class)));
        assertThat(rule.getUserClassName(), is(nullValue()));
        assertThat(rule.getUserRole(), is(AsuRole.EXPECTED_COSIGNER));
        assertThat(rule.getEffect(), is(Effect.PERMIT));
        assertThat(rule.getDescription(), is(asuRuleDef.getDescription()));
    }

    @Test
    public void testDenyStatusMessage() throws Exception {
        AsuRuleDef asuRuleDef = new AsuRuleDef();
        asuRuleDef.setData("uid", "urn:va:asu-rule:F484:119");
        asuRuleDef.setData("actionName", "VIEW");
        asuRuleDef.setData("statusName", "UNSIGNED");
        asuRuleDef.setData("docDefName", "PROGRESS NOTES");
        asuRuleDef.setData("docDefUid", "urn:va:doc-def:F484:3");
        asuRuleDef.setData("userClassName", "CHIEF, MIS");
        asuRuleDef.setData("userClassUid", "urn:va:asu-class:F484:48");
        asuRuleDef.setData("description", "Progress notes with a status of Unsigned may be viewed by individuals who are members of Chief,MIS User Class.");
        asuRuleDef.setData("isAnd", false);
        asuRuleDef.setData("localId", 119);

        List<AsuRule> rules = AsuRule.create(docDefsByUid, asuRuleDef);
        AsuRule denyRule = rules.get(1);

        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUser.hasVistaUserClass("USER")).thenReturn(true);
        when(mockUser.hasVistaUserClass("CHIEF, MIS")).thenReturn(false);

        AsuDecisionRequest request = new DocumentAsuDecisionRequest(mockUser, DocumentAction.VIEW, createMockUnsignedDocument());
        AuthorizationDecision decision = denyRule.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.DENY));
        assertThat(decision.getStatus().getCode(), is(Status.Code.OK));
        assertThat(decision.getStatus().getMessage(), is("You may not VIEW this UNSIGNED PRIMARY CARE GENERAL NOTE."));
    }

    private Document createMockUnsignedDocument() {
        Document mockDocument = new Document();
        mockDocument.setData("uid", UidUtils.getDocumentUid("F484", "100846", "4271"));
        mockDocument.setData("pid", "5000000345");
        mockDocument.setData("documentDefUid", "urn:va:doc-def:F484:22");
        mockDocument.setData("status", "UNSIGNED");
        mockDocument.setData("localTitle", "PRIMARY CARE GENERAL NOTE");
        return mockDocument;
    }
}
