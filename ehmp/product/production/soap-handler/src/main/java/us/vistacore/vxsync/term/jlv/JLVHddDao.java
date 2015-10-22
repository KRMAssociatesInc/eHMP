package us.vistacore.vxsync.term.jlv;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.utility.NullChecker;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * This class is used to read/write concept information from the JLV H2 Terminology database.
 * 
 * @author Les.Westberg
 *
 */
public class JLVHddDao {
    static final Logger LOG = LoggerFactory.getLogger(JLVHddDao.class);
    
    public enum MappingType {
    	AllergyVUIDtoUMLSCui,
    	AllergyCHCSIenToUMLSCui,
    	AllergyDODNcidToUMLSCui,
    	LabUseLOINCtoGetText,
    	LabDODNcidToLOINC,
    	VitalsVuidToLoinc,
    	VitalsDODNcidToLoinc,
    	ProblemsIcd9ToSnomedCT,
    	ProblemsMedcinIdToSnomedCT,
    	MedicationVuidToRxNorm,
    	MedicationDodNcidToRxNorm,
        NotesVuidToLoinc,
        NotesDodNcidToLoinc,
        ImmunizationCptToCvx
    };
    
    protected static JLVHddDao oHDDDaoInstance = null;
    
    protected String sJLVH2JdbcUrl = "";
	protected Connection oDBConnection = null;

    /**
     * Default constructor - We should get an instance of this class from the createInstance method.
     * 
     */
	protected JLVHddDao() {
	}
    
    /**
     * Default constructor - We should get an instance of this class from the createInstance method.
     * 
     */
	protected JLVHddDao (String sJLVH2JdbcUrl) {
    	this.sJLVH2JdbcUrl = sJLVH2JdbcUrl;
    }
    
    
    /**
     * Return the instance of the HDDDao object.
     * 
     * @return THe HDDDao object that is returned.
     */
    public static JLVHddDao createInstance() throws TermLoadException {
    	if (oHDDDaoInstance == null) {
    		throw new TermLoadException("This method can only be called after createInstance(JLVH2JdbcUrl) has already been called.");
    	}
    	return oHDDDaoInstance;
    }

    /**
     * This method returns the instance of the HDD DAO object.  If it has not yet been created,
     * then it creates it.
     * 
     * @param sJLVH2JdbcUrl THe URL of the JLV H2 database.
     * @return
     */
    public static JLVHddDao createInstance(String sJLVH2JdbcUrl) throws TermLoadException {
    	if (NullChecker.isNullish(sJLVH2JdbcUrl)) {
    		throw new TermLoadException("This method can only be called with a valid JDBC URL.");
    	}
    	
    	if (oHDDDaoInstance == null) {
    		oHDDDaoInstance = new JLVHddDao(sJLVH2JdbcUrl);
    	}
    	return oHDDDaoInstance;
    }
    
	/**
	 * This method creates and returns the JDBC connection.  
	 * 
	 * @return The JDBC Connection
	 * @throws SQLException The exception that is thrown if the connection could not be created.
	 */
	protected Connection getConnection() throws SQLException {
		return DriverManager.getConnection(this.sJLVH2JdbcUrl, "sa", "");
	}
	
