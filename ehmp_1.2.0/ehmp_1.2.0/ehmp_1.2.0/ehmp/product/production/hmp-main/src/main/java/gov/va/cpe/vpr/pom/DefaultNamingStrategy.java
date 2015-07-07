package gov.va.cpe.vpr.pom;

import org.springframework.util.StringUtils;

public class DefaultNamingStrategy implements INamingStrategy {
    @Override
    public String collectionName(Class entityClass) {
        return entityClass.getSimpleName().toLowerCase(); // maybe try camelCase -> hyphenated-lower-case?
    }

    @Override
    public String propertyName(String name) {
        return StringUtils.uncapitalize(name);
    }
}
