package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;

import java.util.List;

public interface IJMeadowsConsultNoteService {

    public List<VistaDataChunk> fetchDodConsults(JMeadowsQuery oQuery, PatientIds oPatientIds) throws JMeadowsException_Exception;
}
