package gov.va.hmp.vista.rpc;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestLineMapperRpcResponseExtractor {

    @Test
    public void extractData() {
        RpcResponse mockResponse = new RpcResponse("fred\r\nbarney\r\nwilma\r\nbetty");

        LineMapperRpcResponseExtractor<Foo> extractor = new LineMapperRpcResponseExtractor<Foo>(new FooLineMapper());

        List<Foo> fooList = extractor.extractData(mockResponse);
        assertEquals(4, fooList.size());
        assertEquals("fred", fooList.get(0).getText());
        assertEquals("barney", fooList.get(1).getText());
        assertEquals("wilma", fooList.get(2).getText());
        assertEquals("betty", fooList.get(3).getText());
    }

    @Test
    public void extractDataFromEmptyResponse() {
        RpcResponse mockResponse = new RpcResponse("");

        LineMapperRpcResponseExtractor<Foo> extractor = new LineMapperRpcResponseExtractor<Foo>(new FooLineMapper());

        List<Foo> fooList = extractor.extractData(mockResponse);
        assertTrue(fooList.isEmpty());
    }
}
