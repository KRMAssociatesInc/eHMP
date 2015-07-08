package gov.va.cpe.vpr.termeng.jlv;

import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

/**
 * This is a unit test for the HDDDao class.
 * 
 * @author Les.Westberg
 *
 */
public class JLVHDDDaoTest {
	private static final String JLV_DB_DIRECTORY = "data/termdb-1.0-jlvdb";
	private static final String GENERATED_CODE_SYSTEM = "CODE-SYSTEM";
	private static final String GENERATED_CODE = "1234";
	private static final String GENERATED_DISPLAY = "SOME-TEXT";

	private JLVHddDao testSubject = null;
	private Connection mockConnection = null;
	private JLVReactantsMap mockJLVReactantsMap = null;
	private JLVDodAllergiesMap mockJLVDodAllergiesMap = null;
	private JLVLoincMap mockJLVLoincMap = null;
	private JLVDodLabsMap mockJLVDodLabsMap = null;
	private JLVVitalsMap mockJLVVitalsMap = null;
    private JLVNotesMap mockJLVNotesMap = null;
	private JLVIcd9SnomedMap mockJLVIcd9SnomedMap = null;
	private JLVMedcinSnomedMap mockJLVMedcinSnomedMap = null;
	private JLVDrugsMap mockJLVDrugsMap = null;
	private JLVDodMedicationsMap mockJLVDodMedicationsMap = null;
	
	/**
	 * Class to extend the underlying class and mock out items that reference external resources.
	 * 
	 * @author Les.Westberg
	 */
	private class MyHDDDao extends JLVHddDao {
		public boolean bThrowConnectionException = false;
		
		public MyHDDDao (String sJLVH2JdbcUrl) {
			super(sJLVH2JdbcUrl);
		}
		
		/**
		 * This is a helper method to clear the static data so that the object looks like it is the first time
		 * it is being used.
		 */
		public void clearStaticData() {
			super.oDBConnection = null;
			super.sJLVH2JdbcUrl = "";
			JLVHddDao.oHDDDaoInstance = null;
		}
		
		/**
		 * We cannot override a static method.  For our purposes we will implement our own.  We want 
		 * to make sure that the instance that is created is our class that contains the mocks.
		 */
		public JLVHddDao createInstanceCopy(String sJLVH2JdbcUrl) throws TermLoadException {
	    	MyHDDDao oMyHDDDao = new MyHDDDao(sJLVH2JdbcUrl);
	    	if (MyHDDDao.oHDDDaoInstance == null) {
	    		MyHDDDao.oHDDDaoInstance = oMyHDDDao;
	    	}
	    	return MyHDDDao.oHDDDaoInstance;
	    }

		@Override
		protected Connection getConnection() throws SQLException {
			if (bThrowConnectionException) {
				throw new SQLException();
			} 
			else {
				return mockConnection;
			}
		}
		
		@Override
		protected JLVReactantsMap getJLVReactantsMap() throws TermLoadException {
			return mockJLVReactantsMap;
		}
		
		@Override
		protected JLVDodAllergiesMap getJLVDodAllergiesMap() throws TermLoadException {
			return mockJLVDodAllergiesMap;
		}

		@Override
		protected JLVLoincMap getJLVLoincMap() throws TermLoadException {
			return mockJLVLoincMap;
		}
		
		@Override
		protected JLVDodLabsMap getJLVDodLabsMap() throws TermLoadException {
			return mockJLVDodLabsMap;
		}
		
		@Override
		protected JLVVitalsMap getJLVVitalsMap() throws TermLoadException {
			return mockJLVVitalsMap;
		}

        @Override
        protected JLVNotesMap getJLVNotesMap() throws TermLoadException {
            return mockJLVNotesMap;
        }

		@Override
		protected JLVIcd9SnomedMap getJLVIcd9SnomedMap() throws TermLoadException {
			return mockJLVIcd9SnomedMap;
		}

