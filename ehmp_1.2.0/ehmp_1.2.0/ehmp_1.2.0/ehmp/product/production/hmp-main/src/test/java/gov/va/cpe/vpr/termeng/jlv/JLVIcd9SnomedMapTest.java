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


public class JLVIcd9SnomedMapTest {
	private static final String GENERATED_SNOMED_CT_CODE = "58581001";
	private static final String GENERATED_DISPLAY_TEXT = "Postoperative shock (disorder)";
	private static final String GENERATED_ICD9_CODE = "998";
	
	JLVIcd9SnomedMap testSubject = null;
	Connection mockConnection = null;
	PreparedStatement mockPreparedStatement = null;
	ResultSet mockResultSet = null;

	@Before
	public void setUp() throws Exception {
		mockConnection = mock(Connection.class);
		mockPreparedStatement = mock(PreparedStatement.class);
		mockResultSet = mock(ResultSet.class);
		testSubject = new JLVIcd9SnomedMap(mockConnection);

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
		assertEquals("The code system was incorrect.", JLVIcd9SnomedMap.CODE_SYSTEM_SNOMEDCT, oMappedCode.getCodeSystem());
		assertEquals("The code was incorrect.", GENERATED_SNOMED_CT_CODE, oMappedCode.getCode());
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
	public void testGetSnomedCTFromICD9HappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVIcd9SnomedMap.SQL_FIELD_SNOMEDCT_CONCEPT_ID)).thenReturn(GENERATED_SNOMED_CT_CODE);
			when(mockResultSet.getString(JLVIcd9SnomedMap.SQL_FIELD_SNOMEDCT_NAME)).thenReturn(GENERATED_DISPLAY_TEXT);

			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeNoMappingBecauseFieldsEmpty() {
		try {
			when(mockResultSet.next()).thenReturn(true);
			when(mockResultSet.getString(JLVIcd9SnomedMap.SQL_FIELD_SNOMEDCT_CONCEPT_ID)).thenReturn("");
			when(mockResultSet.getString(JLVIcd9SnomedMap.SQL_FIELD_SNOMEDCT_NAME)).thenReturn("");

			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeNoMappingHappyPath() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeNull() {
		try {
			when(mockResultSet.next()).thenReturn(false);

			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(null);
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
	public void testSnomedCTFromIcd9CodeSQLException() {
		try {
			when(mockResultSet.next()).thenThrow(new SQLException());

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeSQLExceptionOnResultSetClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockResultSet).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeSQLExceptionOnPreparedStatementClose() {
		try {
			when(mockResultSet.next()).thenReturn(false);
			Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

			@SuppressWarnings("unused")
			JLVMappedCode oMappedCode = testSubject.getProblemSnomedCTFromIcd9(GENERATED_ICD9_CODE);
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
	public void testSnomedCTFromIcd9CodeCreatingWithNullParameter() {
		try {
			@SuppressWarnings("unused")
			JLVIcd9SnomedMap oDodLabsMap = new JLVIcd9SnomedMap(null);
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
