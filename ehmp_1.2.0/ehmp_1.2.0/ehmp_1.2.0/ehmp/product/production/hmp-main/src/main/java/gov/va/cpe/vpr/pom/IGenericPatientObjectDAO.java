package gov.va.cpe.vpr.pom;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IGenericPatientObjectDAO extends IGenericPOMObjectDAO {

	// save/delete
	<T extends IPatientObject> void deleteByPID(Class<T> clazz, String pid);

    void deleteCollectionByPIDAndSystem(String vistaCollectionName, String pid, String system);

    // count
    <T extends IPatientObject> int countByPID(Class<T> clazz, String pid);

	<T extends IPatientObject> T findByUID(String uid);

    <T extends IPatientObject> T findByUidWithTemplate(Class<T> clazz, String uid, String templateName);

    <T extends IPatientObject> T findByUidWithTemplate(String uid, String templateName);

	// query finders
	<T extends IPatientObject> Page<T> findAllByPID(Class<T> clazz, String pid, Pageable page);
	<T extends IPatientObject> List<T> findAllByPID(Class<T> clazz, String pid);
	/**
	 * @deprecated - use findAllByQuery() instead
	 */
	<T extends IPatientObject> List<T> findAllByIndex(Class<T> clazz, String pid, String indexName, String start, String end, Map<String, Object> where);
    <T extends IPatientObject> Page<T> findAllByPIDAndIndex(Class<T> clazz, String pid, String indexName, Pageable pageable);

    <T extends IPatientObject> List<T> findAllByPIDIndexAndRange(Class<T> clazz, String pid, String indexName, String range);
    <T extends IPatientObject> Page<T> findAllByPIDIndexAndRange(Class<T> clazz, String pid, String indexName, String range, Pageable pageable);

    // cross patient finders - do these belong on a different DAO?
    <T extends IPatientObject> List<T> findAllCrossPatientByIndex(Class<T> clazz, String indexName);
    <T extends IPatientObject> Page<T> findAllCrossPatientByIndex(Class<T> clazz, String indexName, Pageable pageable);
    <T extends IPatientObject> List<T> findAllCrossPatientByIndexAndRange(Class<T> clazz, String indexName, String range);
    <T extends IPatientObject> Page<T> findAllCrossPatientByIndexAndRange(Class<T> clazz, String indexName, String range, Pageable pageable);

    List<Map<String, Object>> findAllByUrl(String uri);
}
