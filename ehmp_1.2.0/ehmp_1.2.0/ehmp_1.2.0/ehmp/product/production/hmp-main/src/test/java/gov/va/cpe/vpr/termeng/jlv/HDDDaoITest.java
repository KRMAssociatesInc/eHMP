package gov.va.cpe.vpr.termeng.jlv;

import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

public class HDDDaoITest {
	private static final String JLV_DB_DIRECTORY = "data/termdb-1.0-jlvdb";
	
	JLVHddDao testSubject = null;

	@Before
	public void setUp() throws Exception {
		testSubject = JLVHddDao.createInstance(createJdbcUrl());
	}

	/**
	 * Create the JDBC URL for the JLV terminology database.
	 * 
	 * @return The URL.
	 */
	public String createJdbcUrl() {
		String sJdbcUrl = "";
		
		File oDBDirectory = new File(JLV_DB_DIRECTORY);
		String sFileName = "";
		
		try {
			sFileName = oDBDirectory.getCanonicalPath();
		}
		catch (Exception e) {
			fail("Failed to get path to the JLV database.");
		}
		
		sJdbcUrl = "jdbc:h2:" + sFileName + "/termdb";
		
		return sJdbcUrl;
	}

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveAllergyUMLSCuiFromVUID() {
		
		try {
			JLVMappedCode oUmlsCuiCode = testSubject.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, "4020269");
			assertNotNull("Response should not have been null.", oUmlsCuiCode);
			assertEquals("The code system was wrong.", JLVReactantsMap.CODE_SYSTEM_UMLS_CUI, oUmlsCuiCode.getCodeSystem());
			assertEquals("The code was wrong.", "C0049104", oUmlsCuiCode.getCode());
			assertEquals("The text was wrong.", "5-chloro-2-methyl-4-isothiazolin-3-one", oUmlsCuiCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
		
	}
	
	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveAllergyUMLSCuiFromCHCSIen() {
		
		try {
			JLVMappedCode oUmlsCuiCode = testSubject.getMappedCode(MappingType.AllergyCHCSIenToUMLSCui, "8150000");
			assertNotNull("Response should not have been null.", oUmlsCuiCode);
			assertEquals("The code system was wrong.", JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI, oUmlsCuiCode.getCodeSystem());
			assertEquals("The code was wrong.", "C0033306", oUmlsCuiCode.getCode());
			assertEquals("The text was wrong.", "Progestins", oUmlsCuiCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
		
	}
	
	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveLabLoincInfoFromLoincCode() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.LabUseLOINCtoGetText, "1020-7");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVLoincMap.CODE_SYSTEM_LOINC, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "1020-7", oCode.getCode());
			assertEquals("The text was wrong.", "E Ag [Presence] on Red Blood Cells from donor", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
		
	}

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveLabLoincFromDodNcid() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.LabDODNcidToLOINC, "9420");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVLoincMap.CODE_SYSTEM_LOINC, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "5400-7", oCode.getCode());
			assertEquals("The text was wrong.", "Vaccinia virus Ab [Units/volume] in Serum", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
		
	}
	
	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveVitalsLoincFromVuid() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.VitalsVuidToLoinc, "4688725");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVVitalsMap.CODE_SYSTEM_LOINC, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "9279-1", oCode.getCode());
			assertEquals("The text was wrong.", "Respiratory rate", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveVitalsLoincFromDodNcid() {

		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.VitalsDODNcidToLoinc, "2124");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVVitalsMap.CODE_SYSTEM_LOINC, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "9279-1", oCode.getCode());
			assertEquals("The text was wrong.", "Respiratory rate", oCode.getDisplayText());
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

    /**
     * Test a simple case of retrieving a known concept.
     */
    @Ignore("Used as a debug test.")
    @Test
    public void testRetrieveNotesLoincFromVuid() {

        try {
            List<JLVMappedCode> oCodeList = testSubject.getMappedCodeList(MappingType.NotesVuidToLoinc, "4693780");

            assertNotNull("Response should not have been null.", oCodeList);
            assertEquals("The size of code list is wrong.", oCodeList.size(), 4);
            assertEquals("The code system was wrong.", JLVNotesMap.CODE_SYSTEM_LOINC, oCodeList.get(0).getCodeSystem());

            for(JLVMappedCode oCode : oCodeList) {
                String sCode = oCode.getCode();
                String sDisplayText = oCode.getDisplayText();

                boolean hasExpectedCodes =
                        "68677-4".equals(sCode) ||
                                "38951-0".equals(sCode) ||
                                "68676-6".equals(sCode) ||
                                "68677-4".equals(sCode);

                assertTrue("Code list doesn't contain expected code values.", hasExpectedCodes);

                boolean hasExpectedDisplayText =
                        "Multi-specialty program Note".equals(sDisplayText) ||
                                "VA Compensation and Pension (C and P) examination eye".equals(sDisplayText) ||
                                "Multi-specialty program History and physical note".equals(sDisplayText) ||
                                "Multi-specialty program Note".equals(sDisplayText);

                assertTrue("Code list doesn't contain expected display text values", hasExpectedDisplayText);
            }
        }
        catch (Exception e) {
            System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
            e.printStackTrace();
            fail("An unexpected exception occurred.  Error: " + e.getMessage());
        }
    }

    /**
     * Test a simple case of retrieving a known concept.
     */
    @Ignore("Used as a debug test.")
    @Test
    public void testRetrieveNotesLoincFromDodNcid() {

        try {
            JLVMappedCode oCode = testSubject.getMappedCode(MappingType.NotesDodNcidToLoinc, "15148751");
            assertNotNull("Response should not have been null.", oCode);
            assertEquals("The code system was wrong.", JLVVitalsMap.CODE_SYSTEM_LOINC, oCode.getCodeSystem());
            assertEquals("The code was wrong.", "18748-4", oCode.getCode());
            assertEquals("The text was wrong.", "Study Report (Diagnostic Imaging) Document", oCode.getDisplayText());
        }
        catch (Exception e) {
            System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
            e.printStackTrace();
            fail("An unexpected exception occurred.  Error: " + e.getMessage());
        }
    }

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveProblemSnomedCTFromIcd9() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.ProblemsIcd9ToSnomedCT, "998");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "58581001", oCode.getCode());
			assertEquals("The text was wrong.", "Postoperative shock (disorder)", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveProblemSnomedCTFromMedcinId() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.ProblemsMedcinIdToSnomedCT, "64676");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVMedcinSnomedMap.CODE_SYSTEM_SNOMEDCT, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "305058001", oCode.getCode());
			assertEquals("The text was wrong.", "Patient encounter status (finding)", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveMedicationRxNormFromVuid() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.MedicationVuidToRxNorm, "4003686");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVDodMedicationsMap.CODE_SYSTEM_RXNORM, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "237178", oCode.getCode());
			assertEquals("The text was wrong.", "Theophylline 100 MG Extended Release Tablet", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * Test a simple case of retrieving a known concept.
	 */
	@Ignore("Used as a debug test.")
	@Test
	public void testRetrieveMedicationRxNormFromDodNcid() {
		
		try {
			JLVMappedCode oCode = testSubject.getMappedCode(MappingType.MedicationDodNcidToRxNorm, "223879");
			assertNotNull("Response should not have been null.", oCode);
			assertEquals("The code system was wrong.", JLVDodMedicationsMap.CODE_SYSTEM_RXNORM, oCode.getCodeSystem());
			assertEquals("The code was wrong.", "725192", oCode.getCode());
			assertEquals("The text was wrong.", "Calcium Citrate 200 MG / Vitamin D 200 UNT Oral Tablet", oCode.getDisplayText());
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
}
