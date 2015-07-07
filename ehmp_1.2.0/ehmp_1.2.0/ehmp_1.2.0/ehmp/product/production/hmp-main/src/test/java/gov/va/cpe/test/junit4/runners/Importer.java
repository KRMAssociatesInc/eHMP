package gov.va.cpe.test.junit4.runners;

import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.springframework.core.convert.converter.Converter;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Importer {
    Class<? extends Converter<VistaDataChunk, ?>> value();
}
