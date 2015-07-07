package gov.va.jmeadows;

import gov.va.hmp.HmpProperties;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsClientFactoryTest
{
    private Environment mockEnvironment;

    private String url = "test.url";
    private long timeoutMS = 45000;
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
    public void testGetInstance()
    {
        JMeadowsConfiguration jMeadowsConfiguration = new JMeadowsConfiguration(mockEnvironment);

        JMeadowsData jMeadowsData1 = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);

        assertNotNull(jMeadowsData1);

        JMeadowsData jMeadowsData2 = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);

        //both webservice clients should reference the same cached instance
        assertThat(jMeadowsData1, sameInstance(jMeadowsData2));

        //create a different configuration
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL))
                .thenReturn("different.url");

        JMeadowsConfiguration jMeadowsConfiguration2 = new JMeadowsConfiguration(mockEnvironment);

        jMeadowsData1 = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);

        assertNotNull(jMeadowsData1);

        jMeadowsData2 = JMeadowsClientFactory.getInstance(jMeadowsConfiguration2);

        //the client references instances should point to different instances
        assertTrue(jMeadowsData1 != jMeadowsData2);
    }
}
