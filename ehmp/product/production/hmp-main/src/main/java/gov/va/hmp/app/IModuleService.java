package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;

import java.util.List;

public interface IModuleService {
    List<ComponentDescriptor> getModules(PatientDataDisplayType type);
}
