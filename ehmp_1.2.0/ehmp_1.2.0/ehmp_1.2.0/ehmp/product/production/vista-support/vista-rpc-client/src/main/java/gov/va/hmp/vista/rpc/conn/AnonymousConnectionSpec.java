package gov.va.hmp.vista.rpc.conn;

/**
 * ConnectionSpec for opening a connection in order to fetch system info when access/verify codes are not yet known.
 *
 * @see ConnectionFactory
 */
public class AnonymousConnectionSpec implements ConnectionSpec {

    public static final String ANONYMOUS = "ANONYMOUS";

    private final String clientAddress;
    private final String clientHostName;

    @Deprecated
    public AnonymousConnectionSpec() {
        this(null, null);
    }

    public AnonymousConnectionSpec(String clientAddress, String clientHostName) {
        this.clientAddress = clientAddress;
        this.clientHostName = clientHostName;
    }

    @Override
    public String getClientAddress() {
        return clientAddress;
    }

    public String getClientHostName() {
        return clientHostName;
    }

    @Override
    public String toString() {
        return ANONYMOUS;
    }
}
