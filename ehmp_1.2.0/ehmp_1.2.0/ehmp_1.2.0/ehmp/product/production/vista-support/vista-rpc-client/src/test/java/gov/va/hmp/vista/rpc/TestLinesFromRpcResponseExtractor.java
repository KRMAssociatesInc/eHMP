package gov.va.hmp.vista.rpc;

import org.junit.Assert;
import org.junit.Test;

public class TestLinesFromRpcResponseExtractor {
    @Test
    public void extractLines() {
        LinesFromRpcResponseExtractor e = new LinesFromRpcResponseExtractor();

        Assert.assertArrayEquals(new String[]{"fred", "wilma", "barney", "betty"}, e.extractData(new RpcResponse("fred\r\nwilma\r\nbarney\r\nbetty")));
    }
}
