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

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.cpe.vpr.termeng.jlv.JLVVitalsMap;
import gov.va.hmp.util.NullChecker;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

public class VitalSignTests {
	private static final String LOINC_DISPLAY_TEXT_GENERATED = "Respiratory rate";
	private static final String LOINC_CODE_GENERATED = "9729-1";
	private static final String SYSTEM_DOD_NCID = "DOD_NCID";
	private static final String DOD_DISPLAY_TEXT_GENERATED = "Respiratory rate";
	private static final String DOD_NCID_GENERATED = "2124";
	
	VitalSign testSubject = null;
	private JLVHddDao mockHDDDao = null;	
	
	@Before
    public void setUp() {
        // Set up for testing getCodes
        //----------------------------
		mockHDDDao = mock(JLVHddDao.class);
		testSubject = new VitalSign();
		testSubject.setJLVHddDao(mockHDDDao);
	}	
	
	
    @Test
    public void testSummaryWithoutInterpretation() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(5);
        map.put("typeName", "WEIGHT");
        map.put("result", "182");
        map.put("units", "lb");
        map.put("metricResult", "82.73");
        map.put("metricUnits", "kg");
        VitalSign s = new VitalSign(map);
        Assert.assertEquals("WEIGHT 182 lb", s.getSummary());
    }

    @Test
    public void testSummaryWithInterpretation() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(6);
        map.put("typeName", "WEIGHT");
        map.put("result", "182");
        map.put("units", "lb");
        map.put("metricResult", "82.73");
        map.put("metricUnits", "kg");
        map.put("interpretationCode", "L");
        VitalSign s = new VitalSign(map);
        Assert.assertEquals("WEIGHT 182L lb", s.getSummary());
    }

    @Test
    public void testSummaryWithoutUnits() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(2);
        map.put("typeName", "BLOOD PRESSURE");
        map.put("result", "134/81");
        VitalSign s = new VitalSign(map);
        Assert.assertEquals("BLOOD PRESSURE 134/81", s.getSummary());
    }

    @Test
    public void testSummaryWithoutType() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(1);
        map.put("result", "134/81");
        VitalSign s = new VitalSign(map);
        Assert.assertEquals(" 134/81", s.getSummary());
    }

    @Test
    public void testSummaryWithoutAnything() {
        VitalSign s = new VitalSign();
        Assert.assertEquals("", s.getSummary());
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
		oCode.setSystem(JLVVitalsMap.CODE_SYSTEM_LOINC);
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
		oCode.setCodeSystem(JLVVitalsMap.CODE_SYSTEM_LOINC);
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
		assertEquals("The code system was incorrect.", JLVVitalsMap.CODE_SYSTEM_LOINC, oCode.getSystem());
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
	 * Test VA Vitals Result case where the LOINC code is not in the codes array - but it contains a vuid that can be used to look it up.
	 */
	@Test
	public void testVAVitalsGetCodesLoincNotInCodesButContainsVuid () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.VitalsVuidToLoinc), any(String.class))).thenReturn(createMappedLoincCode());

			testSubject.setData("uid", "urn:va:vital:B362:3:100");
			testSubject.setData("typeCode", "urn:va:vuid:411111");
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyLoincCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.VitalsVuidToLoinc), any(String.class));
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
	public void testVAVitalsGetCodesNoVuid() {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.VitalsVuidToLoinc), eq(""))).thenReturn(null);
			when(mockHDDDao.getMappedCode(eq(MappingType.VitalsVuidToLoinc), eq((String) null))).thenReturn(null);

			testSubject.setData("uid", "urn:va:vital:B362:3:100");
			testSubject.setData("typeCode", "someText");
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("This should not have contained any codes.", NullChecker.isNullish(oaReturnedCodes));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.VitalsVuidToLoinc), any(String.class));
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
	public void testDoDVitalGetCodesLoincNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.VitalsDODNcidToLoinc), any(String.class))).thenReturn(createMappedLoincCode());
			
			testSubject.setData("uid", "urn:va:vital:DOD:100:100");

			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createDodNcidCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 2);
			for (JdsCode oReturnedCode : oaReturnedCodes) {
				if (oReturnedCode.getSystem().equals(JLVVitalsMap.CODE_SYSTEM_LOINC)) {
					verifyLoincCode(oReturnedCode);
				}
			}
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.VitalsDODNcidToLoinc), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
}
