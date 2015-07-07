package gov.va.hmp.hub;

import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcHostResolver;
import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class VistaAccountRpcHostResolver implements RpcHostResolver {
    public RpcHost resolve(String vistaId) {
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaId(vistaId);
        if (accounts == null || accounts.isEmpty()) throw new VistaIdNotFoundException(vistaId);
        return new RpcHost(accounts.get(0).getHost(), accounts.get(0).getPort());
    }

    public IVistaAccountDao getVistaAccountDao() {
        return vistaAccountDao;
    }

    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    private IVistaAccountDao vistaAccountDao;
}
