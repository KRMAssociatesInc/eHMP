package gov.va.cpe.vpr.termeng.jlv;

import gov.va.cpe.vpr.termeng.TermLoadException;
import org.junit.Before;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;

import static org.junit.Assert.*;

public class JLVImmunizationsMapTest {
    private static final String GENERATED_CVX_CODE = "20";
    private static final String GENERATED_DISPLAY_TEXT = "TheCVXText";

    JLVImmunizationsMap testSubject = null;
    Connection mockConnection = null;
    PreparedStatement mockPreparedStatement = null;
    ResultSet mockResultSet = null;

    @Before
    public void setUp() throws Exception {
        mockConnection = mock(Connection.class);
        mockPreparedStatement = mock(PreparedStatement.class);
        mockResultSet = mock(ResultSet.class);
        testSubject = new JLVImmunizationsMap(mockConnection);

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
        assertEquals("The code system was incorrect.", JLVImmunizationsMap.CODE_SYSTEM_CVX, oMappedCode.getCodeSystem());
        assertEquals("The code was incorrect.", GENERATED_CVX_CODE, oMappedCode.getCode());
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
    public void testGetImmunizationCvxFromCptHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getString(JLVImmunizationsMap.SQL_FIELD_CVX_CODE)).thenReturn(GENERATED_CVX_CODE);
            when(mockResultSet.getString(JLVImmunizationsMap.SQL_FIELD_FULL_DESCRIPTION)).thenReturn(GENERATED_DISPLAY_TEXT);

            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptNoMappingBecauseFieldsEmpty() {
        try {
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getString(JLVImmunizationsMap.SQL_FIELD_CVX_CODE)).thenReturn("");
            when(mockResultSet.getString(JLVImmunizationsMap.SQL_FIELD_FULL_DESCRIPTION)).thenReturn("");

            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptNoMappingHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptNull() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt(null);
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
    public void testGetImmunizationCvxFromCptSQLException() {
        try {
            when(mockResultSet.next()).thenThrow(new SQLException());

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptSQLExceptionOnResultSetClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockResultSet).close();

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptSQLExceptionOnPreparedStatementClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getImmunizationCvxFromCpt("123");
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
    public void testGetImmunizationCvxFromCptCreatingWithNullParameter() {
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
