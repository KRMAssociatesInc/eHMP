package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

/**
 *
 *
 */
public interface IGenericPOMObjectDAO extends IDataStoreDAO {
    /**
     * Deletes the entity with the given uid.
     *
     * @param uid must not be {@literal null}.
     * @throws IllegalArgumentException in case the given {@code uid} is {@literal null}
     */
    void deleteByUID(String uid);

    /**
     * Deletes the entity with the given uid.
     *
     * @param type
     * @param uid must not be {@literal null}.
     * @throws IllegalArgumentException in case the given {@code uid} is {@literal null}
     */
    <T extends IPOMObject> void deleteByUID(Class<T> type, String uid);

    /**
     * Deletes all entities of the specified type.
     *
     * @param type
     */
    <T extends IPOMObject> void deleteAll(Class<T> type);

    /**
     * Returns the number of entities available.
     *
     * @param type
     * @return the number of entities
     */
    <T extends IPOMObject> int count(Class<T> type);

    /**
     * Returns the number of topics.
     *
     * @param index
     * @return the total number of topics
     */
    int count(String index);

    /**
     * Returns the number of entities for a given topic.
     *
     * @param index
     * @param topic
     * @return the total number of entities for a given topic
     */
    int count(String index, String topic);

    /**
     * Retrives an entity by its uid.
     *
     * @param type
     * @param uid must not be {@literal null}.
     * @return the entity with the given id or {@literal null} if none found
     * @throws IllegalArgumentException if {@code uid} is {@literal null}
     */
    <T extends IPOMObject> T findByUID(Class<T> type, String uid);

    /**
     * Retrives an entity by its uid.
     *
     * @param type
     * @param uid must not be {@literal null}.
     * @param template
     * @return the entity with the given id or {@literal null} if none found
     * @throws IllegalArgumentException if {@code uid} is {@literal null}
     */
    <T extends IPOMObject> T findByUIDWithTemplate(Class<T> type, String uid, String template);

    /**
     * Retrives an entity by its uid applying the specified JDS template.
     *
     * @param uid must not be {@literal null}.
     * @param template
     * @return the entity with the given id or {@literal null} if none found
     * @throws IllegalArgumentException if {@code uid} is {@literal null}
     */
    Map<String,Object> findByUIDWithTemplate(String uid, String template);

    /**
     * Returns all instances of the type.
     *
     * @param type
     * @return all entities
     */
    <T extends IPOMObject> List<T> findAll(Class<T> type);

    /**
     * Returns all instances of the type.
     *
     * @param type
     * @param templateName
     * @return all entities
     */
    <T extends IPOMObject> List<T> findAllWithTemplate(Class<T> type, String templateName);

    List<String> findAllUIDs(Class<? extends IPOMObject> clazz);

    /**
     * Returns all entities sorted by the given options.
     *
     * @param type
     * @param sort
     * @return all entities sorted by the given options
     */
    <T extends IPOMObject> List<T> findAll(Class<T> type, Sort sort);

    /**
     * Returns a {@link org.springframework.data.domain.Page} of entities meeting the paging restriction provided in the {@code Pageable} object.
     *
     * @param type
     * @param pageable
     * @return a page of entities
     */
    <T extends IPOMObject> Page<T> findAll(Class<T> type, Pageable pageable);

    <T extends IPOMObject> List<T> findAllByIndex(Class<T> clazz, String indexName);
    <T extends IPOMObject> Page<T> findAllByIndex(Class<T> clazz, String indexName, Pageable pageable);

    <T extends IPOMObject> List<T> findAllByIndexAndRange(Class<T> clazz, String indexName, String range);
    <T extends IPOMObject> Page<T> findAllByIndexAndRange(Class<T> clazz, String indexName, String range, Pageable pageable);

    <T extends IPOMObject> List<T> findAllByIndexAndRangeWithTemplate(Class<T> clazz, String indexName, String range, String templateName);
    <T extends IPOMObject> Page<T> findAllByIndexAndRangeWithTemplate(Class<T> clazz, String indexName, String range, String templateName, Pageable pageable);

    <T extends IPOMObject> List<T> findAllByQuery(Class<T> clazz, QueryDef qry, Map<String, Object> uriVariables);
    <T extends IPOMObject> List<T> findAllByQuery(Class<T> clazz, String qry, Map<String, Object> uriVariables);

    <T extends IPOMObject> T findOneByIndexAndRange(Class<T> clazz, String indexName, String range);

    <T extends IPOMObject> T findOneByQuery(Class<T> clazz, QueryDef qry, Map<String, Object> uriVariables);
    <T extends IPOMObject> T findOneByQuery(Class<T> clazz, String qry, Map<String, Object> uriVariables);

    void deleteCollectionBySystem(String domain, String system);
}
