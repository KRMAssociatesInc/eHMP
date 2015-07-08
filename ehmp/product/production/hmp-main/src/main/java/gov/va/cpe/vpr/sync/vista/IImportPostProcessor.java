package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.pom.IPOMObject;

public interface IImportPostProcessor<T extends IPOMObject> {
    T postProcess(T item);
}
