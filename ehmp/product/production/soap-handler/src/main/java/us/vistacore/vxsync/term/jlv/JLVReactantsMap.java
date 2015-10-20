package us.vistacore.vxsync.term.jlv;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.utility.NullChecker;

/**
 * This class is used to retrieve mapping data from the JLV H2 Database - REACTANTS table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVReactantsMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVReactantsMap.class);
	private Connection oDBConnection = null;
	
	private static final String SQL_SELECT = "SELECT id, umlsCode, vuid, vistaText, umlstext FROM reactants WHERE vuid = ?";
	public static final int SQL_PARAM_VUID = 1;
	public static final int SQL_FIELD_ID = 1;
	public static final int SQL_FIELD_UMLS_CODE = 2;
	public static final int SQL_FIELD_VUID = 3;
	public static final int SQL_FIELD_VISTA_TEXT = 4;
	public static final int SQL_FIELD_UMLS_TEXT = 5;
	public static final String CODE_SYSTEM_UMLS_CUI = "urn:oid:2.16.840.1.113883.6.86";
	
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVReactantsMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVReactantsMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given VUID.
	 * 
	 * @param sVuid The VUID for the allergy.
	 * @return The UMLS CUI code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getAllergyUMLSCuiFromVuid(String sVuid) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sVuid)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT);
				psSelectStatement.setString(SQL_PARAM_VUID, sVuid);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();

					String sUmlsCode = oResults.getString(SQL_FIELD_UMLS_CODE);
					if (NullChecker.isNotNullish(sUmlsCode)) {
						oTempMappedCode.setCode(sUmlsCode);
						bHasResult = true;
					}
					
					String sUmlsText = oResults.getString(SQL_FIELD_UMLS_TEXT);
					if (NullChecker.isNotNullish(sUmlsText)) {
						oTempMappedCode.setDisplayText(sUmlsText);
						bHasResult = true;
					}
					
					if (bHasResult) {
						oTempMappedCode.setCodeSystem(CODE_SYSTEM_UMLS_CUI);
						
						oMappedCode = oTempMappedCode;
					}
				}
				
			}
			catch (SQLException e) {
				throw new TermLoadException("Failed to read Allergy information from the 'reactants' table.  Error: " + e.getMessage(), e);
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
