package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.AnnotationFinder;
import gov.va.cpe.test.junit4.runners.Importer;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.sync.convert.VistaDataChunkToPOMObjectConverter;
import gov.va.cpe.vpr.sync.vista.ImportException;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.junit.runners.model.InitializationError;
import org.springframework.core.convert.converter.Converter;

public abstract class AbstractImporterITCase<T extends IPOMObject> {

    private VistaDataChunk chunk;

    private Class<? extends Converter<VistaDataChunk, ? extends IPOMObject>> importerClass;

    private T domainInstance;

    public AbstractImporterITCase(VistaDataChunk chunk) {
        this.chunk = chunk;
        try {
            this.importerClass = getImporterClass(this.getClass());
        } catch (InitializationError initializationError) {
            throw new RuntimeException(initializationError);
        }
    }

    protected T getDomainInstance() {
        if (domainInstance == null) {
            domainInstance = importDomainInstance();
        }
        return domainInstance;
    }

    public VistaDataChunk getChunk() {
        return this.chunk;
    }

    private T importDomainInstance() {
        try {
            Converter<VistaDataChunk, ? extends IPOMObject> importer = importerClass.newInstance();
            domainInstance = (T) importer.convert(chunk);
            return domainInstance;
        } catch (ImportException e) {
            throw e;
        } catch (Throwable e) {
            throw new ImportException(chunk, e);
        }
    }

    private Class<? extends Converter<VistaDataChunk, ? extends IPOMObject>> getImporterClass(Class<?> testClass) throws InitializationError {
        AnnotationFinder annotationFinder = new AnnotationFinder(testClass);
        Importer importerClass = annotationFinder.find(Importer.class);
        if (importerClass == null) {
            return VistaDataChunkToPOMObjectConverter.class;
        }
        return (Class<? extends Converter<VistaDataChunk, ? extends IPOMObject>>) importerClass.value();
    }
}
