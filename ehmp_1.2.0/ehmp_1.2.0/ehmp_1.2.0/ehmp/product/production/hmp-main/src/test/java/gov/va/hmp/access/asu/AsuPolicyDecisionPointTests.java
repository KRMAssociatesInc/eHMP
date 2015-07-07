package gov.va.hmp.access.asu;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentClinician;
import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AsuPolicyDecisionPointTests {

    public static final String MOCK_VISTA_ID = "F484";
    private AsuPolicyDecisionPoint pdp;
    private IGenericPOMObjectDAO mockJdsDao;
    private HmpUserDetails mockUser;
    private List<DocumentDefinition> mockDocumentDefinitions;

    @Before
    public void setUp() throws Exception {
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        mockUser = mock(HmpUserDetails.class);

        pdp = new AsuPolicyDecisionPoint();
        pdp.setDao(mockJdsDao);

        mockDocumentDefinitions = loadMockDocumentDefinitions();
        when(mockJdsDao.findAll(DocumentDefinition.class)).thenReturn(mockDocumentDefinitions);

        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid(MOCK_VISTA_ID, "5555"));
        when(mockUser.hasVistaUserClass("USER")).thenReturn(true);
    }

    @Test
    public void testRefresh() throws Exception {
        pdp.refresh();

        verify(mockJdsDao).findAll(DocumentDefinition.class);
        verify(mockJdsDao).findAll(AsuRuleDef.class);
    }

    @Test
    public void testViewProgressNote() {
        List<AsuRuleDef> mockProgressNoteRules = loadMockProgressNoteRules();

        when(mockJdsDao.findAll(AsuRuleDef.class)).thenReturn(mockProgressNoteRules);

        pdp.refresh();

        Document mockDocument = createMockOphthalmologyNoteDocument();

        AsuDecisionRequest request = new DocumentAsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        AuthorizationDecision decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.PERMIT));
    }

    @Test
    public void testViewProgressNoteSolr() {
        List<AsuRuleDef> mockProgressNoteRules = loadMockProgressNoteRules();

        when(mockJdsDao.findAll(AsuRuleDef.class)).thenReturn(mockProgressNoteRules);

        pdp.refresh();

        Map<String, Object> mockDocument = createMockOphthalmologyNoteDocumentSolr();

        AsuDecisionRequest request = new DocumentAsMapAsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        AuthorizationDecision decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.PERMIT));
    }

    @Test
    public void testViewEmployeeHealthNote() {
        List<AsuRuleDef> mockEmployeeHealthRules = loadMockEmployeeHealthRules();

        when(mockJdsDao.findAll(AsuRuleDef.class)).thenReturn(mockEmployeeHealthRules);

        pdp.refresh();

        Document mockDocument = createMockEmployeeHealthDocument();

        AsuDecisionRequest request = new DocumentAsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        AuthorizationDecision decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.DENY));

        when(mockUser.hasVistaUserClass("CHIEF, MIS")).thenReturn(true);

        decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.PERMIT));
    }

    @Test
    public void testViewUnsignedAllergy() {
        List<AsuRuleDef> mockAllergyRules = loadMockAllergyRules();

        when(mockJdsDao.findAll(AsuRuleDef.class)).thenReturn(mockAllergyRules);

        pdp.refresh();

        Document mockDocument = createMockAllergyDocument(UidUtils.getUserUid(MOCK_VISTA_ID, "5555"));

        AsuDecisionRequest request = new DocumentAsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);

        AuthorizationDecision decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.PERMIT));
    }

    @Test
    public void testViewRetractedSurgicalPathReport() {
        List<AsuRuleDef> mockSurgicalPathRules = loadMockSurgicalPathRules();

        when(mockJdsDao.findAll(AsuRuleDef.class)).thenReturn(mockSurgicalPathRules);

        pdp.refresh();

        Document mockDocument = createMockRetractedSurgicalPathologyReportDocument();

        AsuDecisionRequest request = new DocumentAsuDecisionRequest(mockUser, DocumentAction.VIEW, mockDocument);
        AuthorizationDecision decision = pdp.evaluate(request);
        assertThat(decision.getDecision(), is(Decision.DENY));
    }

    private Document createMockOphthalmologyNoteDocument() {
        Document mockDocument = new Document();
        mockDocument.setData("uid", UidUtils.getDocumentUid(MOCK_VISTA_ID, "217", "4099"));
        mockDocument.setData("pid", "10110");
        mockDocument.setData("documentDefUid", "urn:va:doc-def:F484:1635");
        mockDocument.setData("localTitle", "OPHTHALMOLOGY NOTE");
        mockDocument.setData("status", "COMPLETED");

        DocumentClinician author = new DocumentClinician();
        author.setData("uid", "urn:va:user:F484:983");
        author.setData("name", "PROVIDER,ONE");
        author.setData("role", "AU");
        /*
        name: "PROVIDER,ONE",
displayName: "Provider,One",
role: "AU"
         */
        mockDocument.setData("clinicians", Arrays.asList(author));
        return mockDocument;
    }

    private  Map<String, Object> createMockOphthalmologyNoteDocumentSolr() {
        Map<String, Object> mockDocument = new HashMap<>();
        mockDocument.put("uid", UidUtils.getDocumentUid(MOCK_VISTA_ID, "217", "4099"));
        mockDocument.put("pid", "10110");
        mockDocument.put("document_def_uid", "urn:va:doc-def:F484:1635");
        mockDocument.put("local_title", "OPHTHALMOLOGY NOTE");
        mockDocument.put("document_status", "COMPLETED");
        return mockDocument;
    }

    private Document createMockEmployeeHealthDocument() {
        Document mockDocument = new Document();
        mockDocument.setData("uid", UidUtils.getDocumentUid(MOCK_VISTA_ID, "217", "4583"));
        mockDocument.setData("pid", "10110");
        mockDocument.setData("documentDefUid", "urn:va:doc-def:F484:69");
        mockDocument.setData("localTitle", "EMPLOYEE HEALTH NOTE");
        mockDocument.setData("status", "COMPLETED");
        return mockDocument;
    }

    private Document createMockAllergyDocument(String authorUid) {
        Document mockDocument = new Document();
        mockDocument.setData("uid", UidUtils.getDocumentUid(MOCK_VISTA_ID, "8", "4587"));
        mockDocument.setData("pid", "10109");
        mockDocument.setData("documentDefUid", "urn:va:doc-def:F484:17");
        mockDocument.setData("localTitle", "Adverse React/Allergy");
        mockDocument.setData("status", "UNSIGNED");
        mockDocument.setData("authorUid", authorUid);
        return mockDocument;
    }

    private Document createMockRetractedSurgicalPathologyReportDocument() {
        Document mockDocument = new Document();
        mockDocument.setData("uid", UidUtils.getDocumentUid(MOCK_VISTA_ID, "100846", "4271"));
        mockDocument.setData("pid", "5000000345");
        mockDocument.setData("documentDefUid", "urn:va:doc-def:F484:1648");
        mockDocument.setData("localTitle", "LR SURGICAL PATHOLOGY REPORT");
        mockDocument.setData("status", "RETRACTED");
        return mockDocument;
    }

    private List<DocumentDefinition> loadMockDocumentDefinitions() {
        return loadMocksFromJsonC(DocumentDefinition.class, "document-definitions.json");
    }

    private List<AsuRuleDef> loadMockProgressNoteRules() {
        return loadMocksFromJsonC(AsuRuleDef.class, "asu-rules-notes.json");
    }

    private List<AsuRuleDef> loadMockEmployeeHealthRules() {
        return loadMocksFromJsonC(AsuRuleDef.class, "asu-rules-employee-health.json");
    }

    private List<AsuRuleDef> loadMockAllergyRules() {
        return loadMocksFromJsonC(AsuRuleDef.class, "asu-rules-allergies.json");
    }

    private List<AsuRuleDef> loadMockSurgicalPathRules() {
        return loadMocksFromJsonC(AsuRuleDef.class, "asu-rules-surgical-path.json");
    }

    private <T extends IPOMObject> List<T> loadMocksFromJsonC(Class<T> clazz, String resourceName) {
        JsonNode jsonc = POMUtils.parseJSONtoNode(getClass().getResourceAsStream(resourceName));
        JsonNode itemsNode = jsonc.path("data").path("items");
        List<T> docDefs = new ArrayList<>();
        for (JsonNode itemNode : itemsNode) {
            docDefs.add(POMUtils.newInstance(clazz, itemNode));
        }
        return docDefs;
    }
}
