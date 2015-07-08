package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.support.Wire;

import java.io.IOException;
import java.io.OutputStream;

/**
 * TODOC: Provide summary documentation of class LoggingOutputStream
 */
public class LoggingOutputStream extends OutputStream {

    private final OutputStream out;
    private final Wire wire;

    public LoggingOutputStream(final OutputStream s, final Wire wire) {
        this.out = s;
        this.wire = wire;
    }

    @Override
    public void write(int b) throws IOException {
        this.out.write(b);
        if (wire.enabled()) {
            wire.output(b);
        }
    }

    public void close() throws IOException {
        out.close();
    }

    public void flush() throws IOException {
        out.flush();
    }

    public void write(byte[] b) throws IOException {
        out.write(b);
        if (wire.enabled()) {
            wire.output(b);
        }
    }

    public void write(byte[] b, int off, int len) throws IOException {
        out.write(b, off, len);
        if (wire.enabled()) {
            wire.output(b, off, len);
        }
    }
}
