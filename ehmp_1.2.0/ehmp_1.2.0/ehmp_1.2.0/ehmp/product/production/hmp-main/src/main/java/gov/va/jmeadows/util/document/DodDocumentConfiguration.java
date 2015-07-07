package gov.va.jmeadows.util.document;

import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.AbstractJMeadowsConfiguration;
import gov.va.jmeadows.util.document.convert.IConvertDocumentService;
import gov.va.jmeadows.util.document.retrieve.IRetrieveDodDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component("DodDocumentConfiguration")
public class DodDocumentConfiguration extends AbstractJMeadowsConfiguration {

    @Autowired
    public DodDocumentConfiguration(Environment environment) {
        super(environment);

        this.documentStorageFilePath = environment.getProperty(HmpProperties.DOC_STORE_FILE_PATH);
        this.documentStorageServicePath = environment.getProperty(HmpProperties.DOC_STORE_SERVICE_PATH);
    }

    @Autowired
    public void setConvertDocumentService(IConvertDocumentService convertDocumentService) {
        this.convertDocumentService = convertDocumentService;
    }

    @Autowired
    public void setRetrieveDoDDocumentService(IRetrieveDodDocumentService retrieveDoDDocumentService) {
        this.retrieveDoDDocumentService = retrieveDoDDocumentService;
    }

    private String documentStorageFilePath;
    private String documentStorageServicePath;
    private IRetrieveDodDocumentService retrieveDoDDocumentService;
    private IConvertDocumentService convertDocumentService;

    public IRetrieveDodDocumentService getRetrieveDoDDocumentService() {
        return retrieveDoDDocumentService;
    }

    public IConvertDocumentService getConvertDocumentService() {
        return convertDocumentService;
    }

    public String getDocumentStorageFilePath() {
        return documentStorageFilePath;
    }

    public void setDocumentStorageFilePath(String documentStorageFilePath) {
        this.documentStorageFilePath = documentStorageFilePath;
    }

    public String getDocumentStorageServicePath() {
        return documentStorageServicePath;
    }

    public void setDocumentStorageServicePath(String documentStorageServicePath) {
        this.documentStorageServicePath = documentStorageServicePath;
    }
}
