package gov.va.hmp.hub.dao;

import gov.va.hmp.dao.HmpRepository;
import gov.va.hmp.hub.VistaAccount;

import java.util.List;

public interface IVistaAccountDao extends HmpRepository<VistaAccount, Integer> {
    VistaAccount findByDivisionHostAndPort(String division, String host, int port);
    List<String> findAllVistaIds();
    String getPrimaryVistaSystemId();
    List<VistaAccount> findAllByVistaId(String vistaId);
    List<VistaAccount> findAllByVistaIdIsNotNull();
    List<VistaAccount> findAllByHostAndPort(String host, int port);
}
