package us.vistacore.vxsync.term.jlv;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.utility.NullChecker;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is used to retrieve mapping data from the JLV H2 Database - DOD_MEDICATIONS table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVDodMedicationsMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVDodMedicationsMap.class);
	private Connection oDBConnection = null;
	
	private static final String SQL_SELECT = "SELECT dod_medications.dodNcid, " + 
													"dod_medications.rxNorm, " + 
													"drugs.rxNormCode, " + 
													"drugs.rxNormText " + 
						                     "FROM dod_medications INNER JOIN drugs ON dod_medications.rxnorm = drugs.rxNormCode " + 
						                     "WHERE dod_medications.dodNcid = ?";

	public static final int SQL_PARAM_DOD_NCID = 1;

	public static final int SQL_FIELD_DOD_MEDICATIONS_DOD_NCID = 1;
	public static final int SQL_FIELD_DOD_MEDICATIONS_RXNORM = 2;
	public static final int SQL_FIELD_DRUGS_RXNORM_CODE = 3;
	public static final int SQL_FIELD_DRUGS_RXNORM_TEXT = 4;
	
	public static final String CODE_SYSTEM_RXNORM = "urn:oid:2.16.840.1.113883.6.88";
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVDodMedicationsMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVDodMedicationsMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given DOD NCID Code.
	 * 
	 * @param sDodNcid The DOD NCID Code for the problem.
	 * @return The RxNORM code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getMedicationRxNormFromDodNcid(String sDodNcid) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sDodNcid)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT);
				psSelectStatement.setString(SQL_PARAM_DOD_NCID, sDodNcid);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();
					
					String sCode = oResults.getString(SQL_FIELD_DRUGS_RXNORM_CODE);
					if (NullChecker.isNotNullish(sCode)) {
						oTempMappedCode.setCode(sCode);
						bHasResult = true;
					}
					
					String sText = oResults.getString(SQL_FIELD_DRUGS_RXNORM_TEXT);
					if (NullChecker.isNotNullish(sText)) {
						oTempMappedCode.setDisplayText(sText);
						bHasResult = true;
					}
					
					if (bHasResult) {
						oTempMappedCode.setCodeSystem(CODE_SYSTEM_RXNORM);
						oMappedCode = oTempMappedCode;
					}
				}
			}
			catch (SQLException e) {
				throw new TermLoadException("Failed to read RXNORM information from the 'dod_medications' table.  Error: " + e.getMessage(), e);
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
