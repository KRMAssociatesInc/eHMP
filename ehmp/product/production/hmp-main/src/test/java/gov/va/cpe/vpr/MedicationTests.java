package gov.va.cpe.vpr;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.Medication.MedicationKind;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.cpe.vpr.termeng.jlv.JLVDrugsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.junit.Ignore;

public class MedicationTests {
	private static final String RXNORM_DISPLAY_TEXT_GENERATED = "menadiol 5 MG Oral Tablet";
	private static final String RXNORM_CODE_GENERATED = "311488";
	private static final String SYSTEM_DOD_NCID = "DOD_NCID";
	private static final String VUID_GENERATED = "4002175"; 
	private static final String DOD_NCID_GENERATED = "222463";
	
	private Medication testSubject = null;
	private JLVHddDao mockHDDDao = null;
	private Concept mockVuidConcept = null;
	private Concept mockRxnormConcept = null;
	
	// a simple and complex IV med to play with
	private static File med10121 = POMObjectTester.resolveFile("med10121.json", MedicationTests.class);
	private static File med34973 = POMObjectTester.resolveFile("med34973.json", MedicationTests.class);
	
	// complex inpatient med
	private static File med37504 = POMObjectTester.resolveFile("med37504.json", MedicationTests.class);
	
	private static POMObjectTester<Medication> LOADER = new POMObjectTester<>();
	
	private TermEng mockTermEng;
	private Concept mockSCLConcept;
	private HashSet<String> sclAncestorSet;
	private HashSet<String> sclEquivSet;
	private Medication med;

	@Before
	public void setup() {
		sclEquivSet = new HashSet<>();
		sclAncestorSet = new HashSet<>();
		for (int i=1; i <= 25; i++) sclAncestorSet.add("urn:ancestor:" + i);
		for (int i=1; i <= 25; i++) sclAncestorSet.add("urn:equiv:" + i);
		
		// when searching for SODIUM CHLORIDE, return a mock with NDRT mappings, 25 mocked ancestors and 25 mocked ancestors
		TermEng.setInstance(mockTermEng = mock(TermEng.class));
		mockSCLConcept = mock(Concept.class);
		when(mockSCLConcept.getMappingTo("ndfrt")).thenReturn(mockSCLConcept);
		when(mockSCLConcept.getAncestorSet()).thenReturn(sclAncestorSet);
		when(mockSCLConcept.getEquivalentSet()).thenReturn(sclEquivSet);
		when(mockTermEng.getConcept("urn:vandf:4017444")).thenReturn(mockSCLConcept);
		
        // Set up for testing getCodes
        //----------------------------
		mockHDDDao = mock(JLVHddDao.class);
		mockVuidConcept = mock(Concept.class);
		mockRxnormConcept = mock(Concept.class);
		testSubject = new Medication();
		testSubject.setJLVHddDao(mockHDDDao);
	}
	
	@Test
	public void testRXNCodeCalculation() throws FileNotFoundException, URISyntaxException {
		// med1021 has 500+ codes and was taking a long time to return
		Map<String, Object> data = LOADER.loadFileData(med10121); 
		assertEquals("urn:va:med:F484:8:10121", data.get("uid"));
		
		// if we remove the rxncodes value from the data, some should be generated
		data.remove("rxncodes");
		med = POMUtils.newInstance(Medication.class, data);
		assertNull(med.rxnCodes);
		assertEquals(51, med.getRXNCodes().size()); // 25 ancestors, 25 equivs plus self
		verify(mockTermEng).getConcept("urn:vandf:4017444");
	}
	
	
	@Test
	public void testRXNCodeNotCalculated() throws FileNotFoundException, URISyntaxException {
		Map<String, Object> data = LOADER.loadFileData(med10121); 
		assertEquals("urn:va:med:F484:8:10121", data.get("uid"));
		
		// if we keep the rxncodes value from the data, it should be the new value and should be instant
		data.put("rxncodes", Arrays.asList("FOO","BAR","BAZ"));
		med = POMUtils.newInstance(Medication.class, data);
		assertEquals(3, med.rxnCodes.size());
		assertEquals(3, med.getRXNCodes().size());
		assertTrue(med.getRXNCodes().contains("FOO"));
		assertTrue(med.getRXNCodes().contains("BAR"));
		assertTrue(med.getRXNCodes().contains("BAZ"));
		
		// the termeng should not be called
		verify(mockTermEng, never()).getConcept(anyString());
	}
	
