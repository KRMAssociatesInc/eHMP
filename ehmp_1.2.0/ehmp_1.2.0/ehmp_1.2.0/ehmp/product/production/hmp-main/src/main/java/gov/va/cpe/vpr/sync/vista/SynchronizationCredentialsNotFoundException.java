package gov.va.cpe.vpr.sync.vista;

import gov.va.hmp.hub.VistaAccount;

public class SynchronizationCredentialsNotFoundException extends RuntimeException {
    public SynchronizationCredentialsNotFoundException(VistaAccount vistaAccount) {
        super("Credentials for the VPR synchronization user for the '" + vistaAccount.getName() + "' VistA system with id '" + vistaAccount.getVistaId() +"' and station number '" + vistaAccount.getDivision() + "' are not found. Please validate your VPR VistA configuration.");
    }
}