	/**
	 * Return a handle to the JLVReactantsMap object.
	 * 
	 * @return The handle to the JLVReactantsMap
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVReactantsMap getJLVReactantsMap() throws TermLoadException {
		return new JLVReactantsMap(this.oDBConnection);
	}

	/**
	 * Returns a handle to the JLVDodAllergiesMap object.
	 * 
	 * @return The handle to the JLVDodAllergiesMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVDodAllergiesMap getJLVDodAllergiesMap() throws TermLoadException {
		return new JLVDodAllergiesMap(oDBConnection);
	}

	/**
	 * Returns a handle to the JLVLoincMap object.
	 * 
	 * @return The handle to the JLVLoincMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVLoincMap getJLVLoincMap() throws TermLoadException {
		return new JLVLoincMap(oDBConnection);
	}
	
	/**
	 * Returns a handle to the JLVDodLabsMap object.
	 * 
	 * @return The handle to the JLVDodLabsMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVDodLabsMap getJLVDodLabsMap() throws TermLoadException {
		return new JLVDodLabsMap(oDBConnection);
	}
	
	/**
	 * Returns a handle to the JLVVitalsMap object.
	 * 
	 * @return The handle to the JLVVitalsMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVVitalsMap getJLVVitalsMap() throws TermLoadException {
		return new JLVVitalsMap(oDBConnection);
	}
	
	/**
	 * Returns a handle to the JLVIcd9SnomedMap object.
	 * 
	 * @return The handle to the JLVIcd9SnomedMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVIcd9SnomedMap getJLVIcd9SnomedMap() throws TermLoadException {
		return new JLVIcd9SnomedMap(oDBConnection);
	}

	/**
	 * Returns a handle to the JLVMedcinSnomedMap object.
	 * 
	 * @return The handle to the JLVMedcinSnomedMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVMedcinSnomedMap getJLVMedcinSnomedMap() throws TermLoadException {
		return new JLVMedcinSnomedMap(oDBConnection);
	}

	/**
	 * Returns a handle to the JLVDrugsMap object.
	 * 
	 * @return The handle to the JLVDrugsMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVDrugsMap getJLVDrugsMap() throws TermLoadException {
		return new JLVDrugsMap(oDBConnection);
	}

	/**
	 * Returns a handle to the JLVDodMedicationsMap object.
	 * 
	 * @return The handle to the JLVDodMedicationsMap object.
	 * @throws TermLoadException This error is thrown if there is any exception.
	 */
	protected JLVDodMedicationsMap getJLVDodMedicationsMap() throws TermLoadException {
		return new JLVDodMedicationsMap(oDBConnection);
	}

    /**
     * Returns a handle to the JLVNotesMap object.
     *
     * @return The handle to the JLVNotesMap object.
     * @throws TermLoadException This error is thrown if there is any exception.
     */
    protected JLVNotesMap getJLVNotesMap() throws TermLoadException {
        return new JLVNotesMap(oDBConnection);
    }

    /**
     * Returns a handle to the JLVImmunizationsMap object.
     *
     * @return The handle to the JLVImmunizationsMap object.
     * @throws TermLoadException This error is thrown if there is any exception.
     */
    protected JLVImmunizationsMap getJLVImmunizationsMap() throws TermLoadException {
        return new JLVImmunizationsMap(oDBConnection);
    }

	/**
	 * This will open the database - set up the database connection.
	 * 
	 * @throws TermLoadException This is thrown if there is any issue opening the database.
	 */
	private void openDatabase() throws TermLoadException {
		if (this.oDBConnection == null) {
			try {
				Class.forName("org.h2.Driver");
				this.oDBConnection = getConnection();
			}
			catch (Exception e) {
				throw new TermLoadException("Failed to open H2 database.  Error: " + e.getMessage(), e);
			}
		}
	}

    /**
     * This method returns a list of mappings for the specified code. This method is used for one-to-many mappings.
     *
     * @param oMappingType The type of mapping being performed.
     * @param sSourceCode The source code to be used.
     * @return A list of codes for this source code for this mapping type.
     * @throws TermLoadException This is thrown if there are any exceptions.
     */
    public List<JLVMappedCode> getMappedCodeList(MappingType oMappingType, String sSourceCode) throws TermLoadException {

        List<JLVMappedCode> oMappedCodeList = new ArrayList<>();

        JLVMappedCode oMappedCode = getMappedCode(oMappingType, sSourceCode);
        if (oMappedCode != null) {
            oMappedCodeList.add(oMappedCode);
        }

        if (oMappingType == MappingType.NotesVuidToLoinc) {
            JLVNotesMap oNotesMap = getJLVNotesMap();
            List<JLVMappedCode> oResult = oNotesMap.getNotesLoincFromVuid(sSourceCode);

            if (oResult != null) {
                oMappedCodeList.addAll(oResult);
            }
        }

        return oMappedCodeList;
    }

