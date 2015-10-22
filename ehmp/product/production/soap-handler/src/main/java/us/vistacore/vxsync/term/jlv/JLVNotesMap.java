package us.vistacore.vxsync.term.jlv;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.utility.NullChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * This class is used to retrieve mapping data from the JLV H2 Database - NOTES & DOD_NOTES tables.
 *
 */
public class JLVNotesMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVVitalsMap.class);
    private Connection oDBConnection = null;

    private static final String SQL_SELECT_BY_VUID = "SELECT DISTINCT " +
        "vatermmastermapping_v002.sourcecode, " +
        "vatermmastermapping_v002.sourcecodetext, " +
        "vatermmastermapping_v002.mappathwayid, " +
        "loinc.loincnum, " +
        "loinc.longcommonname as loinctitle "+
        "FROM loinc INNER JOIN " +
        "vatermmastermapping_v002 on loinc.loincnum = vatermmastermapping_v002.targetcode " +
        "WHERE vatermmastermapping_v002.sourcecode = ? AND mappathwayid = 4";

    private static final String SQL_SELECT_BY_DOD_NCID = "SELECT id, " +
            "dodNcid, " +
            "loinc, " +
            "mmmName " +
            "FROM dod_notes  " +
            "WHERE dodNcid = ?";
    public static final int SQL_PARAM_VUID = 1;
    public static final int SQL_PARAM_DOD_NCID = 1;

    public static final int SQL_FIELD_VA_NOTES_SOURCE_CODE = 1;
    public static final int SQL_FIELD_VA_NOTES_SOURCE_CODE_TEXT = 2;
    public static final int SQL_FIELD_VA_NOTES_MAP_PATH_WAY_ID = 3;
    public static final int SQL_FIELD_VA_NOTES_LOINC_NUM = 4;
    public static final int SQL_FIELD_VA_NOTES_LOINC_TITLE = 5;

    public static final int SQL_FIELD_DOD_NOTES_ID = 1;
    public static final int SQL_FIELD_DOD_NOTES_NCID = 2;
    public static final int SQL_FIELD_DOD_NOTES_LOINC = 3;
    public static final int SQL_FIELD_DOD_NOTES_MMM_NAME = 4;

    //	public static final String CODE_SYSTEM_LOINC = "urn:oid:2.16.840.1.113883.6.1";
    public static final String CODE_SYSTEM_LOINC = "http://loinc.org";


    /**
     * Cannot call the default constructor...  Must call the other one.
     */
    @SuppressWarnings("unused")
    private JLVNotesMap() {
    }

    /**
     * Construct an object with the given database connection.
     *
     * @param oDBConnection A valid database connection.
     * @throws TermLoadException This exception is thrown if the database connection is null.
     */
    public JLVNotesMap(Connection oDBConnection) throws TermLoadException {
        if (oDBConnection == null) {
            throw new TermLoadException("The database connection object was null.");
        }
        this.oDBConnection = oDBConnection;
    }

    /**
     * This method retrieves the mapped code information for the given VUID.
     *
     * @param sVuid The VUID for the notes data.
     * @return A list of LOINC codes obtained from the map (one-to-many mapping).
     * @throws TermLoadException
     */
    public List<JLVMappedCode> getNotesLoincFromVuid(String sVuid) throws TermLoadException {
        List<JLVMappedCode> oMappedCodes = null;

        if (NullChecker.isNotNullish(sVuid)) {
            PreparedStatement psSelectStatement = null;
            ResultSet oResults = null;

            try {
                psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT_BY_VUID);
                psSelectStatement.setString(SQL_PARAM_VUID, sVuid);
                oResults = psSelectStatement.executeQuery();
                boolean bHasResult = false;
                // Mapping is one-to-many
                //-----------------------------------------------------------
                while (oResults.next()) {
                    JLVMappedCode oTempMappedCode = new JLVMappedCode();

                    String sLoincCode = oResults.getString(SQL_FIELD_VA_NOTES_LOINC_NUM);
                    if (NullChecker.isNotNullish(sLoincCode)) {
                        oTempMappedCode.setCode(sLoincCode);
                        bHasResult = true;
                    }

                    String sLoincText = oResults.getString(SQL_FIELD_VA_NOTES_LOINC_TITLE);
                    if (NullChecker.isNotNullish(sLoincText)) {
                        oTempMappedCode.setDisplayText(sLoincText);
                        bHasResult = true;
                    }

                    if (bHasResult) {
                        oTempMappedCode.setCodeSystem(CODE_SYSTEM_LOINC);

                        if (oMappedCodes == null)
                            oMappedCodes = new ArrayList<>();

                        oMappedCodes.add(oTempMappedCode);
                    }
                }
            }
            catch (SQLException e) {
                throw new TermLoadException("Failed to read Notes information from the 'notes' table.  Error: " + e.getMessage(), e);
            }
            finally {
                TermLoadException exceptionToThrow = null;
                if (oResults != null) {
                    try {
                        oResults.close();
                        oResults = null;
                    }
                    catch (SQLException e) {
                        String sErrorMessage = "Failed to close the result set.  Error: " + e.getMessage();
                        LOG.error(sErrorMessage, e);
                        exceptionToThrow = new TermLoadException(sErrorMessage, e);
                    }
                }
                if (psSelectStatement != null) {
                    try {
                        psSelectStatement.close();
                        psSelectStatement = null;
                    }
                    catch (SQLException e) {
                        String sErrorMessage = "Failed to close the prepared statement.  Error: " + e.getMessage();
                        LOG.error(sErrorMessage, e);
                        exceptionToThrow = new TermLoadException(sErrorMessage, e);
                    }
                }
                if (exceptionToThrow != null) {
                    throw exceptionToThrow;
                }
            }
        }

        return oMappedCodes;
    }

    /**
     * This method retrieves the mapped code information for the given DOD NCID.
     *
     * @param sDodNcid The DOD NCID for the notes data.
     * @return The LOINC code information obtained from the map.
     * @throws TermLoadException
     */
    public JLVMappedCode getNotesLoincFromDodNcid(String sDodNcid) throws TermLoadException {
        JLVMappedCode oMappedCode = null;

        if (NullChecker.isNotNullish(sDodNcid)) {
            PreparedStatement psSelectStatement = null;
            ResultSet oResults = null;

            try {
                psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT_BY_DOD_NCID);
                psSelectStatement.setString(SQL_PARAM_DOD_NCID, sDodNcid);
                oResults = psSelectStatement.executeQuery();
                boolean bHasResult = false;
                // There should only be one mapping - we will take the first.
                //-----------------------------------------------------------
                if (oResults.next()) {
                    JLVMappedCode oTempMappedCode = new JLVMappedCode();

                    String sUmlsCode = oResults.getString(SQL_FIELD_DOD_NOTES_LOINC);
                    if (NullChecker.isNotNullish(sUmlsCode)) {
                        oTempMappedCode.setCode(sUmlsCode);
                        bHasResult = true;
                    }

                    String sUmlsText = oResults.getString(SQL_FIELD_DOD_NOTES_MMM_NAME);
                    if (NullChecker.isNotNullish(sUmlsText)) {
                        oTempMappedCode.setDisplayText(sUmlsText);
                        bHasResult = true;
                    }

                    if (bHasResult) {
                        oTempMappedCode.setCodeSystem(CODE_SYSTEM_LOINC);
                        oMappedCode = oTempMappedCode;
                    }
                }
            }
            catch (SQLException e) {
                throw new TermLoadException("Failed to read notes information from the 'dod_notes' table.  Error: " + e.getMessage(), e);
            }
            finally {
                TermLoadException exceptionToThrow = null;
                if (oResults != null) {
                    try {
                        oResults.close();
                        oResults = null;
                    }
                    catch (SQLException e) {
                        String sErrorMessage = "Failed to close the result set.  Error: " + e.getMessage();
                        LOG.error(sErrorMessage, e);
                        exceptionToThrow = new TermLoadException(sErrorMessage, e);
                    }
                }
                if (psSelectStatement != null) {
                    try {
                        psSelectStatement.close();
                        psSelectStatement = null;
                    }
                    catch (SQLException e) {
                        String sErrorMessage = "Failed to close the prepared statement.  Error: " + e.getMessage();
                        LOG.error(sErrorMessage, e);
                        exceptionToThrow = new TermLoadException(sErrorMessage, e);
                    }
                }
                if (exceptionToThrow != null) {
                    throw exceptionToThrow;
                }
            }
        }

        return oMappedCode;
    }

}

