package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcIoException;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.broker.protocol.DefaultRpcMessageReader;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.Reader;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class DefaultRpcMessageReaderTest {
    private Reader reader;
    private DefaultRpcMessageReader defaultRpcMessageReader;
    
	@Before
    public void setUp() throws IOException {
    }

	@Test
	public void testReadServerPacketNormalFlow() throws IOException {
        reader = mock(Reader.class);
        when(reader.read()).thenReturn(4);
		defaultRpcMessageReader = new DefaultRpcMessageReader(reader);
		try {
			RpcResponse response = defaultRpcMessageReader.readResponse();
		}catch(Throwable t) {
			fail("Should not throw RpcIoException");
		}
	}
	
	@Test
	public void testReadServerPacketThrowsRpcIoException() throws IOException {
        reader = mock(Reader.class);
        when(reader.read()).thenReturn(-1);
		defaultRpcMessageReader = new DefaultRpcMessageReader(reader);
		try {
			defaultRpcMessageReader.readResponse();
			fail("Should throw RpcIoException");
		}catch(Throwable t) {
	        assertTrue(t instanceof RpcIoException);
		}
	}
}
