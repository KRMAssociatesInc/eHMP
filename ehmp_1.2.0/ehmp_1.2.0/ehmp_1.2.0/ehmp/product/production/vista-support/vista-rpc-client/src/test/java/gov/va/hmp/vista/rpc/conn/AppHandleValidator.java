package gov.va.hmp.vista.rpc.conn;


import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;

public class AppHandleValidator {
    public static void main(String[] args) {
        RpcHost vistaHost = createRpcHost(args[0]);
        String clientAddress = args[1];
        String clientHostName = args[2];
        String appHandle = args[3];

        BrokerConnectionFactory factory = new BrokerConnectionFactory();
        Connection c = null;
        try {
            c = factory.getConnection(vistaHost, new AppHandleConnectionSpec(appHandle, clientAddress, clientHostName));
            System.out.println("Sign On Successful!");
        } finally {
            if (c != null) {
                c.close();
            }
        }
    }

    private static RpcHost createRpcHost(String hostAndPort) {
        String[] pieces = hostAndPort.split("\\:");
        if (pieces.length != 2) throw new IllegalArgumentException("Unable to determine VistA RPC host and port from '" + hostAndPort + "'");
        return new RpcHost(pieces[0], Integer.parseInt(pieces[1]));
    }
}
