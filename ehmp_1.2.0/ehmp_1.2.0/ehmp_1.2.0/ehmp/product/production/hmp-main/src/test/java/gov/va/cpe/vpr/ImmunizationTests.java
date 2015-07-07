package gov.va.cpe.vpr;


import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVImmunizationsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.util.NullChecker;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class ImmunizationTests {

    private static final String CPT_CODE_SYSTEM = "CPT_CODE";
    private static final String CPT_CODE_DISPLAY_TEXT_GENERATED = "SomeText2";
    private static final String CPT_CODE_GENERATED = "urn:cpt:4321";
    private static final String CVX_CODE_DISPLAY_TEXT_GENERATED = "SomeText";
    private static final String CVX_CODE_GENERATED = "20";
    Immunization testSubject = null;
    JLVHddDao mockHDDDao = null;

    @Before
    public void setUp() throws Exception {
        mockHDDDao = mock(JLVHddDao.class);
        testSubject = new Immunization() {
            private static final long serialVersionUID = -4226027408358664542L;

            @Override
            protected JLVHddDao getHDDDao() throws TermLoadException {
                return mockHDDDao;
            }
        };
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
     * Verifies that the CVX code is correct.
     *
     * @param oCode The CVX Code information.
     */
    private void verifyCvxCode(JdsCode oCode) {
        assertEquals("The code system was incorrect.", JLVImmunizationsMap.CODE_SYSTEM_CVX, oCode.getSystem());
        assertEquals("The code was incorrect.", CVX_CODE_GENERATED, oCode.getCode());
        assertEquals("The display was incorrect.", CVX_CODE_DISPLAY_TEXT_GENERATED, oCode.getDisplay());
    }

    /**
     * Test case where the CVX code is already in the codes array.
     */
    @Test
    public void testGetCodesAlreadyContainsCvxCode () {
        try {
            List<JdsCode> oaCode = new ArrayList<JdsCode>();
            JdsCode oCode = createCvxCode();
            oaCode.add(oCode);
            testSubject.setCodes(oaCode);

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            verifyCodeArray(oaReturnedCodes, 1);
            verifyCvxCode(oaReturnedCodes.get(0));
            verify(mockHDDDao, times(0)).getMappedCode(any(JLVHddDao.MappingType.class), any(String.class));
        } catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }

    /**
     * Test VA Immunization case where there was no mapping returned by HDDDao.
     */
    @Test
    public void testVAImmunizationNoMappingFound () {
        try {
            when(mockHDDDao.getMappedCode(eq(JLVHddDao.MappingType.ImmunizationCptToCvx), any(String.class))).thenReturn(null);

            List<JdsCode> oaReturnedCodes = testSubject.getCodes();
            assertTrue("The returned value should have been nullish.", NullChecker.isNullish(oaReturnedCodes));
        }
        catch (Exception e) {
            String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
            System.out.println(sErrorMessage);
            e.printStackTrace();
            fail(sErrorMessage);
        }
    }

    //-----------------------------------------------------------------------------------------------
    // The following tests were created to test the getCodes method.
    //-----------------------------------------------------------------------------------------------

    /**
     * This method creates the CVX Code.
     *
     * @return This returns the CVX code that was created.
     */
    private JdsCode createCvxCode() {
        JdsCode oCode = new JdsCode();
        oCode.setSystem(JLVImmunizationsMap.CODE_SYSTEM_CVX);
        oCode.setCode(CVX_CODE_GENERATED);
        oCode.setDisplay(CVX_CODE_DISPLAY_TEXT_GENERATED);
        return oCode;
    }

    /**
     * This method creates the CVX Code.
     *
     * @return This returns the CVX code that was created.
     */
    private JdsCode createCptCode() {
        JdsCode oCode = new JdsCode();
        oCode.setSystem(CPT_CODE_SYSTEM);
        oCode.setCode(CPT_CODE_GENERATED);
        oCode.setDisplay(CPT_CODE_DISPLAY_TEXT_GENERATED);
        return oCode;
    }

    /**
     * This method creates the CVX Code.
     *
     * @return This returns the CVX code that was created.
     */
    private JLVMappedCode createMappedCvxCode() {
        JLVMappedCode oCode = new JLVMappedCode();
        oCode.setCodeSystem(JLVImmunizationsMap.CODE_SYSTEM_CVX);
        oCode.setCode(CVX_CODE_GENERATED);
        oCode.setDisplayText(CVX_CODE_DISPLAY_TEXT_GENERATED);
        return oCode;
    }
}
