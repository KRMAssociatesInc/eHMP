package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.LinesFromRpcResponseExtractor;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcResponseExtractionException;
import gov.va.hmp.vista.rpc.RpcResponseExtractor;

public class VistaSystemInfoResponseExtractor implements RpcResponseExtractor<VistaSystemInfo> {

    private LinesFromRpcResponseExtractor linesFromExtractor = new LinesFromRpcResponseExtractor();

    @Override
    public VistaSystemInfo extractData(RpcResponse response) throws RpcResponseExtractionException {
        String[] lines = linesFromExtractor.extractData(response);
        VistaSystemInfo info = new VistaSystemInfo();
        info.setServer(lines[0]);
        info.setVolume(lines[1]);
        info.setUCI(lines[2]);
        info.setDevice(lines[3]);
        if (lines.length > 7) {
            info.setDomainName(lines[6]);
            if ("1".equals(lines[7]))
                info.setProductionAccount(true);
        }
        return info;
    }
}
