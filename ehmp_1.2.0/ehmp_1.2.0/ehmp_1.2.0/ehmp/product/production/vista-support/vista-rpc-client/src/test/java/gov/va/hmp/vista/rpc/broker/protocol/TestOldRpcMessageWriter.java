package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class TestOldRpcMessageWriter {
    private StringWriter s;
    private RpcMessageWriter w;

    @Before
    public void setUp() {
        s = new StringWriter();
        w = new OldRpcMessageWriter(s);
    }

    @Test
    public void testStrPack() {
        assertEquals("0003foo", OldRpcMessageWriter.strPack("foo", 4));
    }

    @Test
    public void testVarPackNullOrEmptyString() {
        assertEquals("|\u00010", OldRpcMessageWriter.varPack(null));
        assertEquals("|\u00010", OldRpcMessageWriter.varPack(""));
    }

    @Test
    public void testVarPack() {
        assertEquals("|\u000234", OldRpcMessageWriter.varPack("34"));
    }

    @Test
    public void testBuildHdr() {
        assertEquals("007XWB;;;;", OldRpcMessageWriter.buildHdr("XWB", "", "", ""));
    }

    @Test
    public void testBuildApi() {
        assertEquals("000140FOO BAR^00000", OldRpcMessageWriter.buildApi("FOO BAR", "", 0));
    }


    @Test
    public void testWriteRequestWithNoParameters() throws IOException {
        RpcRequest r = new RpcRequest("FOO BAR");

        try {
            w.write(r);
        } catch (RpcException e) {
            e.printStackTrace();  // TODO: replace default exception handling
        }

        assertEquals("{XWB}00037|\u0001000029007XWB;;;;000140FOO BAR^00000", s.toString());
    }

    @Test
    public void testWriteRequestWithLiteralParameter() throws IOException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        params.add(new RpcParam("baz"));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        try {
            w.write(r);
        } catch (RpcException e) {
            e.printStackTrace();  // TODO: replace default exception handling
        }

        assertEquals("{XWB}00044|\u0001000036007XWB;;;;000210FOO BAR^000070040baz", s.toString());
    }

    @Test
    public void testWriteRequestWithListParameter() throws IOException {
        List<RpcParam> params = new ArrayList<RpcParam>();
        Mult mult = new Mult();
        mult.put("baz", "spaz");
        params.add(new RpcParam(mult));
        RpcRequest r = new RpcRequest("FOO BAR", params);

        try {
            w.write(r);
        } catch (RpcException e) {
            e.printStackTrace();  // TODO: replace default exception handling
        }

        assertEquals("{XWB}00043|\u0001000035007XWB;;;;000201FOO BAR^000060032.x003baz004spaz000", s.toString());
    }
}
