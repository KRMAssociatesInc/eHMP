package gov.va.cpe.pt;

public interface IVistaPatientContextService {
    VistaPatientContextInfo fetchVistaPatientContextInfo(String pid, boolean saveCurrentPatientAsUserParam);
}
