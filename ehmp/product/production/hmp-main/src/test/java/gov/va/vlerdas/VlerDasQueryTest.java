package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 */
public class VlerDasQueryTest {

    private static final VlerDasDomain TEST_DOMAIN = VlerDasDomain.VITALS;
    private static final String TEST_ICN = "icn123";

    private VlerDasQuery query;

    @Before
    public void setUp() {
        PatientIds ids = new PatientIds(new PatientIds.Builder().icn(TEST_ICN));
        query = new VlerDasQuery(ids, TEST_DOMAIN);
    }

    @Test
    public void testUrl() {
        Assert.assertEquals(TEST_ICN, query.getPatientIds().getIcn());

        String differentIcn = "differentId";
        PatientIds differentIds = new PatientIds.Builder().icn(differentIcn).build();

        query.setPatientIds(differentIds);

        Assert.assertEquals(differentIcn, query.getPatientIds().getIcn());
    }

    @Test
    public void testDomain() {
        Assert.assertEquals(TEST_DOMAIN, query.getDomain());

        VlerDasDomain differentDomain = VlerDasDomain.VITALS;
        query.setDomain(differentDomain);

        Assert.assertEquals(differentDomain, query.getDomain());
    }
}
