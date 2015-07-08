package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.PatientDemographics;
import org.hamcrest.CoreMatchers;
import org.junit.Test;

import java.util.Collections;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class VistaDataChunkTests {
    @Test
    public void testSetPatient() throws Exception {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "23");

        VistaDataChunk c = new VistaDataChunk();
        c.setPatientId(pt.getPid());

        assertThat(c.getPatientId(), is(pt.getPid()));
    }

    @Test
    public void testCreate() throws Exception {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "23");

        VistaDataChunk c = VistaDataChunk.createVistaDataChunk("ABCD", "/FOO/BAR?baz=spaz", new ObjectMapper().readTree("{\"foo\":\"bar\"}"), "foo", 4, 5, pt, Collections.EMPTY_MAP);

        assertThat(c.getSystemId(), is("ABCD"));
        assertThat(c.getPatientId(), is(pt.getPid()));
        assertThat(c.getItemIndex(), is(4));
        assertThat(c.getItemCount(), is(5));
        assertThat(c.isBatch(), is(false));

        c = VistaDataChunk.createVistaDataChunk("EFGH", "/FOO/BAR?baz=spaz", new ObjectMapper().readTree("{\"foo\":\"bar\"}"), "foo", 32, 167, pt, Collections.EMPTY_MAP, true);

        assertThat(c.getSystemId(), is("EFGH"));
        assertThat(c.getPatientId(), is(pt.getPid()));
        assertThat(c.getItemIndex(), is(32));
        assertThat(c.getItemCount(), is(167));
        assertThat(c.isBatch(), is(true));
    }

    @Test
    public void testSetContentWithJson() throws Exception {
        String jString = "{\"foo\":\"bar\"}";
        JsonNode jNode = new ObjectMapper().readTree(jString);
        VistaDataChunk chunk = new VistaDataChunk();
        chunk.setDomain("baz");
        chunk.setJson(jNode);

        assertThat(chunk.getContent(), is(jString));
        assertThat(chunk.getDomain(), is("baz"));
    }

    @Test
    public void testGetJsonMap() throws Exception {
        String jsonString = "{\"foo\":\"bar\"}";
        VistaDataChunk chunk = new VistaDataChunk();
        chunk.setJson(new ObjectMapper().readTree(jsonString));

        assertThat(chunk.getContent(), is(jsonString));
        assertThat(chunk.getDomain(), CoreMatchers.nullValue());
        assertThat(chunk.getJsonMap(), CoreMatchers.equalTo(new ObjectMapper().readValue(jsonString, Map.class)));
    }

}
