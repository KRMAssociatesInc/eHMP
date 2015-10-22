package us.vistacore.asu.dao;

import java.util.Date;
import java.util.Map;

/**
 * Currently all the documentation is in AbstractPOMObject.
 * 
 * This splits the methods out into two interfaces for
 * 
 * IPOMObject
 * - for all objects (base objects plus nested objects)
 * - includes data marshalling and generic properties
 * 
 * IPatientObject extends IPOMOBject and adds:
 * - for the "root" objects (like Patient, Result, Medication, etc)
 * - includes event generation, indexing and some additional global properties
 * 
 * So something like PatientAddress would only be a IPOMObject, since it needs data
 * marshalling, but not events or indexing since it does not live on its own as is always going
 * to be part of a parent object (Patient)
 * 
 * 
 */
public interface IPOMObject {
	
	// data marshalling ----------------------
	void setData(String key, Object val);
	void setData(Map<String, Object> data);
	Map<String, Object> getData();
	Map<String, Object> getData(Class<? extends JSONViews> view);
	String toJSON();
	String toJSON(Class<? extends JSONViews> view);
	
	// global getters -------------------------
	String getUid();
	String getSummary();
	Map<String, Object> getProperties();
	Object getProperty(String key);
	Date getRecUpdated();
	Date getRecCreated();

}