	@Test
	public void testRXNShouldNotTriggerEvents() throws FileNotFoundException, URISyntaxException {
		Medication med = LOADER.loadFile(med10121);
		
		List<PatientEvent<IPatientObject>> events = med.getEvents();
		assertTrue(events.isEmpty());
		
		// altering some fields produce events
		med.setData("dose", "FOO");
		events = med.getEvents();
		assertEquals(1, events.size());
		med.clearEvents();
		
		// altering the RXN code does not produce events
		med.setData("rxncodes", Arrays.asList("FOO", "BAR"));
		events = med.getEvents();
		assertEquals(0, events.size());
	}
	
	@Test
	public void testIsCurrent() throws FileNotFoundException, URISyntaxException {
		Medication med = LOADER.loadFile(med10121);
		// treat as outpatient
		med.setData("vaType","O");
		
		// its expired and old, therefor not current
		assertEquals("EXPIRED", med.getVaStatus());
		assertTrue(med.getOverallStop().before(new PointInTime("2000")));
		assertTrue(med.getStopped().before(new PointInTime("2000")));
		assertFalse(med.isRecent());
		
		// setting to active, pending, hold, suspend should make it current
		med.setData("vaStatus", "ACTIVE");
		assertTrue(med.isRecent());
		med.setData("vaStatus", "PENDING");
		assertTrue(med.isRecent());
		med.setData("vaStatus", "HOLD");
		assertTrue(med.isRecent());
		med.setData("vaStatus", "SUSPEND");
		assertTrue(med.isRecent());
		
		// setting status to EXPIRED, DISCONTINED should not be current
		med.setData("vaStatus", "EXPIRED");
		assertFalse(med.isRecent());
		med.setData("vaStatus", "DISCONTINUED");
		assertFalse(med.isRecent());
		med.setData("vaStatus", "DISCONTINUED/EDIT");
		assertFalse(med.isRecent());
		
		// setting stopped date to within 30 days should make it current
		med.setData("vaStatus", "EXPIRED");
		med.setData("overallStop", PointInTime.today().subtractDays(30));
		med.setData("stopped", PointInTime.today().subtractDays(30));
		assertTrue(med.isRecent());
	}
	
	@Test
	public void testIsBetween() throws FileNotFoundException, URISyntaxException {
		Medication med = LOADER.loadFile(med10121);
		
		// nulls always return false
		assertFalse(med.isBetween(null, PointInTime.now()));
		assertFalse(med.isBetween(PointInTime.now(), null));
		
		// this is the start and stop date
		assertEquals("199906281500", med.getOverallStart().toString());
		assertEquals("199907012359", med.getOverallStop().toString());
		
		// return true if the start date falls inbetween the range, or stop date falls between range
		assertTrue(med.isBetween(new PointInTime("19990625"), new PointInTime("19990630")));
		assertTrue(med.isBetween(new PointInTime("19990630"), new PointInTime("19990705")));
		
		// same day and missmatched accuracy should return true as well
		assertTrue(med.isBetween(new PointInTime("19990628"), new PointInTime("19990628")));
		assertTrue(med.isBetween(new PointInTime("19990701"), new PointInTime("19990701")));
	}
	
	@Test
	public void testDailyDose() {
		Medication med = LOADER.loadFile(med37504);
		assertEquals(1, med.getDosages().size());
		MedicationDose dose = med.getDosages().get(0);
				
		// 2mg Q4H PRN = 12mg/daily, should return as integer
		assertEquals(12, med.getDailyDose());
		assertTrue(dose.calcDailyDose().floatValue() == med.getDailyDose().floatValue());
		
		// .5mg Q4H = 3mg/daily, should return as float
		dose.setData("dose", .5d);
		assertEquals(3f, dose.calcDailyDose().floatValue(), 0);
		assertTrue(dose.calcDailyDose().floatValue() == med.getDailyDose().floatValue());
		
		// 1.5mg Q8H = 4.5mg/daily, should return as float
		dose.setData("dose", 1.5d);
		dose.setData("scheduleFreq", 60*8);
		assertEquals(4.5f, dose.calcDailyDose().floatValue(), 0);
		assertTrue(dose.calcDailyDose().floatValue() == med.getDailyDose().floatValue());
		
		// for Medication/Dose, test exactly once daily returns exact dose (DrugTherapy is different)
		dose.setData("scheduleFreq", 1440);
		assertEquals(1.5f, dose.calcDailyDose().floatValue(), 0);
		assertTrue(dose.calcDailyDose().floatValue() == med.getDailyDose().floatValue());
		
		// test less than once every other day returns .75 (DrugTherapy is different)
		dose.setData("scheduleFreq", 2880);
		assertEquals(0.75f, dose.calcDailyDose().floatValue(), 0);
		assertTrue(dose.calcDailyDose().floatValue() == med.getDailyDose().floatValue());
		
	}
	
