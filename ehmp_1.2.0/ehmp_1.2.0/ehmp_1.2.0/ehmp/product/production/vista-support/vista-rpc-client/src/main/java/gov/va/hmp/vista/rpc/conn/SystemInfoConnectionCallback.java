package gov.va.hmp.vista.rpc.conn;

import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcException;
import org.springframework.dao.DataAccessException;

public class SystemInfoConnectionCallback implements ConnectionCallback<SystemInfo> {
    @Override
    public SystemInfo doInConnection(Connection con) throws RpcException, DataAccessException {
        return con.getSystemInfo();
    }
}
