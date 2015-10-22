package us.vistacore.vxsync.term.load.jlv;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.term.jlv.IJLVH2PageLoadUtil;
import us.vistacore.vxsync.term.jlv.JLVH2HelperUtil;

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
 * This class is used to load the lab information from the JLV DOD_LABS spreadsheet page into
 * the dod_labs table in the h2 database.
 * 
 * @author Les.Westberg
 */
public class JLVH2DodLabsLoadUtil implements IJLVH2PageLoadUtil {
	private static final String PAGE_NAME = "DOD_LABS";
	private static final String CRLF = System.getProperty("line.separator");
	private static final Object TITLE_ROW_CELL_1_TEXT = "id";
	private static final String SQL_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS dod_labs (id INT PRIMARY KEY, " + 
	                                                                                   "dodNcid VARCHAR(20), " + 
	                                                                                   "dodName VARCHAR(500)," +
	                                                                                   "mmmName VARCHAR(500)," +
	                                                                                   "loinc VARCHAR(20)," +
	                                                                                   "loincName VARCHAR(500))";
	private static final String SQL_CLEAR_ALL = "DELETE FROM dod_labs";
	private static final String SQL_INSERT = "INSERT INTO dod_labs VALUES (?, ?, ?, ?, ?, ?)";
	private static final int SQL_FIELD_ID = 1;
	private static final int SQL_FIELD_DOD_NCID = 2;
	private static final int SQL_FIELD_DOD_NAME = 3;
	private static final int SQL_FIELD_MMM_NAME = 4;
	private static final int SQL_FIELD_LOINC = 5;
	private static final int SQL_FIELD_LOINC_NAME = 6;
	
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
	private JLVH2DodLabsLoadUtil () {
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
	public JLVH2DodLabsLoadUtil(String sMapFileName, FileInputStream fisMapFile, Connection oDBConnection, PrintWriter pwStatusFile) throws TermLoadException {
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
		psInsertStatment.setInt(SQL_FIELD_ID, oRowMapping.getId());
		psInsertStatment.setString(SQL_FIELD_DOD_NCID, oRowMapping.getDodNcid());
		psInsertStatment.setString(SQL_FIELD_DOD_NAME, oRowMapping.getDodName());
		psInsertStatment.setString(SQL_FIELD_MMM_NAME, oRowMapping.getMmmName());
		psInsertStatment.setString(SQL_FIELD_LOINC, oRowMapping.getLoinc());
		psInsertStatment.setString(SQL_FIELD_LOINC_NAME, oRowMapping.getLoincName());
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
		this.pwStatusFile.println("     Id: " + oRowMapping.getId());
		this.pwStatusFile.println("     dodNcid: " + oRowMapping.getDodNcid());
		this.pwStatusFile.println("     dodName: " + oRowMapping.getDodName());
		this.pwStatusFile.println("     mmmName: " + oRowMapping.getMmmName());
		this.pwStatusFile.println("     loinc: " + oRowMapping.getLoinc());
		this.pwStatusFile.println("     loincName: " + oRowMapping.getLoincName());
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
		private static final int CELL_ID = 0;
		private static final int CELL_DOD_NCID = 1;
		private static final int CELL_DOD_NAME = 2;
		private static final int CELL_MMM_NAME = 3;
		private static final int CELL_LOINC = 4;
		private static final int CELL_LOINC_NAME = 5;

		private int id = 0;
		private String dodNcid = null;
		private String dodName = null;
		private String mmmName = null;
		private String loinc = null;
		private String loincName = null;
		
		public RowMapping (Row oRow) {
			if (oRow != null) {
				String sId = JLVH2HelperUtil.getStringCellValue(oRow, CELL_ID);
				id = Integer.parseInt(sId);
				dodNcid = JLVH2HelperUtil.getStringCellValue(oRow, CELL_DOD_NCID);
				dodName = JLVH2HelperUtil.getStringCellValue(oRow, CELL_DOD_NAME);
				mmmName = JLVH2HelperUtil.getStringCellValue(oRow, CELL_MMM_NAME);
				loinc = JLVH2HelperUtil.getStringCellValue(oRow, CELL_LOINC);
				loincName = JLVH2HelperUtil.getStringCellValue(oRow, CELL_LOINC_NAME);
			}
		}

		public int getId() {
			return id;
		}

		public String getDodNcid() {
			return dodNcid;
		}

		public String getDodName() {
			return dodName;
		}

		public String getMmmName() {
			return mmmName;
		}

		public String getLoinc() {
			return loinc;
		}

		public String getLoincName() {
			return loincName;
		}

		
	}
	

}
