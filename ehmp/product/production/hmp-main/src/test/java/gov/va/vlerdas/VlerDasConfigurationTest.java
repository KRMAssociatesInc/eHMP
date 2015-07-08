package gov.va.vlerdas;

import gov.va.hmp.HmpProperties;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.core.env.Environment;

/**
 */
public class VlerDasConfigurationTest {

    private static final String TEST_BASE_URL = "http://localhost:8080/default";

    private VlerDasConfiguration config;

    @Before
    public void setUp() {
        Environment mockEnvironment = Mockito.mock(Environment.class);
        Mockito.when(mockEnvironment.getProperty(HmpProperties.VLER_DAS_BASE_URL)).thenReturn(TEST_BASE_URL);
        config = new VlerDasConfiguration(mockEnvironment);
    }

    @Test
    public void testBaseUrl() {
        Assert.assertEquals(TEST_BASE_URL, config.getBaseUrl());

        String differentUrl = "http://localhost:8080/something/different";
        config.setBaseUrl(differentUrl);

        Assert.assertEquals(differentUrl, config.getBaseUrl());
    }
}
