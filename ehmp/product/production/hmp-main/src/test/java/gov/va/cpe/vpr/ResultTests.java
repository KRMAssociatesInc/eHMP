package gov.va.cpe.vpr;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import gov.va.cpe.vpr.termeng.jlv.JLVDodLabsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ResultTests  {
	private static final String LOINC_DISPLAY_TEXT_GENERATED = "SomeText";
	private static final String LOINC_CODE_GENERATED = "5111-0";
	private static final String LOINC_CODE_URN_GENERATED = "urn:lnc:" + LOINC_CODE_GENERATED;
	private static final String SYSTEM_DOD_NCID = "DOD_NCID";
	private static final String DOD_DISPLAY_TEXT_GENERATED = "SomeText2";
	private static final String DOD_NCID_GENERATED = "4321";
	
	Result testSubject = null;
	JLVHddDao mockHDDDao = null;	

    private ResultOrganizer ro;
    private Result r;
    private PatientDemographics pt;
    private PatientFacility facility;
    
	@Before
    public void setUp() {
        pt = new PatientDemographics();
        pt.setData("pid","1");
        pt.setData("icn","12345");
        pt.setLastUpdated(PointInTime.now());
        
        facility = new PatientFacility(); 
        facility.setData("code","500");
        facility.setData("name","CAMP MASTER");
        facility.setData("homeSite",true);
        facility.setData("localPatientId","229");
        
        ro = new ResultOrganizer();
        ro.setData("pid", pt.getPid());
		ro.setData("facilityCode",facility.getCode());
        ro.setData("facilityName",facility.getName());
		ro.setData("localId","CH;6959389.875453");
		ro.setData("observed",new PointInTime(1975, 7, 23, 10, 58));
		ro.setData("specimen","BLOOD");
		ro.setData("organizerType","accession");
				
        Result result = new Result();
		result.setData("localId","CH;6959389.875453;2");
		result.setData("typeName","SODIUM");
		result.setData("result","140");
		result.setData("units","meq/L");
		ro.addToResults(result);
		
		r = ro.getResults().get(0);

        r.addToOrganizers(ro);
        
        // Set up for testing getCodes
        //----------------------------
		mockHDDDao = mock(JLVHddDao.class);
		testSubject = new Result();
		testSubject.setJLVHddDao(mockHDDDao);
    }

	@Test
    public void testAccessionProperties() {
        assertEquals(pt.getPid(), r.getPid());
        assertEquals(facility.getCode(), r.getFacilityCode());
        assertEquals(facility.getName(), r.getFacilityName());
        assertEquals(new PointInTime(1975, 7, 23, 10, 58), r.getObserved());
        assertNull(r.getResulted());
        assertNull(r.getResultStatusName());
        assertEquals("BLOOD", r.getSpecimen());
        assertNull(r.getCategoryCode());
        assertNull(r.getCategoryName());
    }

    @Test
    public void testSummaryWithoutInterpretation() {
        assertEquals("SODIUM (BLOOD) 140 meq/L", r.getSummary());
    }

    @Test
    public void testSummaryWithInterpretation() {
        Result r2 = new Result();
        r2.setData("typeName","HEMOGLOBIN A1C");
        r2.setData("result","6.2");
        r2.setData("units","%");
        r2.setData("specimen","SERUM");
        r2.setData("interpretationCode","urn:hl7:observation-interpretation:H");
        r2.setData("interpretationName","High");
        ResultOrganizer ro = new ResultOrganizer();
        ro.setData("specimen","SERUM");
        ro.setData("organizerType","accession");
        r2.addToOrganizers(ro);
        
        assertEquals("HEMOGLOBIN A1C (SERUM) 6.2<em>H</em> %", r2.getSummary());
    }

    @Test
    public void testSummaryWithoutUnits() {
        Result r2 = new Result();//(typeName: "MALARIA SMEAR", result: "POSITIVE")
        r2.setData("typeName","MALARIA SMEAR");
        r2.setData("result","POSITIVE");
        assertEquals("MALARIA SMEAR POSITIVE", r2.getSummary());
    }

    @Test
    public void testQualifiedName() {
        assertEquals("SODIUM (BLOOD)", r.getQualifiedName());
    }

    @Test
    public void testLaboratoryKind() {
        r = new Result();
        //(typeName: "HEMOGLOBIN A1C", organizers: [new ResultOrganizer(category: new ResultCategory(code: "CH", name: "Laboratory"), 
        //specimen: "SERUM", organizerType: "accession")]);
        r.setData("typeName","HEMOGLOBIN A1C");
        r.setData("specimen","SERUM");

        ResultOrganizer ro = new ResultOrganizer();
        ro.setData("categoryCode","CH");
        ro.setData("categoryName","Laboratory");
        ro.setData("organizerType","accession");
        r.addToOrganizers(ro);
        
        assertEquals("Laboratory", r.getKind());
    }

    @Test
    public void testMicrobiologyKind() {
        r = new Result(); //typeName: "Bacteriology Remark(s)", result: "NO GROWTH AFTER 2 DAYS", organizers: 
        //[new ResultOrganizer(category: new ResultCategory(code: "MI", name: "Microbiology"), organizerType: "accession")]);
        r.setData("typeName","Bacteriology Remark(s)");
        r.setData("result","NO GROWTH AFTER 2 DAYS");
        ResultOrganizer ro = new ResultOrganizer();
        ro.setData("categoryCode","MI");
        ro.setData("categoryName","Microbiology");
        ro.setData("organizerType","accession");
        r.addToOrganizers(ro);
        assertEquals("Microbiology", r.getKind());
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
		oCode.setSystem(JLVDodLabsMap.CODE_SYSTEM_LOINC);
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
		oCode.setCodeSystem(JLVDodLabsMap.CODE_SYSTEM_LOINC);
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
		assertEquals("The code system was incorrect.", JLVDodLabsMap.CODE_SYSTEM_LOINC, oCode.getSystem());
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
	 * Test VA Lab Result case where the LOINC code is not in the codes array - but existed in the typeCode field.
	 */
	@Test
	public void testVALabGetCodesLoincNotInCodesButInTypeCode () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.LabUseLOINCtoGetText), any(String.class))).thenReturn(createMappedLoincCode());

			testSubject.setData("uid", "urn:va:lab:B362:100:100");
			testSubject.setData("typeCode", LOINC_CODE_URN_GENERATED);
			
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyLoincCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.LabUseLOINCtoGetText), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test VA Lab Result case where the LOINC code is not in the codes array, Not in the typeCode, but was in the lncCodes property
	 */
	@Test
	public void testVALabGetCodesLoincNotInCodesNotInTypeCodeButInLncCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.LabUseLOINCtoGetText), any(String.class))).thenReturn(createMappedLoincCode());

			testSubject.setData("uid", "urn:va:lab:B362:100:100");
			testSubject.setData("typeCode", "someText");
			HashSet<String> setLncCodes = new HashSet<String>();
			setLncCodes.add(LOINC_CODE_URN_GENERATED);
			testSubject.setLNCCodes(setLncCodes);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyLoincCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.LabUseLOINCtoGetText), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test VA Lab Result case where the LOINC code is not in the result at all.
	 */
	@Test
	public void testVALabGetCodesLoincNoLoincCode() {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.LabUseLOINCtoGetText), eq(""))).thenReturn(null);
			when(mockHDDDao.getMappedCode(eq(MappingType.LabUseLOINCtoGetText), eq((String) null))).thenReturn(null);

			testSubject.setData("uid", "urn:va:lab:B362:100:100");
			testSubject.setData("typeCode", "someText");
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("This should not have contained any codes.", NullChecker.isNullish(oaReturnedCodes));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.LabUseLOINCtoGetText), any(String.class));
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
	public void testDoDLabGetCodesLoincNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.LabDODNcidToLOINC), any(String.class))).thenReturn(createMappedLoincCode());
			
			testSubject.setData("uid", "urn:va:lab:DOD:100:100");

			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createDodNcidCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 2);
			for (JdsCode oReturnedCode : oaReturnedCodes) {
				if (oReturnedCode.getSystem().equals(JLVDodLabsMap.CODE_SYSTEM_LOINC)) {
					verifyLoincCode(oReturnedCode);
				}
			}
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.LabDODNcidToLOINC), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
}
