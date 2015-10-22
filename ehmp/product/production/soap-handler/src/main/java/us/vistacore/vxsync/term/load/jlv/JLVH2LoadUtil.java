package us.vistacore.vxsync.term.load.jlv;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.term.jlv.IJLVH2PageLoadUtil;
import us.vistacore.vxsync.utility.NullChecker;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * This class is used to create an H2 database and load the JLV mapping tables into them.  Currently there will 
 * be one SQL table for each page in the mapping spreadsheet.
 * 
 * @author Les.Westberg
 */
public class JLVH2LoadUtil {
	private static final String CRLF = System.getProperty("line.separator");

	public static final String PAGE_CPT_CVX = "CPT_CVX";
	public static final String PAGE_DOD_ALLERGIES = "DOD_ALLERGIES";
	public static final String PAGE_DOD_LABS = "DOD_LABS";
	public static final String PAGE_DOD_MEDICATIONS = "DOD_MEDICATIONS";
	public static final String PAGE_DOD_NOTES = "DOD_NOTES";
	public static final String PAGE_DRUGS = "DRUGS";
	public static final String PAGE_ICD9_SNOMED = "ICD9_SNOMED";
	public static final String PAGE_LOINC = "LOINC";
	public static final String PAGE_MEDCIN_SNOMED = "MEDCIN_SNOMED";
	public static final String PAGE_REACTANTS = "REACTANTS";
	public static final String PAGE_SNOMEDCT = "SNOMEDCT";
	public static final String PAGE_VA_TERM_MAPPING_MASTER = "VATermMappingMaster_v002";
	public static final String PAGE_VITALS = "VITALS";
	public static final String[] JLV_MAP_PAGES = { PAGE_CPT_CVX,
												PAGE_DOD_ALLERGIES,
												PAGE_DOD_LABS,
												PAGE_DOD_MEDICATIONS,
												PAGE_DOD_NOTES,
												PAGE_DRUGS,
												PAGE_ICD9_SNOMED,
												PAGE_LOINC,
												PAGE_MEDCIN_SNOMED,
												PAGE_REACTANTS,
												PAGE_SNOMEDCT,
												PAGE_VA_TERM_MAPPING_MASTER,
												PAGE_VITALS	}; 

	private PrintWriter pwStatusFile = null;
	private File fH2Directory = null;
	private File fJLVMapFileDirectory = null;
	private String sJLVLoadFilePrefix = "";
	private Connection oDBConnection = null;


	/**
	 * Constructor to create an instance of this class with the correct files and print writers
	 * 
	 * @param pwStatusFile PrintWriter to output status information.
	 * @param fH2Directory The Directory where the H2 JLV terminology database is located.
	 * @param fJLVMapFileDirectory The directory containing the mapping files.
	 * @param sJLVLoadFilePrefix The common part of the name of each mapping file.
	 */
	public JLVH2LoadUtil(PrintWriter pwStatusFile, File fH2Directory, File fJLVMapFileDirectory, String sJLVLoadFilePrefix) {
		this.pwStatusFile = pwStatusFile;
		this.fH2Directory = fH2Directory;
		this.fJLVMapFileDirectory = fJLVMapFileDirectory;
		this.sJLVLoadFilePrefix = sJLVLoadFilePrefix;
	}