	@Test
	@Ignore
	public void testDoseAdmin() {
		
		Medication med = LOADER.loadFile(med10121);
		assertEquals(1, med.getDosages().size());
		
		// check the dose fields
		MedicationDose dose = med.getDosages().get(0);
		assertEquals("20 ml/hr", dose.getIvRate());
		assertEquals("IV", dose.getRouteName());
		assertEquals("BID", dose.getScheduleName());
		assertEquals("CONTINUOUS", dose.getScheduleType());
		assertEquals(new Integer(720), dose.getScheduleFreq());
		assertEquals("0700-1900", dose.getAdminTimes());
		
		// check dose administrations, should be returned in a sorted order
		assertEquals(3, med.getAdministrations().size());
		
		// last admin only includes GIVEN + INFUSING, so getLastAdmin() is not necessarily == getAdminitrations.first
		assertEquals("NOT GIVEN", med.getAdministrations().first().getStatus());
		assertFalse(med.getLastAdmin().equals(med.getAdministrations().first().getDateTime()));
		
		MedicationAdministration admin = med.getAdministrations().first();
		assertEquals("200006281900", admin.getDateTime().toString());
		assertEquals("NURSE,TWENTY-SIX", admin.getAdministeredByName());
		assertEquals("urn:va:user:F484:20189", admin.getAdministeredByUid());
		assertEquals("NOT GIVEN", admin.getStatus());
		
		admin = med.getAdministrations().last();
		assertEquals("199906281900", admin.getDateTime().toString());
		assertEquals("NURSE,TWENTY-SIX", admin.getAdministeredByName());
		assertEquals("urn:va:user:F484:20189", admin.getAdministeredByUid());
		assertEquals("GIVEN", admin.getStatus());
		
		// each administration should have 1+ medications that were administered
		for (MedicationAdministration medAdmin : med.getAdministrations()) {
			assertNotNull(medAdmin.getMedications());
			assertEquals(1, medAdmin.getMedications().size());
			MedicationAdministrationMed adminMed = medAdmin.getMedications().get(0);
			assertEquals("SODIUM CHLORIDE 0.9% INJ", adminMed.getName());
			assertEquals("INJ", adminMed.getUnits());
			assertEquals("1", adminMed.getAmount());
		}
		
		// next dose should either be at 0700 or 1900
		// at high noon, the next dose admin should be 1900
		PointInTime now = new PointInTime("199906291200");
		assertEquals(new PointInTime("199906291900"), med.calcNextScheduledAdminFrom(now));
		
		// if the admin times were single numbers, ensure that it still calculates the full hour/minute
		med.getDosages().get(0).setData("adminTimes", "04-08-12-16-20"); // initate Q4H
		now = new PointInTime("199906290500"); // next dose should be at 0800 hours
		assertEquals(new PointInTime("199906290800"), med.calcNextScheduledAdminFrom(now));
	}
	
	@Test
	public void testComplexIV() {
		Medication med = LOADER.loadFile(med34973);
		assertEquals(1, med.getDosages().size());
		assertEquals(2, med.getProducts().size());
		assertEquals(12, med.getAdministrations().size());
		
		// cannot currently calculate dose admin for IV's
		PointInTime start = new PointInTime("201403060000");
		PointInTime end = new PointInTime("201403070000");
		assertNull(med.calcDoseAdminBetween(start, end));
		
		// IV doesn't currently compute daily dose
		assertNull(med.getDailyDose());
	}
	
