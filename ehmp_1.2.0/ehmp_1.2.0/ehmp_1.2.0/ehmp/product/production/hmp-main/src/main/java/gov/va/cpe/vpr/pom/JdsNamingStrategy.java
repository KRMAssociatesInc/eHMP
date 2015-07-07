package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.pom.jds.JdsCollectionName;
import org.springframework.core.annotation.AnnotationUtils;

public class JdsNamingStrategy extends DefaultNamingStrategy {
    @Override
    public String collectionName(Class entityClass) {
        JdsCollectionName name = AnnotationUtils.findAnnotation(entityClass, JdsCollectionName.class);
        if (name != null) {
            return name.value();
        }
        return super.collectionName(entityClass);
    }
}
