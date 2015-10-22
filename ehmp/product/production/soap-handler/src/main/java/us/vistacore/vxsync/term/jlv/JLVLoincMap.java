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
 * This class is used to retrieve mapping data from the JLV H2 Database - LOINC table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVLoincMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVLoincMap.class);
	private Connection oDBConnection = null;
	
	private static final String SQL_SELECT = "SELECT internalId, loincNum, component, shortName, longCommonName FROM loinc WHERE loincNum = ?";
	public static final int SQL_PARAM_LOINC = 1;
	public static final int SQL_FIELD_INTERNAL_ID = 1;
	public static final int SQL_FIELD_LOINC_NUM = 2;
	public static final int SQL_FIELD_COMPONENT = 3;
	public static final int SQL_FIELD_SHORT_NAME = 4;
	public static final int SQL_FIELD_LONG_COMMON_NAME = 5;
//	public static final String CODE_SYSTEM_LOINC = "urn:oid:2.16.840.1.113883.6.1";
	public static final String CODE_SYSTEM_LOINC = "http://loinc.org";
	
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVLoincMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVLoincMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given LOINC Code.
	 * 
	 * @param sLoinc The LOINC code for the lab information.
	 * @return The LOINC code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getLabLoincInfoFromLoincCode(String sLoinc) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sLoinc)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT);
				psSelectStatement.setString(SQL_PARAM_LOINC, sLoinc);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();

					String sCode = oResults.getString(SQL_FIELD_LOINC_NUM);
					if (NullChecker.isNotNullish(sCode)) {
						oTempMappedCode.setCode(sCode);
						bHasResult = true;
					}
					
					String sText = oResults.getString(SQL_FIELD_LONG_COMMON_NAME);
					if (NullChecker.isNotNullish(sText)) {
						oTempMappedCode.setDisplayText(sText);
						bHasResult = true;
					}
					
					if (bHasResult) {
						oTempMappedCode.setCodeSystem(CODE_SYSTEM_LOINC);
						
						oMappedCode = oTempMappedCode;
					}
				}
				
			}
			catch (SQLException e) {
				throw new TermLoadException("Failed to read lab loinc information from the 'loinc' table.  Error: " + e.getMessage(), e);
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
