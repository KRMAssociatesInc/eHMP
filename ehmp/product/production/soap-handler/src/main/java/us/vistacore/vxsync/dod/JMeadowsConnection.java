package us.vistacore.vxsync.dod;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.xml.ws.BindingProvider;
import javax.xml.ws.soap.MTOMFeature;

/**
 * Created by kumblep on 1/5/15.
 */
public class JMeadowsConnection
{

    private static JMeadowsConfig jMeadowsConfig;
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsConnection.class);
    /**
     * The client will expire after this many hours of inactivity, after
     * which a {@link #getInstance(JMeadowsConfig)} call will instantiate a new client.
     */
    private static final long MAX_CLIENT_AGE_IN_HOURS = 2;
    /**
     * Property names for com.sun.xml.internal
     * See internal JDK class BindingProviderProperties for other properties
     */
    private static String CONNECT_TIMEOUT = "com.sun.xml.internal.ws.connect.timeout";

   private static Cache<JMeadowsConfig, JMeadowsData> CLIENT_CACHE =
            CacheBuilder
                    .newBuilder()
                    .expireAfterAccess(MAX_CLIENT_AGE_IN_HOURS, TimeUnit.HOURS)
                    .build();

    /*
    Returns a new empty JMeadowsConfig
    @return JMeadowsConfig
     */
    public static JMeadowsConfig getNewJMeadowsConfigInstance() {
        return new JMeadowsConfig();
    }

    public static void setJMeadowsConfig(JMeadowsConfig jMeadowsConfiguration) {
        jMeadowsConfig = jMeadowsConfiguration;
    }

    /*
    Returns a JMeadowsConfig populated with JMeadows Configuration
    @return JMeadowsConfig
     */
    public static JMeadowsConfig getJMeadowsConfig() {
        return  jMeadowsConfig;
    }


    /**
     * Returns a VistaData client for this {@link JMeadowsConfig} object
     *
     * @return  the VistaData client or {@code null} if the client could not be created from the configuration
     */
    public static JMeadowsData getJMeadowsDataClientInstance()
    {
        LOG.debug("JMeadowsQueryBuilder.getJMeadowsDataClientInstance : Enter ");

        JMeadowsData client = CLIENT_CACHE.getIfPresent(jMeadowsConfig);

        if (client == null) {
            try {
                client = create(JMeadowsConnection.getJMeadowsConfig().getUrl(), JMeadowsConnection.getJMeadowsConfig().getTimeoutMS() );
            } catch (MalformedURLException e)
            {

                //  LOG.error(e.getMessage(), e);
                return null;
            }
            CLIENT_CACHE.put(jMeadowsConfig, client);
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

        LOG.debug("JMeadowsQueryBuilder.create : Enter ");


        JMeadowsDataService jMeadowsDataService = new JMeadowsDataService();

        JMeadowsData jMeadowsData = jMeadowsDataService.getJMeadowsDataPort(new MTOMFeature());

        //set url & connection timeout
        Map<String, Object> requestContext  = ((BindingProvider) jMeadowsData).getRequestContext();
        requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, url);
        requestContext.put(CONNECT_TIMEOUT, timeoutMS);

        return jMeadowsData;
    }


}
