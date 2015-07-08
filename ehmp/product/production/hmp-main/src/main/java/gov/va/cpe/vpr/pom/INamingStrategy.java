package gov.va.cpe.vpr.pom;

/**
 * Rules for determining collection names from entity classes.
 */
public interface INamingStrategy {
    /**
     * Return a collection name for an entity class
     * @param entityClass the entity class
     * @return a collection name
     */
    String collectionName(Class entityClass);

    String propertyName(String name);
}
