package gov.va.jmeadows;

import gov.va.hmp.HmpProperties;
import org.springframework.core.env.Environment;

public abstract class AbstractJMeadowsConfiguration implements IJMeadowsConfiguration {

    private String url;
    private int timeoutMS;
    private String userName;
    private String userIen;
    private String userSiteCode;
    private String userSiteName;
    private Boolean dodDocServiceEnabled;

    /**
     * Constructs JMeadows configuration from Environment.
     */
    public AbstractJMeadowsConfiguration(Environment environment)
    {
        this.url = environment.getProperty(HmpProperties.JMEADOWS_URL);
        this.timeoutMS = Integer.parseInt(environment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS));
        this.userName = environment.getProperty(HmpProperties.JMEADOWS_USER_NAME);
        this.userIen = environment.getProperty(HmpProperties.JMEADOWS_USER_IEN);
        this.userSiteCode = environment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE);
        this.userSiteName = environment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME);
        this.dodDocServiceEnabled = Boolean.valueOf(environment.getProperty(HmpProperties.DOD_DOC_SERVICE_ENABLED));
    }

    @Override
    public String getUrl() {
        return url;
    }

    @Override
    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public int getTimeoutMS() {
        return timeoutMS;
    }

    @Override
    public void setTimeoutMS(int timeoutMS) {
        this.timeoutMS = timeoutMS;
    }

    @Override
    public String getUserName() {
        return userName;
    }

    @Override
    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Override
    public String getUserIen() {
        return userIen;
    }

    @Override
    public void setUserIen(String userIen) {
        this.userIen = userIen;
    }

    @Override
    public String getUserSiteCode() {
        return userSiteCode;
    }

    @Override
    public void setUserSiteCode(String userSiteCode) {
        this.userSiteCode = userSiteCode;
    }

    @Override
    public String getUserSiteName() {
        return userSiteName;
    }

    @Override
    public void setUserSiteName(String userSiteName) {
        this.userSiteName = userSiteName;
    }

    @Override
    public Boolean isDodDocServiceEnabled() {
        return dodDocServiceEnabled;
    }

    @Override
    public void setDodDocServiceEnabled(Boolean dodDocServiceEnabled) {
        this.dodDocServiceEnabled = dodDocServiceEnabled;
    }
}
