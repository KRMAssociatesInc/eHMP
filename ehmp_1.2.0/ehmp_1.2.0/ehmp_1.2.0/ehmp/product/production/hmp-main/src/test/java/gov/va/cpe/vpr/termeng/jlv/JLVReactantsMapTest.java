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


public class JLVReactantsMapTest {
	private static final String GENERATED_CUI_CODE = "C1234";
	private static final String GENERATED_DISPLAY_TEXT = "TheUMLSText";
	
	JLVReactantsMap testSubject = null;
	Connection mockConnection = null;
	PreparedStatement mockPreparedStatement = null;
	ResultSet mockResultSet = null;

	@Before
	public void setUp() throws Exception {
		mockConnection = mock(Connection.class);
		mockPreparedStatement = mock(PreparedStatement.class);
		mockResultSet = mock(ResultSet.class);
		testSubject = new JLVReactantsMap(mockConnection);

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
		assertEquals("The code system was incorrect.", JLVReactantsMap.CODE_SYSTEM_UMLS_CUI, oMappedCode.getCodeSystem());
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
	public void testGetAllergyUMLSCuiFromVuidHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVReactantsMap.SQL_FIELD_UMLS_CODE)).thenReturn(GENERATED_CUI_CODE);
			when(mockResultSet.getString(JLVReactantsMap.SQL_FIELD_UMLS_TEXT)).thenReturn(GENERATED_DISPLAY_TEXT);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidNoMappingBecauseFieldsEmpty() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVReactantsMap.SQL_FIELD_UMLS_CODE)).thenReturn("");
			when(mockResultSet.getString(JLVReactantsMap.SQL_FIELD_UMLS_TEXT)).thenReturn("");

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidNoMappingHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidNull() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid(null);
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
	public void testGetAllergyUMLSCuiFromVuidSQLException() {
		try {
			when(mockResultSet.next()).thenThrow(new SQLException());

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidSQLExceptionOnResultSetClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockResultSet).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidSQLExceptionOnPreparedStatementClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getAllergyUMLSCuiFromVuid("123");
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
	public void testGetAllergyUMLSCuiFromVuidCreatingWithNullParameter() {
		try {
			@SuppressWarnings("unused")
			JLVReactantsMap oReactantsMap = new JLVReactantsMap(null);
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
