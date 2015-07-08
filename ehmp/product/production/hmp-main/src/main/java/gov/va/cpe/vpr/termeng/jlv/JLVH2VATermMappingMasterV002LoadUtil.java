package gov.va.cpe.vpr.termeng.jlv;

import gov.va.cpe.vpr.termeng.TermLoadException;

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
 * This class is used to load the info from the VATermMasterMapping_v002 sheet spreadsheet page into
 * the vatermmastermapping_v002 table in the h2 database.
 * 
 * @author Les.Westberg
 */
public class JLVH2VATermMappingMasterV002LoadUtil implements IJLVH2PageLoadUtil {
	private static final String PAGE_NAME = "VATermMappingMaster_v002";
	private static final String CRLF = System.getProperty("line.separator");
	private static final Object TITLE_ROW_CELL_1_TEXT = "RowID";
	private static final String SQL_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS vatermmastermapping_v002 (rowId INT PRIMARY KEY, " + 
					                                                                                   "mapPathwayId INT, " + 
					                                                                                   "sourceCode VARCHAR(20)," +
					                                                                                   "sourceCodeText VARCHAR(500)," +
					                                                                                   "targetCode VARCHAR(20)," +
					                                                                                   "targetCodeText VARCHAR(500)," +
					                                                                                   "optCode VARCHAR(1))";
	private static final String SQL_CLEAR_ALL = "DELETE FROM vatermmastermapping_v002";
	private static final String SQL_INSERT = "INSERT INTO vatermmastermapping_v002 VALUES (?, ?, ?, ?, ?, ?, ?)";
	private static final int SQL_FIELD_ROW_ID = 1;
	private static final int SQL_FIELD_MAP_PATHWAY_ID = 2;
	private static final int SQL_FIELD_SOURCE_CODE = 3;
	private static final int SQL_FIELD_SOURCE_CODE_TEXT = 4;
	private static final int SQL_FIELD_TARGET_CODE = 5;
	private static final int SQL_FIELD_TARGET_CODE_TEXT = 6;
	private static final int SQL_FIELD_OPT_CODE = 7;
	
	private static final long NUM_ROWS_PER_SECTION = 5000;


	public enum RowProcessingStatus {
		RECORD_WRITTEN,
		EXCEPTION_OCCURRED
	};
	
	private String sMapFileName = "";
	private FileInputStream fisMapFile = null;
	private Connection oDBConnection = null;
	private PrintWriter pwStatusFile = null;
	
	private long lNumProcessed = 0;
	private long lNumRecordWritten = 0;
	private long lNumExceptionOccurred = 0;
	
	/**
	 * Do not allow calling of the default constructor.
	 */
	@SuppressWarnings("unused")
	private JLVH2VATermMappingMasterV002LoadUtil () {
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
	public JLVH2VATermMappingMasterV002LoadUtil(String sMapFileName, FileInputStream fisMapFile, Connection oDBConnection, PrintWriter pwStatusFile) throws TermLoadException {
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
					try {
						addRowToTermDatabase(oRowMapping);
						eStatus = RowProcessingStatus.RECORD_WRITTEN;
					}
					catch (Exception e) {
						outputRowMessage("Exception", e.getMessage(), oRowMapping);
						eStatus = RowProcessingStatus.EXCEPTION_OCCURRED;
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
	 * This adds the specified row to the database.
	 * 
	 * @param oRowMapping
	 * @throws SQLException 
	 */
	private void addRowToTermDatabase(RowMapping oRowMapping) throws SQLException {
		PreparedStatement psInsertStatment = this.oDBConnection.prepareStatement(SQL_INSERT);
		psInsertStatment.setInt(SQL_FIELD_ROW_ID, oRowMapping.getRowId());
		psInsertStatment.setInt(SQL_FIELD_MAP_PATHWAY_ID, oRowMapping.getMapPathwayId());
		psInsertStatment.setString(SQL_FIELD_SOURCE_CODE, oRowMapping.getSourceCode());
		psInsertStatment.setString(SQL_FIELD_SOURCE_CODE_TEXT, oRowMapping.getSourceCodeText());
		psInsertStatment.setString(SQL_FIELD_TARGET_CODE, oRowMapping.getTargetCode());
		psInsertStatment.setString(SQL_FIELD_TARGET_CODE_TEXT, oRowMapping.getTargetCodeText());
		psInsertStatment.setString(SQL_FIELD_OPT_CODE, oRowMapping.getOptCode());
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
		this.pwStatusFile.println("     Id: " + oRowMapping.getRowId());
		this.pwStatusFile.println("     mapPathwayId: " + oRowMapping.getMapPathwayId());
		this.pwStatusFile.println("     sourceCode: " + oRowMapping.getSourceCode());
		this.pwStatusFile.println("     sourceCodeText: " + oRowMapping.getSourceCodeText());
		this.pwStatusFile.println("     targetCode: " + oRowMapping.getTargetCode());
		this.pwStatusFile.println("     targetCodeText: " + oRowMapping.getTargetCodeText());
		this.pwStatusFile.println("     optCode: " + oRowMapping.getOptCode());
		this.pwStatusFile.println("     createDate: " + oRowMapping.getCreateDate());
		this.pwStatusFile.println("     editDate: " + oRowMapping.getEditDate());
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
		
		return sbOutput.toString();
	}
	
	/**
	 * Class that represents one row of the JLV map sheet.
	 * 
	 * @author Les.Westberg
	 *
	 */
	private class RowMapping {
		private static final int CELL_ROW_ID = 0;
		private static final int CELL_MAP_PATHWAY_ID = 1;
		private static final int CELL_SOURCE_CODE = 2;
		private static final int CELL_SOURCE_CODE_TEXT = 3;
		private static final int CELL_TARGET_CODE = 4;
		private static final int CELL_TARGET_CODE_TEXT = 5;
		private static final int CELL_OPT_CODE = 6;
		private static final int CELL_CREATE_DATE = 7;
		private static final int CELL_EDIT_DATE = 8;

		private int rowId = 0;
		private int mapPathwayId = 0;
		private String sourceCode = null;
		private String sourceCodeText = null;
		private String targetCode = null;
		private String targetCodeText = null;
		private String optCode = null;
		private String createDate = null;
		private String editDate = null;
		
		public RowMapping (Row oRow) {
			if (oRow != null) {
				String sId = JLVH2HelperUtil.getStringCellValue(oRow, CELL_ROW_ID);
				rowId = Integer.parseInt(sId);
				
				String sMapPathwayId = JLVH2HelperUtil.getStringCellValue(oRow, CELL_MAP_PATHWAY_ID); 
				mapPathwayId = Integer.parseInt(sMapPathwayId);
				
				sourceCode = JLVH2HelperUtil.getStringCellValue(oRow, CELL_SOURCE_CODE);
				sourceCodeText = JLVH2HelperUtil.getStringCellValue(oRow, CELL_SOURCE_CODE_TEXT);
				targetCode = JLVH2HelperUtil.getStringCellValue(oRow, CELL_TARGET_CODE);
				targetCodeText = JLVH2HelperUtil.getStringCellValue(oRow, CELL_TARGET_CODE_TEXT);
				optCode = JLVH2HelperUtil.getStringCellValue(oRow, CELL_OPT_CODE);
				createDate = JLVH2HelperUtil.getStringCellValue(oRow, CELL_CREATE_DATE);
				editDate = JLVH2HelperUtil.getStringCellValue(oRow, CELL_EDIT_DATE);
			}
		}

		public int getRowId() {
			return rowId;
		}

		public int getMapPathwayId() {
			return mapPathwayId;
		}

		public String getSourceCode() {
			return sourceCode;
		}

		public String getSourceCodeText() {
			return sourceCodeText;
		}

		public String getTargetCode() {
			return targetCode;
		}

		public String getTargetCodeText() {
			return targetCodeText;
		}

		public String getOptCode() {
			return optCode;
		}

		public String getCreateDate() {
			return createDate;
		}
		
		public String getEditDate() {
			return editDate;
		}
	}
	

}
