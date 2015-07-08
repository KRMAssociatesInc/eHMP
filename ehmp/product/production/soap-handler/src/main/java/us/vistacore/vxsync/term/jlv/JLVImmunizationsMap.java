package us.vistacore.vxsync.term.jlv;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.utility.NullChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is used to retrieve mapping data from the JLV H2 Database - CPT_CVX tables.
 *
 */
public class JLVImmunizationsMap {

    static final Logger LOG = LoggerFactory.getLogger(JLVImmunizationsMap.class);
    private Connection oDBConnection = null;

    private static final String SQL_SELECT = "SELECT id, cvxCode, cvxShortDescription, cvxFullDescription FROM cpt_cvx WHERE cptCode = ? and cvxCode is not null";
    public static final int SQL_PARAM_CPT_CODE = 1;
    public static final int SQL_FIELD_ID = 1;
    public static final int SQL_FIELD_CVX_CODE = 2;
    public static final int SQL_FIELD_CVX_SHORT_DESCRIPTION = 3;
    public static final int SQL_FIELD_FULL_DESCRIPTION = 4;
    public static final String CODE_SYSTEM_CVX = "urn:oid:2.16.840.1.113883.12.292";


    /**
     * Cannot call the default constructor...  Must call the other one.
     */
    @SuppressWarnings("unused")
    private JLVImmunizationsMap() {
    }

    /**
     * Construct an object with the given database connection.
     *
     * @param oDBConnection A valid database connection.
     * @throws TermLoadException This exception is thrown if the database connection is null.
     */
    public JLVImmunizationsMap(Connection oDBConnection) throws TermLoadException {
        if (oDBConnection == null) {
            throw new TermLoadException("The database connection object was null.");
        }
        this.oDBConnection = oDBConnection;
    }

    /**
     * This method retrieves the mapped code information for the given CPT.
     *
     * @param sCpt The CPT for the immunization.
     * @return The CVX code information obtained from the map.
     * @throws TermLoadException
     */
    public JLVMappedCode getImmunizationCvxFromCpt(String sCpt) throws TermLoadException {
        JLVMappedCode oMappedCode = null;

        if (NullChecker.isNotNullish(sCpt)) {
            PreparedStatement psSelectStatement = null;
            ResultSet oResults = null;

            try {
                psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT);
                psSelectStatement.setString(SQL_PARAM_CPT_CODE, sCpt);
                oResults = psSelectStatement.executeQuery();
                boolean bHasResult = false;
                // There should only be one mapping - we will take the first.
                //-----------------------------------------------------------
                if (oResults.next()) {
                    JLVMappedCode oTempMappedCode = new JLVMappedCode();

                    String sCvx = oResults.getString(SQL_FIELD_CVX_CODE);
                    if (NullChecker.isNotNullish(sCvx)) {
                        oTempMappedCode.setCode(sCvx);
                        bHasResult = true;
                    }

                    String sCvxText = oResults.getString(SQL_FIELD_FULL_DESCRIPTION);
                    if (NullChecker.isNotNullish(sCvxText)) {
                        oTempMappedCode.setDisplayText(sCvxText);
                        bHasResult = true;
                    }

                    if (bHasResult) {
                        oTempMappedCode.setCodeSystem(CODE_SYSTEM_CVX);

                        oMappedCode = oTempMappedCode;
                    }
                }

            }
            catch (SQLException e) {
                throw new TermLoadException("Failed to read Immunization information from the 'cpt_cvx' table.  Error: " + e.getMessage(), e);
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