	@Test
	public void testComplexINPT() {
		Medication med = LOADER.loadFile(med37504);
		assertEquals(1, med.getDosages().size());
		assertEquals(1, med.getProducts().size());
		assertEquals(3, med.getAdministrations().size());
		assertTrue(med.isPRN());
		
		// calc 24h dose over whole period is 6 mg
		PointInTime start = new PointInTime("201403060000");
		PointInTime end = new PointInTime("201403070000");
		assertEquals(6.0f, med.calcDoseAdminBetween(start, end));
		
		// there were 2 admins after noon on 20140306 for a total of 4mg
		start = new PointInTime("201403061200");
		end = new PointInTime("201403071200");
		assertEquals(4.0f, med.calcDoseAdminBetween(start, end));
		
		// daily dose for 2mg Q4H is 12 
		assertEquals(new Integer(12), med.getDailyDose());
		
		// since its PRN there is no scheduled time
		assertNull(med.calcNextScheduledAdminFrom(end));
	}
	
	@Test
	public void testMedicationKind() {
		Medication med = new Medication();
		assertSame(MedicationKind.UNKNOWN, MedicationKind.kindOf(med));
		
		med.setData("vaType", "I");
		assertSame(MedicationKind.I, MedicationKind.kindOf(med));

		med.setData("vaType", "O");
		assertSame(MedicationKind.O, MedicationKind.kindOf(med));

		med.setData("vaType", "N");
		assertSame(MedicationKind.N, MedicationKind.kindOf(med));

		med.setData("vaType", "V");
		assertSame(MedicationKind.V, MedicationKind.kindOf(med));

		med.setData("supply", true);
		assertSame(MedicationKind.SUPPLY, MedicationKind.kindOf(med));
		med.setData("supply", null);
		
		med.setData("IMO", true);
		assertSame(MedicationKind.IMO, MedicationKind.kindOf(med));
	}
	
	//-----------------------------------------------------------------------------------------------
	// The following tests were created to test the getCodes method.
	//-----------------------------------------------------------------------------------------------

	/**
	 * This method creates the RxNORM Code.
	 * 
	 * @return This returns the RxNORM code that was created.
	 */
	private JdsCode createRxNormCode() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(JLVDrugsMap.CODE_SYSTEM_RXNORM);
		oCode.setCode(RXNORM_CODE_GENERATED);
		oCode.setDisplay(RXNORM_DISPLAY_TEXT_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the DoD NCID.
	 * 
	 * @return This returns the DoD NCID that was created.
	 */
	private JdsCode createDodNcid() {
		JdsCode oCode = new JdsCode();
		oCode.setSystem(SYSTEM_DOD_NCID);
		oCode.setCode(DOD_NCID_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the RXNORM Code.
	 * 
	 * @return This returns the RXNORM code that was created.
	 */
	private JLVMappedCode createMappedRxNormCode() {
		JLVMappedCode oCode = new JLVMappedCode();
		oCode.setCodeSystem(JLVDrugsMap.CODE_SYSTEM_RXNORM);
		oCode.setCode(RXNORM_CODE_GENERATED);
		oCode.setDisplayText(RXNORM_DISPLAY_TEXT_GENERATED);
		return oCode;
	}

	/**
	 * This method creates the equivalent set for the VUID concept to be returned.
	 * 
	 * @return
	 */
	private Set<String> createEquivalentSet() {
		Set<String> setEquivalentCodes = new HashSet<String>();
		setEquivalentCodes.add("urn:rxnorm:" + RXNORM_CODE_GENERATED);
		return setEquivalentCodes;
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
	 * Verifies that the RXNORM code is correct.
	 * 
	 * @param oCode The RXNORM Code information.
	 */
	private void verifyRxnormCode(JdsCode oCode) {
		assertEquals("The code system was incorrect.", JLVDrugsMap.CODE_SYSTEM_RXNORM, oCode.getSystem());
		assertEquals("The code was incorrect.", RXNORM_CODE_GENERATED, oCode.getCode());
		assertEquals("The display was incorrect.", RXNORM_DISPLAY_TEXT_GENERATED, oCode.getDisplay());
	}

	/**
	 * Test case where the RxNORM code is already in the codes array.
	 */
	@Test
	public void testGetCodesAlreadyContainsRxnormCode () {
		try {
			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createRxNormCode();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyRxnormCode(oaReturnedCodes.get(0));
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
	 * Test VA case where the RxNorm code is not in the codes array - but it contains an VUID that can be used to look it up.
	 */
	@Test
	public void testVAMedicationGetCodesRxnormNotInCodesButContainsVuid () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq(VUID_GENERATED))).thenReturn(createMappedRxNormCode());

			testSubject.setData("uid", "urn:va:problem:B362:8:748");
			List<MedicationProduct> oaProduct = new ArrayList<MedicationProduct>();
			MedicationProduct oProduct = new MedicationProduct();
			oProduct.setData("suppliedCode", "urn:va:vuid:" + VUID_GENERATED);
			oaProduct.add(oProduct);
			testSubject.setData("products", oaProduct);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyRxnormCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq(VUID_GENERATED));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}

	/**
	 * Test VA case where the VA result contains no VUID Code.
	 */
	@Test
	public void testVAMedicationGetCodesNoVuid() {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq(""))).thenReturn(null);
			when(mockHDDDao.getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq((String) null))).thenReturn(null);

