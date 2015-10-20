package us.vistacore.vxsync.term.load.jlv;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.term.jlv.IJLVH2PageLoadUtil;
import us.vistacore.vxsync.term.jlv.JLVH2HelperUtil;
import us.vistacore.vxsync.utility.NullChecker;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * This class is used to load the LOINC information from the JLV LOINC spreadsheet page into
 * the loinc table in the h2 database.
 * 
 * @author Les.Westberg
 */
public class JLVH2LoincLoadUtil implements IJLVH2PageLoadUtil {
	private static final String PAGE_NAME = "LOINC";
	private static final String CRLF = System.getProperty("line.separator");
	private static final Object TITLE_ROW_CELL_1_TEXT = "LOINC_NUM";
	private static final String SQL_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS loinc (internalId INT PRIMARY KEY, " + 
																			               "loincNum VARCHAR(20), " + 
		                                                                                   "component VARCHAR(500), " + 
		                                                                                   "shortName VARCHAR(100)," +
		                                                                                   "longCommonName VARCHAR(500))";
	private static final String SQL_CLEAR_ALL = "DELETE FROM loinc";
	private static final String SQL_INSERT = "INSERT INTO loinc VALUES (?, ?, ?, ?, ?)";
	private static final int SQL_FIELD_INTERNAL_ID = 1;
	private static final int SQL_FIELD_LOINC_NUM = 2;
	private static final int SQL_FIELD_COMPONENT = 3;
	private static final int SQL_FIELD_SHORT_NAME = 4;
	private static final int SQL_FIELD_LONG_COMMON_NAME = 5;
	
	private static final long NUM_ROWS_PER_SECTION = 5000;


	public enum RowProcessingStatus {
		RECORD_WRITTEN,
		EXCEPTION_OCCURRED,
		INVALID_ROW_DATA
	};
	
	private String sMapFileName = "";
	private FileInputStream fisMapFile = null;
	private Connection oDBConnection = null;
	private PrintWriter pwStatusFile = null;
	
	private long lNumProcessed = 0;
	private long lNumRecordWritten = 0;
	private long lNumExceptionOccurred = 0;
	private long lNumInvalidRowData = 0;
	private int iGeneratedId = 1;
	
	/**
	 * Do not allow calling of the default constructor.
	 */
	@SuppressWarnings("unused")
	private JLVH2LoincLoadUtil () {
	}

	/**
	 * Construct the loader with the given files and data base connection information.
	 * 
	 * @param sMapFileName The path and name of the file that is represented by the FileInputStream.
	 * @param fisMapFile The file input stream for the Map file that is being processed.
	 * @param oDBConnection The database connection to the H2 database.
	 * @param pwStatusFile The status file where information is to be output.
	 * @throws TermLoadException If there are any issues, this exception will be thrown.
	 */
	public JLVH2LoincLoadUtil(String sMapFileName, FileInputStream fisMapFile, Connection oDBConnection, PrintWriter pwStatusFile) throws TermLoadException {
		this.sMapFileName = sMapFileName;
		
		if (fisMapFile == null) {
			throw new TermLoadException(PAGE_NAME + " input file was null.");
		}
		this.fisMapFile = fisMapFile;
		
		if (oDBConnection == null) {
			throw new TermLoadException("The H2 database connection was null.");
		}
		this.oDBConnection = oDBConnection;
		
		if (pwStatusFile == null) {
			throw new TermLoadException("The status file print writer was null.");
		}
		this.pwStatusFile = pwStatusFile;
	}

	/**
	 * This method loads the database table with the information in the mapping file.
	 * @throws IOException This exception is thrown if there is a problem accessing the spreadsheet.
	 * @throws SQLException 
	 */
	@Override
	public void loadDatabaseTable() throws IOException, SQLException {
		
		prepareDatabase();
		
		XSSFWorkbook oWorkbook = new XSSFWorkbook (this.fisMapFile);
		 
		XSSFSheet oMapSheet = oWorkbook.getSheet(PAGE_NAME);
		if (oMapSheet != null) {
			Iterator<Row> iterDrugRow = oMapSheet.iterator();
			long lRowIndex = 0;
			while (iterDrugRow.hasNext()) {
				Row oRow = iterDrugRow.next();
				
				if ((lRowIndex > 0) ||
					((lRowIndex == 0) && (!isTitleRow(oRow)))) {
					
					RowMapping oRowMapping = new RowMapping(oRow);
					RowProcessingStatus eStatus = null;
					if (containsValidData(oRowMapping)) {
						try {
							addRowToTermDatabase(oRowMapping);
							eStatus = RowProcessingStatus.RECORD_WRITTEN;
						}
						catch (Exception e) {
							outputRowMessage("Exception", e.getMessage(), oRowMapping);
							eStatus = RowProcessingStatus.EXCEPTION_OCCURRED;
						}
					}
					else {
						outputRowMessage("Error", "The row contained invalid data.", oRowMapping);
						eStatus = RowProcessingStatus.INVALID_ROW_DATA;
					}
					updateStatistics(eStatus);
				}
				
				lRowIndex++;
				
				if ((lRowIndex % NUM_ROWS_PER_SECTION) == 0) {
					System.out.println("Total rows processed so far: " + lRowIndex);
				}
			}
		}
	}
	
	/**
	 * This method returns true if the row contains valid data.  False if it does not.
	 * For some reason this map has rows that appear to be "sections".  They have placed a 
	 * value in the RxNorm column that contains no text or other fields.   We should skip these.
	 * 
	 * @param oRowMapping The row to be verified.
	 * @return TRUE if the row has valid data.
	 */
	private boolean containsValidData(RowMapping oRowMapping) {
		boolean bHasValidData = true;
		
		if ((NullChecker.isNullish(oRowMapping.getComponent())) &&
			(NullChecker.isNullish(oRowMapping.getShortName())) &&
			(NullChecker.isNullish(oRowMapping.getLongCommonName()))) {
			bHasValidData = false;
		}
		
		return bHasValidData;
	}

	/**
	 * This adds the specified row to the database.
	 * 
	 * @param oRowMapping
	 * @throws SQLException 
	 */
	private void addRowToTermDatabase(RowMapping oRowMapping) throws SQLException {
		PreparedStatement psInsertStatment = this.oDBConnection.prepareStatement(SQL_INSERT);
		psInsertStatment.setInt(SQL_FIELD_INTERNAL_ID, oRowMapping.getInternalId());
		psInsertStatment.setString(SQL_FIELD_LOINC_NUM, oRowMapping.getLoincNum());
		psInsertStatment.setString(SQL_FIELD_COMPONENT, oRowMapping.getComponent());
		psInsertStatment.setString(SQL_FIELD_SHORT_NAME, oRowMapping.getShortName());
		psInsertStatment.setString(SQL_FIELD_LONG_COMMON_NAME, oRowMapping.getLongCommonName());
		psInsertStatment.execute();
		this.oDBConnection.commit();
	}

	/**
	 * This method outputs an error to the Status file along with the row that failed.
	 * 
	 * @param sTitle The title for the row.
	 * @param sMessage The error message.
	 * @param oRowMapping The row information for the row that this error occurred on.
	 */
	private void outputRowMessage(String sTitle, String sMessage, RowMapping oRowMapping) {
		this.pwStatusFile.println(sTitle + ": " + sMessage);
		this.pwStatusFile.println("     internalId: " + oRowMapping.getInternalId());
		this.pwStatusFile.println("     loincNum: " + oRowMapping.getLoincNum());
		this.pwStatusFile.println("     component: " + oRowMapping.getComponent());
		this.pwStatusFile.println("     shortName: " + oRowMapping.getShortName());
		this.pwStatusFile.println("     longCommonName: " + oRowMapping.getLongCommonName());
	}
	
	/**
	 * This method updates the statistics based on the return value.
	 * 
	 * @param eStatus The status of the update message.
	 */
	private void updateStatistics(RowProcessingStatus eStatus) {
		lNumProcessed++;
		
		if (eStatus == RowProcessingStatus.RECORD_WRITTEN) {
			lNumRecordWritten++;
		}		
		else if (eStatus == RowProcessingStatus.EXCEPTION_OCCURRED) {
			lNumExceptionOccurred++;
		}		
		else if (eStatus == RowProcessingStatus.INVALID_ROW_DATA) {
			lNumInvalidRowData++;
		}		
	}

	
	
	/**
	 * This method prepares the database for updating.  If the table that is used does not exist, it will create it.
	 * If it exists, it will clear out the contents so the new information can be loaded.
	 * 
	 * @throws SQLException 
	 */
	private void prepareDatabase() throws SQLException {
		this.oDBConnection.prepareCall(SQL_CREATE_TABLE).execute();		// Create the table if it does not exist.
		this.oDBConnection.prepareCall(SQL_CLEAR_ALL).execute();
		this.oDBConnection.commit();
	}

	/**
	 * This method checks the row to see if it is a title row.  It returns true if it is.
	 * 
	 * @param oRow The row to be checked.
	 * @return TRUE if this is a title row.
	 */
	private static boolean isTitleRow(Row oRow) {
		boolean bReturnValue = false;
		
		if ((oRow != null) &&
			(oRow.getPhysicalNumberOfCells() > 0)) {
			Cell oCell = oRow.getCell(oRow.getFirstCellNum());
			if ((oCell != null) &&
				(oCell.getCellType() == Cell.CELL_TYPE_STRING)) {
				if (TITLE_ROW_CELL_1_TEXT.equals(oCell.getStringCellValue())) {
					bReturnValue = true;
				}
			}
		}
		
		return bReturnValue;
	}
	

	/**
	 * This method returns the final statistics.
	 * 
	 * @return The final statistics.
	 */
	@Override
	public String getFinalStatistics() {
		StringBuffer sbOutput = new StringBuffer();
		
		sbOutput.append("JLV Mapping File: " + this.sMapFileName + CRLF);
		sbOutput.append("Number of mappings processed: " + lNumProcessed + CRLF);
		sbOutput.append("Number of records written: " + lNumRecordWritten + CRLF);
		sbOutput.append("Number of exceptions: " + lNumExceptionOccurred + CRLF);
		sbOutput.append("Number of rows with invalid data: " + lNumInvalidRowData + CRLF);
		
		return sbOutput.toString();
	}
	
	/**
	 * Class that represents one row of the JLV map sheet.
	 * 
	 * @author Les.Westberg
	 *
	 */
	private class RowMapping {
		private static final int CELL_LOINC_NUM = 0;
		private static final int CELL_COMPONENT = 1;
		private static final int CELL_SHORT_NAME = 2;
		private static final int CELL_LONG_COMMON_NAME = 3;

		private int internalId = 0;
		private String loincNum = null;
		private String component = null;
		private String shortName = null;
		private String longCommonName = null;
		
		public RowMapping (Row oRow) {
			if (oRow != null) {
				internalId = iGeneratedId++;
				
				loincNum = JLVH2HelperUtil.getStringCellValue(oRow, CELL_LOINC_NUM);
				component = JLVH2HelperUtil.getStringCellValue(oRow, CELL_COMPONENT);
				shortName = JLVH2HelperUtil.getStringCellValue(oRow, CELL_SHORT_NAME);
				longCommonName = JLVH2HelperUtil.getStringCellValue(oRow, CELL_LONG_COMMON_NAME);
			}
		}

		public int getInternalId() {
			return internalId;
		}
		
		public String getLoincNum() {
			return loincNum;
		}

		public String getComponent() {
			return component;
		}

		public String getShortName() {
			return shortName;
		}

		public String getLongCommonName() {
			return longCommonName;
		}
		
	}
	

}
