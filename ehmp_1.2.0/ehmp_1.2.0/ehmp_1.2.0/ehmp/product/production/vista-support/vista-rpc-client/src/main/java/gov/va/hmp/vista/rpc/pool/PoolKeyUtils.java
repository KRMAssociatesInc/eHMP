package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.ConnectionSpec;
import gov.va.hmp.vista.rpc.conn.ConnectionSpecFactory;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;

public class PoolKeyUtils {

    public static String getKey(RpcHost host, String credentials) {
        return RpcUriUtils.toUriString(host, ConnectionSpecFactory.create(credentials));
    }

    public static String keyToUriString(Object key) {
        return UriComponentsBuilder.fromUriString((String) key).userInfo(null).build().toString();
    }

    @Deprecated
    public static URI keyToURI(Object key) throws URISyntaxException {
        return RpcUriUtils.toSafeURI((String) key);
    }

    public static ConnectionSpec keyToConnectionSpec(Object key) {
        return RpcUriUtils.extractConnectionSpec((String) key);
    }
}
