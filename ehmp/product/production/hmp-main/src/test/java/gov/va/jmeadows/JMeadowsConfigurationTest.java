package gov.va.jmeadows;

import gov.va.hmp.HmpProperties;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsConfigurationTest
{
    private Environment mockEnvironment;

    private String url = "test.url";
    private int timeoutMS = 45000;
    private String userName = "test.username";
    private String userIen = "test.ien";
    private String userSiteCode = "test.sitecode";
    private String userSiteName = "test.sitename";

    @Before
    public void setup()
    {
        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn(userIen);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn(userSiteCode);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn(userSiteName);
    }

    @Test
    public void testConfiguration()
    {
        JMeadowsConfiguration jMeadowsConfiguration = new JMeadowsConfiguration(mockEnvironment);

        assertThat(jMeadowsConfiguration.getTimeoutMS(), is(timeoutMS));
        assertThat(jMeadowsConfiguration.getUrl(), is(url));
        assertThat(jMeadowsConfiguration.getUserIen(), is(userIen));
        assertThat(jMeadowsConfiguration.getUserName(), is(userName));
        assertThat(jMeadowsConfiguration.getUserSiteCode(), is(userSiteCode));
        assertThat(jMeadowsConfiguration.getUserSiteName(), is(userSiteName));
    }
}
