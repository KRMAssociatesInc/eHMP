package gov.va.nhin.vler.service;


import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import gov.hhs.fha.nhinc.entitydocquery.EntityDocQuery;
import gov.hhs.fha.nhinc.entitydocquery.EntityDocQueryPortType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.ws.BindingProvider;
import java.net.MalformedURLException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class EntityDocQueryFactory {
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

    private static Cache<INhinAdapterCfg, EntityDocQueryPortType> CLIENT_CACHE =
            CacheBuilder
                    .newBuilder()
                    .expireAfterAccess(MAX_CLIENT_AGE_IN_HOURS, TimeUnit.HOURS)
                    .build();

    /**
     * Returns a EntityDocQueryPortType client for this {@link INhinAdapterCfg} object
     * @param nhinAdapterCfg  the configuration for the EntityDocQueryPortType client
     * @return  the EntityDocQueryPortType client if the client could not be created from the configuration
     */
    public static EntityDocQueryPortType getInstance(INhinAdapterCfg nhinAdapterCfg) {
        EntityDocQueryPortType client = CLIENT_CACHE.getIfPresent(nhinAdapterCfg);
        if (client == null) {
            try {
                client = create(nhinAdapterCfg.getDocQueryUrl(), nhinAdapterCfg.getTimeoutMS());
            } catch (MalformedURLException e) {
                logger.error(e.getMessage(), e);
                return null;
            }
            CLIENT_CACHE.put(nhinAdapterCfg, client);
        }
        return client;
    }

    /**
     * Returns a EntityDocQueryPortType client for this configuration
     * @param url   the WS endpoint
     * @return  the EntityDocQueryPortType client
     * @throws MalformedURLException if the url is an invalid URL
     */
    private static EntityDocQueryPortType create(String url, int timeoutMS) throws MalformedURLException {

        EntityDocQuery entityDocQueryService = new EntityDocQuery();

        EntityDocQueryPortType entityDocQueryPort = entityDocQueryService.getEntityDocQueryPortSoap11();

        //set url & connection timeout
        Map<String, Object> requestContext  = ((BindingProvider) entityDocQueryPort).getRequestContext();
        requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, url);
        requestContext.put(CONNECT_TIMEOUT, timeoutMS);

        return entityDocQueryPort;
    }
}
