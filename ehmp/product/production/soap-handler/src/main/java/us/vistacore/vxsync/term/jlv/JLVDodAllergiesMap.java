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
 * This class is used to retrieve mapping data from the JLV H2 Database - DOD_ALLERGIES table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVDodAllergiesMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVDodAllergiesMap.class);
	private Connection oDBConnection = null;
	
	private static final String SQL_SELECT_BY_CHCS_IEN = "SELECT dod_allergies.chcsAllergyIen, " + 
	                                                             "dod_allergies.chcsName, " + 
			                                                     "dod_allergies.umlsCui, " + 
	                                                             "reactants.umlsCode, " + 
			                                                     "reactants.umlsText " + 
	                                                       "FROM dod_allergies LEFT OUTER JOIN reactants ON dod_allergies.umlscui = reactants.umlscode " + 
			                                               "WHERE dod_allergies.umlsCui IS NOT NULL AND " + 
	                                                             "dod_allergies.chcsAllergyIen = ?";
	private static final String SQL_SELECT_BY_DOD_NCID = "SELECT dod_allergies.dodNcid, " + 
													            "dod_allergies.dodName, " + 
													            "dod_allergies.umlsCui, " + 
													            "reactants.umlsCode, " + 
													            "reactants.umlsText " + 
													      "FROM dod_allergies LEFT OUTER JOIN reactants ON dod_allergies.umlscui = reactants.umlscode " + 
													      "WHERE dod_allergies.umlsCui IS NOT NULL AND " + 
													            "dod_allergies.dodNcid = ?";
	public static final int SQL_PARAM_CHCS_IEN = 1;
	public static final int SQL_PARAM_DOD_NCID = 1;

	public static final int SQL_FIELD_DOD_ALLERGIES_CHCS_ALLERGY_IEN = 1;
	public static final int SQL_FIELD_DOD_ALLERGIES_CHCS_DOD_NCID = 1;
	public static final int SQL_FIELD_DOD_ALLERGIES_CHCS_NAME = 2;
	public static final int SQL_FIELD_DOD_ALLERGIES_DOD_NAME = 2;
	public static final int SQL_FIELD_DOD_ALLERGIES_UMLS_CUI = 3;
	public static final int SQL_FIELD_REACTANTS_UMLS_CODE = 4;
	public static final int SQL_FIELD_REACTANTS_UMLS_TEXT = 5;
	
	public static final String CODE_SYSTEM_UMLS_CUI = "urn:oid:2.16.840.1.113883.6.86";
	
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVDodAllergiesMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVDodAllergiesMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given CHCS IEN.
	 * 
	 * @param sChcsIen The CHCS IEN for the allergy.
	 * @return The UMLS CUI code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getAllergyUMLSCuiFromChcsIen(String sChcsIen) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sChcsIen)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT_BY_CHCS_IEN);
				psSelectStatement.setString(SQL_PARAM_CHCS_IEN, sChcsIen);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();
					
					String sUmlsCode = oResults.getString(SQL_FIELD_DOD_ALLERGIES_UMLS_CUI);
					if (NullChecker.isNotNullish(sUmlsCode)) {
						oTempMappedCode.setCode(sUmlsCode);
						bHasResult = true;
					}
					
					String sUmlsText = oResults.getString(SQL_FIELD_REACTANTS_UMLS_TEXT);
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
				throw new TermLoadException("Failed to read Allergy information from the 'dod_allergies' and 'reactants' table.  Error: " + e.getMessage(), e);
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
	 * @param sDodNcid The DOD NCID for the allergy.
	 * @return The UMLS CUI code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getAllergyUMLSCuiFromDodNcid(String sDodNcid) throws TermLoadException {
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
					
					String sUmlsCode = oResults.getString(SQL_FIELD_DOD_ALLERGIES_UMLS_CUI);
					if (NullChecker.isNotNullish(sUmlsCode)) {
						oTempMappedCode.setCode(sUmlsCode);
						bHasResult = true;
					}
					
					String sUmlsText = oResults.getString(SQL_FIELD_REACTANTS_UMLS_TEXT);
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
				throw new TermLoadException("Failed to read Allergy information from the 'dod_allergies' and 'reactants' table.  Error: " + e.getMessage(), e);
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
