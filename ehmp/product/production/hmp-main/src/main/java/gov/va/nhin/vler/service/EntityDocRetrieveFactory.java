package gov.va.nhin.vler.service;

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

public class EntityDocRetrieveFactory {
    private static Logger logger = LoggerFactory.getLogger(EntityDocQueryFactory.class);

    /**
     * Property names for com.sun.xml.internal
     * See internal JDK class BindingProviderProperties for other properties
     */
    private static String CONNECT_TIMEOUT = "com.sun.xml.internal.ws.connect.timeout";

    /**
     * The client will expire after this many hours of inactivity, after
     * which a {@link INhinAdapterCfg} call will instantiate a new client.
     */
    private static final long MAX_CLIENT_AGE_IN_HOURS = 2;

    private static Cache<INhinAdapterCfg, EntityDocRetrievePortType> CLIENT_CACHE =
            CacheBuilder
                    .newBuilder()
                    .expireAfterAccess(MAX_CLIENT_AGE_IN_HOURS, TimeUnit.HOURS)
                    .build();

    /**
     * Returns a EntityDocQueryPortType client for this {@link INhinAdapterCfg} object
     * @param nhinAdapterCfg  the configuration for the EntityDocRetrievePortType client
     * @return  the EntityDocQueryPortType client if the client could not be created from the configuration
     */
    public static EntityDocRetrievePortType getInstance(INhinAdapterCfg nhinAdapterCfg) {
        EntityDocRetrievePortType client = CLIENT_CACHE.getIfPresent(nhinAdapterCfg);
        if (client == null) {
            try {
                client = create(nhinAdapterCfg.getDocRetrieveUrl(), nhinAdapterCfg.getTimeoutMS());
            } catch (MalformedURLException e) {
                logger.error(e.getMessage(), e);
                return null;
            }
            CLIENT_CACHE.put(nhinAdapterCfg, client);
        }
        return client;
    }

    /**
     * Returns a EntityDocRetrievePortType client for this configuration
     * @param url   the WS endpoint
     * @return  the EntityDocRetrievePortType client
     * @throws MalformedURLException if the url is an invalid URL
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
