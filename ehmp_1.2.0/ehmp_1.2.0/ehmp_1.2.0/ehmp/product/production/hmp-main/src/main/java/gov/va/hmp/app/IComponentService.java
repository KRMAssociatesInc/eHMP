package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;

import java.util.List;

public interface IComponentService {
    List<ComponentDescriptor> getComponents();
    List<ComponentDescriptor> getComponents(PatientDataDisplayType type);
}
