package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.vista.rpc.RpcRequest;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class MapToVistaDataChunkTests {
    private PatientDemographics patient;
    private IPatientDAO patientDao;
    private MapToVistaDataChunk converter;
    private Map<String, Object> m;

    @Before
    public void setUp() {
        patient = new PatientDemographics();
        patient.setData("pid", "42");
        patient.setData("icn", "12345");

        patientDao = mock(IPatientDAO.class);

        converter = new MapToVistaDataChunk();
        converter.setPatientDao(patientDao);

        m = new HashMap<String, Object>();
        m.put(VISTA_ID, "ABCDEF");
        m.put(PATIENT_DFN, "229");
        m.put(PATIENT_ID, "42");
        m.put(RPC_URI, new RpcRequest("FOO/BAR", "arg1", "arg2").toString());
        m.put(RPC_ITEM_INDEX, 7);
        m.put(RPC_ITEM_COUNT, 9);
        m.put("foo", "bar");
        m.put("baz", "spaz");
        m.put(DOMAIN, "foo");
        m.put(IS_BATCH, false);

        when(patientDao.findByPid(anyString())).thenReturn(patient);
    }

    @Test
    public void testConvertJson() throws SAXException, IOException {
        String jsonString = "{\"foo\":\"bar\"}";
        m.put(RPC_ITEM_CONTENT, jsonString);

        VistaDataChunk chunk = converter.convert(m);
        assertNotNull(chunk);
        assertThat(chunk.getSystemId(), equalTo(m.get(VISTA_ID)));
        assertThat(chunk.getPatientId(), equalTo("42"));
        assertThat(chunk.getRpcUri(), equalTo(m.get(RPC_URI)));
        assertThat(chunk.getItemIndex(), equalTo((Integer) m.get(RPC_ITEM_INDEX)));
        assertThat(chunk.getItemCount(), equalTo((Integer) m.get(RPC_ITEM_COUNT)));
        assertThat(chunk.getDomain(), equalTo(m.get(DOMAIN)));
        assertThat(chunk.isBatch(), equalTo((Boolean) m.get(IS_BATCH)));

        Map<String, String> map = new HashMap<String, String>();
        map.put("foo", "bar");
        map.put("baz", "spaz");
        assertTrue(chunk.getParams().equals(map));
        assertThat(chunk.getContent(), is(jsonString));
    }

}
