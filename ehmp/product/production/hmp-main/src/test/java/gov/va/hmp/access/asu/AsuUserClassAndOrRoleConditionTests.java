package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentClinician;
import gov.va.cpe.vpr.DocumentText;
import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.ICondition;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AsuUserClassAndOrRoleConditionTests {

    private HmpUserDetails mockUser;
    private Document mockDocument;

    @Before
    public void setUp() throws Exception {
        mockUser = mock(HmpUserDetails.class);
        String userUid = UidUtils.getUserUid("ABCD", "23");
        when(mockUser.getUid()).thenReturn(userUid);

        Map<String,Object> clinicianValues = new HashMap<>();
        clinicianValues.put("uid", userUid);
        clinicianValues.put("role", DocumentClinician.Role.COSIGNER);

        String documentUid = UidUtils.getDocumentUid("ABCD", "229", "1234");
        Map<String,Object> textValues = new HashMap<>();
        textValues.put("uid", documentUid);
        textValues.put("clinicians", Collections.singletonList(new DocumentClinician(clinicianValues)));

        Map<String,Object> docValues = new HashMap<>();
        docValues.put("uid", documentUid);
        docValues.put("text", Collections.singletonList(new DocumentText(textValues)));
        mockDocument = new Document(docValues);
    }

    @Test
    public void testConditionTrueForOnlyAnExpectedUserClassThatUserHas() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.hasVistaUserClass("CLINICAL SERVICE CHIEF")).thenReturn(true);

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition("CLINICAL SERVICE CHIEF", null);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.TRUE));
    }

    @Test
    public void testConditionFalseForOnlyAnExpectedUserClassThatUserDoesNotHave() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.hasVistaUserClass("CLINICAL SERVICE CHIEF")).thenReturn(false);

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition("CLINICAL SERVICE CHIEF", null);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.FALSE));
    }

    @Test
    public void testConditionTrueForOnlyAnExpectedUserRoleThatUserIs() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "23"));

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition(null, AsuRole.EXPECTED_COSIGNER);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.TRUE));
    }

    @Test
    public void testConditionFalseForOnlyAnExpectedUserRoleThatUserIsNot() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "23"));

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition(null, AsuRole.ATTENDING_PHYSICIAN);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.FALSE));
    }

    @Test
    public void testConditionTrueForBothAnExpectedUserClassAndUserRoleWithAndFlagSet() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.hasVistaUserClass("CLINICAL SERVICE CHIEF")).thenReturn(true);

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition("CLINICAL SERVICE CHIEF", AsuRole.EXPECTED_COSIGNER, true);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.TRUE));
    }

    @Test
    public void testConditionFalseForBothAnExpectedUserClassAndUserRoleWithAndFlagSet() throws Exception {
        AsuDecisionRequest mockDecisionRequest = new AsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        when(mockUser.hasVistaUserClass("CLINICAL SERVICE CHIEF")).thenReturn(true);

        AsuUserClassAndOrRoleCondition condition = new AsuUserClassAndOrRoleCondition("CLINICAL SERVICE CHIEF", AsuRole.ATTENDING_PHYSICIAN, true);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.FALSE));

        condition = new AsuUserClassAndOrRoleCondition("CHIEF, MIS", AsuRole.EXPECTED_COSIGNER, true);
        assertThat(condition.evaluate(mockDecisionRequest), is(ICondition.ConditionValue.FALSE));
    }
}
