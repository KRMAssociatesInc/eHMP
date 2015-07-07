package gov.va.hmp;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.config.Configuration;
import net.sf.ehcache.config.ConfigurationFactory;
import net.sf.ehcache.config.DiskStoreConfiguration;

import org.apache.commons.lang.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePropertySource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.context.ConfigurableWebApplicationContext;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static gov.va.hmp.HmpProperties.*;

/**
 * Configures Spring {@link Environment} based on contents of hmp.properties
 */
public class Bootstrap implements ApplicationContextInitializer<ConfigurableWebApplicationContext> {
    public static boolean isSetupComplete(Environment env) {
        return Boolean.parseBoolean(env.getProperty(HmpProperties.SETUP_COMPLETE));
    }

    public static boolean isDevelopment(Environment env) {
        return ArrayUtils.contains(env.getActiveProfiles(), HmpProperties.DEVELOPMENT_PROFILE);
    }


    public static Resource getHmpHomeDirectory(ApplicationContext applicationContext) {
        Environment environment = applicationContext.getEnvironment();

        // check for HMP_HOME
        String home = environment.getProperty(HmpProperties.HMP_HOME_ENVIRONMENT_VARIABLE_NAME);

        // check for hmp.home
        if (environment.containsProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME)) {
            home = environment.getProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME);
        }


        // otherwise use current working directory
        if (!StringUtils.hasText(home)) home = ".";

        if (!home.endsWith(File.separator)) home += File.separator;

        Resource homeDir = applicationContext.getResource("file:" + home);
        return homeDir;
    }

    public static Resource getHmpPropertiesResource(ApplicationContext applicationContext) throws IOException {
        Resource homeDir = getHmpHomeDirectory(applicationContext);

        Resource hmpProps = homeDir.createRelative(HmpProperties.HMP_PROPERTIES_FILE_NAME);

        return hmpProps;
    }

    public void initialize(ConfigurableWebApplicationContext applicationContext) {
        ConfigurableEnvironment environment = (ConfigurableEnvironment) applicationContext.getEnvironment();

        try {
            Resource homeDir = getHmpHomeDirectory(applicationContext);
            final Resource hmpProps = getHmpPropertiesResource(applicationContext);

            // add version info
            environment.getPropertySources().addFirst(new ResourcePropertySource(HMP_VERSION_PROPERTIES_PROPERTY_SOURCE_NAME, applicationContext.getResource("classpath:/version.properties")));

            // add hmp-defaults with low precedence
            environment.getPropertySources().addLast(createHmpDefaultsPropertySource(applicationContext));

            if (hmpProps.exists()) {
                Map map = new ResourcePropertySource(HMP_PROPERTIES_PROPERTY_SOURCE_NAME, hmpProps).getSource();
                // NOTE: we currently have no encrypted properties any more, but this is where we'd decrypt them.
//          if(map.get("hmp.properties.encrypted")) {
//			}
                final File file = hmpProps.getFile();
                LOG.info("loading configuration from " + (file == null ? null : file.getAbsolutePath()));
                environment.getPropertySources().addFirst(new MapPropertySource(HMP_PROPERTIES_PROPERTY_SOURCE_NAME, map));
            } else {
                final File file = hmpProps.getFile();
                LOG.info((file != null ? "no hmp.properties file found at " + file.getAbsolutePath() : "no hmp.home or HMP_HOME found") + ", using defaults");
                environment.getPropertySources().addFirst(createHmpRuntimeDefaultsPropertySource(homeDir));
            }


            // add calculated/compound hmp properties
            environment.getPropertySources().addLast(createHmpCalculatedPropertySource(homeDir, environment));

            initializeEhcacheDiskStore(environment);          
            
            // dump all hmp environment settings to log
            if (LOG.isDebugEnabled()) {
                Map<String, String> props = HmpProperties.getProperties(environment, true);

                String template = "%s=%s\n";
                StringBuilder sb = new StringBuilder();
                for (Map.Entry<String, String> e : props.entrySet()) {
                    sb.append(String.format(template, e.getKey(), e.getValue()));
                }


                LOG.debug("active profiles: {}", StringUtils.arrayToCommaDelimitedString(environment.getActiveProfiles()));
                LOG.debug("environment properties: {}", sb.toString());
            }
        } catch (IOException ex) {
            LOG.error("Unable to bootstrap HMP", ex);
        }
    }

    private void initializeEhcacheDiskStore(Environment environment) {
        DiskStoreConfiguration diskStoreConfiguration = new DiskStoreConfiguration();
        diskStoreConfiguration.setPath(environment.getProperty(HmpProperties.EHCACHE_DATA_DIR));

        Configuration configuration = ConfigurationFactory.parseConfiguration();
        configuration.addDiskStore(diskStoreConfiguration);

        CacheManager.newInstance(configuration);
    }

    /**
     * Property defaults that are "baked" in to the HMP, but can still be overridden.
     *
     * @param resourceLoader
     * @return
     */
    protected PropertySource createHmpDefaultsPropertySource(ResourceLoader resourceLoader) throws IOException {
        return new ResourcePropertySource(HMP_DEFAULT_PROPERTIES_PROPERTY_SOURCE_NAME, resourceLoader.getResource("classpath:/hmp-defaults.properties"));
    }

    /**
     * Property defaults used when no "hmp.properties" file is found.  In other words, these are intended to be set in
     * hmp.properties.
     *
     * @param homeDir
     * @return
     */
    protected PropertySource createHmpRuntimeDefaultsPropertySource(Resource homeDir) {
        Map runtimeProps = new HashMap();
        runtimeProps.put(HmpProperties.SERVER_ID, getDefaultServerId());
        runtimeProps.put(HmpProperties.SERVER_HOST, getDefaultServerHost());
        return new MapPropertySource(HMP_PROPERTIES_PROPERTY_SOURCE_NAME, runtimeProps);
    }

    /**
     * Property values that are calculated from the values of other existing properties ("compound"), but that can still
     * be overridden in hmp.properties.
     *
     * @param environment
     * @return
     */
    protected PropertySource createHmpCalculatedPropertySource(Resource homeDir, final Environment environment) throws IOException {
        final String homeDirCanonicalPath = homeDir.getFile().getCanonicalPath();

        Map calculatedProps = new HashMap();

        calculatedProps.put(HmpProperties.SERVER_URL, getDefaultServerUrl(environment));
        calculatedProps.put(ACTIVEMQ_BROKER_URL, "vm://hmp-" + environment.getProperty(HmpProperties.SERVER_ID));
        calculatedProps.put(ACTIVEMQ_DATA_DIR, homeDirCanonicalPath + File.separator + "activemq-data");
        calculatedProps.put(EHCACHE_DATA_DIR, homeDirCanonicalPath + File.separator + "ehcache");
        calculatedProps.put(HMP_DATA_DIR, homeDirCanonicalPath);
        calculatedProps.put(SOLR_URL, getDefaultSolrUrl(environment));

        return new MapPropertySource(HMP_CALCULATED_PROPERTIES_PROPERTY_SOURCE_NAME, calculatedProps);
    }

    private String getDefaultServerUrl(Environment environment) {
        Assert.hasText(environment.getProperty(SERVER_HOST));
        Assert.hasText(environment.getProperty(SERVER_PORT_HTTPS));

        return "https://" + environment.getProperty(SERVER_HOST) + ":" + environment.getProperty(SERVER_PORT_HTTPS) + "/";
    }

    private String getDefaultSolrUrl(Environment environment) {
        Assert.hasText(environment.getProperty(SERVER_HOST));
        Assert.hasText(environment.getProperty(SERVER_PORT_HTTP));

        return "http://" + environment.getProperty(SERVER_HOST) + ":" + environment.getProperty(SERVER_PORT_HTTP) + "/solr/";
    }

    private String getDefaultServerId() {
        return UUID.randomUUID().toString().toUpperCase();
    }

    private String getDefaultServerHost() {
        try {
            String host = InetAddress.getLocalHost().getHostName();
            return host;
        } catch (UnknownHostException e) {
           return "localhost";
        }
    }

    /**
     * HMP version properties property source name: {@value}
     */
    public static final String HMP_VERSION_PROPERTIES_PROPERTY_SOURCE_NAME = "hmpVersionProperties";
    /**
     * HMP default properties property source name: {@value}
     */
    public static final String HMP_DEFAULT_PROPERTIES_PROPERTY_SOURCE_NAME = "hmpDefaultProperties";
    /**
     * HMP compound properties property source name: {@value}
     */
    public static final String HMP_CALCULATED_PROPERTIES_PROPERTY_SOURCE_NAME = "hmpCalculatedProperties";
    /**
     * HMP properties property source name: {@value}
     */
    public static final String HMP_PROPERTIES_PROPERTY_SOURCE_NAME = "hmpProperties";
    public static final String DEVELOPMENT_PROFILE = "dev";
    public static final String JNDI_DATASOURCE_PROFILE = "jndi-datasource";
    public static final String PROPERTIES_DATASOURCE_PROFILE = "properties-datasource";
    private static Logger LOG = LoggerFactory.getLogger(Bootstrap.class);
}
