package gov.va.nhin.vler.service;

import gov.va.hmp.HmpProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component("NhinAdapterCfg")
public class NhinAdapterCfg implements INhinAdapterCfg {

    private String docQueryUrl;
    private String docRetrieveUrl;
    private int timeoutMS;
    private int maxThreads;
    private String systemUserName;
    private String systemSiteCode;

    @Autowired
    public NhinAdapterCfg(Environment environment) {
        this.docQueryUrl = environment.getProperty(HmpProperties.VLER_DOC_QUERY_URL);
        this.docRetrieveUrl = environment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_URL);
        this.timeoutMS = Integer.parseInt(environment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_TIMEOUT_MS));
        this.maxThreads = Integer.parseInt(environment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_MAX_THREADS));
        this.systemUserName = environment.getProperty(HmpProperties.VLER_SYSTEM_USER_NAME);
        this.systemSiteCode = environment.getProperty(HmpProperties.VLER_SYSTEM_USER_SITE_CODE);
    }

    @Override
    public void setDocQueryUrl(String docQueryUrl) {
        this.docQueryUrl = docQueryUrl;
    }

    @Override
    public String getDocQueryUrl() {
        return docQueryUrl;
    }

    @Override
    public void setDocRetrieveUrl(String docRetrieveUrl) {
        this.docRetrieveUrl = docRetrieveUrl;
    }

    @Override
    public String getDocRetrieveUrl() {
        return docRetrieveUrl;
    }

    @Override
    public void setTimeoutMS(int timeoutMS) {
        this.timeoutMS = timeoutMS;
    }

    @Override
    public int getTimeoutMS() {
        return timeoutMS;
    }

    @Override
    public void setMaxThreads(int maxThreads) {
        this.maxThreads = maxThreads;
    }

    @Override
    public int getMaxThreads() {
        return maxThreads;
    }

    @Override
    public void setSystemUserName(String systemUserName) {
        this.systemUserName = systemUserName;
    }

    @Override
    public String getSystemUserName() {
        return systemUserName;
    }

    @Override
    public void setSystemSiteCode(String systemSiteCode) {
        this.systemSiteCode = systemSiteCode;
    }

    @Override
    public String getSystemSiteCode() {
        return systemSiteCode;
    }
}