	/**
	 * This method returns the mapping for the specified code. This method is used for one-to-one mappings.
	 * 
	 * @param oMappingType The type of mapping being performed.
	 * @param sSourceCode The source code to be used.
	 * @return The code that was mapped for this source code for this mapping type.
	 * @throws TermLoadException This is thrown if there are any exceptions.
	 */
	public JLVMappedCode getMappedCode(MappingType oMappingType, String sSourceCode) throws TermLoadException {
		JLVMappedCode oMappedCode = null;
		
		openDatabase();
		
		if (oMappingType == MappingType.AllergyVUIDtoUMLSCui) {
			JLVReactantsMap oReactantsMap = getJLVReactantsMap();
			oMappedCode = oReactantsMap.getAllergyUMLSCuiFromVuid(sSourceCode);
		} 
		else if (oMappingType == MappingType.AllergyCHCSIenToUMLSCui) {
			JLVDodAllergiesMap oDodAllergiesMap = getJLVDodAllergiesMap();
			oMappedCode = oDodAllergiesMap.getAllergyUMLSCuiFromChcsIen(sSourceCode);
		}
		else if (oMappingType == MappingType.AllergyDODNcidToUMLSCui) {
			JLVDodAllergiesMap oDodAllergiesMap = getJLVDodAllergiesMap();
			oMappedCode = oDodAllergiesMap.getAllergyUMLSCuiFromDodNcid(sSourceCode);
		}
		else if (oMappingType == MappingType.LabUseLOINCtoGetText) {
			JLVLoincMap oLoincMap = getJLVLoincMap();
			oMappedCode = oLoincMap.getLabLoincInfoFromLoincCode(sSourceCode);
		}
		else if (oMappingType == MappingType.LabDODNcidToLOINC) {
			JLVDodLabsMap oDodLabsMap = getJLVDodLabsMap();
			oMappedCode = oDodLabsMap.getLabLoincFromDodNcid(sSourceCode);
		}
		else if (oMappingType == MappingType.VitalsVuidToLoinc) {
			JLVVitalsMap oVitalsMap = getJLVVitalsMap();
			oMappedCode = oVitalsMap.getVitalsLoincFromVuid(sSourceCode);
		}
		else if (oMappingType == MappingType.VitalsDODNcidToLoinc) {
			JLVVitalsMap oVitalsMap = getJLVVitalsMap();
			oMappedCode = oVitalsMap.getVitalsLoincFromDodNcid(sSourceCode);
		}
		else if (oMappingType == MappingType.ProblemsIcd9ToSnomedCT) {
			JLVIcd9SnomedMap oIcd9SnomedMap = getJLVIcd9SnomedMap();
			oMappedCode = oIcd9SnomedMap.getProblemSnomedCTFromIcd9(sSourceCode);
		}
		else if (oMappingType == MappingType.ProblemsMedcinIdToSnomedCT) {
			JLVMedcinSnomedMap oMedcinSnomedMap = getJLVMedcinSnomedMap();
			oMappedCode = oMedcinSnomedMap.getProblemSnomedCTFromMedcinId(sSourceCode);
		}
		else if (oMappingType == MappingType.MedicationVuidToRxNorm) {
			JLVDrugsMap oDrugsMap = getJLVDrugsMap();
			oMappedCode = oDrugsMap.getMedicationRxNormFromVuid(sSourceCode);
		}
		else if (oMappingType == MappingType.MedicationDodNcidToRxNorm) {
			JLVDodMedicationsMap oDodMedicationsMap = getJLVDodMedicationsMap();
			oMappedCode = oDodMedicationsMap.getMedicationRxNormFromDodNcid(sSourceCode);
		}
        else if (oMappingType == MappingType.NotesDodNcidToLoinc) {
            JLVNotesMap oNotesMap = getJLVNotesMap();
            oMappedCode = oNotesMap.getNotesLoincFromDodNcid(sSourceCode);
        }
        else if (oMappingType == MappingType.ImmunizationCptToCvx) {
            JLVImmunizationsMap oImmunizationsMap = getJLVImmunizationsMap();
            oMappedCode = oImmunizationsMap.getImmunizationCvxFromCpt(sSourceCode);
        }
		
		return oMappedCode;
	}
}
