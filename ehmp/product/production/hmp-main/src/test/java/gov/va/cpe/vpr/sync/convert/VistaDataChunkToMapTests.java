package gov.va.cpe.vpr.sync.convert;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.vista.rpc.RpcRequest;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class VistaDataChunkToMapTests {
    private VistaDataChunkToMap converter;
    private VistaDataChunk chunk;

    @Before
    public void setUp() throws Exception {
        converter = new VistaDataChunkToMap();

        PatientDemographics pt = new PatientDemographics();
        pt.setData("icn", "12345");
        pt.setData("pid", "42");

        Map params = new HashMap();
        params.put("foo", "bar");
        params.put("baz", "spaz");

        chunk = new VistaDataChunk();
        chunk.setItemIndex(7);
        chunk.setItemCount(9);
        chunk.setSystemId("ABCDEF");
        chunk.setLocalPatientId("229");
        chunk.setRpcUri(new RpcRequest("FOO/BAR", Arrays.asList("arg1", "arg2")).toString());
        chunk.setParams(params);

        chunk.setDomain("foo");
        chunk.setJson(new ObjectMapper().readTree("{\"foo\":\"bar\"}"));
    }

    @Test
    public void testConvertJson(){
        Map<String, Object> m = converter.convert(chunk);

        assertThat(m, not(nullValue()));
        assertThat((String) m.get(VISTA_ID), is(chunk.getSystemId()));
        assertThat((String) m.get(PATIENT_DFN), is(chunk.getLocalPatientId()));
        assertThat((String) m.get(PATIENT_ID), is(chunk.getPatientId()));

        assertThat((String) m.get(RPC_URI), is(chunk.getRpcUri()));
        assertThat((Integer) m.get(RPC_ITEM_INDEX), is(chunk.getItemIndex()));
        assertThat((Integer) m.get(RPC_ITEM_COUNT), is(chunk.getItemCount()));
        assertThat((String) m.get(RPC_ITEM_CONTENT), is(chunk.getContent()));

        assertThat((String) m.get(DOMAIN), is(chunk.getDomain()));

        assertThat((Boolean) m.get(IS_BATCH), is(chunk.isBatch()));
    }
}
