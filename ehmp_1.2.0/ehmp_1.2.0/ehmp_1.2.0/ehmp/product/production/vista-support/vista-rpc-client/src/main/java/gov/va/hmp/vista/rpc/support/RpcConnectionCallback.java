package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.conn.Connection;
import org.springframework.dao.DataAccessException;

public class RpcConnectionCallback implements ConnectionCallback<RpcResponse> {

    private RpcRequest request;

    public RpcConnectionCallback(RpcRequest request) {
        this.request = request;
    }

    @Override
    public RpcResponse doInConnection(Connection con) throws RpcException, DataAccessException {
        return con.send(request);
    }
}
