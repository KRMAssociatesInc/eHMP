package gov.va.cpe.vpr.termeng.jlv;

import gov.va.cpe.vpr.termeng.TermLoadException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class JLVNotesMapTest {
    private static final String GENERATED_LOINC_CODE = "15148751";
    private static final String GENERATED_DISPLAY_TEXT = "Study Report (Diagnostic Imaging) Document";

    JLVNotesMap testSubject = null;
    Connection mockConnection = null;
    PreparedStatement mockPreparedStatement = null;
    ResultSet mockResultSet = null;

    @Before
    public void setUp() throws Exception {
        mockConnection = mock(Connection.class);
        mockPreparedStatement = mock(PreparedStatement.class);
        mockResultSet = mock(ResultSet.class);
        testSubject = new JLVNotesMap(mockConnection);

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
        assertEquals("The code system was incorrect.", JLVNotesMap.CODE_SYSTEM_LOINC, oMappedCode.getCodeSystem());
        assertEquals("The code was incorrect.", GENERATED_LOINC_CODE, oMappedCode.getCode());
        assertEquals("The display text was incorrect.", GENERATED_DISPLAY_TEXT, oMappedCode.getDisplayText());
    }

    /**
     * Verify that the content returned was the generated content we expected.
     *
     * @param oMappedCodeList The code list that is being verified.
     */
    private void verifyGeneratedContentList(List<JLVMappedCode> oMappedCodeList) {

        for(JLVMappedCode oMappedCode : oMappedCodeList) {
            assertNotNull("The mapped code should not have been null.", oMappedCode);
            assertEquals("The code system was incorrect.", JLVNotesMap.CODE_SYSTEM_LOINC, oMappedCode.getCodeSystem());
            assertEquals("The code was incorrect.", GENERATED_LOINC_CODE, oMappedCode.getCode());
            assertEquals("The display text was incorrect.", GENERATED_DISPLAY_TEXT, oMappedCode.getDisplayText());
        }
    }

    /**
     * Verify that the close statements are called on our resources.
     *
     * @throws java.sql.SQLException
     */
    private void verifyCloseMethodsCalled() throws SQLException {
        verify(mockPreparedStatement, times(1)).close();
        verify(mockResultSet, times(1)).close();
    }

    /**
     * This tests the happy path.
     */
    @Test
    public void testGetNotesLoincFromVuidHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(true).thenReturn(false);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_VA_NOTES_LOINC_NUM)).thenReturn(GENERATED_LOINC_CODE);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_VA_NOTES_LOINC_TITLE)).thenReturn(GENERATED_DISPLAY_TEXT);

            List<JLVMappedCode> oMappedCodeList = testSubject.getNotesLoincFromVuid("123");
            verifyGeneratedContentList(oMappedCodeList);
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
    public void testGetNotesLoincFromVuidNoMappingBecauseFieldsEmpty() {
        try {
            when(mockResultSet.next()).thenReturn(true).thenReturn(false);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_VA_NOTES_LOINC_NUM)).thenReturn("");
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_VA_NOTES_LOINC_TITLE)).thenReturn("");

            List<JLVMappedCode> oMappedCodeList = testSubject.getNotesLoincFromVuid("123");
            assertNull("The result should have been null", oMappedCodeList);
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
    public void testGetNotesLoincFromVuidNoMappingHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            List<JLVMappedCode> oMappedCodeList = testSubject.getNotesLoincFromVuid("123");
            assertNull("The result should have been null", oMappedCodeList);
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
    public void testGetNotesLoincFromVuidNull() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            List<JLVMappedCode> oMappedCodeList = testSubject.getNotesLoincFromVuid(null);
            assertNull("The result should have been null", oMappedCodeList);
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
    public void testGetNotesLoincFromVuidSQLException() {
        try {
            when(mockResultSet.next()).thenThrow(new SQLException());

            @SuppressWarnings("unused")
            List<JLVMappedCode> oMappedCodeList = testSubject.getNotesLoincFromVuid("123");
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
    public void testGetNotesLoincFromVuidSQLExceptionOnResultSetClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockResultSet).close();

            @SuppressWarnings("unused")
            List<JLVMappedCode> oMappedCode = testSubject.getNotesLoincFromVuid("123");
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
    public void testGetNotesLoincFromVuidSQLExceptionOnPreparedStatementClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

            @SuppressWarnings("unused")
            List<JLVMappedCode> oMappedCode = testSubject.getNotesLoincFromVuid("123");
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
    public void testGetNotesLoincFromVuidCreatingWithNullParameter() {
        try {
            @SuppressWarnings("unused")
            JLVNotesMap oJLVNotesMap = new JLVNotesMap(null);
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
    // The next set of tests are used to test the DoD NCID -> LOINC method
    //---------------------------------------------------------------------------
    /**
     * This tests the happy path.
     */
    @Test
    public void testGetNotesLoincFromDodNcidHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_DOD_NOTES_LOINC)).thenReturn(GENERATED_LOINC_CODE);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_DOD_NOTES_MMM_NAME)).thenReturn(GENERATED_DISPLAY_TEXT);

            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidNoMappingBecauseFieldsEmpty() {
        try {
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_DOD_NOTES_LOINC)).thenReturn("");
            when(mockResultSet.getString(JLVNotesMap.SQL_FIELD_DOD_NOTES_MMM_NAME)).thenReturn("");

            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidNoMappingHappyPath() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidNull() {
        try {
            when(mockResultSet.next()).thenReturn(false);

            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid(null);
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
    public void testGetVitalsLoincFromDodNcidSQLException() {
        try {
            when(mockResultSet.next()).thenThrow(new SQLException());

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidSQLExceptionOnResultSetClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockResultSet).close();

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidSQLExceptionOnPreparedStatementClose() {
        try {
            when(mockResultSet.next()).thenReturn(false);
            Mockito.doThrow(new SQLException()).when(mockPreparedStatement).close();

            @SuppressWarnings("unused")
            JLVMappedCode oMappedCode = testSubject.getNotesLoincFromDodNcid("123");
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
    public void testGetNotesLoincFromDodNcidCreatingWithNullParameter() {
        try {
            @SuppressWarnings("unused")
            JLVNotesMap oDodNotesMap = new JLVNotesMap(null);
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
