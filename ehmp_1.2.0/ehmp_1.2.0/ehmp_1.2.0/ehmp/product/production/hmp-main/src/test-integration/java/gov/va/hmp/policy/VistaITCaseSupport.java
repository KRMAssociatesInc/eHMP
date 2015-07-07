package gov.va.hmp.policy;

import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.HmpUserDetailsService;
import gov.va.hmp.vista.rpc.CredentialsProvider;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcHostResolver;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;
import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.atomic.AtomicReference;

public class VistaITCaseSupport {
    private static final AtomicReference<RpcTemplate> RPC_TEMPLATE_REFERENCE = new AtomicReference<>();
    private static final HmpUserDetailsService USER_DETAILS_REFERENCE = new HmpUserDetailsService();
    private static final AtomicReference<HmpUserDetails> USER = new AtomicReference<>();

    public static RpcTemplate getRpcTemplate() {
        return RPC_TEMPLATE_REFERENCE.get();
    }

    public static HmpUserDetails getUser() {
        return USER.get();
    }

    public static void init() throws UnknownHostException {
        init(new RpcHost("localhost", 29060), "10vehu", "vehu10");
    }

    public static void init(String host, int port, final String accessCode, final String verifyCode) throws UnknownHostException {
        init(new RpcHost(host, port), accessCode, verifyCode);
    }

    public static void init(final RpcHost rpcHost, final String accessCode, final String verifyCode) throws UnknownHostException {
        RpcTemplate rpcTemplate = new RpcTemplate(new DefaultConnectionManager(new BrokerConnectionFactory(), 1));
        rpcTemplate.setHostResolver(new RpcHostResolver() {
            @Override
            public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
                return rpcHost;
            }
        });
        rpcTemplate.setCredentialsProvider(new CredentialsProvider() {
            @Override
            public String getCredentials(RpcHost host, String userInfo) {
                return USER.get().getCredentials();
            }
        });
        RPC_TEMPLATE_REFERENCE.set(rpcTemplate);

        USER_DETAILS_REFERENCE.setRpcTemplate(rpcTemplate);
        USER_DETAILS_REFERENCE.setEnforceHmpVersionMatch(false);
        USER.set((HmpUserDetails) USER_DETAILS_REFERENCE.login("F484", "500", accessCode, verifyCode, null, null, InetAddress.getLocalHost().getHostAddress(), InetAddress.getLocalHost().getHostName()));
    }

    public static void destroy() throws Exception {
        RpcTemplate rpcTemplate = RPC_TEMPLATE_REFERENCE.getAndSet(null);
        try {
            rpcTemplate.destroy();
        } catch (Exception e) {

        }
    }
}
