package gov.va.cpe.vpr.termeng.jlv;

import static org.junit.Assert.*;

import gov.va.cpe.vpr.termeng.TermLoadException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;


public class JLVDodAllergiesMapTest {
	private static final String GENERATED_CUI_CODE = "C1234";
	private static final String GENERATED_DISPLAY_TEXT = "TheUMLSText";
	
	JLVDodAllergiesMap testSubject = null;
	Connection mockConnection = null;
	PreparedStatement mockPreparedStatement = null;
	ResultSet mockResultSet = null;

	@Before
	public void setUp() throws Exception {
		mockConnection = mock(Connection.class);
		mockPreparedStatement = mock(PreparedStatement.class);
		mockResultSet = mock(ResultSet.class);
		testSubject = new JLVDodAllergiesMap(mockConnection);

		// Set up the common when clauses.
		//---------------------------------
		when(mockConnection.prepareStatement(any(String.class))).thenReturn(mockPreparedStatement);
		when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
	}
	
	/**
	 * Verify that the content returned was the generated content we expected.
	 * 
	 * @param oMappedCode The code that is being verified.
	 */
	private void verifyGeneratedContent(JLVMappedCode oMappedCode) {
		assertNotNull("The mapped code should not have been null.", oMappedCode);
		assertEquals("The code system was incorrect.", JLVDodAllergiesMap.CODE_SYSTEM_UMLS_CUI, oMappedCode.getCodeSystem());
		assertEquals("The code was incorrect.", GENERATED_CUI_CODE, oMappedCode.getCode());
		assertEquals("The display text was incorrect.", GENERATED_DISPLAY_TEXT, oMappedCode.getDisplayText());
	}
	
	/**
	 * Verify that the close statements are called on our resources.
	 * 
	 * @throws SQLException
	 */
	private void verifyCloseMethodsCalled() throws SQLException {
		verify(mockPreparedStatement, times(1)).close();
		verify(mockResultSet, times(1)).close();
	}

	/**
	 * This tests the happy path.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_DOD_ALLERGIES_UMLS_CUI)).thenReturn(GENERATED_CUI_CODE);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_REACTANTS_UMLS_TEXT)).thenReturn(GENERATED_DISPLAY_TEXT);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			verifyGeneratedContent(oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests the happy path for no mapping because fields were empty.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenNoMappingBecauseFieldsEmpty() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_DOD_ALLERGIES_UMLS_CUI)).thenReturn("");
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_REACTANTS_UMLS_TEXT)).thenReturn("");

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			assertNull("The result should have been null", oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests the happy path with no mapping found.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenNoMappingHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			assertNull("The result should have been null", oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests the with null parameters.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenNull() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen(null);
			assertNull("The result should have been null", oMappedCode);
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests for SQL Exception.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenSQLException() {
		try {
			when(mockResultSet.next()).thenThrow(new SQLException());

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests for SQL Exception on closing result set.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenSQLExceptionOnResultSetClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockResultSet).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests for SQL Exception on closing the prepared statement.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenSQLExceptionOnPreparedStatementClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromChcsIen("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests attempting to construct this object with a null parameter.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromChcsIenCreatingWithNullParameter() {
		try {
			@SuppressWarnings("unused")
			JLVDodAllergiesMap oDodAllergiesMap = new JLVDodAllergiesMap(null);
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	//---------------------------------------------------------------------------
	// The next set of tests are used to test the DoD NCID -> UMLS CUI method
	//---------------------------------------------------------------------------
	/**
	 * This tests the happy path.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_DOD_ALLERGIES_UMLS_CUI)).thenReturn(GENERATED_CUI_CODE);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_REACTANTS_UMLS_TEXT)).thenReturn(GENERATED_DISPLAY_TEXT);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			verifyGeneratedContent(oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests the happy path for no mapping because fields were empty.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidNoMappingBecauseFieldsEmpty() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_DOD_ALLERGIES_UMLS_CUI)).thenReturn("");
			when(mockResultSet.getString(JLVDodAllergiesMap.SQL_FIELD_REACTANTS_UMLS_TEXT)).thenReturn("");

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			assertNull("The result should have been null", oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests the happy path with no mapping found.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidNoMappingHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			assertNull("The result should have been null", oMappedCode);
			verifyCloseMethodsCalled();
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests the with null parameters.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidNull() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid(null);
			assertNull("The result should have been null", oMappedCode);
		} 
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests for SQL Exception.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidSQLException() {
		try {
			when(mockResultSet.next()).thenThrow(new SQLException());

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}

	/**
	 * This tests for SQL Exception on closing result set.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidSQLExceptionOnResultSetClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockResultSet).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests for SQL Exception on closing the prepared statement.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidSQLExceptionOnPreparedStatementClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromDodNcid("123");
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
			try {
				verifyCloseMethodsCalled();
			}
			catch (Exception e2) {
				System.out.println("An unexpected exception occurred.  Error: " + e2.getMessage());
				e2.printStackTrace();
				fail("An unexpected exception occurred.  Error: " + e2.getMessage());
			}
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	/**
	 * This tests attempting to construct this object with a null parameter.
	 */
	@Test
	public void testGetAllergyUMLSCuiFromDodNcidCreatingWithNullParameter() {
		try {
			@SuppressWarnings("unused")
			JLVDodAllergiesMap oDodAllergiesMap = new JLVDodAllergiesMap(null);
			fail("There should have been a TermLoadException thrown.");
		}
		catch (TermLoadException e) {
			// We expected this exception.
		}
		catch (Exception e) {
			System.out.println("An unexpected exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unexpected exception occurred.  Error: " + e.getMessage());
		}
	}
	
	
}
