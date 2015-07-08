package gov.va.hmp.vista.rpc;

import java.util.Date;

/**
 * Event triggered by selection of a node in the style stree.
 */
public class RpcEvent implements Comparable<RpcEvent> {

    private RpcRequest request;
    private RpcResponse response;
    private RpcException exception;
    private Date timestamp;

    public RpcEvent(RpcRequest request, RpcResponse response) {
        this.request = request;
        this.response = response;
        this.timestamp = new Date();
    }

    public RpcEvent(RpcRequest request, RpcException exception) {
        this.request = request;
        this.exception = exception;
        this.timestamp = new Date();
    }

    public RpcHost getHost() {
        return getRequest().getHost();
    }

    public RpcRequest getRequest() {
        return request;
    }

    public RpcResponse getResponse() {
        return response;
    }

    public RpcException getException() {
        return exception;
    }

    public boolean isError() {
        return getException() != null;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    @Override
    public int compareTo(RpcEvent rpcEvent) {
        int c = getTimestamp().compareTo(rpcEvent.getTimestamp());
        if (c != 0) return c;
        c = getHost().getHostname().compareTo(rpcEvent.getHost().getHostname());
        if (c != 0) return c;
        c = getRequest().getCredentials().compareTo(rpcEvent.getRequest().getCredentials());
        if (c != 0) return c;
        c = getRequest().getRpcContext().compareTo(rpcEvent.getRequest().getRpcContext());
        if (c != 0) return c;
        return getRequest().getRpcName().compareTo(rpcEvent.getRequest().getRpcName());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RpcEvent rpcEvent = (RpcEvent) o;

        if (!request.equals(rpcEvent.request)) return false;
        if (!timestamp.equals(rpcEvent.timestamp)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = request.hashCode();
        result = 31 * result + timestamp.hashCode();
        return result;
    }
}
