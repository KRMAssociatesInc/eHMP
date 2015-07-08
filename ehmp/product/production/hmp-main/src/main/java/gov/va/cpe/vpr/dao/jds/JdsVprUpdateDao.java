package gov.va.cpe.vpr.dao.jds;

import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.pom.jds.JdsPOMObjectDAO;
import gov.va.cpe.vpr.sync.vista.VprUpdate;
import org.springframework.util.Assert;

public class JdsVprUpdateDao extends JdsPOMObjectDAO<VprUpdate> implements IVprUpdateDao {

    public JdsVprUpdateDao(IGenericPOMObjectDAO genericDao, JdsOperations jdsTemplate) {
        super(VprUpdate.class, genericDao, jdsTemplate);
    }

    @Override
    public VprUpdate findOneBySystemId(String systemId) {
        Assert.notNull(systemId, "[Assertion failed] - 'systemId' argument is required; it must not be null");

        return findOne("urn:va:vprupdate:" + systemId);
    }
}
