package gov.va.jmeadows;

/**
 * JMeadows Configuration Interface
 */
public interface IJMeadowsConfiguration {
    public String getUrl();

    public void setUrl(String url);

    public int getTimeoutMS();

    public void setTimeoutMS(int timeoutMS);

    public String getUserName();

    public void setUserName(String userName);

    public String getUserIen();

    public void setUserIen(String userIen);

    public String getUserSiteCode();

    public void setUserSiteCode(String userSiteCode);

    public String getUserSiteName();

    public void setUserSiteName(String userSiteName);

    public Boolean isDodDocServiceEnabled();

    public void setDodDocServiceEnabled(Boolean dodDocServiceEnabled);
}
