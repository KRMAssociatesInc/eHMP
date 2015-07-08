package gov.va.cpe.test.junit4.runners;

import gov.va.hmp.vista.rpc.RpcTemplate;

public class VistaSessionManager {

    private static ThreadLocal<RpcTemplate> sessionHolder = new ThreadLocal<RpcTemplate>();

    public static RpcTemplate getRpcTemplate() {
        return sessionHolder.get();
    }

    public static void startSession(int timeout) {
        if (sessionHolder.get() != null)
            stopSession();

        RpcTemplate rpcTemplate = new RpcTemplate();
        rpcTemplate.setTimeout(timeout);
        sessionHolder.set(rpcTemplate);
    }

    public static void stopSession() {
        RpcTemplate rpcTemplate = sessionHolder.get();
        if (rpcTemplate == null) return;
        sessionHolder.set(null);
        try {
            rpcTemplate.destroy();
        } catch (Exception e) {
            // NOOP
        }
    }
}
