package us.vistacore.vxsync.term.jlv;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.miscellaneous.LimitTokenCountAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.classic.QueryParser.Operator;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import us.vistacore.vxsync.term.hmp.Concept;
import us.vistacore.vxsync.term.hmp.H2TermDataSource;
import us.vistacore.vxsync.term.hmp.TermEng;
import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.term.hmp.UMLSBuildPolicy;
import us.vistacore.vxsync.utility.NullChecker;

/**
 * This class is used to read the JLV Drug data and load the contents into the eHMP drug database.
 * 
 * @author Les.Westberg
 */
public class JLVDrugLoadUtil {
	
	public static final String VA_MAP_TITLE_ROW_CELL_1_TEXT = "rxNormCode";
	public static final String DOD_MAP_TITLE_ROW_CELL_1_TEXT = "id";
	private static final long NUM_PER_SECTION = 5000;
	
	public enum RowProcessingStatus {
		VA_MAP_SAME_MAPPING_TEXT_IDENTICAL,
		VA_MAP_SAME_MAPPING_BOTH_TEXT_DIFFERENT,
		VA_MAP_SAME_MAPPING_VA_TEXT_DIFFERENT,
		VA_MAP_SAME_MAPPING_RXNORM_TEXT_DIFFERENT,
		VA_MAP_JLV_MAPPING_DIFFERENT,
		VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING,
		VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING_WILL_COLLIDE,
		VA_MAP_JLV_MAPPING_DIFFERENT_JLV_MISSING,
		VA_MAP_JLV_MAPPING_ADDED,
		VA_MAP_EXCEPTION_OCCURRED,
		DOD_MAP_EXCEPTION_OCCURRED,
		DOD_MAP_CONCEPT_CREATED_WITH_MAPPING, 
		DOD_MAP_CONCEPT_CREATED_MAPPING_COLLIDED, 
		DOD_MAP_CONCEPT_CREATED_NO_MAPPING, 
		DOD_MAP_CONCEPT_CREATED_RXNORM_NOT_EXIST,
		DOD_MAP_CONCEPT_EXISTED_MAPPING_COLLIDED, 
		DOD_MAP_CONCEPT_EXISTED_MAPPING_ADDED, 
		DOD_MAP_CONCEPT_EXISTED_MAPPING_EXISTED, 
		DOD_MAP_CONCEPT_EXISTED_RXNORM_NOT_EXIST
	};
	
	// Statistics for numbers that were processed.
	//--------------------------------------------
	private long lNumVaMapProcessed = 0;
	private long lNumVaMapSame = 0;
	private long lNumVaMapSameBothTextDifferent = 0;
	private long lNumVaMapSameVaTextDifferent = 0;
	private long lNumVaMapSameRxnormTextDifferent = 0;
	private long lNumVaMapDifferent = 0;
	private long lNumVaMapDifferentVaMissing = 0;
	private long lNumVaMapDifferentVaMissingWillCollide = 0;
	private long lNumVaMapDifferentJlvMissing = 0;
	private long lNumVaMapAdded = 0;
	private long lNumVaMapExceptions = 0;
	private long lNumDodMapProcessed = 0;
	private long lNumDodMapExceptions = 0;
	private long lNumDodMapConceptCreatedWithMapping = 0;
	private long lNumDodMapConceptCreatedMappingCollided = 0;
	private long lNumDodMapConceptCreatedNoMapping = 0;
	private long lNumDodMapConceptCreatedRxnormNotExist = 0;
	private long lNumDodMapConceptExistedMappingCollided = 0;
	private long lNumDodMapConceptExistedMappingAdded = 0;
	private long lNumDodMapConceptExistedMappingExisted = 0;
	private long lNumDodMapConceptExistedRxnormNotExist = 0;
	

	// Handles to files, databases, etc.
	//-----------------------------------
	private File fH2Directory = null;
	private TermEng oTermEng = null;
	private H2TermDataSource oH2TermDataSource = null;
	private FileInputStream fisJlvVaMedFileName = null;
	private FileInputStream fisJlvDodMedFileName = null;
	private PrintWriter pwStatusFile = null;
	private Analyzer oLuceneAnalyzer = null;
	private Directory oLuceneDirectory = null;
	private DirectoryReader oLuceneReader = null;
	private IndexSearcher oLuceneSearcher = null;
	private QueryParser oLuceneParser = null;
	private IndexWriter oLuceneWriter = null;
	private boolean bLuceneSetup = false;

	/**
	 * Force callers to use the one that takes a PrintWriter parameter.
	 */
	@SuppressWarnings("unused")
	private JLVDrugLoadUtil() {
	}
	
	/**
	 * Constructor to create an instance of the Loader.
	 * 
	 * @param pwStatusFile
	 */
	public JLVDrugLoadUtil(PrintWriter pwStatusFile) {
		this.pwStatusFile = pwStatusFile;
	}
	

	/**
	 * This is the class used to run this utility.
	 * 
	 * @param args The run-time arguments.  The following are the arguments needed:
	 * 	args[0] - The location of the H2 drug database
	 * 	args[1] - The location of the JLV load file for Meds - VA to RxNorm
	 * 	args[2] - The location of the JLV load file for Meds - DoD to RxNorm
	 *  args[3] - The file to place status and error information
	 */
	public static void main(String[] args) {
		String sH2Directory = "";
		String sJlvVaMedFileName = "";
		String sJlvDodMedFileName = "";
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
			System.out.println("The H2 Drug database must be the path of a directory containing an existing H2 terminology database.");
			outputRunInstructions();
			System.exit(-1);
		}
		
