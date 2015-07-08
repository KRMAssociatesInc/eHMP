package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;

import java.io.IOException;
import java.io.Writer;

/**
 * TODOC: Provide summary documentation of class gov.va.cpe.vista.protocol.impl.NewStyleRpcRequestWriter
 */
public class NewRpcMessageWriter implements RpcMessageWriter {

    public static final String PREFIX = "[XWB]";
    private static final int COUNT_WIDTH = 3;
    private static final String EOT = "\u0004";

    private Writer writer;

    public void writeStartConnection(String hostname, String address, int localPort) throws RpcException {
        StringBuilder sb = new StringBuilder(PREFIX);
        sb.append("10");
        sb.append(COUNT_WIDTH);
        sb.append("0");
        sb.append("4");
        sb.append("\n");
        sb.append("TCPConnect50");
        sb.append(LPack(address, COUNT_WIDTH));
        sb.append("f0");
        sb.append(LPack("0", COUNT_WIDTH));
        sb.append("f0");
        sb.append(LPack(hostname, COUNT_WIDTH));
        sb.append("f");
        sb.append(EOT);
        try {
            writer.write(sb.toString());
        } catch (IOException e) {
            throw new RpcException("unable to write start connection message", e);
        }
    }

    public void writeStopConnection() throws RpcException {
        try {
            writer.write(PREFIX + "10" + COUNT_WIDTH + "04\u0005#BYE#" + EOT);
        } catch (IOException e) {
            throw new RpcException("unable to write stop connection message", e);
        }
    }

    public NewRpcMessageWriter(Writer w) {
        this.writer = w;
    }

    public void write(RpcRequest request) throws RpcException {
        try {
            writer.write(buildPar(request));
        } catch (IOException e) {
            throw new RpcException("unable to write request message", e);
        }

    }

    private String buildPar(RpcRequest request) {
        StringBuilder param = new StringBuilder("5");
        if (request.getParams().isEmpty()) {
            param.append("4f");
        } else {
            for (RpcParam p : request.getParams()) {
                switch (p.getType()) {
                    case LITERAL:
                        param.append("0").append(LPack(p.getValue(), COUNT_WIDTH)).append("f");
                        break;
                    case REFERENCE:
                        param.append("1").append(LPack(p.getValue(), COUNT_WIDTH)).append("f");
                        break;
                    case EMPTY:
                        param.append("4f");
                        break;
                    case LIST:
                    case GLOBAL:
                        if (p.getType() == RpcParam.Type.LIST)
                            param.append("2");
                        else
                            param.append("3");
                        boolean isSeen = false;
                        String subscript = p.getMult().getFirst();
                        while (!subscript.isEmpty()) {
                            if (isSeen) param.append("t");
                            if (p.getMult().get(subscript).isEmpty())
                                p.getMult().put(subscript, "\u0001");
                            param.append(LPack(subscript, COUNT_WIDTH));
                            param.append(LPack(p.getMult().get(subscript), COUNT_WIDTH));
                            isSeen = true;
                            subscript = p.getMult().order(subscript, 1);
                        }
                        if (!isSeen) param.append(LPack("", COUNT_WIDTH));
                        param.append("f");
                        break;
                    case STREAM:
                        param.append("5").append(LPack(p.getValue(), COUNT_WIDTH)).append("f");
                        break;
                }
            }
        }

        StringBuilder result = new StringBuilder(PREFIX);
        result.append("11");
        result.append(COUNT_WIDTH);
        result.append("02");
        result.append(SPack(request.getRpcVersion()));
        result.append(SPack(request.getRpcName()));
        result.append(param.toString());
        result.append(EOT);

        return result.toString();
    }

    public void flush() throws RpcException {
        try {
            writer.flush();
        } catch (IOException e) {
            throw new RpcException("unable to flush message writer", e);
        }
    }

    /**
     * Prepends the length of the string in one character to the value of <code>str</code>.  We want the length
     * to fit into one byte for 8-bit character encodings, so the input string is limited to a length of 256 characters.
     *
     * @param str
     * @return
     */
    public static String SPack(String str) {
        int r = str.length();
        if (r > 255)
            throw new IllegalArgumentException("In generation of message to server, send to SPack with string '" + str + "' of " + r + " chars which exceeds max of 255 chars'");
        return ((char) r) + str;
    }

    /**
     * Prepends the length of the string in <code>nDigits</code> characters to the value of <code>str</code>.
     *
     * @param str
     * @param nDigits
     * @return
     */
    public static String LPack(String str, int nDigits) {
        if (str == null) return String.format("%0" + nDigits + "d", 0);
        int length = str.length();
        int width = Integer.toString(length).length();
        if (nDigits < width)
            throw new IllegalArgumentException("In generation of message to server, send to LPack where length of string '" + str + "' of " + width + " chars exceeds number of chars for output length (" + nDigits + ")");
        return String.format("%0" + nDigits + "d%s", length, str);
    }
}
