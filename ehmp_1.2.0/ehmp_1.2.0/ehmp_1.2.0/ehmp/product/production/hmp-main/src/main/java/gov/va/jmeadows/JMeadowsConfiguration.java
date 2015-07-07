package gov.va.jmeadows;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * JMeadows Webservice Configuration
 */
@Component("JMeadowsConfiguration")
public class JMeadowsConfiguration extends AbstractJMeadowsConfiguration
{
    private String url;
    private int timeoutMS;
    private String userName;
    private String userIen;
    private String userSiteCode;
    private String userSiteName;

    /**
     * Constructs JMeadows configuration from Environment.
     */
    @Autowired
    public JMeadowsConfiguration(Environment environment)
    {
        super(environment);
    }

}