	/**
	 * Run this to create and load the content from the JLV mapping tables.
	 * 
	 * @param args The run-time arguments.  The following are the arguments needed:
	 * 	args[0] - The location of the H2 JLV terminology database
	 * 	args[1] - The location of the JLV load file directory
	 *  args[2] - The name of the file not including the '_<page-name>'
	 *  args[3] - The file to place status and error information
	 */
	public static void main(String[] args) {
		String sH2Directory = "";
		String sJLVMapFileDirectory = "";
		String sJLVLoadFilePrefix = "";
		String sStatusFileName = "";

		
		if ((args == null) || 
			(args.length != 4)) {
			outputRunInstructions();
			System.exit(-1);
		}
		
		// H2 Database Directory
		//-----------------------
		sH2Directory = args[0];
		File fH2Directory = new File(sH2Directory);
		if ((!fH2Directory.exists()) || 
			(!fH2Directory.isDirectory())) {
			System.out.println("The H2 JLV terminology database must be the path of a directory containing an existing H2 terminology database.");
			outputRunInstructions();
			System.exit(-1);
		}
		
		// JLV Mapping File Directory
		//---------------------------
		sJLVMapFileDirectory = args[1];
		File fJLVMapFileDirectory = new File(sJLVMapFileDirectory);
		if ((!fJLVMapFileDirectory.exists()) || 
			(!fJLVMapFileDirectory.isDirectory())) {
			System.out.println("The JLV map file directory must exist.");
			outputRunInstructions();
			System.exit(-1);
		}
		
		// Verify that we have all the map files that we should have...
		//--------------------------------------------------------------
		sJLVLoadFilePrefix = args[2];
		try {
			String sMissingFiles = verifyFilesExist(fJLVMapFileDirectory, sJLVLoadFilePrefix);
			if (NullChecker.isNotNullish(sMissingFiles)) {
				System.out.println("The JLV load directory was missing the following mapping files: " + sMissingFiles);
				outputRunInstructions();
				System.exit(-1);
			}
		}
		catch (Exception e) {
			System.out.println("Failed to verify the existence of the JLV Mapping Files.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			System.exit(-1);
		}
		
		// Status File Name
		//-----------------
		sStatusFileName = args[3];
		File fStatusFileName = new File(sStatusFileName);
		try {
			fStatusFileName.createNewFile();
		}
		catch (Exception e) {
			System.out.println("Failed to create the status file.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			System.exit(-1);
		}
		PrintWriter pwStatusFile = null;
		try {
			pwStatusFile = new PrintWriter(fStatusFileName);
		} 
		catch (FileNotFoundException e) {
			System.out.println("Failed to open the status file.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			System.exit(-1);
		}
		
		JLVH2LoadUtil oLoadUtil = new JLVH2LoadUtil(pwStatusFile, fH2Directory, fJLVMapFileDirectory, sJLVLoadFilePrefix);
		
		try {
			oLoadUtil.outputInitialInformation();
			oLoadUtil.loadJLVData();
			oLoadUtil.outputClosingInformation();
		}
		catch (Exception e) {
			System.out.println("Failed to load the JLV terminology database.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			closeStatusFile(pwStatusFile);
			System.exit(-1);
		}
		finally {
			closeStatusFile(pwStatusFile);
		}
		
		System.exit(0);
	}

	/**
	 * Output the run-time instructions.
	 */
	private static void outputRunInstructions() {
		System.out.println("Usage:");
		System.out.println("JLVH2LoadUtil h2-database-directory jlv-load-file-directory jlv-load-file-prefix status-file");
		System.out.println("Where:");
		System.out.println("  h2-database-directory   is the directory where the h2 JLV terminology database is located.");
		System.out.println("  jlv-load-file-directory is the directory where the JLV mapping excel spreadsheets exist.  The files in");
		System.out.println("                          this directory should be in 'xlsx' format.  There should be one file per");
		System.out.println("                          mapping page.  The name of the file(s) will be the name of the ");
		System.out.println("                          <jlv-load-file-prefix>_<page-name>.xlsx.  Where <page-name> must match the ");
		System.out.println("                          sheet page name in the file.");
		System.out.println("  jlv-load-file-prefix    is the name of the file not including the '_<page-name>' ");
		System.out.println("                          (i.e. MappingTables)  ");
		System.out.println("  status-file             is the directory and location where status information will be placed. ");
		System.out.println("                          If the file does not exist, it will be created.");
	}
	
	/**
	 * This creates the file name based on the prefix and the page name and returns it.
	 * 
	 * @param sJLVLoadFilePrefix The common part of each excel spreadsheet name.
	 * @param sPage The page that the spreadsheet file contains.
	 * @return The name of the file as a concatenation of the common part and the page part.
	 */
	private static String createFileName(String sJLVLoadFilePrefix, String sPage) {
		return sJLVLoadFilePrefix + "_" + sPage + ".xlsx";
	}

	/**
	 * This method verifies that each of the mapping load files exist.  The names of any files that are missing are returned.
	 * 
	 * @param fJLVMapFileDirectory The directory containing the JLV Map files.
	 * @param sJLVLoadFilePrefix The prefix name of the mapping files.
	 * @return The list of files that are missing.
	 * @throws IOException 
	 */
	private static String verifyFilesExist(File fJLVMapFileDirectory, String sJLVLoadFilePrefix) throws IOException {
		StringBuffer sbMissingFiles = new StringBuffer();
		
		for (String sPage : JLV_MAP_PAGES) {
			if (fileMissing(fJLVMapFileDirectory, sJLVLoadFilePrefix, sPage)) {
				sbMissingFiles.append(" " + createFileName(sJLVLoadFilePrefix, sPage));
			}
		}
		
		return sbMissingFiles.toString();
	}

	/**
	 * This checks to see if the given file is missing.
	 * 
	 * @param fJLVMapFileDirectory The directory containing the mapping files.
	 * @param sJLVLoadFilePrefix The common name for the mapping files.
	 * @param sPageName The page specific part of the name of the mapping files.
	 * @return True if the file is missing.
	 * @throws IOException 
	 */
	private static boolean fileMissing(File fJLVMapFileDirectory, String sJLVLoadFilePrefix, String sPageName) throws IOException {
		boolean bMissing = true;
		
		String sFileName = createFileName(sJLVLoadFilePrefix, sPageName);
		File fMapFile = new File(fJLVMapFileDirectory.getCanonicalPath() + "/" + sFileName);
		if (fMapFile.exists()) {
			bMissing = false;
		}
		
		return bMissing;
	}

	/**
	 * This will output a line of text to both the status file and System out.
	 * 
	 * @param sMessage The message to put printed.
	 */
	private void outputLine(String sMessage) {
		this.pwStatusFile.println(sMessage);
		System.out.println(sMessage);
	}
	
	/**
	 * This method outputs a section header to both the status file as well as System.out.
	 * 
	 * @param sMessage The message to be output.
	 */
	private void outputSectionHeader(String sMessage) {
		
		outputLine("--------------------------------------------------------------------------------------------------------------");
		outputLine(sMessage);
		outputLine("--------------------------------------------------------------------------------------------------------------");
	}
	
	/**
	 * Output the initial information - name of files, etc.
	 * 
	 * @throws IOException The exception that occurs one of these directories or files do not exist.
	 */
	private void outputInitialInformation() throws IOException {
		outputSectionHeader("Loading information from JLV mapping tables into H2 database.");
		outputLine("H2 database location: " + this.fH2Directory.getCanonicalPath());
		outputLine("JLV Map Excel Spreadsheet Directory: " + this.fJLVMapFileDirectory.getCanonicalPath());
		outputLine("JLV Map File Name Prefix: " + this.sJLVLoadFilePrefix);
	}

	/**
	 * Output closing information.
	 */
	private void outputClosingInformation() {
		outputSectionHeader("End of load");
	}

	/**
	 * This will close the status file.
	 * 
	 * @param pwStatusFile The status file to be closed.
	 */
	private static void closeStatusFile(PrintWriter pwStatusFile) {
		if (pwStatusFile != null) {
			pwStatusFile.close();
			pwStatusFile = null;
		}
	}
	

	/**
	 * This method is responsible for orchestrating the loading of the data from the JLV mapping spreadsheet.
	 * @throws IOException 
	 * @throws TermLoadException 
	 * @throws SQLException 
	 * 
	 */
	private void loadJLVData() throws IOException, TermLoadException, SQLException {
		
		openDatabase();
		StringBuffer sbFinalStatistics = new StringBuffer();
		
		for (String sPage : JLV_MAP_PAGES) {
			IJLVH2PageLoadUtil oJLVPageLoadUtil = createPageLoadUtil(sPage);
			if (oJLVPageLoadUtil != null) {
				outputSectionHeader("Creating mapping entries for: " + sPage);
				
				oJLVPageLoadUtil.loadDatabaseTable();
	
				sbFinalStatistics.append("-------------------------------------------------------------------------------------------------------------------" + CRLF);
				sbFinalStatistics.append("Statistics for: '" + sPage + "'" + CRLF);
				sbFinalStatistics.append("-------------------------------------------------------------------------------------------------------------------" + CRLF);
				
				sbFinalStatistics.append(oJLVPageLoadUtil.getFinalStatistics());
			}
			else {
				outputLine("ERROR: Failed to obtain a loader object for page: " + sPage + ".  Mapping page not loaded.");
			}
		}
		
		outputLine(sbFinalStatistics.toString());
	}

	/**
	 * This creates an instance of the specifed page loader and returns a handle to it.
	 * 
	 * @param sPage The name of the JLV mapping page that will be processed.
	 * @return The handle to the page loader for that page.
	 * @throws IOException This exception is thrown if there is a problem getting the file name.
	 * @throws TermLoadException This exception is thrown if we cannot create a page loader. 
	 */
	private IJLVH2PageLoadUtil createPageLoadUtil(String sPage) throws IOException, TermLoadException {
		IJLVH2PageLoadUtil oPageLoadUtil = null;
		
		String sMapFileName = fJLVMapFileDirectory.getCanonicalPath() + "/" + JLVH2LoadUtil.createFileName(sJLVLoadFilePrefix, sPage);
		FileInputStream fisMapFile = new FileInputStream(new File(sMapFileName));
		if (sPage.equals(PAGE_CPT_CVX)) {
			oPageLoadUtil = new JLVH2CptCvxLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_DOD_ALLERGIES)) {
			oPageLoadUtil = new JLVH2DodAllergiesLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_DOD_LABS)) {
			oPageLoadUtil = new JLVH2DodLabsLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_DOD_MEDICATIONS)) {
			oPageLoadUtil = new JLVH2DodMedicationsLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_DOD_NOTES)) {
			oPageLoadUtil = new JLVH2DodNotesLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_DRUGS)) {
			oPageLoadUtil = new JLVH2DrugsLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_ICD9_SNOMED)) {
			oPageLoadUtil = new JLVH2Icd9SnomedLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_LOINC)) {
			oPageLoadUtil = new JLVH2LoincLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_MEDCIN_SNOMED)) {
			oPageLoadUtil = new JLVH2MedcinSnomedLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_REACTANTS)) {
			oPageLoadUtil = new JLVH2ReactantsLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_SNOMEDCT)) {
			oPageLoadUtil = new JLVH2SnomedCTLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_VA_TERM_MAPPING_MASTER)) {
			oPageLoadUtil = new JLVH2VATermMappingMasterV002LoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		else if (sPage.equals(PAGE_VITALS)) {
			oPageLoadUtil = new JLVH2VitalsLoadUtil(sMapFileName, fisMapFile, this.oDBConnection, this.pwStatusFile);
		}
		
		return oPageLoadUtil;
	}

	/**
	 * This will open the database - set up the database connection.
	 * @throws TermLoadException This is thrown if there is any issue opening the database.
	 */
	private void openDatabase() throws TermLoadException {
		try {
			String sJdbcUrl = createUrl();
	
			Class.forName("org.h2.Driver");
			this.oDBConnection = DriverManager.getConnection(sJdbcUrl, "sa", "");
		}
		catch (Exception e) {
			throw new TermLoadException("Failed to open H2 database.  Error: " + e.getMessage(), e);
		}
	}

	/**
	 * This method creates the URL based on the H2 database location.
	 * 
	 * @return The JDBC URL for the H2 database.
	 * @throws IOException 
	 */
	private String createUrl() throws IOException {
		String sJdbcUrl = "";
		
		String sH2Directory = fH2Directory.getCanonicalPath();
		sJdbcUrl = "jdbc:h2:" + sH2Directory + "/termdb";
		
		return sJdbcUrl; 
	}


}