		@Override
		protected JLVMedcinSnomedMap getJLVMedcinSnomedMap() throws TermLoadException {
			return mockJLVMedcinSnomedMap;
		}

		@Override
		protected JLVDrugsMap getJLVDrugsMap() throws TermLoadException {
			return mockJLVDrugsMap;
		}
		
		@Override
		protected JLVDodMedicationsMap getJLVDodMedicationsMap() throws TermLoadException {
			return mockJLVDodMedicationsMap;
		}

	}

	/**
	 * This method is run before each test.
	 * 
	 * @throws Exception Any exceptions that occur.
	 */
	@Before
	public void setUp() throws Exception {
		mockConnection = mock(Connection.class);
		mockJLVReactantsMap = mock(JLVReactantsMap.class);
		mockJLVDodAllergiesMap = mock(JLVDodAllergiesMap.class);
		mockJLVLoincMap = mock(JLVLoincMap.class);
		mockJLVDodLabsMap = mock(JLVDodLabsMap.class);
		mockJLVVitalsMap = mock(JLVVitalsMap.class);
        mockJLVNotesMap = mock(JLVNotesMap.class);
		mockJLVIcd9SnomedMap = mock(JLVIcd9SnomedMap.class);
		mockJLVMedcinSnomedMap = mock(JLVMedcinSnomedMap.class);
		mockJLVDrugsMap = mock(JLVDrugsMap.class);
		mockJLVDodMedicationsMap = mock(JLVDodMedicationsMap.class);
		
		MyHDDDao oMyHDDDao = new MyHDDDao(createJdbcUrl());
		testSubject = oMyHDDDao.createInstanceCopy(createJdbcUrl());
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
	 * This method creates a basic mapped code response.
	 * 
	 * @return The response code.
	 */
	private JLVMappedCode createGeneratedMappedCodeResponse() {
		JLVMappedCode oMappedCode = new JLVMappedCode();
		oMappedCode.setCodeSystem(GENERATED_CODE_SYSTEM);
		oMappedCode.setCode(GENERATED_CODE);
		oMappedCode.setDisplayText(GENERATED_DISPLAY);
		return oMappedCode;
	}

    /**
     * This method creates a basic mapped code list response.
     *
     * @return The response code.
     */
    private List<JLVMappedCode> createGeneratedMappedCodeListResponse() {
        JLVMappedCode oMappedCode1 = new JLVMappedCode();
        oMappedCode1.setCodeSystem(GENERATED_CODE_SYSTEM);
        oMappedCode1.setCode(GENERATED_CODE);
        oMappedCode1.setDisplayText(GENERATED_DISPLAY);

        JLVMappedCode oMappedCode2 = new JLVMappedCode();
        oMappedCode2.setCodeSystem(GENERATED_CODE_SYSTEM);
        oMappedCode2.setCode(GENERATED_CODE);
        oMappedCode2.setDisplayText(GENERATED_DISPLAY);

        return Arrays.asList(oMappedCode1, oMappedCode2);
    }
	
	/**
	 * This method verifies that the contents of the response was our generated mapped code response.
	 * 
	 * @param oMappedCode The mapped code to be verified.
	 */
	private void verifyGeneratedMappedCodeResponse(JLVMappedCode oMappedCode) {
		assertNotNull("The mapped code should not have been null.", oMappedCode);
		assertEquals("The code system was incorrect.", GENERATED_CODE_SYSTEM, oMappedCode.getCodeSystem());
		assertEquals("The code was incorrect.", GENERATED_CODE, oMappedCode.getCode());
		assertEquals("The display text was incorrect.", GENERATED_DISPLAY, oMappedCode.getDisplayText());
	}

    /**
     * This method verifies that the contents of the response was our generated mapped code response.
     *
     * @param oMappedCodeList The mapped code list to be verified.
     */
    private void verifyGeneratedMappedCodeListResponse(List<JLVMappedCode> oMappedCodeList) {

        for(JLVMappedCode oMappedCode : oMappedCodeList) {
            assertNotNull("The mapped code should not have been null.", oMappedCode);
            assertEquals("The code system was incorrect.", GENERATED_CODE_SYSTEM, oMappedCode.getCodeSystem());
            assertEquals("The code was incorrect.", GENERATED_CODE, oMappedCode.getCode());
            assertEquals("The display text was incorrect.", GENERATED_DISPLAY, oMappedCode.getDisplayText());
        }
    }

	/**
	 * Test attempting to create an instance where the JDBC URL is not first passed in.
	 * This should throw an exception.
	 */
	@SuppressWarnings("unused")
	@Ignore("This is turned off because it cannot be automatically tested.  It is checking static variables -no other unit tests can be run before this test for this to work.  To run - you must also remove testSubject creation in the setup.")
	@Test
	public void testCreateInstanceFailureCase() {
		//--------------------------------------------------------------------------------------------------
		// BIG NOTE:::   To run this you must comment out the creating of the HDDDao in the setup method.  
		//--------------------------------------------------------------------------------------------------
		
		// Test calling the createInstance without parameters first.
		//----------------------------------------------------------
		try {
			JLVHddDao oHDDDao = JLVHddDao.createInstance();
			fail("This should have thrown an exception.");
		}
		catch (TermLoadException e) {
			// This is OK - we are expecting to see this exception.
		}
		
		// Test calling the createinstance with no JDBC URL
		//-------------------------------------------------
		try {
			JLVHddDao oHDDDao = JLVHddDao.createInstance("");
			fail("This should have thrown an exception.");
		}
		catch (TermLoadException e) {
			// This is OK - we are expecting to see this exception.
		}
		
		// Test recalling the first one - it should fail still.
		//------------------------------------------------------
		try {
			JLVHddDao oHDDDao = JLVHddDao.createInstance();
			fail("This should have thrown an exception.");
		}
		catch (TermLoadException e) {
			// This is OK - we are expecting to see this exception.
		}
	}
	
	/**
	 * This tests that the static internal instance is created correctly.
	 */
	@Ignore("This is turned off because it cannot be automatically tested.  It is checking static variables -no other unit tests can be run before this test for this to work.  To run - you must also remove testSubject creation in the setup.")
	@Test
	public void testCreateInstanceHappyPath() {
		//--------------------------------------------------------------------------------------------------
		// BIG NOTE:::   To run this you must comment out the creating of the HDDDao in the setup method.  
		//--------------------------------------------------------------------------------------------------
		JLVHddDao oHDDDao = null;
		
		try {
			oHDDDao = JLVHddDao.createInstance(createJdbcUrl());
			
			JLVHddDao oNewHDDDao = JLVHddDao.createInstance(createJdbcUrl());
			assertSame(oHDDDao, oNewHDDDao);
			
			oNewHDDDao = JLVHddDao.createInstance();
			assertSame(oHDDDao, oNewHDDDao);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an allergy VUID using the happy path.
	 */
	@Test
	public void testAllergyVuidGetMappingCodeHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVReactantsMap.getAllergyUMLSCuiFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an allergy DoD NCID using the happy path.
	 */
	@Test
	public void testAllergyDodNcidGetMappingCodeHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVDodAllergiesMap.getAllergyUMLSCuiFromDodNcid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.AllergyDODNcidToUMLSCui, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an allergy CHCS IEN using the happy path.
	 */
	@Test
	public void testAllergyChcsIenGetMappingCodeHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVDodAllergiesMap.getAllergyUMLSCuiFromChcsIen(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.AllergyCHCSIenToUMLSCui, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the retrieval of Lab LOINC text from the LOINC code using the happy path.
	 */
	@Test
	public void testLabLoincInfoFromLoincCodeHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVLoincMap.getLabLoincInfoFromLoincCode(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.LabUseLOINCtoGetText, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This method tests the translation of an DOD NCID to a LOINC code using the happy path.
	 */
	@Test
	public void testLabLoincFromDodNcidHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVDodLabsMap.getLabLoincFromDodNcid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.LabDODNcidToLOINC, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an VUID to a LOINC code using the happy path.
	 */
	@Test
	public void testVitalLoincFromVuidHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVVitalsMap.getVitalsLoincFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.VitalsVuidToLoinc, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an DOD NCID to a LOINC code using the happy path.
	 */
	@Test
	public void testVitalLoincFromDodNcidHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVVitalsMap.getVitalsLoincFromDodNcid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.VitalsDODNcidToLoinc, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

    /**
     * This method tests the translation of an VUID to a LOINC code using the happy path.
     */
    @Test
    public void testNoteLoincFromVuidHappyPath() {
        try {
            ((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
            when(mockJLVNotesMap.getNotesLoincFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeListResponse());

            List<JLVMappedCode> oMappedCodeList = testSubject.getMappedCodeList(MappingType.VitalsVuidToLoinc, "9999");
            verifyGeneratedMappedCodeListResponse(oMappedCodeList);
        }
        catch (Exception e) {
            System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
            e.printStackTrace();
            fail("An unexpected exception occurred.  Error: " + e.getMessage());
        }
    }

    /**
     * This method tests the translation of an DOD NCID to a LOINC code using the happy path.
     */
    @Test
    public void testNoteLoincFromDodNcidHappyPath() {
        try {
            ((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
            when(mockJLVNotesMap.getNotesLoincFromDodNcid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());

            JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.NotesDodNcidToLoinc, "9999");
            verifyGeneratedMappedCodeResponse(oMappedCode);
        }
        catch (Exception e) {
            System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
            e.printStackTrace();
            fail("An unexpected exception occurred.  Error: " + e.getMessage());
        }
    }


    /**
	 * This method tests the translation of an VA ICD9 Code to a SNOMED CT code using the happy path.
	 */
	@Test
	public void testProblemSnomedCTFromIcd9HappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVIcd9SnomedMap.getProblemSnomedCTFromIcd9(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.ProblemsIcd9ToSnomedCT, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of an DOD Medcin ID to a SNOMED CT code using the happy path.
	 */
	@Test
	public void testProblemSnomedCTFromMedcinIdHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVMedcinSnomedMap.getProblemSnomedCTFromMedcinId(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.ProblemsMedcinIdToSnomedCT, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of a VUID to an RXNORM code using the happy path.
	 */
	@Test
	public void testMedicationRxNormFromVuidHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVDrugsMap.getMedicationRxNormFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.MedicationVuidToRxNorm, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This method tests the translation of a DoD NCID to an RXNORM code using the happy path.
	 */
	@Test
	public void testMedicationRxNormFromDodNcidHappyPath() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVDodMedicationsMap.getMedicationRxNormFromDodNcid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.MedicationDodNcidToRxNorm, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * Call translation twice to verify a branch on the underlying openDatabase method.
	 */
	@Test
	public void testAllergyVuidGetMappingCodeOpenDatabase() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			when(mockJLVReactantsMap.getAllergyUMLSCuiFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);

			oMappedCode = testSubject.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, "9999");
			verifyGeneratedMappedCodeResponse(oMappedCode);
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * Call translation twice to verify a branch on the underlying openDatabase method.
	 */
	@Test
	public void testExceptionOnOpenConnection() {
		try {
			((MyHDDDao) testSubject).clearStaticData();		// Need to clear things out so that this method thinks it is the first to run.
			((MyHDDDao) testSubject).bThrowConnectionException = true;
			when(mockJLVReactantsMap.getAllergyUMLSCuiFromVuid(any(String.class))).thenReturn(createGeneratedMappedCodeResponse());
			
			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getMappedCode(MappingType.AllergyVUIDtoUMLSCui, "9999");
			fail("This should have thrown an exception.");
		}
		catch (Exception e) {
			// We should see an exception - no error here.
		}
	}
}
