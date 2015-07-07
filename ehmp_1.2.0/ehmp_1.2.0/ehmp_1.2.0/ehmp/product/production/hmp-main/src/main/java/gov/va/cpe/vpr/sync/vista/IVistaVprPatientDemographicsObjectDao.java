package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.PatientDemographics;

/**
 *  Interface to the VPR PUT PATIENT DATA Remote Procedure call (RPC) and JDS simultaneously.
 *
 *  @see "VistA FileMan VPR PATIENT OBJECT(560.1)"
 */
public interface IVistaVprPatientDemographicsObjectDao {
    PatientDemographics update(PatientDemographics demographics);
}
