package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.MatchResult;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

public class AsuTargetTests {

    private HmpUserDetails mockUser;

    @Before
    public void setUp() throws Exception {
         mockUser = mock(HmpUserDetails.class);
    }

    @Test
    public void testConstruct() throws Exception {
        AsuTarget target = new AsuTarget(null, DocumentAction.VIEW, DocumentStatus.UNSIGNED, createMockDocDef("urn:va:doc-def:ABCD:34", "NM CARDIAC STRESS TEST REPORT"), null, false);
        assertThat(target.getAction(), is(sameInstance(DocumentAction.VIEW)));
        assertThat(target.getStatus(), is(DocumentStatus.UNSIGNED));
        assertThat(target.getDocumentDefinitionUid(), is("urn:va:doc-def:ABCD:34"));
    }

    @Test
    public void testEvaluateWithDocumentInstance() throws Exception {
        AsuTarget target = new AsuTarget(null, DocumentAction.VIEW, DocumentStatus.UNSIGNED, createMockDocDef("urn:va:doc-def:ABCD:34", "NM CARDIAC STRESS TEST REPORT"), null, false);

        Document document = new Document();
        document.setData("status", "completed");
        document.setData("documentDefUid", "urn:va:doc-def:ABCD:12");

        MatchResult matchResult = target.evaluate(createMockDecisionRequestWithDocumentInstance(DocumentAction.VIEW, document));
        assertThat(matchResult.getValue(), is(MatchResult.Value.NO_MATCH));

        document.setData("status", "unsigned");
        document.setData("documentDefUid", "urn:va:doc-def:ABCD:34");
        assertThat(target.evaluate(createMockDecisionRequestWithDocumentInstance(DocumentAction.VIEW, document)).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testEvaluateWithSolrSearchResult() throws Exception {
        AsuTarget target = new AsuTarget(null, DocumentAction.VIEW, DocumentStatus.UNSIGNED, createMockDocDef("urn:va:doc-def:ABCD:34", "NM CARDIAC STRESS TEST REPORT"), null, false);

        Map<String, Object> document = new HashMap<>();
        document.put("document_status", "completed");
        document.put("document_def_uid", "urn:va:doc-def:ABCD:12");
        assertThat(target.evaluate(createMockDecisionRequestWithSolrSearchResult(DocumentAction.VIEW, document)).getValue(), is(MatchResult.Value.NO_MATCH));

        document.put("document_status", "unsigned");
        document.put("document_def_uid", "urn:va:doc-def:ABCD:34");
        assertThat(target.evaluate(createMockDecisionRequestWithSolrSearchResult(DocumentAction.VIEW, document)).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testMissingAttributesProducesIndeterminate() throws Exception {
        AsuTarget target = new AsuTarget(null, DocumentAction.VIEW, DocumentStatus.UNSIGNED, createMockDocDef("urn:va:doc-def:ABCD:34", "NM CARDIAC STRESS TEST REPORT"), null, false);

        Document document = new Document();
        assertThat(target.evaluate(createMockDecisionRequestWithDocumentInstance(DocumentAction.VIEW, document)).getValue(), is(MatchResult.Value.INDETERMINATE));
    }

    @Test
    public void testDocumentDefinitionHierarchyMatch() {
        DocumentDefinition docDef = new DocumentDefinition();
        docDef.setData("uid", "urn:va:doc-def:ABCD:12");
        docDef.setData("parentUid", "urn:va:doc-def:ABCD:34");

        DocumentDefinition parentDocDef = new DocumentDefinition();
        parentDocDef.setData("uid", "urn:va:doc-def:ABCD:34");

        Map<String, DocumentDefinition> docDefsByUid = new HashMap<>();
        docDefsByUid.put(docDef.getUid(), docDef);
        docDefsByUid.put(parentDocDef.getUid(), parentDocDef);

        Document document = new Document();
        document.setData("status", "unsigned");
        document.setData("documentDefUid", "urn:va:doc-def:ABCD:12");

        AsuTarget target = new AsuTarget(docDefsByUid, DocumentAction.VIEW, DocumentStatus.UNSIGNED, createMockDocDef("urn:va:doc-def:ABCD:34", "NM CARDIAC STRESS TEST REPORT"), null, false);
        MatchResult matchResult = target.evaluate(createMockDecisionRequestWithDocumentInstance(DocumentAction.VIEW, document));
        assertThat(matchResult.getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void createMockOphthalmologyNoteMatch() {
        DocumentDefinition docDef = new DocumentDefinition();
        docDef.setData("uid", "urn:va:doc-def:ABCD:1635");
        docDef.setData("parentUid", "urn:va:doc-def:ABCD:1256");

        DocumentDefinition parentDocDef = new DocumentDefinition();
        parentDocDef.setData("uid", "urn:va:doc-def:ABCD:1256");
        parentDocDef.setData("parentUid", "urn:va:doc-def:ABCD:3");

        DocumentDefinition grandparentDocDef = new DocumentDefinition();
        grandparentDocDef.setData("uid", "urn:va:doc-def:ABCD:3");

        Map<String, DocumentDefinition> docDefsByUid = new HashMap<>();
        docDefsByUid.put(docDef.getUid(), docDef);
        docDefsByUid.put(parentDocDef.getUid(), parentDocDef);
        docDefsByUid.put(grandparentDocDef.getUid(), grandparentDocDef);

        AsuTarget target = new AsuTarget(docDefsByUid, DocumentAction.VIEW, DocumentStatus.COMPLETED, createMockDocDef("urn:va:doc-def:ABCD:3", "PROGRESS NOTES"), null, false);

        Map<String, Object> document = new HashMap<>();
        document.put("document_status", "completed");
        document.put("document_def_uid", "urn:va:doc-def:ABCD:1635");

        assertThat(target.evaluate(createMockDecisionRequestWithSolrSearchResult(DocumentAction.VIEW, document)).getValue(), is(MatchResult.Value.MATCH));
    }

    private DecisionRequest<HmpUserDetails, DocumentAction, Object> createMockDecisionRequestWithDocumentInstance(DocumentAction action, Document document) {
        return new DocumentAsuDecisionRequest(mockUser, action, document);
    }

    private DecisionRequest<HmpUserDetails, DocumentAction, Object> createMockDecisionRequestWithSolrSearchResult(DocumentAction action, Map<String,Object> solrFields) {
        return new DocumentAsMapAsuDecisionRequest(mockUser, action, solrFields);
    }
    
    private DocumentDefinition createMockDocDef(String uid, String name) {
        Map<String, Object> vals = new HashMap<>();
        vals.put("uid", uid);
        vals.put("displayName", name);
        return POMUtils.newInstance(DocumentDefinition.class, vals);
    }
}
