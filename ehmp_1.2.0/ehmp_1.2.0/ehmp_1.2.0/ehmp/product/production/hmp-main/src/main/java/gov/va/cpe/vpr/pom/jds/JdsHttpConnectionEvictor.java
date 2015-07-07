package gov.va.cpe.vpr.pom.jds;

import org.apache.http.conn.ClientConnectionManager;

import java.util.concurrent.TimeUnit;

public class JdsHttpConnectionEvictor implements Runnable {

    private ClientConnectionManager connectionManager;

    public JdsHttpConnectionEvictor(ClientConnectionManager connectionManager) {
        this.connectionManager = connectionManager;
    }

    @Override
    public void run() {
        connectionManager.closeExpiredConnections();
        // Optionally, close connections
        // that have been idle longer than 30 sec
        connectionManager.closeIdleConnections(30, TimeUnit.SECONDS);
    }
}
