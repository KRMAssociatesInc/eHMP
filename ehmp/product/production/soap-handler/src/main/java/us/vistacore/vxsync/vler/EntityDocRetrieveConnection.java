package us.vistacore.vxsync.vler;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrieve;
import gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrievePortType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.ws.BindingProvider;
import java.net.MalformedURLException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class EntityDocRetrieveConnection {
    private static Logger logger = LoggerFactory.getLogger(EntityDocQueryConnection.class);

    /**
     * Property names for com.sun.xml.internal
     * See internal JDK class BindingProviderProperties for other properties
     */
    private static String CONNECT_TIMEOUT = "com.sun.xml.internal.ws.connect.timeout";

    private static VlerConfig vlerConfig;

    public static void setVlerConfig(VlerConfig vlerConfiguration) {
        vlerConfig = vlerConfiguration;
    }

    /*
        Returns a VlerConfig populated with VLER Configuration
        @return VlerConfig
     */
    public static VlerConfig getVlerConfig() {
        return  vlerConfig;
    }

    /**
     * The client will expire after this many hours of inactivity, after
     * which a {@link VlerConfig} call will instantiate a new client.
     */
    private static final long MAX_CLIENT_AGE_IN_HOURS = 2;

    private static Cache<VlerConfig, EntityDocRetrievePortType> CLIENT_CACHE =
            CacheBuilder
                    .newBuilder()
                    .expireAfterAccess(MAX_CLIENT_AGE_IN_HOURS, TimeUnit.HOURS)
                    .build();

    /**
     * Returns a EntityDocQueryPortType client
     * @return  the EntityDocQueryPortType client if the client could not be created from the configuration
     */
    public static EntityDocRetrievePortType getInstance() {
        EntityDocRetrievePortType client = CLIENT_CACHE.getIfPresent(vlerConfig);
        if (client == null) {
            try {
                client = create(vlerConfig.getDocRetrieveUrl(), vlerConfig.getDocRetrieveTimeoutMs());
            } catch (MalformedURLException e) {
                logger.error(e.getMessage(), e);
                return null;
            }
            CLIENT_CACHE.put(vlerConfig, client);
        }
        return client;
    }

    /**
     * Returns a EntityDocRetrievePortType client for this configuration
     * @param url   the WS endpoint
     * @return  the EntityDocRetrievePortType client
     * @throws java.net.MalformedURLException if the url is an invalid URL
     */
    private static EntityDocRetrievePortType create(String url, int timeoutMS) throws MalformedURLException {

        EntityDocRetrieve entityDocRetrieveService = new EntityDocRetrieve();

        EntityDocRetrievePortType entityDocRetrievePort = entityDocRetrieveService.getEntityDocRetrievePortSoap11();

        //set url & connection timeout
        Map<String, Object> requestContext  = ((BindingProvider) entityDocRetrievePort).getRequestContext();
        requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, url);
        requestContext.put(CONNECT_TIMEOUT, timeoutMS);

        return entityDocRetrievePort;
    }
}
