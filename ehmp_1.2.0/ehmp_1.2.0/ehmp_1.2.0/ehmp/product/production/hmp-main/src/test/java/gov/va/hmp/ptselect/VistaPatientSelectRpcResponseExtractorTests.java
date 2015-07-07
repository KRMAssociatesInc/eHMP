package gov.va.hmp.ptselect;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Test;
import org.springframework.util.StreamUtils;

import java.nio.charset.Charset;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class VistaPatientSelectRpcResponseExtractorTests {

    private VistaPatientSelectRpcResponseExtractor extractor = new VistaPatientSelectRpcResponseExtractor();

    @Test
    public void testDefaultPatientList() throws Exception {
        String cprsDefaultPatientsJson = StreamUtils.copyToString(getClass().getResourceAsStream("cprsDefaultList.json"), Charset.forName("UTF-8"));
        VistaPatientSelectsAndMetadata s = extractor.extractData(new RpcResponse(cprsDefaultPatientsJson));
        List<VistaPatientSelect> ptSelects = s.getPatients();
        assertThat(ptSelects, hasSize(8));

        assertThat(ptSelects.get(0).getPid(), is("F484;100851"));
        assertThat(ptSelects.get(0).getRoomBed(), is(nullValue()));
        assertThat(ptSelects.get(0).getPatientType(), is("Inpatient"));

        assertThat(ptSelects.get(7).getPid(), is("F484;8"));
        assertThat(ptSelects.get(7).getRoomBed(), is("A-1"));
        assertThat(ptSelects.get(7).getPatientType(), is("Inpatient"));

        assertThat(s.getDefaultPatientListSourceSort(), is("A"));
        assertThat(s.getDefaultPatientListSourceName(), is("AVIVA INPATIENTS"));
        assertThat(s.getDefaultPatientListSourceType(), is("T"));
    }

    @Test
    public void testClinicPatients() throws Exception {
        String clinicPatientsJson = StreamUtils.copyToString(getClass().getResourceAsStream("clinicPatients.json"), Charset.forName("UTF-8"));
        List<VistaPatientSelect> ptSelects = extractor.extractData(new RpcResponse(clinicPatientsJson)).getPatients();
        assertThat(ptSelects, hasSize(11));
        assertThat(ptSelects.get(0).getPid(), is("F484;8"));
        assertThat(ptSelects.get(0).getAppointment(), is(new PointInTime(2014,6,2,15,0)));
        assertThat(ptSelects.get(0).getPatientType(), is("Inpatient"));

        assertThat(ptSelects.get(10).getPid(), is("F484;100843"));
        assertThat(ptSelects.get(10).getAppointment(), is(new PointInTime(2014,6,3,8,0)));
        assertThat(ptSelects.get(10).getPatientType(), is("Outpatient"));
    }

    @Test
    public void testWardPatients() throws Exception {
        String wardPatientsJson = StreamUtils.copyToString(getClass().getResourceAsStream("wardPatients.json"), Charset.forName("UTF-8"));
        List<VistaPatientSelect> ptSelects = extractor.extractData(new RpcResponse(wardPatientsJson)).getPatients();

        assertThat(ptSelects, hasSize(15));
        assertThat(ptSelects.get(0).getPid(), is("F484;100736"));
        assertThat(ptSelects.get(0).getRoomBed(), is("712-B"));

        assertThat(ptSelects.get(14).getPid(), is("F484;100758"));
        assertThat(ptSelects.get(14).getRoomBed(), is("717-D"));
    }

    @Test
    public void testEmpty() throws Exception {
        VistaPatientSelectsAndMetadata s = extractor.extractData(new RpcResponse("{}"));
        assertThat(s.getPatients(), notNullValue());
        assertThat(s.getPatients(), hasSize(0));
        assertThat(s.getDefaultPatientListSourceSort(), nullValue());
        assertThat(s.getDefaultPatientListSourceName(), nullValue());
        assertThat(s.getDefaultPatientListSourceType(), nullValue());
    }
}
