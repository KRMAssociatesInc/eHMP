package gov.va.jmeadows.util.document.retrieve;

import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.NoteImage;

import java.util.concurrent.Future;

public interface IRetrieveDodDocumentService {
    /**
     * Asynchronously retrieve DoD complex note.
     *
     * @param jMeadowsQuery jMeadows query.
     * @return Result of asynchronous execution.
     */
    public Future<NoteImage> retrieveDodDocument(JMeadowsQuery jMeadowsQuery);
}
