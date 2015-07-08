package gov.va.cpe.vpr.sync.vista;

import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.VistaAccountNotFoundException;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.CredentialsProvider;
import gov.va.hmp.vista.rpc.RpcHost;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.util.StringUtils;

import java.util.List;

class SynchronizationCredentialsProvider implements CredentialsProvider {

    private IVistaAccountDao vistaAccountDao;

    @Required
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Override
    public String getCredentials(RpcHost host, String userInfo) {
        List<VistaAccount> accounts = vistaAccountDao.findAllByHostAndPort(host.getHostname(), host.getPort());
        if (accounts == null || accounts.isEmpty()) throw new VistaAccountNotFoundException(host);

        // use the first one
        VistaAccount account = accounts.get(0);

        String systemId = account.getVistaId();

        if (!StringUtils.hasText(account.getVprUserCredentials())) {
            throw new SynchronizationCredentialsNotFoundException(account);
        }

        return account.getVprUserCredentials();
    }
}