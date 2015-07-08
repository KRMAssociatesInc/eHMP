package gov.va.jmeadows;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.ws.BindingProvider;
import javax.xml.ws.soap.MTOMFeature;
import java.net.MalformedURLException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class JMeadowsClientFactory
{
    private static Logger logger = LoggerFactory.getLogger(JMeadowsClientFactory.class);

    /**
     * Property names for com.sun.xml.internal
     * See internal JDK class BindingProviderProperties for other properties
     */
    private static String CONNECT_TIMEOUT = "com.sun.xml.internal.ws.connect.timeout";

    /**
     * The client will expire after this many hours of inactivity, after
     * which a {@link #getInstance(IJMeadowsConfiguration)} call will instantiate a new client.
     */
    private static final long MAX_CLIENT_AGE_IN_HOURS = 2;

    private static Cache<IJMeadowsConfiguration, JMeadowsData> CLIENT_CACHE =
            CacheBuilder
                    .newBuilder()
                    .expireAfterAccess(MAX_CLIENT_AGE_IN_HOURS, TimeUnit.HOURS)
                    .build();

    /**
     * Returns a VistaData client for this {@link JMeadowsConfiguration} object
     * @param jMeadowsConfiguration  the configuration for the JMeadowsData client
     * @return  the VistaData client or {@code null} if the client could not be created from the configuration
     */
    public static JMeadowsData getInstance(IJMeadowsConfiguration jMeadowsConfiguration) {
        JMeadowsData client = CLIENT_CACHE.getIfPresent(jMeadowsConfiguration);
        if (client == null) {
            try {
                client = create(jMeadowsConfiguration.getUrl(), jMeadowsConfiguration.getTimeoutMS());
            } catch (MalformedURLException e) {
                logger.error(e.getMessage(), e);
                return null;
            }
            CLIENT_CACHE.put(jMeadowsConfiguration, client);
        }
        return client;
    }

    /**
     * Returns a JMeadowsData client for this configuration
     * @param url   the WS endpoint
     * @return  the JMeadowsData client
     * @throws MalformedURLException if the url is an invalid URL
     */
    private static JMeadowsData create(String url, int timeoutMS) throws MalformedURLException {

        JMeadowsDataService jMeadowsDataService = new JMeadowsDataService();

        JMeadowsData jMeadowsData = jMeadowsDataService.getJMeadowsDataPort(new MTOMFeature());

        //set url & connection timeout
        Map<String, Object> requestContext  = ((BindingProvider) jMeadowsData).getRequestContext();
        requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, url);
        requestContext.put(CONNECT_TIMEOUT, timeoutMS);

        return jMeadowsData;
    }
}
