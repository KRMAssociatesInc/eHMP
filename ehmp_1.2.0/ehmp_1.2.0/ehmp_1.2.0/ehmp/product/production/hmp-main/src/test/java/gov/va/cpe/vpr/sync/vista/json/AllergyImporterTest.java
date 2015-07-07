package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.AllergyProduct;
import gov.va.cpe.vpr.AllergyReaction;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.codehaus.groovy.runtime.DefaultGroovyMethods;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class AllergyImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getAllergyResourceAsStream(), mockPatient, "allergy");

        Allergy a = (Allergy) importer.convert(chunk);

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));

        assertThat(a.getFacilityCode(), is(equalTo("500")));
        assertThat(a.getFacilityName(), is(equalTo("CAMP MASTER")));

        assertThat(a.getUid(), is(equalTo(UidUtils.getAllergyUid(MockVistaDataChunks.VISTA_ID, "100846", "982"))));
        assertThat(a.getLocalId(), is(equalTo("982")));
        assertThat(a.getMechanism(), is(equalTo("DRUG OTHER")));
        assertThat(a.getEntered(), is(new PointInTime(2011, 11, 22, 13, 43)));
        assertThat(a.getVerified(), is(new PointInTime(2011, 11, 22, 13, 43, 43)));
        assertThat(a.getSeverityName(), is(nullValue()));
        assertThat(a.getSeverityCode(), is(nullValue()));
        assertThat(a.getHistorical(), is(true));
        assertThat(a.getReference(), is(equalTo("219;PSNDF(50.6,")));

        assertThat(a.getProducts().size(), equalTo(1));
        AllergyProduct p = DefaultGroovyMethods.asType(DefaultGroovyMethods.toList(a.getProducts()).get(0), AllergyProduct.class);
        assertThat(p.getName(), is(equalTo("DIPHENHYDRAMINE")));
        assertThat(p.getVuid(), is(equalTo("urn:va:vuid:4019724")));
        assertThat(p.getCode(), is(nullValue()));

        Assert.assertEquals(1, a.getReactions().size());
        AllergyReaction r = DefaultGroovyMethods.asType(DefaultGroovyMethods.toList(a.getReactions()).get(0), AllergyReaction.class);
        Assert.assertEquals("ANXIETY", r.getName());
        assertThat(r.getVuid(), is("urn:va:vuid:4637050"));
        assertThat(r.getCode(), is(nullValue()));
    }

    public static InputStream getAllergyResourceAsStream() {
        return AllergyImporterTest.class.getResourceAsStream("allergy.json");
    }
}
