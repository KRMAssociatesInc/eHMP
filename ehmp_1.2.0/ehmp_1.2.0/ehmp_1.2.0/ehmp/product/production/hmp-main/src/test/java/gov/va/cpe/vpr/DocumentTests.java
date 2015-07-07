package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVNotesMap;
import gov.va.hmp.util.NullChecker;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class DocumentTests {

    private static final String LOINC_DISPLAY_TEXT_GENERATED = "Study Report (Diagnostic Imaging) Document";
    private static final String LOINC_CODE_GENERATED = "18748-4";
    private static final String SYSTEM_DOD_NCID = "DOD_NCID";
    private static final String DOD_DISPLAY_TEXT_GENERATED = "Diagnostic Imaging Document";
    private static final String DOD_NCID_GENERATED = "15148751";

    private Document d = new Document();

    private Document testSubject = null;
    private JLVHddDao mockHDDDao = null;

    @Before
    public void setUp() {
        // Set up for testing getCodes
        //----------------------------
        mockHDDDao = mock(JLVHddDao.class);
        testSubject = new Document();
        testSubject.setJLVHddDao(mockHDDDao);
    }

    @Test
    public void testConstruct() throws Exception {
        assertThat(d.getAuthor(), nullValue());
        assertThat(d.getCosigner(), nullValue());
        assertThat(d.getAttending(), nullValue());
    }

    @Test
    public void testGetAuthor() throws Exception {
        d = createDocumentWithClinician("FOO", DocumentClinician.Role.AUTHOR_DICTATOR);
        assertThat(d.getAuthor(), is("FOO"));
        assertThat(d.getAuthorDisplayName(), is("Foo"));
    }

    @Test
    public void testGetCosigner() throws Exception {
        d = createDocumentWithClinician("BAR", DocumentClinician.Role.COSIGNER);
        assertThat(d.getCosigner(), is("BAR"));
        assertThat(d.getCosignerDisplayName(), is("Bar"));
    }

    @Test
    public void testGetAttending() throws Exception {
        d = createDocumentWithClinician("BAZ", DocumentClinician.Role.ATTENDING_PHYSICIAN);
        assertThat(d.getAttending(), is("BAZ"));
        assertThat(d.getAttendingDisplayName(), is("Baz"));
    }

    @Test
    public void testIsTIUDocument() throws Exception {
        assertThat(Document.isTIU("urn:va:document:ABCD:229:456"), is(true));
        d.setData("uid", "urn:va:document:ABCD:229:456");
        assertThat(Document.isTIU(d), is(true));
        assertThat(Document.isTIU(POMUtils.convertObjectToMap(d)), is(true));

        assertThat(Document.isTIU("urn:va:document:ABCD:229:456;789"), is(false));
        d.setData("uid", "urn:va:document:ABCD:229:456;789");
        assertThat(Document.isTIU(d), is(false));
        assertThat(Document.isTIU(POMUtils.convertObjectToMap(d)), is(false));

        assertThat(Document.isTIU("urn:va:foo:ABCD:229:456"), is(false));
        d.setData("uid", "urn:va:foo:ABCD:229:456");
        assertThat(Document.isTIU(d), is(false));
        assertThat(Document.isTIU(POMUtils.convertObjectToMap(d)), is(false));
    }

    @Test
    public void testGetStatusNameWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("status", "completed");

        assertThat(Document.getStatusName(document), is("completed"));
        assertThat(Document.getStatusName(POMUtils.convertObjectToMap(document)), is("completed"));
    }

    @Test
    public void testGetStatusNameWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_DOCUMENT_STATUS_FIELD, Arrays.asList("retracted"));

        assertThat(Document.getStatusName(document), is("retracted"));
    }

    @Test
    public void testGetDocDefUidWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("documentDefUid", "urn:va:doc-def:ABCD:34");

        assertThat(Document.getDocDefUid(document), is("urn:va:doc-def:ABCD:34"));
        assertThat(Document.getDocDefUid(POMUtils.convertObjectToMap(document)), is("urn:va:doc-def:ABCD:34"));
    }

    @Test
    public void testGetDocDefUidWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_DOC_DEF_UID_FIELD, Arrays.asList("urn:va:doc-def:ABCD:34"));

        assertThat(Document.getDocDefUid(document), is("urn:va:doc-def:ABCD:34"));
    }

    @Test
    public void testGetLocalTitleWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("localTitle", "Foo Bar Baz");

        assertThat(Document.getLocalTitle(document), is("Foo Bar Baz"));
        assertThat(Document.getLocalTitle(POMUtils.convertObjectToMap(document)), is("Foo Bar Baz"));
    }

    @Test
    public void testGetLocalTitleWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_LOCAL_TITLE_FIELD, Arrays.asList("Foo Bar Baz"));

        assertThat(Document.getLocalTitle(document), is("Foo Bar Baz"));
    }

    @Test
    public void testGetAuthorUidWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("authorUid", UidUtils.getUserUid("ABCD", "23"));

        assertThat(Document.getAuthorUid(document), is(UidUtils.getUserUid("ABCD", "23")));
        assertThat(Document.getAuthorUid(POMUtils.convertObjectToMap(document)), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetAuthorUidWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_AUTHOR_UID_FIELD, Arrays.asList(UidUtils.getUserUid("ABCD", "23")));

        assertThat(Document.getAuthorUid(document), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetSignerUidWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("signerUid", UidUtils.getUserUid("ABCD", "23"));

        assertThat(Document.getSignerUid(document), is(UidUtils.getUserUid("ABCD", "23")));
        assertThat(Document.getSignerUid(POMUtils.convertObjectToMap(document)), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetSignerUidWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_SIGNER_UID_FIELD, Arrays.asList(UidUtils.getUserUid("ABCD", "23")));

        assertThat(Document.getSignerUid(document), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetCosignerUidWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("cosignerUid", UidUtils.getUserUid("ABCD", "23"));

        assertThat(Document.getCosignerUid(document), is(UidUtils.getUserUid("ABCD", "23")));
        assertThat(Document.getCosignerUid(POMUtils.convertObjectToMap(document)), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetCosignerUidWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_COSIGNER_UID_FIELD, Arrays.asList(UidUtils.getUserUid("ABCD", "23")));

        assertThat(Document.getCosignerUid(document), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetAttendingUidWithDocumentInstance() throws Exception {
        Document document = new Document();
        document.setData("attendingUid", UidUtils.getUserUid("ABCD", "23"));

        assertThat(Document.getAttendingUid(document), is(UidUtils.getUserUid("ABCD", "23")));
        assertThat(Document.getAttendingUid(POMUtils.convertObjectToMap(document)), is(UidUtils.getUserUid("ABCD", "23")));
    }

    @Test
    public void testGetAttendingUidWithSolrSearchResult() throws Exception {
        Map<String, Object> document = new HashMap<>();
        document.put(Document.SOLR_ATTENDING_UID_FIELD, Arrays.asList(UidUtils.getUserUid("ABCD", "23")));

        assertThat(Document.getAttendingUid(document), is(UidUtils.getUserUid("ABCD", "23")));
    }

    public static Document createDocumentWithClinician(String clinicianName, DocumentClinician.Role clinicianRole) {
    	String uid = "urn:va:F484:fee:;fi:fo:fum";
        DocumentText text = DocumentTextTests.createDocumentTextWithClinician(uid, clinicianName, clinicianRole);
    	Document doc = new Document();
    	doc.setData("uid",uid);
        doc.setData("text", Collections.singletonList(text));
        return doc;
    }

    private DocumentText createDocumentTextWithClinician(String docUid, String clinicianName, String clinicianRole) {
        Map vals = new HashMap();
        vals.put("name",clinicianName);
        vals.put("role",clinicianRole);
        DocumentText dtxt = new DocumentText(Collections.<String, Object>singletonMap("clinicians",Collections.singletonList(vals)));
        dtxt.setData("uid",docUid);
        return dtxt;
    }

    //-----------------------------------------------------------------------------------------------
    // The following tests were created to test the getCodes method.
    //-----------------------------------------------------------------------------------------------

    /**
     * This method creates the LOINC Code.
     *
     * @return This returns the LOINC code that was created.
     */
    private JdsCode createLoincCode() {
        JdsCode oCode = new JdsCode();
        oCode.setSystem(JLVNotesMap.CODE_SYSTEM_LOINC);
        oCode.setCode(LOINC_CODE_GENERATED);
        oCode.setDisplay(LOINC_DISPLAY_TEXT_GENERATED);
        return oCode;
    }

    /**
     * This method creates the DoD NCID Code.
     *
     * @return This returns the DoD NCID code that was created.
     */
    private JdsCode createDodNcidCode() {
        JdsCode oCode = new JdsCode();
        oCode.setSystem(SYSTEM_DOD_NCID);
        oCode.setCode(DOD_NCID_GENERATED);
        oCode.setDisplay(DOD_DISPLAY_TEXT_GENERATED);
        return oCode;
    }

    /**
     * This method creates the LOINC Code.
     *
     * @return This returns the LOINC code that was created.
     */
    private JLVMappedCode createMappedLoincCode() {
        JLVMappedCode oCode = new JLVMappedCode();
        oCode.setCodeSystem(JLVNotesMap.CODE_SYSTEM_LOINC);
        oCode.setCode(LOINC_CODE_GENERATED);
        oCode.setDisplayText(LOINC_DISPLAY_TEXT_GENERATED);
        return oCode;
    }

    /**
     * This method verifies that the code array existed and was the correct size.
     *
     * @param oaCode The array to verified.
     * @param iSize The size the array should be.
     */
    private void verifyCodeArray(List<JdsCode> oaCode, int iSize) {
        assertNotNull("The returned set should not have been null.", oaCode);
        assertEquals("The codes array size was not correct.", iSize, oaCode.size());
    }

    /**
     * Verifies that the LOINC code is correct.
     *
     * @param oCode The LOINC Code information.
     */
    private void verifyLoincCode(JdsCode oCode) {
        assertEquals("The code system was incorrect.", JLVNotesMap.CODE_SYSTEM_LOINC, oCode.getSystem());
        assertEquals("The code was incorrect.", LOINC_CODE_GENERATED, oCode.getCode());
        assertEquals("The display was incorrect.", LOINC_DISPLAY_TEXT_GENERATED, oCode.getDisplay());
    }

    /**
     * Test case where the LOINC code is already in the codes array.
     */
    @Test
    public void testGetCodesAlreadyContainsLoincCode () {
        try {
            List<JdsCode> oaCode = new ArrayList<JdsCode>();
            JdsCode oCode = createLoincCode();
            oaCode.add(oCode);
            testSubject.setCodes(oaCode);

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            verifyCodeArray(oaReturnedCodes, 1);
            verifyLoincCode(oaReturnedCodes.get(0));
            verify(mockHDDDao, times(0)).getMappedCode(any(JLVHddDao.MappingType.class), any(String.class));
        }
        catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }

    /**
     * Test VA Vitals Result case where the LOINC code is not in the codes array - but it contains a vuid that can be used to look it up.
     */
    @Test
    public void testVANotesGetCodesLoincNotInCodesButContainsVuid() {
        try {

            when(mockHDDDao.getMappedCodeList(eq(JLVHddDao.MappingType.NotesVuidToLoinc), any(String.class))).thenReturn(Arrays.asList(createMappedLoincCode()));

            testSubject.setData("uid", "urn:va:document:B362:3:100");
            testSubject.setData("documentDefUidVuid", "urn:va:vuid:411111");

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            verifyCodeArray(oaReturnedCodes, 1);
            verifyLoincCode(oaReturnedCodes.get(0));
            verify(mockHDDDao, times(1)).getMappedCodeList(eq(JLVHddDao.MappingType.NotesVuidToLoinc), any(String.class));
        }
        catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }

    /**
     * Test VA Vitals Result case where the VA result contains no VUID.
     */
    @Test
    public void testVANotesGetCodesNoVuid() {
        try {
            when(mockHDDDao.getMappedCodeList(eq(JLVHddDao.MappingType.NotesVuidToLoinc), eq(""))).thenReturn(null);
            when(mockHDDDao.getMappedCodeList(eq(JLVHddDao.MappingType.NotesVuidToLoinc), eq((String) null))).thenReturn(null);

            testSubject.setData("uid", "urn:va:document:B362:3:100");

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            assertTrue("This should not have contained any codes.", NullChecker.isNullish(oaReturnedCodes));
            verify(mockHDDDao, times(0)).getMappedCodeList(eq(JLVHddDao.MappingType.NotesVuidToLoinc), any(String.class));
        }
        catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }

    /**
     * Test DoD Result case where the LOINC code is not in the codes array
     */
    @Test
    public void testDoDNotesGetCodesLoincNotInCodes () {
        try {
            when(mockHDDDao.getMappedCode(eq(JLVHddDao.MappingType.NotesDodNcidToLoinc), any(String.class))).thenReturn(createMappedLoincCode());

            testSubject.setData("uid", "urn:va:document:DOD:100:100");

            List<JdsCode> oaCode = new ArrayList<JdsCode>();
            JdsCode oCode = createDodNcidCode();
            oaCode.add(oCode);
            testSubject.setCodes(oaCode);

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            verifyCodeArray(oaReturnedCodes, 2);
            for (JdsCode oReturnedCode : oaReturnedCodes) {
                if (oReturnedCode.getSystem().equals(JLVNotesMap.CODE_SYSTEM_LOINC)) {
                    verifyLoincCode(oReturnedCode);
                }
            }
            verify(mockHDDDao, times(1)).getMappedCode(eq(JLVHddDao.MappingType.NotesDodNcidToLoinc), any(String.class));
        }
        catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }
}

