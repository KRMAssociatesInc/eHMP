package gov.va.cpe.vpr.pom;

import java.util.List;
import java.util.Map;

public interface IPatientObject extends IPOMObject {
	List<Map<String, Object>> getIDX();
	
	// life cycle -----------------------------
	/** 
	 * Called on each PatientObject just after it is stored/saved.  
	 * Useful for also storing derivative objects 
	 **/
	public void save(IGenericPOMObjectDAO dao);
	/** 
	 * Called on each PatientObject just after it is loaded.  
	 * Useful for loading derivative objects or lazy loading. 
	 * By default stores the DAO in a weak daoRef for later use 
	 **/
	public void load(IGenericPOMObjectDAO dao);
	
	// events --------------------------------
	void clearEvents();
	List<PatientEvent.Change> getModifiedFields();
	List<PatientEvent<IPatientObject>> getEvents(); // TODO: This should probably be T and each POM Object should declare T.
	boolean isModified();
	
	// getters -------------------------------
	String getPid();
}