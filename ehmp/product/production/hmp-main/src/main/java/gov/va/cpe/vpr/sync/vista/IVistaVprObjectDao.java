package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.pom.IPOMObject;

import java.util.Map;

/**
 *  Interface for persisting IPOMObject instances to the VistA FileMan VPR OBJECT file.
 *
 *  @see "VistA FileMan VPR OBJECT(560.11)"
 */
public interface IVistaVprObjectDao {
    /**
     * Saves a given entity. Use the returned instance for further operations as the save operation might have changed the
     * entity instance.
     *
     * @param entity
     * @return the saved entity
     */
    <T extends IPOMObject> T save(T entity);

    /**
     * Saves given entity data converting it to the requested entityType. Use the returned instance for further operations as the save operation might have changed the
     * entity data.
     *
     * @param entityType
     * @param data
     * @return the saved entity
     */
    <T extends IPOMObject> T save(Class<T> entityType, Map<String, Object> data);

    /**
     * Deletes a given entity.
     *
     * @param entity
     * @throws Exception 
     * @throws IllegalArgumentException in case the given entity is (@literal null}.
     */
    <T extends IPOMObject> void delete(T entity);

    /**
     * Deletes the entity with the given uid.
     *
     * @param type
     * @param uid must not be {@literal null}.
     * @throws Exception 
     * @throws IllegalArgumentException in case the given {@code uid} is {@literal null}
     */
    <T extends IPOMObject> void deleteByUID(Class<T> type, String uid);
}