		// JLV Load file for VA to RxNorm mappings
		//----------------------------------------
		sJlvVaMedFileName = args[1];
		File fJlvVaMedFileName = new File(sJlvVaMedFileName);
		if ((!fJlvVaMedFileName.exists()) &&
			(fJlvVaMedFileName.exists())) {
			System.out.println("The JLV load file must be a valid 'xlsx' spreadsheet file.");
			outputRunInstructions();
			System.exit(-1);
		}
		FileInputStream fisJlvVaMedFileName = null;
		try {
			fisJlvVaMedFileName = new FileInputStream(fJlvVaMedFileName);
		} 
		catch (FileNotFoundException e) {
			System.out.println("Failed to open the JLV Load file.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			System.exit(-1);
		}
		
		// JLV Load file for DoD to RxNorm mappings
		//----------------------------------------
		sJlvDodMedFileName = args[2];
		File fJlvDodMedFileName = new File(sJlvDodMedFileName);
		if ((!fJlvDodMedFileName.exists()) &&
			(fJlvDodMedFileName.exists())) {
			System.out.println("The JLV load file must be a valid 'xlsx' spreadsheet file.");
			outputRunInstructions();
			System.exit(-1);
		}
		FileInputStream fisJlvDodMedFileName = null;
		try {
			fisJlvDodMedFileName = new FileInputStream(fJlvDodMedFileName);
		} 
		catch (FileNotFoundException e) {
			System.out.println("Failed to open the JLV Load file.  Error: " + e.getMessage());
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

		JLVDrugLoadUtil oLoadUtil = new JLVDrugLoadUtil(pwStatusFile);

		try {
			oLoadUtil.outputInitialInformation(fH2Directory, fJlvVaMedFileName,	fJlvDodMedFileName);
			oLoadUtil.loadJlvDrugData(fH2Directory, fisJlvVaMedFileName, fisJlvDodMedFileName);
		} catch (IOException e) {
			System.out.println("Failed to load the JLV table.  Error: " + e.getMessage());
			e.printStackTrace();
			outputRunInstructions();
			closeStatusFile(pwStatusFile);
			System.exit(-1);
		}
		
		closeStatusFile(pwStatusFile);
		
		System.exit(0);
	}

	/**
	 * Output the initial information - name of files, etc.
	 * 
	 * @param fH2Directory The directory where the H2 database is located.
	 * @param fJlvVaMedFileName The path and name of the JLV VA-RxNorm excel file
	 * @param fJlvDodMedFileName The pathe and name of the JLV DoD NCID-RxNorm exel file.
	 * @throws IOException The exception that occurs one of these directories or files do not exist.
	 */
	private void outputInitialInformation(File fH2Directory, File fJlvVaMedFileName, File fJlvDodMedFileName) throws IOException {
		outputSectionHeader("Loading medication information from JLV database into H2 database.");
		outputLine("H2 database location: " + fH2Directory.getCanonicalPath());
		outputLine("JLV VUID-RxNorm Excel Spreadsheet: " + fJlvVaMedFileName.getCanonicalPath());
		outputLine("JLV DoD NCID-RxNorm Excel Spreadsheet: " + fJlvDodMedFileName.getCanonicalPath());
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
	 * Output the final statistics for this load.
	 */
	private void outputStatistics() {
		outputLine("");
		outputSectionHeader("Final Statistics for Loading VA VUID to RxNORM mapings: ");
		outputLine("Number of records processed: " + lNumVaMapProcessed);
		outputLine("Number of identical mappings: " + lNumVaMapSame);
		outputLine("Number of mappings that were added (did not exist in original VA mappings): " + lNumVaMapAdded);
		outputLine("Number of mappings where both VA and RxNorm Text were different: " + lNumVaMapSameBothTextDifferent);
		outputLine("Number of mappings where VA Text was different: " + lNumVaMapSameVaTextDifferent);
		outputLine("Number of mappings where RXNORM Text was different: " + lNumVaMapSameRxnormTextDifferent);
		outputLine("Number of mappings where the VUID to RXNORM mapping was to different codes: " + lNumVaMapDifferent);
		outputLine("Number of mappings where the VUID to RXNORM mapping was different - VA was missing the mapping: " + lNumVaMapDifferentVaMissing);
		outputLine("Number of mappings where the VUID to RXNORM mapping was different - VA was missing the mapping - RxNorm has already been mapped to another concept: " + lNumVaMapDifferentVaMissingWillCollide);
		outputLine("Number of mappings where the VUID to RXNORM mapping was different - JLV was missing the mapping: " + lNumVaMapDifferentJlvMissing);
		outputLine("Number of error/exception conditions: " + lNumVaMapExceptions);
		outputLine("");
		
		outputSectionHeader("Final Statistics for Loading VA VUID to RxNORM mapings: ");
		outputLine("Number of records processed: " + lNumDodMapProcessed);
		outputLine("Number of identical mappings: " + lNumVaMapSame);
		outputLine("Number of DoD Concepts created with RXNORM mappings: " + lNumDodMapConceptCreatedWithMapping);
		outputLine("Number of DoD Concepts created with no RXNORM mappings: " + lNumDodMapConceptCreatedNoMapping);
		outputLine("Number of DoD Concepts created where RXNORM mappings could not be created because the RxNorm concept had already been mapped to another DOD concept: " + lNumDodMapConceptCreatedMappingCollided);
		outputLine("Number of DoD Concepts created but where the RxNorm concept did not exist (No mapping could be done): " + lNumDodMapConceptCreatedRxnormNotExist);
		outputLine("Number of RxNorm mappings added to existing DOD Concept: " + lNumDodMapConceptExistedMappingAdded);
		outputLine("Number of RxNorm mappings added to existing DOD Concept that could not be created because the RxNorm concept had already been mapped to another DOD concept: " + lNumDodMapConceptExistedMappingCollided);
		outputLine("Number of Concepts that already existed with RxNorm mappings which were correct: " + lNumDodMapConceptExistedMappingExisted);
		outputLine("Number of Concepts that already existed but where the RxNorm concept did not exist (No mapping could be done): " + lNumDodMapConceptExistedRxnormNotExist);
		outputLine("Number of error/exception conditions: " + lNumDodMapExceptions);
	}
	
	/**
	 * This method outputs an error to the Status file along with the row that failed.
	 * 
	 * @param sTitle The title for the row.
	 * @param sMessage The error message.
	 * @param oVaDrugRowMapping The row information for the row that this error occurred on.
	 */
	private void outputRowMessage(String sTitle, String sMessage, VaDrugRowMapping oVaDrugRowMapping) {
		this.pwStatusFile.println(sTitle + ": " + sMessage);
		this.pwStatusFile.println("     Index: " + oVaDrugRowMapping.getIndex());
		this.pwStatusFile.println("     vuid: " + oVaDrugRowMapping.getVuid());
		this.pwStatusFile.println("     rxNormCode: " + oVaDrugRowMapping.getRxnormCode());
		this.pwStatusFile.println("     vistaText: " + oVaDrugRowMapping.getVistaText());
		this.pwStatusFile.println("     rxNormText: " + oVaDrugRowMapping.getRxnormText());
	}

	/**
	 * This method outputs an error to the Status file along with the row that failed.
	 * 
	 * @param sTitle The title for the row.
	 * @param sMessage The error message.
	 * @param oDodDrugRowMapping The row information for the row that this error occurred on.
	 */
	private void outputRowMessage(String sTitle, String sMessage, DodDrugRowMapping oDodDrugRowMapping) {
		this.pwStatusFile.println(sTitle + ": " + sMessage);
		this.pwStatusFile.println("     Index: " + oDodDrugRowMapping.getIndex());
		this.pwStatusFile.println("     dodNcid: " + oDodDrugRowMapping.getDodNcid());
		this.pwStatusFile.println("     dodText: " + oDodDrugRowMapping.getDodText());
		this.pwStatusFile.println("     mmmText: " + oDodDrugRowMapping.getMmmText());
		this.pwStatusFile.println("     rxNormCode: " + oDodDrugRowMapping.getRxnormCode());
	}
	

	/**
	 * This method will read the drug entries in the JLV excel spreadsheet and load them into the H2 database.
	 * 
	 * @param fH2Directory The directory for the H2 database.
	 * @param fisJlvVaMedFileName The JLV excel spreadsheet for VA to RxNorm drugs as a File Input Stream.
	 * @param fisJlvDodMedFileName  The JLV excel spreadsheet for DoD to RxNorm drugs as a File Input Stream.
	 * @param pwStatusFile The status file as a print writer.
	 * @throws IOException 
	 */
	private void loadJlvDrugData(File fH2Directory, FileInputStream fisJlvVaMedFileName, FileInputStream fisJlvDodMedFileName) throws IOException {
		this.fH2Directory = fH2Directory;
		this.fisJlvVaMedFileName = fisJlvVaMedFileName;
		this.fisJlvDodMedFileName = fisJlvDodMedFileName;
		
		outputSectionHeader("Start: Processing VA VUID to RxNORM Mappings");
		loadJlvVaMedData();
		outputSectionHeader("End: Processing VA VUID to RxNORM Mappings");
		
		outputLine("");

		outputSectionHeader("Start: Processing DoD NCID to RxNORM Mappings");
		loadJlvDodMedData();
		outputSectionHeader("End: Processing DoD NCID to RxNORM Mappings");
		
		outputStatistics();
		
	}
	
	/**
	 * This method reads the information in the JLV table that contains VA VUID to RxNORM mappings.   
	 * 
	 * @throws IOException This exception occurs if there is a problem reading the excel spreadsheet.
	 */
	private void loadJlvVaMedData() throws IOException {
		//Get the workbook instance for XLS file
		XSSFWorkbook workbook = new XSSFWorkbook (this.fisJlvVaMedFileName);
		 
		XSSFSheet oDrugsSheet = workbook.getSheet("DRUGS");
		if (oDrugsSheet != null) {
			Iterator<Row> iterDrugRow = oDrugsSheet.iterator();
			long lRowIndex = 0;
			while (iterDrugRow.hasNext()) {
				Row oRow = iterDrugRow.next();
				
				if ((lRowIndex > 0) ||
					((lRowIndex == 0) && (!isVaMapTitleRow(oRow)))) {
					
					VaDrugRowMapping oVaDrugRowMapping = new VaDrugRowMapping(oRow);
					RowProcessingStatus eStatus = null;
					try {
						eStatus = updateTermDatabase(oVaDrugRowMapping);
					}
					catch (TermLoadException e) {
						outputRowMessage("Exception", e.getMessage(), oVaDrugRowMapping);
						eStatus = RowProcessingStatus.VA_MAP_EXCEPTION_OCCURRED;
					}
					updateVaMapStatistics(eStatus);
				}
				
				lRowIndex++;
				
				if ((lRowIndex % NUM_PER_SECTION) == 0) {
					System.out.println("Total rows processed so far: " + lRowIndex);
				}
			}
		}
	}
	
	/**
	 * This method reads the information in the JLV table that contains VA VUID to RxNORM mappings.   
	 * 
	 * @throws IOException This exception occurs if there is a problem reading the excel spreadsheet.
	 */
	private void loadJlvDodMedData() throws IOException {
		//Get the workbook instance for XLS file
		XSSFWorkbook workbook = new XSSFWorkbook (this.fisJlvDodMedFileName);
		 
		XSSFSheet oDrugsSheet = workbook.getSheet("DOD_MEDICATIONS");
		if (oDrugsSheet != null) {
			Iterator<Row> iterDrugRow = oDrugsSheet.iterator();
			long lRowIndex = 0;
			while (iterDrugRow.hasNext()) {
				Row oRow = iterDrugRow.next();
				
				if ((lRowIndex > 0) ||
					((lRowIndex == 0) && (!isDodMapTitleRow(oRow)))) {
					
					DodDrugRowMapping oDodDrugRowMapping = new DodDrugRowMapping(oRow);
					RowProcessingStatus eStatus = null;
					try {
						eStatus = updateTermDatabase(oDodDrugRowMapping);
					}
					catch (TermLoadException e) {
						outputRowMessage("Exception", e.getMessage(), oDodDrugRowMapping);
						eStatus = RowProcessingStatus.DOD_MAP_EXCEPTION_OCCURRED;
					}
					updateDodMapStatistics(eStatus);
				}
				
				lRowIndex++;
				
				if ((lRowIndex % NUM_PER_SECTION) == 0) {
					System.out.println("Total rows processed so far: " + lRowIndex);
				}
			}
		}
	}

	/**
	 * This method updates the statistics based on the return value.
	 * 
	 * @param eStatus The status of the update message.
	 */
	private void updateVaMapStatistics(RowProcessingStatus eStatus) {
		lNumVaMapProcessed++;
		
		if (eStatus == RowProcessingStatus.VA_MAP_SAME_MAPPING_TEXT_IDENTICAL) {
			lNumVaMapSame++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_SAME_MAPPING_BOTH_TEXT_DIFFERENT) {
			lNumVaMapSameBothTextDifferent++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_SAME_MAPPING_VA_TEXT_DIFFERENT) {
			lNumVaMapSameVaTextDifferent++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_SAME_MAPPING_RXNORM_TEXT_DIFFERENT) {
			lNumVaMapSameRxnormTextDifferent++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT) {
			lNumVaMapDifferent++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING) {
			lNumVaMapDifferentVaMissing++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING_WILL_COLLIDE) {
			lNumVaMapDifferentVaMissingWillCollide++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_JLV_MISSING) {
			lNumVaMapDifferentJlvMissing++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_ADDED) {
			lNumVaMapAdded++;
		}
		else if (eStatus == RowProcessingStatus.VA_MAP_EXCEPTION_OCCURRED) {
			lNumVaMapExceptions++;
		}
	}

	/**
	 * This method updates the statistics based on the return value.
	 * 
	 * @param eStatus The status of the update message.
	 */
	private void updateDodMapStatistics(RowProcessingStatus eStatus) {
		lNumDodMapProcessed++;
		
		if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_WITH_MAPPING) {
			lNumDodMapConceptCreatedWithMapping++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_MAPPING_COLLIDED) {
			lNumDodMapConceptCreatedMappingCollided++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_NO_MAPPING) {
			lNumDodMapConceptCreatedNoMapping++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_RXNORM_NOT_EXIST) {
			lNumDodMapConceptCreatedRxnormNotExist++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_COLLIDED) {
			lNumDodMapConceptExistedMappingCollided++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_ADDED) {
			lNumDodMapConceptExistedMappingAdded++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_EXISTED) {
			lNumDodMapConceptExistedMappingExisted++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_RXNORM_NOT_EXIST) {
			lNumDodMapConceptExistedRxnormNotExist++;
		}		
		else if (eStatus == RowProcessingStatus.DOD_MAP_EXCEPTION_OCCURRED) {
			lNumDodMapExceptions++;
		}
		
	}

	/**
	 * This method takes the information in the given row and updates the terminology database with the information.
	 * 
	 * @param oVaDrugRowMapping The drug information in a single row of the JLV load table.
	 */
	private RowProcessingStatus updateTermDatabase(VaDrugRowMapping oVaDrugRowMapping) throws TermLoadException {
		RowProcessingStatus eProcessingStatus = RowProcessingStatus.VA_MAP_SAME_MAPPING_TEXT_IDENTICAL;
		
		if (NullChecker.isNullish(oVaDrugRowMapping.getVuid())) {
			throw new TermLoadException("Row did not contain a valid VUID.");
		}
		
		Concept oVaConcept = retrieveConcept("urn:vandf:" + oVaDrugRowMapping.getVuid());
		if (oVaConcept == null) {
//			createConcept(oVaDrugRowMapping);
			eProcessingStatus = RowProcessingStatus.VA_MAP_JLV_MAPPING_ADDED;
		}
		else {
			eProcessingStatus = compareMapping(oVaDrugRowMapping, oVaConcept);
			if (eProcessingStatus == RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING) {
				if (isAlreadyMappedToAnother(oVaDrugRowMapping.getRxnormCode(), "vandf")) {
					outputRowMessage("Error", "Cannot Add Mapping:  RxNorm Code: " + oVaDrugRowMapping.getRxnormCode() + " has already been mapped to another VUID.", oVaDrugRowMapping);
					eProcessingStatus = RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING_WILL_COLLIDE;
				}
				else {
					outputRowMessage("Status", "Adding Mapping:  RxNorm Code: " + oVaDrugRowMapping.getRxnormCode() + "  to VUID: " + oVaDrugRowMapping.getVuid(), oVaDrugRowMapping);
					addRxnormMapping(oVaDrugRowMapping, oVaConcept);
				}
			}
		}
		
		return eProcessingStatus;
	}
	
	/**
	 * This method takes the information in the given row and updates the terminology database with the information.
	 * 
	 * @param oDodDrugRowMapping The drug information in a single row of the JLV DoD medication load table.
	 */
	private RowProcessingStatus updateTermDatabase(DodDrugRowMapping oDodDrugRowMapping) throws TermLoadException {
		RowProcessingStatus eProcessingStatus = null;
		
		if (NullChecker.isNullish(oDodDrugRowMapping.getDodNcid())) {
			throw new TermLoadException("Row did not contain a valid DoD NCID.");
		}
		
		String sDodNcidUrn = "urn:ncid:" + oDodDrugRowMapping.getDodNcid();
		Concept oDodConcept = retrieveConcept(sDodNcidUrn);
		if (oDodConcept == null) {
			createConcept(oDodDrugRowMapping);
			if (NullChecker.isNotNullish(oDodDrugRowMapping.getRxnormCode())) {
				if (isAlreadyMappedToAnother(oDodDrugRowMapping.getRxnormCode(), "ncid")) {
					outputRowMessage("Status", "Cannot Add Mapping:  RxNorm Code: " + oDodDrugRowMapping.getRxnormCode() + " has already been mapped to another DOD NCID.", oDodDrugRowMapping);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_MAPPING_COLLIDED;
				}
				else if (!doesConceptExist("urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode())) {
					outputRowMessage("Status", "Cannot Add Mapping:  RxNorm Code: " + oDodDrugRowMapping.getRxnormCode() + " does not exist in the database.", oDodDrugRowMapping);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_RXNORM_NOT_EXIST;
				}
				else {
					addSameAsItem(sDodNcidUrn, "urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode());
					addSameAsItem("urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode(), sDodNcidUrn);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_WITH_MAPPING;
				}
			}
			else {
				eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_CREATED_NO_MAPPING;
			}
		}
		else {
			if (NullChecker.isNotNullish(oDodDrugRowMapping.getRxnormCode())) {
				if (isAlreadyMapped(oDodDrugRowMapping.getRxnormCode(), sDodNcidUrn)) {
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_EXISTED;
				}
				else if (isAlreadyMappedToAnother(oDodDrugRowMapping.getRxnormCode(), "ncid")) {
					outputRowMessage("Status", "Cannot Add Mapping:  RxNorm Code: " + oDodDrugRowMapping.getRxnormCode() + " has already been mapped to another DOD NCID.", oDodDrugRowMapping);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_COLLIDED;
				}
				else if (!doesConceptExist("urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode())) {
					outputRowMessage("Status", "Cannot Add Mapping:  RxNorm Code: " + oDodDrugRowMapping.getRxnormCode() + " does not exist in the database.", oDodDrugRowMapping);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_RXNORM_NOT_EXIST;
				}
				else {
					addSameAsItem(sDodNcidUrn, "urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode());
					addSameAsItem("urn:rxnorm:" + oDodDrugRowMapping.getRxnormCode(), sDodNcidUrn);
					eProcessingStatus = RowProcessingStatus.DOD_MAP_CONCEPT_EXISTED_MAPPING_ADDED;
				}
			}
		}
		
		return eProcessingStatus;
	}

	/**
	 * This verifies the that a concept exists in the database.  If it exists, then true is returned.
	 * 
	 * @param sUrn The urn of the concept.
	 * @return TRUE of the concept exists.
	 * @throws TermLoadException 
	 */
	private boolean doesConceptExist(String sUrn) throws TermLoadException {
		Concept oConcept = retrieveConcept(sUrn);
		if (oConcept != null) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * This method creates a new concept with the information in the given row.  Note that this will
	 * add a concept to the database without the "sameas" value filled in.  We need to do some more
	 * verification that we add the "sameas" value for this RxNorm code before we insert it.
	 *  
	 * @param oDodDrugRowMapping The information to include in the concept.
	 * @throws TermLoadException This exception is thrown if there is an issue creating the LuceneIndex information.
	 */
	private void createConcept(DodDrugRowMapping oDodDrugRowMapping) throws TermLoadException {
		Map<String, Object> mapConcept = new HashMap<String, Object>();
		
		String sDodNcidUrn = "urn:ncid:" + oDodDrugRowMapping.getDodNcid();
		mapConcept.put("urn", sDodNcidUrn);
		
		if (NullChecker.isNotNullish(oDodDrugRowMapping.getDodText())) {
			mapConcept.put("description", oDodDrugRowMapping.getDodText());
		}
		else if (NullChecker.isNotNullish(oDodDrugRowMapping.getMmmText())) {
			mapConcept.put("description", oDodDrugRowMapping.getMmmText());
		}
		else {
			throw new TermLoadException("Failed to create concept.  Neither the DoD description text or the mmm text existed.  Concept: " + sDodNcidUrn);
		}
		mapConcept.put("code", oDodDrugRowMapping.getDodNcid());
		mapConcept.put("codeSystem", "NCID");
		mapConcept.put("aui", "");
		mapConcept.put("cui", "");
		mapConcept.put("attributes", new HashMap<String, Object>());
		mapConcept.put("terms", new ArrayList<Map<String,String>>());
		mapConcept.put("ancestors", new HashSet<String>());
		mapConcept.put("parents", new HashSet<String>());
		mapConcept.put("sameas", new HashSet<String>());
		mapConcept.put("rels", new HashMap<String, Set<String>>());
		
		oH2TermDataSource.save(mapConcept);
		
		saveLuceneIndex(sDodNcidUrn, mapConcept);
		
	}

	/**
	 * This method adds the mapping between the given concept and the Rxnorm code.
	 * 
	 * @param oVaDrugRowMapping The row that was read from the JLV table.
	 * @param oVaConcept The concept that represents the VUID.
	 * @throws TermLoadException 
	 */
	private void addRxnormMapping(VaDrugRowMapping oVaDrugRowMapping, Concept oVaConcept) throws TermLoadException {
		addSameAsItem("urn:vandf:" + oVaDrugRowMapping.getVuid(), "urn:rxnorm:" + oVaDrugRowMapping.getRxnormCode());
		addSameAsItem("urn:rxnorm:" + oVaDrugRowMapping.getRxnormCode(), "urn:vandf:" + oVaDrugRowMapping.getVuid());
	}

	/**
	 * This method retrieves the concept for the given URN and adds the "UrnToAdd" urn to the 
	 * "sameas" list for this concept.  It also updates the Lucene index after making the change.
	 * 
	 * @param sUrn The URN to be updated.
	 * @param sUrnToAdd The URN to add to the sameas set.
	 * @throws TermLoadException The exception of a problem occurs.
	 */
	private void addSameAsItem(String sUrn, String sUrnToAdd) throws TermLoadException {
		Map<String, Object> mapConcept = retrieveConceptMap(sUrn);
		if (mapConcept == null) {
			throw new TermLoadException("Failed to add 'sameas' entry for concept urn: " + sUrn + ".  The concept does not exist in the terminology database.");
		}
		
		@SuppressWarnings("unchecked")
		Set<String> setSameAs = (Set<String>) mapConcept.get("sameas");
		if (setSameAs == null) {
			setSameAs = new HashSet<String>();
			mapConcept.put("sameas", setSameAs);
		}
		setSameAs.add(sUrnToAdd);
		oH2TermDataSource.save(mapConcept);
		
		saveLuceneIndex(sUrn, mapConcept);
	}

	/**
	 * This will update the Lucene index with the new information in the mapped concept.
	 *
	 * @param sUrn The URN for the concept. 
	 * @param mapConcept The concept map.
	 * @throws TermLoadException 
	 */
	private void saveLuceneIndex(String sUrn, Map<String, Object> mapConcept) throws TermLoadException {
		Document oLuceneDoc = createLuceneDoc(sUrn, mapConcept);
		updateLuceneDoc(sUrn, oLuceneDoc);
	}

	/**
	 * This method updates the lucene search document for the given concept. 
	 * 
	 * @param sUrn The URN of the concept being updated.
	 * @param oLuceneDoc The Lucene Document that represents the search criteria.
	 * @throws TermLoadException 
	 */
	private void updateLuceneDoc(String sUrn, Document oLuceneDoc) throws TermLoadException {
		if (!bLuceneSetup) {
			setupLuceneAccess();
		}
		
		Term oTerm = new Term("urn", sUrn);
		try {
			oLuceneWriter.updateDocument(oTerm, oLuceneDoc);
		}
		catch (Exception e) {
			throw new TermLoadException("Failed to update lucene index for urn: " + sUrn);
		}
	}

	/**
	 * Create the Lucene Document for this concept.
	 * 
	 * @param sUrn The URN of the concept.
	 * @param mapConcept The concept information in the form of a map.
	 * @return The document that was created.
	 */
	@SuppressWarnings("unchecked")
	private Document createLuceneDoc(String sUrn, Map<String, Object> mapConcept) {
		Set<String> setAncestor = (Set<String>) mapConcept.get("ancestors"); //same as src.getAncestorSet(urn);
		Set<String> setParent = (Set<String>) mapConcept.get("parents"); // same as src.getParentSet(urn);
		Set<String> setSameas = (Set<String>) mapConcept.get("sameas"); // same as src.getEquivalentSet(urn);
		List<Map<String, String>> listTerms = (List<Map<String, String>>) mapConcept.get("terms"); // same as src.getTermList(urn);
		Map<String, Set<String>> mapRels = (Map<String, Set<String>>) mapConcept.get("rels"); // same as src.getRelMap(urn);
		
		// create the document
		String sab = TermEng.parseCodeSystem(sUrn).toLowerCase();
		UMLSBuildPolicy policy = UMLSBuildPolicy.getPolicy(sab);
		Document doc = new Document();
		doc.add(new StringField("urn", sUrn, Field.Store.YES));
		doc.add(new StringField("sab", sab, Field.Store.NO));
		doc.add(new StringField("code", TermEng.parseCode(sUrn), Field.Store.NO));
		if (mapConcept.containsKey("description"))
			doc.add(new TextField("description", mapConcept.get("description").toString(), Field.Store.YES));
		
		// add all the terms
		if (listTerms != null) {
			for (Map<String, String> term : listTerms) {
				// sab-specific rules
				if (policy.indexTerm(term)) {
	    			doc.add(new StringField("aui", term.get("aui").toString(), Field.Store.NO));
	    			doc.add(new StringField("cui", term.get("cui").toString(), Field.Store.NO));
	    			doc.add(new TextField("term", term.get("str").toString(), Field.Store.YES));
				}
			}
		}
		
		// add the set lists
		if (setAncestor != null) {
    		for (String s : setAncestor) {
    			doc.add(new StringField("ancestor", s, Field.Store.NO));
    		}
		}
		if (setParent != null) {
    		for (String s : setParent) {
    			doc.add(new StringField("parent", s, Field.Store.NO));
    		}
		}
		if (setSameas != null) {
    		for (String s : setSameas) {
    			doc.add(new StringField("sameas", s, Field.Store.NO));
    		}
		}
		
		// misc relations map
		if (mapRels != null) {
			for (String urn2 : mapRels.keySet()) {
				for (String relstr : mapRels.get(urn2)) {
					doc.add(new StringField(relstr, urn2, Field.Store.NO));
				}
			}
		}
		return doc;
	}

	/**
	 * This method will look at an Rxnorm code and see if it is already mapped to a VUID.
	 * 
	 * @param sRxnormCode The Rxnorm code that is being mapped.
	 * @param sCodeSet The name of the code set (sab) that is being checked (i.e. vandf, ncid, etc.)
	 * @return TRUE if this rxnorm code is already associated with a VUID.
	 * @throws TermLoadException Throws if the concept could not be retrieved.
	 */
	private boolean isAlreadyMappedToAnother(String sRxnormCode, String sCodeSet) throws TermLoadException {
		boolean bResult = false;
		
		Concept oRxnormConcept = retrieveRxnormConcept(sRxnormCode);
		
		if (oRxnormConcept != null) {
			Set<String> setSameAs = oRxnormConcept.getEquivalentSet();
			if (setSameAs != null) {
				for (String sUrn : setSameAs) {
					if (sUrn.startsWith("urn:" + sCodeSet)) {
						bResult = true;
						break;
					}
				}
			}
		}
		
		return bResult;
	}

	/**
	 * This method will look at an Rxnorm code and see if it is already mapped to a VUID.
	 * 
	 * @param sRxnormCode The Rxnorm code that is being mapped.
	 * @param sConceptUrn The URN of the concept to compare with the items in the SameAs array.
	 * @return TRUE if this rxnorm code is already associated with a VUID.
	 * @throws TermLoadException Throws if the concept could not be retrieved.
	 */
	private boolean isAlreadyMapped(String sRxnormCode, String sConceptUrn) throws TermLoadException {
		boolean bResult = false;
		
		Concept oRxnormConcept = retrieveRxnormConcept(sRxnormCode);
		
		if (oRxnormConcept != null) {
			Set<String> setSameAs = oRxnormConcept.getEquivalentSet();
			if (setSameAs.contains(sConceptUrn)) {
				bResult = true;
			}
		}
		
		return bResult;
	}

	/**
	 * Retrieve an RxNorm concept.
	 * 
	 * @param sRxnormCode The RXNorm code.
	 * @return The RxNorm concept if it exists.
	 * @throws TermLoadException This occurs if an error happens when retrieving the concept.
	 */
	private Concept retrieveRxnormConcept(String sRxnormCode)	throws TermLoadException {
		if (NullChecker.isNullish(sRxnormCode)) {
			return null;
		}
		
		Concept oRxnormConcept = retrieveConcept("urn:rxnorm:" + sRxnormCode);
		return oRxnormConcept;
	}

	/**
	 * This method returns true if the two strings are equal (ignoring case).  Null and "" are 
	 * treated the same in this comparison.
	 * 
	 * @param s1 The first string.
	 * @param s2 The second string.
	 * @return TRUE if they are equal.
	 */
	private boolean stringsEqualIgnoreCase(String s1, String s2) {
		
		if ((NullChecker.isNullish(s1)) && (NullChecker.isNullish(s2))) {
			return true;
		}
		else if ((NullChecker.isNotNullish(s1)) && (NullChecker.isNotNullish(s2)) &&
				 (s1.equalsIgnoreCase(s2))) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * This method compares the concept retrieved from the database to the mapping that we are looking at in the JLV table to see if 
	 * they differ and if so how...
	 * 
	 * @param oVaDrugRowMapping The Row we are processing from the JLV table.
	 * @param oVaConcept The concept that we retrieved from the database.
	 * @return The status of the comparison.
	 */
	private RowProcessingStatus compareMapping(VaDrugRowMapping oVaDrugRowMapping, Concept oVaConcept) throws TermLoadException {
		
		// First find the RxNorm code..
		//------------------------------
		String sRxnormCode = extractRxnormCode(oVaConcept);
		if (!stringsEqualIgnoreCase(oVaDrugRowMapping.getRxnormCode(), sRxnormCode))	{
			if (NullChecker.isNullish(oVaDrugRowMapping.getRxnormCode())) {
				outputRowMessage("Mapping Difference (Missing JLV)", "VA and JLV mapping was different for VUID: " + oVaDrugRowMapping.getVuid() +
					       " VA had: " + sRxnormCode + " JLV had: " + oVaDrugRowMapping.getRxnormCode(), oVaDrugRowMapping);
				return RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_JLV_MISSING;
			}
			else if (NullChecker.isNullish(sRxnormCode)) {
				outputRowMessage("Mapping Difference (Missing VA)",  "VA and JLV mapping was different for VUID: " + oVaDrugRowMapping.getVuid() +
					       " VA had: " + sRxnormCode + " JLV had: " + oVaDrugRowMapping.getRxnormCode(), oVaDrugRowMapping);
				return RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT_VA_MISSING;
			}
			else {
				outputRowMessage("Mapping Difference (Different Code)", "VA and JLV mapping was different for VUID: " + oVaDrugRowMapping.getVuid() +
						       " VA had: " + sRxnormCode + " JLV had: " + oVaDrugRowMapping.getRxnormCode(), oVaDrugRowMapping);
				return RowProcessingStatus.VA_MAP_JLV_MAPPING_DIFFERENT;
			}
		}
		
		// Compare VA Text 
		//----------------
		boolean bVaTextDifferent = !stringsEqualIgnoreCase(oVaDrugRowMapping.vistaText, oVaConcept.getDescription());
		boolean bRxnormTextDifferent = true;
		String sRxnormText = "";
		
		if (NullChecker.isNotNullish(sRxnormCode)) {
			Concept oRxnormConcept = retrieveConcept("urn:rxnorm:" + sRxnormCode);
			if (oRxnormConcept != null) {
				sRxnormText = oRxnormConcept.getDescription();
				bRxnormTextDifferent = !stringsEqualIgnoreCase(oVaDrugRowMapping.rxnormText, oRxnormConcept.getDescription());
			}
			else if ((oRxnormConcept == null) && (NullChecker.isNotNullish(oVaDrugRowMapping.getRxnormText()))) {
				bRxnormTextDifferent = false;		// It did not exist in the database - but it was also null in the table as well.
			}
		} 
		// If both are null - they should be considered the same.
		//-------------------------------------------------------
		else if ((NullChecker.isNullish(sRxnormCode)) && (NullChecker.isNullish(oVaDrugRowMapping.getRxnormText()))) {
			bRxnormTextDifferent = false;
		}
		
		if ((bVaTextDifferent) && (bRxnormTextDifferent)) {
			outputRowMessage("Both Text Difference", "VA Text and Rxnorm Text were different for VUID: " + oVaDrugRowMapping.getVuid() +
				       " VA Vista Text had: '" + oVaConcept.getDescription() + "' JLV Vista Text had: '" + oVaDrugRowMapping.getVistaText() + "' " +
				       " VA RxNorm Text had: '" + sRxnormText + "' JLV RxNorm Text had: '" + oVaDrugRowMapping.getRxnormText() + "' ", oVaDrugRowMapping);
			return RowProcessingStatus.VA_MAP_SAME_MAPPING_BOTH_TEXT_DIFFERENT;
		}
		else if (bVaTextDifferent) {
			outputRowMessage("VA Text Difference", "VA Text was different for VUID: " + oVaDrugRowMapping.getVuid() +
				           " VA Vista Text had: '" + oVaConcept.getDescription() + "' JLV Vista Text had: '" + oVaDrugRowMapping.getVistaText() + "' ", oVaDrugRowMapping);
			return RowProcessingStatus.VA_MAP_SAME_MAPPING_VA_TEXT_DIFFERENT;
		}
		else if (bRxnormTextDifferent) {
			outputRowMessage("RxNorm Text Difference", "VA Text and Rxnorm Text were different for VUID: " + oVaDrugRowMapping.getVuid() +
				           " VA RxNorm Text had: '" + sRxnormText + "' JLV RxNorm Text had: '" + oVaDrugRowMapping.getRxnormText() + "' ", oVaDrugRowMapping);
			return RowProcessingStatus.VA_MAP_SAME_MAPPING_RXNORM_TEXT_DIFFERENT;
		}
		
		return RowProcessingStatus.VA_MAP_SAME_MAPPING_TEXT_IDENTICAL;
	}

	/**
	 * This method returns the Rxnorm code for this concept by looking through the 
	 * "SameAs" list of the concept.   If it finds a code, it returns it.  If this list
	 * contains multiple Rxnorm codes, it throws an exception.
	 * 
	 * @param oVaConcept The concept to be checked.
	 * @return The Rxnorm code.
	 * @throws TermLoadException An exception if more than one Rxnorm code was found for this concept.
	 */
	private String extractRxnormCode(Concept oVaConcept) throws TermLoadException {
		String sRxnormCode = null;
		StringBuffer sbRxnormCodes = new StringBuffer("");
		
		Set<String> setSameAsList = oVaConcept.getEquivalentSet();
		if (setSameAsList != null) {
			for (String sUrn : setSameAsList) {
				if (sUrn.startsWith("urn:rxnorm:")) {
					if (NullChecker.isNullish(sRxnormCode)) {
						sRxnormCode = sUrn.substring("urn:rxnorm:".length());
					}
					else {
						sbRxnormCodes.append(";" + sUrn.substring("urn:rxnorm:".length()));
					}
				}
			}
		}

		if (sbRxnormCodes.length() > 0) {
			throw new TermLoadException("Found more than one Rxnorm for concept: urn: " + oVaConcept.getURN() + " Rxnorm Codes: " + sRxnormCode + sbRxnormCodes.toString());
		}
		
		return sRxnormCode;
	}

	/**
	 * This method retrieves the concept from the terminology database.
	 * 
	 * @param dodNcid
	 * @return
	 */
	private Map<String, Object> retrieveConceptMap(String urn) throws TermLoadException {
		Map<String, Object> mapConcept = null;
		
		if (oTermEng == null) {
			openTermDatabase();
		}
		
		mapConcept = oTermEng.getConceptData(urn);
		
		return mapConcept;
	}

	/**
	 * This method retrieves the concept from the terminology database.
	 * 
	 * @param dodNcid
	 * @return
	 */
	private Concept retrieveConcept(String urn) throws TermLoadException {
		Concept oConcept = null;
		
		if (oTermEng == null) {
			openTermDatabase();
		}
		
		oConcept = oTermEng.getConcept(urn);
		
		return oConcept;
	}

	/**
	 * Open the terminology database.
	 */
	private void openTermDatabase() throws TermLoadException {
		String sDirectory = "";
		try {
			sDirectory = fH2Directory.getCanonicalPath();
		}
		catch (Exception e) {
			throw new TermLoadException("Failed to get path name for H2 database.  Error: " + e.getMessage(), e);
		}
		
		String sJdbcUrl = "jdbc:h2:" + sDirectory + "/termdb";
		
		H2TermDataSource[] oaH2TermDataSource = new H2TermDataSource[1];
		try {
			oH2TermDataSource = new H2TermDataSource(sJdbcUrl);
			oaH2TermDataSource[0] = oH2TermDataSource;
		} 
		catch (ClassNotFoundException e) {
			throw new TermLoadException("Failed to open terminology database.  Error: " + e.getMessage(), e);
		} 
		catch (SQLException e) {
			throw new TermLoadException("Failed to open terminology database.  Error: " + e.getMessage(), e);
		}
		
		oTermEng = TermEng.createInstance(oaH2TermDataSource);
		
		if ((oTermEng == null) || (oH2TermDataSource == null)) {
			throw new TermLoadException("Failed to open terminology database.  Reason - unknown.");
		}
	}
	
	/**
	 * This method sets up the handles for accessing the terminology Lucene index.
	 * 
	 * @throws TermLoadException This is thrown if any part of the setup fails.
	 */
	@SuppressWarnings("deprecation")
	private void setupLuceneAccess() throws TermLoadException {
        oLuceneAnalyzer = new StandardAnalyzer(Version.LUCENE_44);
        if (oLuceneAnalyzer == null) {
        	throw new TermLoadException("Failed to set up Lucene analyzer.");
        }

		String sDirectory = "";
		try {
			sDirectory = fH2Directory.getCanonicalPath();
		}
		catch (Exception e) {
			throw new TermLoadException("Failed to get path name for H2 database.  Error: " + e.getMessage(), e);
		}
		sDirectory += "/lucene";
		try {
	    	oLuceneDirectory = FSDirectory.open(new File(sDirectory));
	    	if (oLuceneDirectory == null) {
	    		throw new TermLoadException("Failed to open lucene directory: " + sDirectory);
	    	}
		}
		catch (Exception e) {
			throw new TermLoadException("Failed to open lucene directory.  Error: " + e.getMessage(), e);
		}
    	
        IndexWriterConfig oWriterConf = new IndexWriterConfig(Version.LUCENE_44, new LimitTokenCountAnalyzer(oLuceneAnalyzer, Integer.MAX_VALUE));
        
        try {
			oLuceneWriter = new IndexWriter(oLuceneDirectory, oWriterConf);
			if (oLuceneWriter == null) {
	        	throw new TermLoadException("Failed to create Lucene Writer.");
			}
        }
        catch (Exception e) {
        	throw new TermLoadException("Failed to create Lucene Writer.  Error: " + e.getMessage(), e);
        }
		
        // if index doesn't exist, create it (otherwise you get an error trying to open the reader)
		//--------------------------------------------------------------------------------------------
        try {
	        if (!DirectoryReader.indexExists(oLuceneDirectory)) {
				oLuceneWriter.commit(); // for ensuring the index exists the first time
	        }
        }
        catch (Exception e) {
        	throw new TermLoadException("Failed to initialize lucene index.  Error: " + e.getMessage(), e);
        }
        
		try {
			oLuceneReader = DirectoryReader.open(oLuceneDirectory);
			if (oLuceneReader == null) {
	    		throw new TermLoadException("Failed to open lucene directory reader.");
			}
		}
		catch (Exception e) {
    		throw new TermLoadException("Failed to open lucene directory reader.  Error: " + e.getMessage(), e);
		}
		
		oLuceneSearcher = new IndexSearcher(oLuceneReader);
		if (oLuceneSearcher == null) {
    		throw new TermLoadException("Failed to create lucene searcher.");
		}
		
		oLuceneParser = new QueryParser(Version.LUCENE_44, "description", oLuceneAnalyzer);
		if (oLuceneParser == null) {
    		throw new TermLoadException("Failed to create lucene parser.");
		}
		oLuceneParser.setDefaultOperator(Operator.AND);
		
		bLuceneSetup = true;

	}


	/**
	 * This method checks the row to see if it is a title row.  It returns true if it is.
	 * 
	 * @param oRow The row to be checked.
	 * @return TRUE if this is a title row.
	 */
	private static boolean isVaMapTitleRow(Row oRow) {
		boolean bReturnValue = false;
		
		if ((oRow != null) &&
			(oRow.getPhysicalNumberOfCells() > 0)) {
			Cell oCell = oRow.getCell(oRow.getFirstCellNum());
			if ((oCell != null) &&
				(oCell.getCellType() == Cell.CELL_TYPE_STRING)) {
				if (VA_MAP_TITLE_ROW_CELL_1_TEXT.equals(oCell.getStringCellValue())) {
					bReturnValue = true;
				}
			}
		}
		
		return bReturnValue;
	}
	
	/**
	 * This method checks the row to see if it is a title row.  It returns true if it is.
	 * 
	 * @param oRow The row to be checked.
	 * @return TRUE if this is a title row.
	 */
	private static boolean isDodMapTitleRow(Row oRow) {
		boolean bReturnValue = false;
		
		if ((oRow != null) &&
			(oRow.getPhysicalNumberOfCells() > 0)) {
			Cell oCell = oRow.getCell(oRow.getFirstCellNum());
			if ((oCell != null) &&
				(oCell.getCellType() == Cell.CELL_TYPE_STRING)) {
				if (DOD_MAP_TITLE_ROW_CELL_1_TEXT.equals(oCell.getStringCellValue())) {
					bReturnValue = true;
				}
			}
		}
		
		return bReturnValue;
	}

	/**
	 * This will return the value at the cell location as a string.  If it is null, then
	 * it will return null.  If it is numeric, it will be transformed into a string.
	 * 
	 * @param oRow The row containing the data.
	 * @param iCellNum The cell number of the cell containing the data.
	 * @return The value of the cell as a string.
	 */
	private String getStringCellValue(Row oRow, int iCellNum) {
		String sValue = null;
		
		if ((oRow != null) &&
			(oRow.getCell(iCellNum) != null)) {
			Cell oCell = oRow.getCell(iCellNum);
			if (oCell.getCellType() == Cell.CELL_TYPE_STRING) {
				sValue = oCell.getStringCellValue();
				
				// The cell may have the reserved word "null" - if so then we should treat it as a real null.
				//---------------------------------------------------------------------------------------------
				if (sValue.equalsIgnoreCase("null")) {
					sValue = null;
				}
			}
			else if (oCell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
				double dValue = oCell.getNumericCellValue();

				// Is it an integer value?  If it is then we want to cast it to an integer or long first or we end
				// up getting ".0" at the end of the string when we convert it and it makes it look like a decimal value
				// when in the spreadsheet it was not.
				//-------------------------------------------------------------------------------------------------------
				if ((!Double.isInfinite(dValue)) &&
					(dValue == Math.floor(dValue))) {
					sValue = ((long) dValue) + "";
				}
				else {
					sValue = oCell.getNumericCellValue() + "";
				}
			}
		}
		
		return sValue;
	}
	

	/**
	 * Output the run-time instructions.
	 */
	private static void outputRunInstructions() {
		System.out.println("Usage:");
		System.out.println("JLVDrugLoadUtil h2-database-directory jlv-va-med-file jlv-dod-med-file status-file");
		System.out.println("Where:");
		System.out.println("  h2-database-directory is the directory where the h2 terminology database is located.");
		System.out.println("  jlv-va-med-file is the directory and file name of the JLV excel spreadsheet in 'xlsx' format");
		System.out.println("                  containing the VUID to RXNORM mappings.");
		System.out.println("  jlv-dod-med-file is the directory and file name of the JLV excel spreadsheet in 'xlsx' format");
		System.out.println("                  containing the DoD NCID to RXNORM mappings.");
		System.out.println("  status-file is the directory and location where status information will be placed. ");
		System.out.println("              If the file does not exist, it will be created.");
	}
	
	/**
	 * Class that represents one row of the JLV Drugs map sheet.
	 * 
	 * @author Les.Westberg
	 *
	 */
	private class VaDrugRowMapping {
		private static final int CELL_RXNORM_CODE = 0;
		private static final int CELL_VUID = 1;
		private static final int CELL_VISTA_TEXT = 2;
		private static final int CELL_RXNORM_TEXT = 3;
		private static final int CELL_INDEX = 4;
		
		private String rxnormCode = null;
		private String vuid = null;
		private String vistaText = null;
		private String rxnormText = null;
		private String index = null;
		
		public VaDrugRowMapping (Row oRow) {
			if (oRow != null) {
				rxnormCode = getStringCellValue(oRow, CELL_RXNORM_CODE);
				vuid = getStringCellValue(oRow, CELL_VUID);
				vistaText = getStringCellValue(oRow, CELL_VISTA_TEXT);
				rxnormText = getStringCellValue(oRow, CELL_RXNORM_TEXT);
				index = getStringCellValue(oRow, CELL_INDEX);
			}
		}
		
		public String getRxnormCode() {
			return rxnormCode;
		}
		
		public String getVuid() {
			return vuid;
		}
		
		public String getVistaText() {
			return vistaText;
		}
		
		public String getRxnormText() {
			return rxnormText;
		}
		
		public String getIndex() {
			return index;
		}
		
	}

	/**
	 * Class that represents one row of the JLV DoD Drugs map sheet.
	 * 
	 * @author Les.Westberg
	 *
	 */
	private class DodDrugRowMapping {
		private static final int CELL_INDEX = 0;
		private static final int CELL_DOD_NCID = 1;
		private static final int CELL_DOD_TEXT = 2;
		private static final int CELL_MMM_TEXT = 3;
		private static final int CELL_RXNORM_CODE = 4;
		
		private String index = null;
		private String dodNcid = null;
		private String dodText = null;
		private String mmmText = null;
		private String rxnormCode = null;
		
		public DodDrugRowMapping (Row oRow) {
			if (oRow != null) {
				index = getStringCellValue(oRow, CELL_INDEX);
				dodNcid = getStringCellValue(oRow, CELL_DOD_NCID);
				dodText = getStringCellValue(oRow, CELL_DOD_TEXT);
				mmmText = getStringCellValue(oRow, CELL_MMM_TEXT);
				rxnormCode = getStringCellValue(oRow, CELL_RXNORM_CODE);
			}
		}

		public String getIndex() {
			return index;
		}

		public String getDodNcid() {
			return dodNcid;
		}

		public String getDodText() {
			return dodText;
		}

		public String getMmmText() {
			return mmmText;
		}

		public String getRxnormCode() {
			return rxnormCode;
		}
		
	}
}