			testSubject.setData("uid", "urn:va:problem:B362:8:748");
			List<MedicationProduct> oaProduct = new ArrayList<MedicationProduct>();
			MedicationProduct oProduct = new MedicationProduct();
			oProduct.setData("suppliedCode", "someText");
			testSubject.setData("products", oaProduct);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			assertTrue("This should not have contained any codes.", NullChecker.isNullish(oaReturnedCodes));
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.MedicationVuidToRxNorm), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
	
	/**
	 * Test DoD case where the RXNORM code is not in the codes array
	 */
	@Test
	public void testDoDMedicationGetCodesRxnormNotInCodes () {
		try {
			when(mockHDDDao.getMappedCode(eq(MappingType.MedicationDodNcidToRxNorm), any(String.class))).thenReturn(createMappedRxNormCode());
			
			testSubject.setData("uid", "urn:va:med:DOD:0000000008:1000001252");

			List<JdsCode> oaCode = new ArrayList<JdsCode>();
			JdsCode oCode = createDodNcid();
			oaCode.add(oCode);
			testSubject.setCodes(oaCode);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 2);
			for (JdsCode oReturnedCode : oaReturnedCodes) {
				if (oReturnedCode.getSystem().equals(JLVDrugsMap.CODE_SYSTEM_RXNORM)) {
					verifyRxnormCode(oReturnedCode);
				}
			}
			verify(mockHDDDao, times(1)).getMappedCode(eq(MappingType.MedicationDodNcidToRxNorm), any(String.class));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
	
	/**
	 * This tests the case where the VA terminology database is used to retrieve the RxNORM code.
	 * 
	 */
	@Test
	public void testUsingVATerminologyHappyPath() {
		try {
			when(mockVuidConcept.getEquivalentSet()).thenReturn(createEquivalentSet());
			when(mockRxnormConcept.getDescription()).thenReturn(RXNORM_DISPLAY_TEXT_GENERATED);
			when(mockTermEng.getConcept("urn:vandf:" + VUID_GENERATED)).thenReturn(mockVuidConcept);
			when(mockTermEng.getConcept("urn:rxnorm:" + RXNORM_CODE_GENERATED)).thenReturn(mockRxnormConcept);

			when(mockHDDDao.getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq(VUID_GENERATED))).thenReturn(createMappedRxNormCode());

			testSubject.setData("uid", "urn:va:problem:B362:8:748");
			List<MedicationProduct> oaProduct = new ArrayList<MedicationProduct>();
			MedicationProduct oProduct = new MedicationProduct();
			oProduct.setData("suppliedCode", "urn:va:vuid:" + VUID_GENERATED);
			oaProduct.add(oProduct);
			testSubject.setData("products", oaProduct);
			
			List<JdsCode> oaReturnedCodes = testSubject.getCodes();
			verifyCodeArray(oaReturnedCodes, 1);
			verifyRxnormCode(oaReturnedCodes.get(0));
			verify(mockHDDDao, times(0)).getMappedCode(eq(MappingType.MedicationVuidToRxNorm), eq(VUID_GENERATED));
		}
		catch (Exception e) {
			String sErrorMessage = "An unexpected exception occurred.  Error: " + e.getMessage();
			System.out.println(sErrorMessage);
			e.printStackTrace();
			fail(sErrorMessage);
		}
	}
}
