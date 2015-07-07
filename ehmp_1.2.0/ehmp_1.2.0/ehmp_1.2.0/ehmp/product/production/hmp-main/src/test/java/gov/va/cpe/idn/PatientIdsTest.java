package gov.va.cpe.idn;

import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class PatientIdsTest
{
    private String edipi = "test.edipi";
    private String dfn = "test.dfn";
    private String pid = "test.pid";
    private String icn = "test.icn";
    private String uid = "test.uid";

    @Test
    public void testBuilder() {

        PatientIds patientIds = new PatientIds.Builder()
                .edipi(edipi)
                .dfn(dfn)
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build();

        assertThat(patientIds.getEdipi(), is(edipi));
        assertThat(patientIds.getPid(), is(pid));
        assertThat(patientIds.getIcn(), is(icn));
        assertThat(patientIds.getUid(), is(uid));
    }

    @Test
    public void testPatientIdsConstructor()
    {
        PatientIds.Builder builder = new PatientIds.Builder()
                .edipi(edipi)
                .dfn(dfn)
                .pid(pid)
                .icn(icn)
                .uid(uid);

        PatientIds patientIds = new PatientIds(builder);

        assertThat(patientIds.getEdipi(), is(edipi));
        assertThat(patientIds.getPid(), is(pid));
        assertThat(patientIds.getIcn(), is(icn));
        assertThat(patientIds.getUid(), is(uid));
    }

    @Test
    public void testToString()
    {
        PatientIds patientIds = new PatientIds.Builder()
                .edipi(edipi)
                .dfn(dfn)
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build();

        assertThat(patientIds.toString(), is("pid: "+pid+" | dfn: "+dfn+" | icn: "+icn+" | uid: "+uid+" | edipi: "+edipi));
    }

}
