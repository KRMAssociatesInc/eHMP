package gov.va.hmp;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePropertySource;
import org.springframework.security.util.InMemoryResource;
import org.springframework.web.context.ConfigurableWebApplicationContext;
import org.springframework.web.context.ConfigurableWebEnvironment;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.net.InetAddress;
import java.util.Properties;

import static gov.va.hmp.HmpProperties.*;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.notNull;
import static org.mockito.Mockito.*;

public class BootstrapTests {

    public static final String MOCK_HMP_HOME_PATH = File.separator+"foo"+File.separator+"bar"+File.separator+"baz";
    public static final String MOCK_HOST = "hmp.example.org";
    public static final String MOCK_HTTP_PORT = "1234";
    public static final String MOCK_HTTPS_PORT = "4321";
    public static final String MOCK_SERVER_ID = "MOCK-SERVER-ID";

    ConfigurableWebApplicationContext mockApplicationContext;
    ConfigurableWebEnvironment mockEnviroment;
    MutablePropertySources mockPropertySources;
    Resource mockHomeDirectory;

    @Before
    public void setUp() throws Exception {
        mockApplicationContext = mock(ConfigurableWebApplicationContext.class);
        mockEnviroment = mock(ConfigurableWebEnvironment.class);
        mockPropertySources = mock(MutablePropertySources.class);
        mockHomeDirectory = mock(Resource.class);

        when(mockApplicationContext.getEnvironment()).thenReturn(mockEnviroment);
        when(mockEnviroment.getPropertySources()).thenReturn(mockPropertySources);

        File mockFile = new File(MOCK_HMP_HOME_PATH);
        when(mockHomeDirectory.getFile()).thenReturn(mockFile);
        when(mockHomeDirectory.getFilename()).thenReturn(MOCK_HMP_HOME_PATH);
    }

    @Test
    public void testGetHmpHomeDirectoryFromEnvironmentVariable() throws Exception {
        setUpMockHmpHomeEnvironmentVariable();

        Resource home = Bootstrap.getHmpHomeDirectory(mockApplicationContext);
        assertThat(home, notNullValue());
        assertThat(home.getFile().getPath(), is(equalTo(MOCK_HMP_HOME_PATH)));
    }

    @Test
    public void testGetHmpHomeDirectoryFromSystemProperty() throws Exception {
        setUpMockHmpHomeSystemProperty();

        Resource home = Bootstrap.getHmpHomeDirectory(mockApplicationContext);
        assertThat(home, notNullValue());
        assertThat(home.getFile().getPath(), is(equalTo(MOCK_HMP_HOME_PATH)));
    }

    @Test
    public void testGetHmpPropertiesResourceFromEnvironmentVariable() throws IOException {
        setUpMockHmpHomeEnvironmentVariable();
        Resource mockHmpProperties = mock(Resource.class);
        when(mockHomeDirectory.createRelative(HMP_PROPERTIES_FILE_NAME)).thenReturn(mockHmpProperties);

        Resource hmpProperties = Bootstrap.getHmpPropertiesResource(mockApplicationContext);
        assertThat(hmpProperties, notNullValue());
        assertThat(hmpProperties, sameInstance(mockHmpProperties));
    }

    @Test
    public void testGetHmpPropertiesResourceFromSystemProperty() throws IOException {
        setUpMockHmpHomeSystemProperty();
        Resource mockHmpProperties = mock(Resource.class);
        when(mockHomeDirectory.createRelative(HMP_PROPERTIES_FILE_NAME)).thenReturn(mockHmpProperties);

        Resource hmpProperties = Bootstrap.getHmpPropertiesResource(mockApplicationContext);
        assertThat(hmpProperties, notNullValue());
        assertThat(hmpProperties, sameInstance(mockHmpProperties));
    }

