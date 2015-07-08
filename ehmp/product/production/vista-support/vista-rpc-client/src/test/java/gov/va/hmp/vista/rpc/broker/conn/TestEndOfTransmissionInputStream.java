package gov.va.hmp.vista.rpc.broker.conn;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;

public class TestEndOfTransmissionInputStream {

    private byte[] bytes = new byte[]{0x66, 0x6F, 0x6F, 0x62, 0x61, 0x72, 0x4, 0x66, 0x72, 0x65, 0x42, 0x4};
    private byte[] firstBytes = new byte[]{0x66, 0x6F, 0x6F, 0x62, 0x61, 0x72, 0x4};
    private byte[] secondBytes = new byte[]{0x66, 0x72, 0x65, 0x42, 0x4};
    private EndOfTransmissionInputStream in;
    private ByteArrayInputStream byteStream;
    private byte[] buf;
    private int bytesRead;

    @Before
    public void setUp() {
        byteStream = new ByteArrayInputStream(bytes);
        in = new EndOfTransmissionInputStream(byteStream);
        buf = new byte[256];
        bytesRead = 0;
    }

    @Test
    public void readOneByte() throws IOException {
        int c = -1;
        while ((c = in.read()) != -1) {
            buf[bytesRead++] = (byte) c;
        }

        Assert.assertArrayEquals(firstBytes, Arrays.copyOf(buf, bytesRead));

        buf = new byte[256];
        bytesRead = 0;

        c = -1;
        while ((c = in.read()) != -1) {
            buf[bytesRead++] = (byte) c;
        }

        Assert.assertArrayEquals(secondBytes, Arrays.copyOf(buf, bytesRead));
    }

    @Test
    public void readBytes() throws IOException {
        bytesRead = in.read(buf);
        Assert.assertEquals(7, bytesRead);

        Assert.assertArrayEquals(firstBytes, Arrays.copyOf(buf, bytesRead));

        bytesRead = in.read(buf);
        Assert.assertEquals(5, bytesRead);

        Assert.assertArrayEquals(secondBytes, Arrays.copyOf(buf, bytesRead));
    }

    @Test
    public void readBytesWithOffsetAndLength() throws IOException {
        bytesRead = in.read(buf, 2, 23);
        Assert.assertEquals(7, bytesRead);
        Assert.assertArrayEquals(firstBytes, Arrays.copyOfRange(buf, 2, 2 + bytesRead));

        bytesRead = in.read(buf, 13, 45);
        Assert.assertEquals(5, bytesRead);
        Assert.assertArrayEquals(secondBytes, Arrays.copyOfRange(buf, 13, 13 + bytesRead));
    }
}
