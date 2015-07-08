package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;

import java.util.List;

import static gov.va.jmeadows.JMeadowsNoteService.NoteType;

public interface IJMeadowsNoteService {

    /**
     * Retrieve the clinical note data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param noteType   Type of clinical note to fetch.
     * @param query      JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the vital data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception
     *                                  If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    public List<VistaDataChunk> fetchDodNotes(NoteType noteType, JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception;
}
