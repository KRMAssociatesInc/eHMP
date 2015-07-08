package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.io.Reader;

/**
 * TODOC: Provide summary documentation of class RpcMessageReader
 */
public class DefaultRpcMessageReader implements RpcMessageReader {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultRpcMessageReader.class);

    private final Reader reader;

    public DefaultRpcMessageReader(final Reader r) {
        this.reader = r;
    }

    public RpcResponse readResponse() throws RpcException {
        long start = System.currentTimeMillis();
        long waitMillis = -1;
        long receiveMillis = -1;

        String securitySegment = null;
        String applicationSegment = null;
        try {
            securitySegment = readServerPacket();
            waitMillis = System.currentTimeMillis() - start;
            applicationSegment = readServerPacket();
        } catch (RpcException e) {
            if (securitySegment != null && securitySegment.startsWith(ServiceTemporarilyDownException.RPC_SERVICE_TEMPORARILY_DOWN_MESSAGE)) {
                throw new ServiceTemporarilyDownException();
            } else {
                throw e;
            }
        }

        StringBuilder responseBuf = new StringBuilder();

        int c = -1;
        do {
            try {
                c = reader.read();
                if (c < 0) throw new IOException("unexpected end of stream");
            } catch (InterruptedIOException e) {
                throw new TimeoutWaitingForRpcResponseException(e);
            } catch (IOException e) {
                throw new RpcIoException("unable to read response", e);
            }
            responseBuf.append((char) c);
        } while (c != 4);
        responseBuf.deleteCharAt(responseBuf.length() - 1);

        if ("U411".equals(applicationSegment))
            throw new BadReadsException();

        String responseString = responseBuf.toString();
        RpcResponse response = new RpcResponse(securitySegment, applicationSegment, responseString);
        if (response.length() > 0) {
            String[] lines = response.toLines();
            if (lines.length > 0) {
                if (lines[0].length() > 0) {
                    if (lines[0].charAt(0) == (char) 24)
                        throw new InternalServerException(response.toLines()[1]);
                }
            } else {
                LOGGER.warn("RPC response '" + responseString + "' produced a 0-length lines array");
            }
        }

        receiveMillis = System.currentTimeMillis() - start - waitMillis;
        response.setElapsedMillis(RpcPhase.WAITING, waitMillis);
        response.setElapsedMillis(RpcPhase.RECEIVING, receiveMillis);
        return response;
    }

    public String readServerPacket() throws RpcException {
        try {
            int numChars = reader.read();
            if (numChars < 0) {
                /* this is a strangey-strange-strangington thing that the Delphi does - so we're putting it in, the original comment was:

                   040720 code added to check for the timing problem if initial attempt to read during connection fails */
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    // NOOP
                }
                numChars = reader.read();
                if (numChars < 0) {
                    throw new EOFException();
                }
            }
            if (numChars == 0) return "";
            char[] buf = new char[numChars];
            reader.read(buf);
            return new String(buf);
        } catch (InterruptedIOException e) {
            throw new TimeoutWaitingForRpcResponseException(e);
        } catch (IOException e) {
            throw new RpcIoException("unable to read server packet", e);
        }
    }
}
