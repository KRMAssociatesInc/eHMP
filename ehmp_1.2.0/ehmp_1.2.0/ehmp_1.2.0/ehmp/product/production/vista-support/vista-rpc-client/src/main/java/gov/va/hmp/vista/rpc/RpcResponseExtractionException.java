package gov.va.hmp.vista.rpc;

import org.springframework.dao.DataRetrievalFailureException;

public class RpcResponseExtractionException extends DataRetrievalFailureException {

    private RpcResponse response;

    public RpcResponseExtractionException(RpcResponse response, String msg) {
        super(msg);
        this.response = response;
    }

    public RpcResponseExtractionException(RpcResponse response, Throwable cause) {
        super(getMessage(response, cause.getMessage()), cause);
        this.response = response;
    }

    public RpcResponseExtractionException(RpcResponse response, String msg, Throwable cause) {
        super(getMessage(response, msg), cause);
        this.response = response;
    }

    private static String getMessage(RpcResponse response, String msg) {
        return msg + "\nRPC: " + response.getRequestUri() + "\nresponse: \n" + response.toString();
    }

    public RpcResponse getResponse() {
        return response;
    }
}
