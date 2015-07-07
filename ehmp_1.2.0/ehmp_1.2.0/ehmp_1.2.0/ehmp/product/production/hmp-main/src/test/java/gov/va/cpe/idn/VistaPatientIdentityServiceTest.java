package gov.va.cpe.idn;

import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.json.JsonVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertNull;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VistaPatientIdentityServiceTest
{
    private VistaPatientIdentityService vistaPatientIdentityService;
    private RpcTemplate mockRpcTemplate;
    private RpcResponse mockRpcResponse;
    private JsonVistaAccountDao mockVistaAccountDao;
    private VistaAccount mockVistaAccount;

    @Before
    public void setup() {

        mockVistaAccount = mock(VistaAccount.class);
        when(mockVistaAccount.getDivision()).thenReturn("500");
        mockVistaAccountDao = mock(JsonVistaAccountDao.class);
        when(mockVistaAccountDao.findAllByVistaId(any(String.class))).thenReturn(Arrays.asList(mockVistaAccount));

        mockRpcResponse = mock(RpcResponse.class);

        mockRpcTemplate = mock(RpcTemplate.class);
        when(mockRpcTemplate.execute(any(RpcRequest.class))).thenReturn(mockRpcResponse);

        vistaPatientIdentityService = new VistaPatientIdentityService();
        vistaPatientIdentityService.setSynchronizationRpcTemplate(mockRpcTemplate);
        vistaPatientIdentityService.setVistaAccountDao(mockVistaAccountDao);

    }

    private List<String> toLinesList(String rpcResponse) {
        return Arrays.asList(rpcResponse.split("\r\n"));
    }

    @Test
    public void testGetPatientIdsQueryWithDfn() {

        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("1008520438V882204^NI^USVHA^200M\r\n852043888^NI^USDOD^200DOD^A\r\n"));

        String vistaId = "9E7A";
        String pid = "9E7A;7168937";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is(pid));
    }

    @Test
    public void testGetPatientIdsQueryWithDfnMissingEdipi() {
        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("1008520438V882204^NI^USVHA^200M\r\n7168937^PI^USVHA^500^A\r\n"));

        String vistaId = "9E7A";
        String pid = "9E7A;7168937";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertNull(patientIds.getEdipi());
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is(pid));
    }

    @Test
    public void testGetPatientIdsQueryWithDfnMissingIcn() {

        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("-1^NO ICN^NI^USVHA^200M^A\r\n7168937^PI^USVHA^500^A\r\n852043888^NI^USDOD^200DOD^A\r\n"));

        String vistaId = "9E7A";
        String pid = "9E7A;7168937";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertNull(patientIds.getIcn());
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:7168937"));
        assertThat(patientIds.getPid(), is(pid));
    }

    @Test
    public void testGetPatientIdsQueryWithDfnMissingDfn() {

        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("1008520438V882204^NI^USVHA^200M^A\r\n852043888^NI^USDOD^200DOD^A\r\n"));

        String vistaId = "9E7A";
        String pid = "9E7A;7168937";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is(pid));
    }

    @Test
    public void testGetPatientIdentifiersQueryWithIcn() {

        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("7168937^PI^USVHA^500^A\r\n852043888^NI^USDOD^200DOD^A\r\n"));

        String vistaId = "9E7A";
        String pid = "1008520438V882204";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is("1008520438V882204"));
    }

    @Test
    public void testGetPatientIdentifiersQueryWithIcnMissingIdStatus() {

        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("7168937^PI^USVHA^500^\r\n852043888^NI^USDOD^200DOD^\r\n"));

        String vistaId = "9E7A";
        String pid = "1008520438V882204";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is("1008520438V882204"));
    }

    @Test
    public void testGetPatientIdentifiersQueryWithIcnMultipleDfn() {

        //merged & active dfns
        when(mockRpcResponse.toLinesList()).
                thenReturn(toLinesList("27^PI^USVHA^500^H\r\n7168937^PI^USVHA^500^A\r\n852043888^NI^USDOD^200DOD^A\r\n"));

        String vistaId = "9E7A";
        String pid = "1008520438V882204";

        PatientIds patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);

        assertNotNull(patientIds);
        assertThat(patientIds.getDfn(), is("7168937"));
        assertThat(patientIds.getIcn(), is("1008520438V882204"));
        assertThat(patientIds.getEdipi(), is("852043888"));
        assertThat(patientIds.getUid(), is("urn:va:patient:9E7A:7168937:1008520438V882204"));
        assertThat(patientIds.getPid(), is("1008520438V882204"));
    }


}
