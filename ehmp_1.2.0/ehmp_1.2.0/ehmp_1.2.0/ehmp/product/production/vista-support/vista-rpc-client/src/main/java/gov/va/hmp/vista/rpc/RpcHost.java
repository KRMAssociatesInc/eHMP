package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.util.RpcUriUtils;

import java.io.Serializable;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTALINK_SCHEME;
import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

/**
 * Holds all of the variables needed to describe an VistA RPC connection to a host.
 * This includes remote host name, port and scheme.
 */
public class RpcHost implements Cloneable, Serializable {

    private static final long serialVersionUID = 722460426762944098L;

    private String hostname;
    private String lcHostname;
    private int port;
    private String scheme;

    public RpcHost(final String hostname) {
        this(hostname, RpcUriUtils.DEFAULT_PORT, VISTA_RPC_BROKER_SCHEME);
    }

    public RpcHost(final String hostname, final int port) {
        this(hostname, port, VISTA_RPC_BROKER_SCHEME);
    }

    public RpcHost(final String hostname, final int port, final String scheme) {
        if (hostname == null) {
            throw new IllegalArgumentException("Host name may not be null");
        }
        this.hostname = hostname;
        this.lcHostname = hostname.toLowerCase();
        this.port = port;
        this.scheme = scheme.toLowerCase();
        if (!this.scheme.equals(VISTA_RPC_BROKER_SCHEME) && !this.scheme.equals(VISTALINK_SCHEME)) {
            throw new IllegalArgumentException("[Assertion failed] - the uri scheme must be '" + VISTA_RPC_BROKER_SCHEME + "' or '" + VISTALINK_SCHEME + "', was '" + scheme + "'");
        }
    }

    public RpcHost(final RpcHost host) {
        this(host.getHostname(), host.getPort(), host.getScheme());
    }

    public String getHostname() {
        return hostname;
    }

    public int getPort() {
        return port;
    }

    public String getScheme() {
        return scheme;
    }

    public String toURI() {
        StringBuilder b = new StringBuilder(getScheme());
        b.append("://");
        b.append(getHostname());
        b.append(":");
        b.append(getPort());
        return b.toString();
    }

    /**
     * Obtains the host string, without scheme prefix.
     *
     * @return the host string, for example <code>localhost:9200</code>
     */
    public String toHostString() {
        if (this.port != -1) {
            //the highest port number is 65535, which is length 6 with the addition of the colon
            StringBuilder buffer = new StringBuilder(this.hostname.length() + 6);
            buffer.append(this.hostname);
            buffer.append(":");
            buffer.append(Integer.toString(this.port));
            return buffer.toString();
        } else {
            return this.hostname;
        }
    }

    public String toString() {
        return toURI();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RpcHost rpcHost = (RpcHost) o;

        if (port != rpcHost.port) return false;
        if (!lcHostname.equals(rpcHost.lcHostname)) return false;
        if (scheme != null ? !scheme.equals(rpcHost.scheme) : rpcHost.scheme != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = lcHostname.hashCode();
        result = 31 * result + port;
        result = 31 * result + (scheme != null ? scheme.hashCode() : 0);
        return result;
    }

    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
