package gov.va.cpe.vpr.dao;

import gov.va.cpe.vpr.pom.IPOMObjectDAO;
import gov.va.cpe.vpr.sync.vista.VprUpdate;

public interface IVprUpdateDao extends IPOMObjectDAO<VprUpdate> {
    VprUpdate findOneBySystemId(String systemId);
}
