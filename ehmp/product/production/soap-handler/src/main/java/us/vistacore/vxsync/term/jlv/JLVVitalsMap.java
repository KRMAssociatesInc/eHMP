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
 * This class is used to retrieve mapping data from the JLV H2 Database - VITALS table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVVitalsMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVVitalsMap.class);
	private Connection oDBConnection = null;
	
	private static final String SQL_SELECT_BY_VUID = "SELECT id, " + 
	                                                        "dodNcid, " + 
			                                                "vuid, " + 
	                                                        "loinc, " + 
			                                                "loincName " + 
                                                     "FROM vitals  " + 
	                                                 "WHERE vuid = ?";
	private static final String SQL_SELECT_BY_DOD_NCID = "SELECT id, " + 
													            "dodNcid, " + 
													            "vuid, " + 
													            "loinc, " + 
													            "loincName " + 
											             "FROM vitals  " + 
											             "WHERE dodNcid = ?";
	public static final int SQL_PARAM_VUID = 1;
	public static final int SQL_PARAM_DOD_NCID = 1;

	public static final int SQL_FIELD_VITALS_ID = 1;
	public static final int SQL_FIELD_VITALS_DOD_NCID = 2;
	public static final int SQL_FIELD_VITALS_VUID = 3;
	public static final int SQL_FIELD_VITALS_LOINC = 4;
	public static final int SQL_FIELD_VITALS_LOINC_NAME = 5;
	
//	public static final String CODE_SYSTEM_LOINC = "urn:oid:2.16.840.1.113883.6.1";
	public static final String CODE_SYSTEM_LOINC = "http://loinc.org";
	
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVVitalsMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVVitalsMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given VUID.
	 * 
	 * @param sVuid The VUID for the vitals data.
	 * @return The LOINC code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getVitalsLoincFromVuid(String sVuid) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sVuid)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT_BY_VUID);
				psSelectStatement.setString(SQL_PARAM_VUID, sVuid);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();
					
					String sLoincCode = oResults.getString(SQL_FIELD_VITALS_LOINC);
					if (NullChecker.isNotNullish(sLoincCode)) {
						oTempMappedCode.setCode(sLoincCode);
						bHasResult = true;
					}
					
					String sLoincText = oResults.getString(SQL_FIELD_VITALS_LOINC_NAME);
					if (NullChecker.isNotNullish(sLoincText)) {
						oTempMappedCode.setDisplayText(sLoincText);
						bHasResult = true;
					}
					
					if (bHasResult) {
						oTempMappedCode.setCodeSystem(CODE_SYSTEM_LOINC);
						oMappedCode = oTempMappedCode;
					}
				}
			}
			catch (SQLException e) {
				throw new TermLoadException("Failed to read Vitals information from the 'vitals' table.  Error: " + e.getMessage(), e);
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
	
	/**
	 * This method retrieves the mapped code information for the given DOD NCID.
	 * 
	 * @param sDodNcid The DOD NCID for the vitals data.
	 * @return The LOINC code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getVitalsLoincFromDodNcid(String sDodNcid) throws TermLoadException {
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
					
					String sUmlsCode = oResults.getString(SQL_FIELD_VITALS_LOINC);
					if (NullChecker.isNotNullish(sUmlsCode)) {
						oTempMappedCode.setCode(sUmlsCode);
						bHasResult = true;
					}
					
					String sUmlsText = oResults.getString(SQL_FIELD_VITALS_LOINC_NAME);
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
				throw new TermLoadException("Failed to read vitals information from the 'vitals' table.  Error: " + e.getMessage(), e);
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
