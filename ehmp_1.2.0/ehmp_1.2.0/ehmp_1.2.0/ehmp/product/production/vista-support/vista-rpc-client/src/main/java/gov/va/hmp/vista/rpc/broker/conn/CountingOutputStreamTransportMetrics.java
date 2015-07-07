package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import org.apache.commons.io.output.CountingOutputStream;

import java.io.OutputStream;

public class CountingOutputStreamTransportMetrics implements TransportMetrics {

    private CountingOutputStream out;

    public CountingOutputStreamTransportMetrics(OutputStream out) {
        this.out = new CountingOutputStream(out);
    }

    public OutputStream out() {
        return out;
    }

    @Override
    public long getBytesTransferred() {
        return out.getByteCount();
    }

    @Override
    public void reset() {
        out.resetByteCount();
    }
}
