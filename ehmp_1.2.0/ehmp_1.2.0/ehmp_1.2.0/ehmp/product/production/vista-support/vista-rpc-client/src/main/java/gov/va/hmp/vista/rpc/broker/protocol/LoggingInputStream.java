package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.support.Wire;

import java.io.IOException;
import java.io.InputStream;

/**
 * TODOC: Provide summary documentation of class LoggingInputStream
 */
public class LoggingInputStream extends InputStream {

    private final InputStream in;
    private final Wire wire;

    public LoggingInputStream(final InputStream in, final Wire wire) {
        this.in = in;
        this.wire = wire;
    }

    @Override
    public int read() throws IOException {
        int l = in.read();
        if (wire.enabled() && l != -1) {
            wire.input(l);
        }
        return l;
    }

    public int read(byte[] b) throws IOException {
        int l = in.read(b);
        if (wire.enabled() && l != -1) {
            wire.input(b, 0, l);
        }
        return l;
    }

    public int read(byte[] b, int off, int len) throws IOException {
        int l = in.read(b, off, len);
        if (wire.enabled() && l != -1) {
            wire.input(b, off, l);
        }
        return l;
    }

    public int available() throws IOException {
        return in.available();
    }

    public void close() throws IOException {
        in.close();
    }
}
