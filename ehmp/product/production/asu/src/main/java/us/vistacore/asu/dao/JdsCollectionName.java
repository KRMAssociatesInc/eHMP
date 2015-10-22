package us.vistacore.asu.dao;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation for explicitly setting the collection name of an AbstractPOMObject in the JDS.
 *
 * @see //gov.va.cpe.vpr.pom.INamingStrategy
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value = ElementType.TYPE)
public @interface JdsCollectionName {
    String value();
}
