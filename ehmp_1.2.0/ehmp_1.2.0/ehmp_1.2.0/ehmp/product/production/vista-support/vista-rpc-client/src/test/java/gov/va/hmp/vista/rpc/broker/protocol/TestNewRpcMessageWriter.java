package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;
import org.junit.Before;
import org.junit.Test;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import static gov.va.hmp.vista.rpc.broker.protocol.NewRpcMessageWriter.LPack;
import static org.junit.Assert.assertEquals;

public class TestNewRpcMessageWriter {

    private StringWriter s;
    private RpcMessageWriter w;

    @Before
    public void setUp() {
        s = new StringWriter();
        w = new NewRpcMessageWriter(s);
    }

    @Test
    public void testSPack() {
        assertEquals("\u0003foo", NewRpcMessageWriter.SPack("foo"));
        assertEquals("\u0009foobarbaz", NewRpcMessageWriter.SPack("foobarbaz"));
    }

    @Test
    public void testLPack() {
        assertEquals("0009DataValue", NewRpcMessageWriter.LPack("DataValue", 4));
    }

    @Test
    public void testLPackNullOrEmptyString() {
        assertEquals("0000", NewRpcMessageWriter.LPack("", 4));
        assertEquals("0000", NewRpcMessageWriter.LPack(null, 4));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testLPackNotWideEnoughException() {
        NewRpcMessageWriter.LPack("DataValueThatHasALengthLongerThanOneCharacter", 1);
    }

    @Test
    public void testWriteStart() throws RpcException {
        w.writeStartConnection("localhost", "127.0.0.1", 5678);

        String packedAddress = LPack("127.0.0.1", 3);
        String packedHostName = LPack("localhost", 3);
        assertEquals("[XWB]10304\nTCPConnect50" + packedAddress + "f0" + "0010" + "f0" + packedHostName + "f\u0004", s.toString());
    }

    @Test
    public void testWriteStop() throws RpcException {
        w.writeStopConnection();

        assertEquals("[XWB]10304\u0005#BYE#\u0004", s.toString());
    }


    @Test
    public void testWriteRequestWithNoParameters() throws RpcException {
        RpcRequest r = new RpcRequest("FOO BAR");

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR54f\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithLiteralParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        params.add(new RpcParam("baz"));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR50003bazf\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithReferenceParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        params.add(new RpcParam("baz", RpcParam.Type.REFERENCE));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR51003bazf\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithEmptyParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        params.add(new RpcParam("baz", RpcParam.Type.EMPTY));
        RpcRequest r = new RpcRequest("FOO BAR", params);
        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR54f\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithListParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        Mult mult = new Mult();
        mult.put("baz", "spaz");
        mult.put("waz", "craz");
        params.add(new RpcParam(mult));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR52003baz004spazt003waz004crazf\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithGlobalParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        Mult mult = new Mult();
        mult.put("baz", "spaz");
        params.add(new RpcParam(mult, RpcParam.Type.GLOBAL));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR53003baz004spazf\u0004", s.toString());
    }

    @Test
    public void testWriteRequestWithStreamParameter() throws RpcException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        params.add(new RpcParam("baz", RpcParam.Type.STREAM));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        w.write(r);

        assertEquals("[XWB]11302\u00010\u0007FOO BAR55003bazf\u0004", s.toString());
    }
}
