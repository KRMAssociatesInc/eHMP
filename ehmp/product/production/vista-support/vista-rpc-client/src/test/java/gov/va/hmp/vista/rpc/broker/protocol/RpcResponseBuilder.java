package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcResponse;

/**
 * TODOC: Provide summary documentation of class RpcResponseBuilder
 */
public class RpcResponseBuilder {
    private static final char EOT = '\u0004';

    private StringBuilder sb = new StringBuilder();
    private String applicationSegment;
    private String securitySegment;

    public RpcResponseBuilder() {
        this("", "");
    }

    public RpcResponseBuilder(String response) {
        this("", "");
        sb.append(response);
    }

    public RpcResponseBuilder(String securitySegment, String applicationSegment) {
        this.securitySegment = securitySegment;
        this.applicationSegment = applicationSegment;
    }

    public RpcResponseBuilder append(String s) {
        sb.append(s);
        return this;
    }

    public RpcResponseBuilder appendLine() {
        sb.append(RpcResponse.LINE_DELIMITER);
        return this;
    }

    public RpcResponseBuilder appendLine(String line) {
        sb.append(line);
        sb.append(RpcResponse.LINE_DELIMITER);
        return this;
    }

    public String getApplicationSegment() {
        return applicationSegment;
    }

    public void setApplicationSegment(String applicationSegment) {
        this.applicationSegment = applicationSegment;
    }

    public String getSecuritySegment() {
        return securitySegment;
    }

    public void setSecuritySegment(String securitySegment) {
        this.securitySegment = securitySegment;
    }

    public RpcResponse toRpcResponse() {
        return new RpcResponse(getSecuritySegment(), getApplicationSegment(), sb.toString());
    }

    @Override
    public String toString() {
        return NewRpcMessageWriter.SPack(getSecuritySegment()) + NewRpcMessageWriter.SPack(getSecuritySegment()) + sb.toString() + EOT;
    }
}
