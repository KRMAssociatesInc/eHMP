package gov.va.nhin.vler.service;

public interface INhinAdapterCfg {

    public void setDocQueryUrl(String url);

    public String getDocQueryUrl();

    public void setDocRetrieveUrl(String url);

    public String getDocRetrieveUrl();

    public void setTimeoutMS(int timeoutMS);

    public int getTimeoutMS();

    public void setMaxThreads(int maxThreads);

    public int getMaxThreads();

    public void setSystemUserName(String systemUserName);

    public String getSystemUserName();

    public void setSystemSiteCode(String systemSiteCode);

    public String getSystemSiteCode();
}
