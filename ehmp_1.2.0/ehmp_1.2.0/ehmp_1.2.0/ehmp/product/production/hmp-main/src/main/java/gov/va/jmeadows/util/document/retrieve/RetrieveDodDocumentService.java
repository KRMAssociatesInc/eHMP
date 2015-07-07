package gov.va.jmeadows.util.document.retrieve;

import gov.va.jmeadows.JMeadowsClientFactory;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.NoteImage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.Future;

/**
 * Retrieves DoD complex note in Rich text format (RTF).
 * <p/>
 * Retrieves documents asynchronously by utilizing the Hystrix API.
 */
@Service
public class RetrieveDodDocumentService implements IRetrieveDodDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveDodDocumentService.class);

    private RetrieveDocumentConfiguration config;
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a Retrieve DoD document service instance.
     */
    @Autowired
    public RetrieveDodDocumentService(RetrieveDocumentConfiguration config) {
        this.config = config;
        jMeadowsClient = JMeadowsClientFactory.getInstance(this.config);
    }

    /**
     * Sets JMeadowsClient
     *
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient) {
        this.jMeadowsClient = jMeadowsClient;
    }

    /**
     * Asynchronously retrieve DoD complex note.
     *
     * @param jMeadowsQuery jMeadows query.
     * @return Result of asynchronous execution.
     */
    @Override
    public Future<NoteImage> retrieveDodDocument(JMeadowsQuery jMeadowsQuery) {
        logger.debug("retrieveDodDocument begin");
        return new RetrieveDodDocumentCommand(jMeadowsClient, jMeadowsQuery,
                this.config.getMaxThreads(), this.config.getTimeoutMS()).queue();
    }
}
