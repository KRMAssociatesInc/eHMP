package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Test;

import java.io.StringReader;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestDefaultRpcMessageReader {

    @Test
    public void testReadServerPacket() throws RpcException {
        StringReader s = new StringReader("\u0003foo\u0003bar");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        assertEquals("foo", r.readServerPacket());
        assertEquals("bar", r.readServerPacket());
    }

    @Test
    public void testReadServerPacketZeroLength() throws RpcException {
        StringReader s = new StringReader("\u0000");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        assertEquals("", r.readServerPacket());
    }

    @Test
    public void testReadResponse() throws RpcException {
        StringReader s = new StringReader("\u0000\u0003barbaz\u0004");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        RpcResponse response = r.readResponse();
        assertEquals("", response.getSecuritySegment());
        assertEquals("bar", response.getApplicationSegment());
        assertEquals("baz", response.toString());
    }

    @Test(expected = EOFException.class)
    public void testEOF() throws RpcException {
        StringReader s = new StringReader("");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);
        r.readResponse();
    }

    @Test(expected = BadReadsException.class)
    public void testBadReads() throws RpcException {
        StringReader s = new StringReader("\u0000\u0004U411baz\u0004");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        r.readResponse();
    }

    @Test(expected = InternalServerException.class)
    public void testInternalServerErrorInMessage() throws RpcException {
        StringReader s = new StringReader("\u0000\u0000" + (char) 24 + "\r\nbaz\u0004");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        try {
            r.readResponse();
        } catch (InternalServerException e) {
            assertTrue(e.getMessage().contains("baz"));
            throw e;
        }
    }

    @Test(expected = ServiceTemporarilyDownException.class)
    public void testServiceTemporarilyDown() throws RpcException {
        StringReader s = new StringReader("421 Service temporarily down.\r\n");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        r.readResponse();
    }

    @Test
    public void testResponseWithNoCharactersInFirstLine() throws RpcException {
        StringReader s = new StringReader("\u0000\u0000\r\nfoo\r\nbar\r\nbaz\r\n\u0004");
        DefaultRpcMessageReader r = new DefaultRpcMessageReader(s);

        RpcResponse response = r.readResponse();
        assertEquals("", response.getSecuritySegment());
        assertEquals("", response.getApplicationSegment());
        String[] lines = response.toLines();
        assertEquals("", lines[0]);
        assertEquals("foo", lines[1]);
        assertEquals("bar", lines[2]);
        assertEquals("baz", lines[3]);
    }
}
