package gov.va.cpe.vpr.sync;

import gov.va.cpe.vpr.PatientDemographics;


public class UnreachableFacilityException extends RuntimeException {

    public static final String MESSAGE = "Patient %s was seen at facility '%s' station number '%s' but data from %s is unreachable because the facility's 'domain' was missing from the patient demographics extract from VistA account '%s'. Please set the 'domain' for the %s entry in the INSTITUTION file.";

    public UnreachableFacilityException(PatientDemographics pt, String stationNumber, String facilityName, String vistaId) {
        super(String.format(MESSAGE, pt.toString(), facilityName, stationNumber, facilityName, vistaId, facilityName));
    }
}
