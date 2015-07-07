package gov.va.hmp.vista.rpc.broker.conn;

import java.io.IOException;
import java.io.InputStream;

/**
 * TODOC: Provide summary documentation of class gov.va.cpe.vista.impl.BufferedInputStream
 */
public class EndOfTransmissionInputStream extends InputStream {

    private static final int EOT = 4;

    private volatile InputStream in;
    private boolean readEOT = false;

    public EndOfTransmissionInputStream(InputStream in) {
        this.in = in;
    }

    @Override
    public int read() throws IOException {
        if (readEOT) {
            readEOT = false;
            return -1;
        }
        int l = in.read();
        if (l == EOT) {
            readEOT = true;
        }
        return l;
    }
}
