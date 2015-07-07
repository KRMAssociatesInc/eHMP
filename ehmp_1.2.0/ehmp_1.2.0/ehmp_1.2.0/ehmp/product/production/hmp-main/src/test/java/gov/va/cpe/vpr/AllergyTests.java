package gov.va.cpe.vpr;

import static org.junit.Assert.*;

import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.cpe.vpr.termeng.jlv.JLVDodAllergiesMap;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.hmp.util.NullChecker;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.*;


public class AllergyTests  {
	private static final String SYSTEM_DOD_CHCS_IEN = "DOD_ALLERGY_IEN";
	private static final String DOD_DISPLAY_TEXT_GENERATED = "SomeText2";
	private static final String DOD_CHCS_IEN_GENERATED = "4321";
	private static final String UMLS_DISPLAY_TEXT_GENERATED = "SomeText";
	private static final String UMLS_CUI_CODE_GENERATED = "C111";
	Allergy testSubject = null;
	JLVHddDao mockHDDDao = null;

	@Before
	public void setUp() throws Exception {
		mockHDDDao = mock(JLVHddDao.class);
		testSubject = new Allergy() {
			private static final long serialVersionUID = -4226027408358664542L;

			@Override
			protected JLVHddDao getHDDDao() throws TermLoadException {
				return mockHDDDao;
			}
		};
	}
	
	@Test
    public void testSummary() {
        Allergy a = new Allergy();
        AllergyProduct product = new AllergyProduct();
        product.setData("name","BBQ SAUCE");
        a.addToProducts(product);
        assertEquals("BBQ SAUCE", a.getSummary());
    }

	@Test
    public void testKind() {
        Allergy a = new Allergy();
        assertEquals("Allergy/Adverse Reaction", a.getKind());
    }
	
	//-----------------------------------------------------------------------------------------------
	// The following tests were created to test the getCodes method.
	//-----------------------------------------------------------------------------------------------

	/**
	 * This method creates the UMLS CUI Code.
	 * 
	 * @return This returns the UNLS CUI code that was created.
	 */
	private JdsCode createUMLSCuiCode() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI);
		oCode.setCode(UMLS_CUI_CODE_GENERATED);
		oCode.setDisplay(UMLS_DISPLAY_TEXT_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the UMLS CUI Code.
	 * 
	 * @return This returns the UNLS CUI code that was created.
	 */
	private JdsCode createChcsIenCode() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(SYSTEM_DOD_CHCS_IEN);
		oCode.setCode(DOD_CHCS_IEN_GENERATED);
		oCode.setDisplay(DOD_DISPLAY_TEXT_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the UMLS CUI Code.
	 * 
	 * @return This returns the UNLS CUI code that was created.
	 */
	private JLVMappedCode createMappedUMLSCuiCode() {
		JLVMappedCode oCode = new JLVMappedCode();
		oCode.setCodeSystem(JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI);
		oCode.setCode(UMLS_CUI_CODE_GENERATED);
		oCode.setDisplayText(UMLS_DISPLAY_TEXT_GENERATED);
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
	 * Verifies that the UMLS CUI code is correct.
	 * 
	 * @param oCode The UMLS CUI Code information.
	 */
	private void verifyUMLSCuiCode(JdsCode oCode) {
		assertEquals("The code system was incorrect.", JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI, oCode.getSystem());
		assertEquals("The code was incorrect.", UMLS_CUI_CODE_GENERATED, oCode.getCode());
		assertEquals("The display was incorrect.", UMLS_DISPLAY_TEXT_GENERATED, oCode.getDisplay());
	}

	/**
	 * Test case where the UMLS CUI code is already in the codes array.
	 */
	@Test
	public void testGetCodesAlreadyContainsUMLSCuiCode () {
		try {
			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createUMLSCuiCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyUMLSCuiCode(oaReturnedCodes.get(0));
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
	 * Test VA Allergy case where the UMLS CUI code is not in the codes array
	 */
	@Test
	public void testVAAllergyGetCodesUMLSCuiNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.AllergyVUIDtoUMLSCui), any(String.class))).thenReturn(createMappedUMLSCuiCode());
			
	        AllergyProduct oProduct = new AllergyProduct();
	        oProduct.setData("vuid","urn:va:vuid:12345");
	        testSubject.addToProducts(oProduct);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyUMLSCuiCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.AllergyVUIDtoUMLSCui), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test DoD Allergy case where the UMLS CUI code is not in the codes array
	 */
	@Test
	public void testDoDAllergyGetCodesUMLSCuiNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.AllergyCHCSIenToUMLSCui), any(String.class))).thenReturn(createMappedUMLSCuiCode());
			
			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createChcsIenCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 2);
			for (JdsCode oReturnedCode : oaReturnedCodes) {
				if (oReturnedCode.getSystem().equals(JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI)) {
					verifyUMLSCuiCode(oReturnedCode);
				}
			}
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.AllergyCHCSIenToUMLSCui), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
	
	/**
	 * Test Where it is not DoD or VA allergy.  (This should insert nothing at this point.)
	 */
	@Test
	public void testNotDoDOrVAAllergy () {
		try {
			when(mockHDDDao.getMappedCode(any(MappingType.class), any(String.class))).thenReturn(createMappedUMLSCuiCode());
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("The returned result should have been nullish.", NullChecker.isNullish(oaReturnedCodes));
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
	 * Test VA Allergy case where there was no mapping returnd by HDDDao.
	 */
	@Test
	public void testVAAllergyNoMappingFound () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.AllergyVUIDtoUMLSCui), any(String.class))).thenReturn(null);
			
	        AllergyProduct oProduct = new AllergyProduct();
	        oProduct.setData("vuid","12345");
	        testSubject.addToProducts(oProduct);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("The returned value should have been nullish.", NullChecker.isNullish(oaReturnedCodes));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.AllergyVUIDtoUMLSCui), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
}
