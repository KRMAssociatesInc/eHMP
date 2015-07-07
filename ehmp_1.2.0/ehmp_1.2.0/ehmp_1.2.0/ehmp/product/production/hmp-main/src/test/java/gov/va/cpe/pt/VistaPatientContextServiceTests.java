package gov.va.cpe.pt;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.param.ParamService.SAVE_PARAM_BY_UID_COMMAND;
import static gov.va.cpe.pt.ThreadLocalPatientContext.PATIENT_CONTEXT_USER_PREF_KEY;
import static gov.va.cpe.pt.VistaPatientContextService.GET_PATIENT_CHECKS_COMMAND;
import static gov.va.cpe.pt.VistaPatientContextService.GET_PATIENT_DEMOGRAPHICS_COMMAND;
import static gov.va.cpe.vpr.UserInterfaceRpcConstants.CONTROLLER_CHAIN_RPC_URI;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

public class VistaPatientContextServiceTests {

    private VistaPatientContextService s;

    private RpcOperations mockRpcTemplate;
    private IParamService mockParamService;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = mock(RpcOperations.class);
        mockParamService = mock(IParamService.class);

        s = new VistaPatientContextService();
        s.setRpcTemplate(mockRpcTemplate);
        s.setParamService(mockParamService);
    }

    @Test
    public void testFetchVistaPatientContextInfo() throws Exception {
        JsonNode json = POMUtils.parseJSONtoNode(getClass().getResourceAsStream("vistaPatientContextInfo.json"));
        when(mockRpcTemplate.executeForJson(eq(CONTROLLER_CHAIN_RPC_URI), anyMap())).thenReturn(json);

        VistaPatientContextInfo info = s.fetchVistaPatientContextInfo(PidUtils.getPid("ABCD", "229"), false);

        assertThat(info.getPatientDemographics().getFullName(), is("AVIVAPATIENT,TWENTYFOUR"));
        assertThat(info.getAdditionalPatientDemographics().getRoomBed(), is("3C-4"));
        assertThat(info.getAdditionalPatientDemographics().getInpatientLocation(), is("ONCOLOGY"));
        assertThat(info.getPatientChecks().getSensitive().isLogAccess(), is(true));
        assertThat(info.getPatientChecks().getSensitive().isMayAccess(), is(true));
        assertThat(info.getPatientChecks().getSensitive().getText(), Matchers.containsString("RESTRICTED"));
        assertThat(info.getPatientChecks().getPatientRecordFlags(), hasSize(1));
        assertThat(info.getPatientChecks().getPatientRecordFlags().get(0).getName(), is("HIGH RISK FOR SUICIDE"));

        verifyZeroInteractions(mockParamService);

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForJson(eq(CONTROLLER_CHAIN_RPC_URI), rpcArg.capture());

        assertThat((Map<String, Object>) rpcArg.getValue(), hasKey("commandList"));
        List<Map<String, String>> commands = (List<Map<String, String>>) rpcArg.getValue().get("commandList");
        assertThat(commands, hasSize(2));

        assertThat(commands.get(0), hasEntry("command", GET_PATIENT_DEMOGRAPHICS_COMMAND));
        assertThat(commands.get(0), hasEntry("patientId", "229"));

        assertThat(commands.get(1), hasEntry("command", GET_PATIENT_CHECKS_COMMAND));
        assertThat(commands.get(1), hasEntry("patientId", "229"));
    }

    @Test
    public void testFetchVistaPatientContextInfoAndSavePatientAsUserParam() throws Exception {
        Map userPrefs = new HashMap();
        userPrefs.put(PATIENT_CONTEXT_USER_PREF_KEY, PidUtils.getPid("ABCD", "301"));
        String mockUserPrefUid = "foo";

        when(mockParamService.getUserPreferences()).thenReturn(userPrefs);
        when(mockParamService.getUserPreferencesParamUid()).thenReturn(mockUserPrefUid);

        JsonNode json = POMUtils.parseJSONtoNode(getClass().getResourceAsStream("vistaPatientContextInfoWithSave.json"));
        when(mockRpcTemplate.executeForJson(eq(CONTROLLER_CHAIN_RPC_URI), anyMap())).thenReturn(json);

        VistaPatientContextInfo info = s.fetchVistaPatientContextInfo(PidUtils.getPid("ABCD", "301"), true);

        verify(mockParamService).getUserPreferences();
        verify(mockParamService).getUserPreferencesParamUid();

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForJson(eq(CONTROLLER_CHAIN_RPC_URI), rpcArg.capture());

        assertThat((Map<String, Object>) rpcArg.getValue(), hasKey("commandList"));
        List<Map<String, String>> commands = (List<Map<String, String>>) rpcArg.getValue().get("commandList");
        assertThat(commands, hasSize(3));

        assertThat(commands.get(0), hasEntry("command", GET_PATIENT_DEMOGRAPHICS_COMMAND));
        assertThat(commands.get(0), hasEntry("patientId", "301"));

        assertThat(commands.get(1), hasEntry("command", GET_PATIENT_CHECKS_COMMAND));
        assertThat(commands.get(1), hasEntry("patientId", "301"));

        assertThat(commands.get(2), hasEntry("command", SAVE_PARAM_BY_UID_COMMAND));
        assertThat(commands.get(2), hasEntry("uid", mockUserPrefUid));
        assertThat(commands.get(2), hasEntry("value", VistaStringUtils.splitLargeStringIfNecessary(POMUtils.toJSON(userPrefs))));
    }
}
