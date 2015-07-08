package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import org.apache.commons.io.input.CountingInputStream;

import java.io.InputStream;

public class CountingInputStreamTransportMetrics implements TransportMetrics {

    private CountingInputStream in;

    public CountingInputStreamTransportMetrics(InputStream in) {
         this.in = new CountingInputStream(in);
    }

    public InputStream in() {
        return in;
    }

    @Override
    public long getBytesTransferred() {
        return in.getByteCount();
    }

    @Override
    public void reset() {
        in.resetByteCount();
    }
}
