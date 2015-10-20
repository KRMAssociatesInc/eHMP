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
 * This class is used to retrieve mapping data from the JLV H2 Database - MEDCIN_SNOMED table.
 * 
 * @author Les.Westberg
 *
 */
public class JLVMedcinSnomedMap {
    static final Logger LOG = LoggerFactory.getLogger(JLVMedcinSnomedMap.class);
	private Connection oDBConnection = null;

	/*
						SELECT distinct @sourceSystem as sourceSystem
								,@sourceCode as sourceCode
								,[HDD].[dbo].SNOMEDCT.conceptid as targetCode
								,CASE 
									WHEN [HDD].[dbo].[SNOMEDCT].name = 'NULL' THEN null
									ELSE [HDD].[dbo].[SNOMEDCT].name
									END as name
							FROM  [HDD].[dbo].MEDCIN_SNOMED INNER JOIN
                         [HDD].[dbo].SNOMEDCT ON [HDD].[dbo].MEDCIN_SNOMED.snomedCode = [HDD].[dbo].SNOMEDCT.conceptid
							WHERE [HDD].[dbo].MEDCIN_SNOMED.medcinId = @sourceCode
	 
	 */
	
	private static final String SQL_SELECT = "SELECT medcin_snomed.medcinId, " + 
													"medcin_snomed.snomedCode, " + 
													"snomedct.conceptId, " + 
			                                        "snomedct.name " + 
	                                                       "FROM snomedct INNER JOIN medcin_snomed ON snomedct.conceptId = medcin_snomed.snomedCode " + 
			                                               "WHERE medcin_snomed.medcinId= ?";
	public static final int SQL_PARAM_MEDCIN_ID = 1;

	public static final int SQL_FIELD_MEDCIN_SNOMED_MEDCIN_ID = 1;
	public static final int SQL_FIELD_MEDCIN_SNOMED_SNOMED_CODE = 2;
	public static final int SQL_FIELD_SNOMEDCT_CONCEPT_ID = 3;
	public static final int SQL_FIELD_SNOMEDCT_NAME = 4;
	
	public static final String CODE_SYSTEM_SNOMEDCT = "http://snomed.info/sct";
	
	
	/**
	 * Cannot call the default constructor...  Must call the other one.
	 */
	@SuppressWarnings("unused")
	private JLVMedcinSnomedMap() {
	}
	
	/**
	 * Construct an object with the given database connection.
	 * 
	 * @param oDBConnection A valid database connection.
	 * @throws TermLoadException This exception is thrown if the database connection is null.
	 */
	public JLVMedcinSnomedMap(Connection oDBConnection) throws TermLoadException {
		if (oDBConnection == null) {
			throw new TermLoadException("The database connection object was null.");
		}
		this.oDBConnection = oDBConnection;
	}

	/**
	 * This method retrieves the mapped code information for the given MEDCIN ID.
	 * 
	 * @param sMedcinId The ICD9 Code for the problem.
	 * @return The SNOMED CT code information obtained from the map.
	 * @throws TermLoadException 
	 */
	public JLVMappedCode getProblemSnomedCTFromMedcinId(String sMedcinId) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		if (NullChecker.isNotNullish(sMedcinId)) {
			PreparedStatement psSelectStatement = null;
			ResultSet oResults = null;
			
			try {
				psSelectStatement = this.oDBConnection.prepareStatement(SQL_SELECT);
				psSelectStatement.setString(SQL_PARAM_MEDCIN_ID, sMedcinId);
				oResults = psSelectStatement.executeQuery();
				boolean bHasResult = false;
				// There should only be one mapping - we will take the first.
				//-----------------------------------------------------------
				if (oResults.next()) {
					JLVMappedCode oTempMappedCode = new JLVMappedCode();
					
					String sCode = oResults.getString(SQL_FIELD_SNOMEDCT_CONCEPT_ID);
					if (NullChecker.isNotNullish(sCode)) {
						oTempMappedCode.setCode(sCode);
						bHasResult = true;
					}
					
					String sText = oResults.getString(SQL_FIELD_SNOMEDCT_NAME);
					if (NullChecker.isNotNullish(sText)) {
						oTempMappedCode.setDisplayText(sText);
						bHasResult = true;
					}
					
					if (bHasResult) {
						oTempMappedCode.setCodeSystem(CODE_SYSTEM_SNOMEDCT);
						oMappedCode = oTempMappedCode;
					}
				}
			}
			catch (SQLException e) {
				throw new TermLoadException("Failed to read snomed information from the 'medcin_snomed' and 'snomedct' table.  Error: " + e.getMessage(), e);
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
