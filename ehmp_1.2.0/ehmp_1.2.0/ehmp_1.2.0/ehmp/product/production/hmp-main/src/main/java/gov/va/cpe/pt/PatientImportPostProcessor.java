package gov.va.cpe.pt;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.IImportPostProcessor;
import gov.va.hmp.healthtime.PointInTime;

public class PatientImportPostProcessor implements IImportPostProcessor<PatientDemographics> {

    @Override
    public PatientDemographics postProcess(PatientDemographics patient) {
        PatientDemographics patDem = null;
        if ( patient.getProperty("veteran") != null || patient.getProperty("telecoms") != null || patient.getProperty("addresses") != null )  {
            patDem = new PatientDemographics(patient.getData());
            patDem.setLastUpdated(PointInTime.now());
            return patDem;
        }
        return patient;
    }
}
