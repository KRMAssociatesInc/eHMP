package gov.va.cpe.vpr;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVIcd9SnomedMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.cpe.vpr.termeng.jlv.JLVMedcinSnomedMap;
import gov.va.hmp.util.NullChecker;

import java.util.ArrayList;
import java.util.List;

public class ProblemTests {
	private static final String SNOMED_CT_DISPLAY_TEXT_GENERATED = "Patient encounter status (finding)";
	private static final String SNOMED_CT_CODE_GENERATED = "305058001";
	private static final String SYSTEM_DOD_MEDCIN = "DOD_MEDCIN";
	private static final String DOD_MEDCIN_ID_GENERATED = "64676";
	
	Problem testSubject = null;
	private JLVHddDao mockHDDDao = null;	
	
	@Before
    public void setUp() {
        // Set up for testing getCodes
        //----------------------------
		mockHDDDao = mock(JLVHddDao.class);
		testSubject = new Problem();
		testSubject.setJLVHddDao(mockHDDDao);
	}	
	
	//-----------------------------------------------------------------------------------------------
	// The following tests were created to test the getCodes method.
	//-----------------------------------------------------------------------------------------------

	/**
	 * This method creates the SNOMED CT Code.
	 * 
	 * @return This returns the SNOMED CT code that was created.
	 */
	private JdsCode createSnomedCTCode() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT);
		oCode.setCode(SNOMED_CT_CODE_GENERATED);
		oCode.setDisplay(SNOMED_CT_DISPLAY_TEXT_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the DoD MEDCIN ID.
	 * 
	 * @return This returns the DoD MEDCIN ID that was created.
	 */
	private JdsCode createDodMedcinId() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(SYSTEM_DOD_MEDCIN);
		oCode.setCode(DOD_MEDCIN_ID_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the SNOMED CT Code.
	 * 
	 * @return This returns the SNOMED CT code that was created.
	 */
	private JLVMappedCode createMappedSnomedCTCode() {
		JLVMappedCode oCode = new JLVMappedCode();
		oCode.setCodeSystem(JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT);
		oCode.setCode(SNOMED_CT_CODE_GENERATED);
		oCode.setDisplayText(SNOMED_CT_DISPLAY_TEXT_GENERATED);
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
	 * Verifies that the SNOMED CT code is correct.
	 * 
	 * @param oCode The SNOMED CT Code information.
	 */
	private void verifySnomedCTCode(JdsCode oCode) {
		assertEquals("The code system was incorrect.", JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT, oCode.getSystem());
		assertEquals("The code was incorrect.", SNOMED_CT_CODE_GENERATED, oCode.getCode());
		assertEquals("The display was incorrect.", SNOMED_CT_DISPLAY_TEXT_GENERATED, oCode.getDisplay());
	}

	/**
	 * Test case where the SNOMED CT code is already in the codes array.
	 */
	@Test
	public void testGetCodesAlreadyContainsSnomedCTCode () {
		try {
			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createSnomedCTCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifySnomedCTCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(0)).getMappedCode(any(MappingType.class), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test VA case where the SNOMED CT code is not in the codes array - but it contains an ICD9 Code that can be used to look it up.
	 */
	@Test
	public void testVAProblemGetCodesSnomedCTNotInCodesButContainsIcd9 () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.ProblemsIcd9ToSnomedCT), any(String.class))).thenReturn(createMappedSnomedCTCode());

			testSubject.setData("uid", "urn:va:problem:B362:8:748");
			testSubject.setData("icdCode", "urn:icd:272.4");
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifySnomedCTCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.ProblemsIcd9ToSnomedCT), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test VA case where the VA result contains no ICD9 Code.
	 */
	@Test
	public void testVAProblemGetCodesNoICD9() {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.ProblemsIcd9ToSnomedCT), eq(""))).thenReturn(null);
			when(mockHDDDao.getMappedCode(eq(MappingType.ProblemsIcd9ToSnomedCT), eq((String) null))).thenReturn(null);

			testSubject.setData("uid", "urn:va:problem:B362:8:748");
			testSubject.setData("icdCode", "someText");
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("This should not have contained any codes.", NullChecker.isNullish(oaReturnedCodes));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.ProblemsIcd9ToSnomedCT), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
	
	/**
	 * Test DoD case where the SNOMED CT code is not in the codes array
	 */
	@Test
	public void testDoDProblemGetCodesSnomedCTNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.ProblemsMedcinIdToSnomedCT), any(String.class))).thenReturn(createMappedSnomedCTCode());
			
			testSubject.setData("uid", "urn:va:problem:DOD:0000000008:1000001440");

			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createDodMedcinId();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 2);
			for (JdsCode oReturnedCode : oaReturnedCodes) {
				if (oReturnedCode.getSystem().equals(JLVMedcinSnomedMap.CODE_SYSTEM_SNOMEDCT)) {
					verifySnomedCTCode(oReturnedCode);
				}
			}
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.ProblemsMedcinIdToSnomedCT), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
    

}
