package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.pom.IPatientObject;

import java.util.Map;

/**
 *  Interface to the VPR PUT PATIENT DATA Remote Procedure call (RPC) and JDS simultaneously.
 *
 *  @see "VistA FileMan VPR PATIENT OBJECT(560.1)"
 */
public interface IVistaVprPatientObjectDao {
    <T extends IPatientObject> T save(T entity);
    <T extends IPatientObject> T save(Class<T> entityType, Map<String, Object> data);
}