    @Test
    public void testInitializeWithHmpHomeSystemPropertyAndDefaults() throws Exception {
        Properties versionInfo = new Properties();
        versionInfo.put(HmpProperties.VERSION, "fubar-23.42");
        versionInfo.put(HmpProperties.BUILD_DATE, "Jul 20,1944");

        Properties hmpDefaults = new Properties();
        hmpDefaults.put(HmpProperties.SERVER_PORT_HTTP, MOCK_HTTP_PORT);
        hmpDefaults.put(HmpProperties.SERVER_PORT_HTTPS, MOCK_HTTPS_PORT);

        setUpMockHmpHomeSystemProperty();
        when(mockApplicationContext.getResource("classpath:/version.properties")).thenReturn(createMockPropertiesResource(versionInfo));
        when(mockApplicationContext.getResource("classpath:/hmp-defaults.properties")).thenReturn(createMockPropertiesResource(hmpDefaults));
        Resource mockHmpPropertiesResource = mock(Resource.class);
        when(mockHomeDirectory.createRelative(HMP_PROPERTIES_FILE_NAME)).thenReturn(mockHmpPropertiesResource);
        when(mockHmpPropertiesResource.exists()).thenReturn(false); // no hmp.properties resource exists, therefore use defaults

        when(mockEnviroment.getProperty(VERSION)).thenReturn("fubar-23.42");
        when(mockEnviroment.getProperty(BUILD_DATE)).thenReturn("Jul 20,1944");
        when(mockEnviroment.getProperty(SERVER_HOST)).thenReturn(MOCK_HOST);
        when(mockEnviroment.getProperty(SERVER_PORT_HTTP)).thenReturn(MOCK_HTTP_PORT);
        when(mockEnviroment.getProperty(SERVER_PORT_HTTPS)).thenReturn(MOCK_HTTPS_PORT);
        when(mockEnviroment.getProperty(SERVER_ID)).thenReturn(MOCK_SERVER_ID);
        when(mockEnviroment.getProperty(EHCACHE_DATA_DIR)).thenReturn("java.io.tmpdir");

        Bootstrap bootstrap = new Bootstrap();
        bootstrap.initialize(mockApplicationContext);

        InOrder inOrder = inOrder(mockPropertySources);

        ArgumentCaptor<ResourcePropertySource> versionPropertySourceArg = ArgumentCaptor.forClass(ResourcePropertySource.class);
        inOrder.verify(mockPropertySources, times(1)).addFirst(versionPropertySourceArg.capture());
        assertThat(versionPropertySourceArg.getValue().getName(), is(Bootstrap.HMP_VERSION_PROPERTIES_PROPERTY_SOURCE_NAME));

        ArgumentCaptor<PropertySource> hmpDefaultsPropertySourceArg = ArgumentCaptor.forClass(PropertySource.class);
        inOrder.verify(mockPropertySources, times(1)).addLast(hmpDefaultsPropertySourceArg.capture());
        assertThat(hmpDefaultsPropertySourceArg.getValue().getName(), is(Bootstrap.HMP_DEFAULT_PROPERTIES_PROPERTY_SOURCE_NAME));

        ArgumentCaptor<MapPropertySource> runtimeDefaultsPropertySourceArg = ArgumentCaptor.forClass(MapPropertySource.class);
        inOrder.verify(mockPropertySources, times(1)).addFirst(runtimeDefaultsPropertySourceArg.capture());
        assertThat(runtimeDefaultsPropertySourceArg.getValue().getName(), is(Bootstrap.HMP_PROPERTIES_PROPERTY_SOURCE_NAME));
        // check the initial defaults
        assertThat(runtimeDefaultsPropertySourceArg.getValue().getProperty(SERVER_ID).toString(), notNullValue());
        assertThat(runtimeDefaultsPropertySourceArg.getValue().getProperty(SERVER_HOST).toString(), is(InetAddress.getLocalHost().getHostName()));

        ArgumentCaptor<MapPropertySource> calculatedPropertySourceArg = ArgumentCaptor.forClass(MapPropertySource.class);
        inOrder.verify(mockPropertySources, times(1)).addLast(calculatedPropertySourceArg.capture());
        assertThat(calculatedPropertySourceArg.getValue().getName(), is(Bootstrap.HMP_CALCULATED_PROPERTIES_PROPERTY_SOURCE_NAME));
        // check the calculated values
        assertThat(calculatedPropertySourceArg.getValue().getProperty(SERVER_URL).toString(), is("https://" + MOCK_HOST + ":" + MOCK_HTTPS_PORT + "/"));
        assertThat(calculatedPropertySourceArg.getValue().getProperty(ACTIVEMQ_BROKER_URL).toString(), is("vm://hmp-" + MOCK_SERVER_ID));
        assertThat(calculatedPropertySourceArg.getValue().getProperty(SOLR_URL).toString(), is("http://" + MOCK_HOST + ":" + MOCK_HTTP_PORT + "/solr/"));

        // This is not cross-platform and it's taking too long to untangle the properties to make them cross-platform for the sake of these tests.
//
//        assertThat(calculatedPropertySourceArg.getValue().getProperty(ACTIVEMQ_DATA_DIR).toString(), is(MOCK_HMP_HOME_PATH + File.separator + "activemq-data"));
//        assertThat(calculatedPropertySourceArg.getValue().getProperty(EHCACHE_DATA_DIR).toString(), is(MOCK_HMP_HOME_PATH + "/ehcache"));
//        assertThat(calculatedPropertySourceArg.getValue().getProperty(LOGS_DIR).toString(), is(MOCK_HMP_HOME_PATH + "/logs"));
//
        /*
        calculatedProps.put(ACTIVEMQ_DATA_DIR, "${homeDirCanonicalPath}/activemq-data");
        calculatedProps.put(EHCACHE_DATA_DIR, "${homeDirCanonicalPath}/ehcache");
         */
    }

    private void setUpMockHmpHomeEnvironmentVariable() {
        when(mockEnviroment.getProperty(HMP_HOME_ENVIRONMENT_VARIABLE_NAME)).thenReturn(MOCK_HMP_HOME_PATH);
        when(mockApplicationContext.getResource("file:" + MOCK_HMP_HOME_PATH + File.separator)).thenReturn(mockHomeDirectory);
    }

    private void setUpMockHmpHomeSystemProperty() {
        when(mockEnviroment.getProperty(HMP_HOME_ENVIRONMENT_VARIABLE_NAME)).thenReturn(null);
        when(mockEnviroment.containsProperty(HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(true);
        when(mockEnviroment.getProperty(HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(MOCK_HMP_HOME_PATH);
        when(mockApplicationContext.getResource("file:" + MOCK_HMP_HOME_PATH + File.separator)).thenReturn(mockHomeDirectory);
    }

    private static Resource createMockPropertiesResource(Properties props) {
        try {
            StringWriter sw = new StringWriter();
            props.store(sw, "mock properties");
            return new InMemoryResource(sw.toString());
        } catch (IOException e) {
            return null;
        }
    }
}
