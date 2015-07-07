package gov.va.cpe.vpr.pom;

public interface IDataStoreDAO {
    /**
     * Saves a given entity. Use the returned instance for further operations as the save operation might have changed the
     * entity instance completely.
     *
     * @param entity
     * @return the saved entity
     */
    <T extends IPOMObject> T save(T entity);

    /**
     * Deletes a given entity.
     *
     * @param entity
     * @throws IllegalArgumentException in case the given entity is (@literal null}.
     */
    <T extends IPOMObject> void delete(T entity);
}
