package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.Diagnosis;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.view.StringView;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_PUT_PATIENT_DATA_URI;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class DiagnosisControllerTests {

    private DiagnosisController controller;
    private UserContext mockUserContext;
    private HmpUserDetails mockUser;
    private IPatientDAO mockPatientDao;
    private RpcOperations mockRpcTemplate;
    private IGenericPatientObjectDAO mockPatientObjectDao;

    @Before
    public void setUp() throws Exception {
        mockUser = mock(HmpUserDetails.class);
        mockUserContext = mock(UserContext.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
        mockPatientDao = mock(IPatientDAO.class);
        mockRpcTemplate = mock(RpcOperations.class);
        mockPatientObjectDao = mock(IGenericPatientObjectDAO.class);

        controller = new DiagnosisController();
        controller.setUserContext(mockUserContext);
        controller.setPatientDao(mockPatientDao);
        controller.setRpcTemplate(mockRpcTemplate);
        controller.setGenericJdsDAO(mockPatientObjectDao);

        when(mockUser.getVistaId()).thenReturn("ABCD");
        when(mockUser.getDisplayName()).thenReturn("Monkey Fitzpatrick");
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "42"));
        when(mockUser.getDivision()).thenReturn("500");
        when(mockUser.getDivisionName()).thenReturn("CAMP MASTER");
    }

    @Test
    public void testAddTask() throws Exception {
        PatientDemographics mockPt = MockPatientUtils.create("23", "10104", "ABCD", "229");
        when(mockPatientDao.findByPid("23")).thenReturn(mockPt);

        when(mockRpcTemplate.executeForString(eq(VPR_PUT_PATIENT_DATA_URI), eq("229"), eq("diagnosis"), anyString())).thenReturn("{\"success\":true}");

        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        ModelAndView mav = controller.postAddTask("23", "urn:va:foo:ABCD:23", "Schnobb", mockRequest);
        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));

        ArgumentCaptor<List> jsonRpcArg = ArgumentCaptor.forClass(List.class);
        verify(mockRpcTemplate).executeForString(eq(VPR_PUT_PATIENT_DATA_URI), eq("229"), eq("diagnosis"), jsonRpcArg.capture());

        JsonNode json = POMUtils.parseJSONtoNode(StringUtils.collectionToDelimitedString(jsonRpcArg.getValue(), ""));
        assertThat(json.get("pid").asText(), is("23"));
        assertThat(json.get("uid").asText(), is("urn:va:foo:ABCD:23"));
        assertThat(json.get("diagnosis").asText(), is("Schnobb"));
        assertThat(json.get("ownerCode").asText(), is(mockUser.getUid()));
        assertThat(json.get("ownerName").asText(), is(mockUser.getDisplayName()));
        assertThat(json.get("assignToName").asText(), is(mockUser.getDisplayName()));
        assertThat(json.get("assignToCode").asText(), is(mockUser.getUid()));
        assertThat(json.get("facilityCode").asText(), is("500"));
        assertThat(json.get("facilityName").asText(), is("CAMP MASTER"));

        Diagnosis expectedDiagnosis = POMUtils.newInstance(Diagnosis.class, json);
        ArgumentCaptor<Diagnosis> diagnosis = ArgumentCaptor.forClass(Diagnosis.class);
        verify(mockPatientObjectDao).save(diagnosis.capture());
        assertThat(diagnosis.getValue().getPid(), is(expectedDiagnosis.getPid()));
        assertThat(diagnosis.getValue().getUid(), is(expectedDiagnosis.getUid()));
        assertThat(diagnosis.getValue().getDiagnosis(), is(expectedDiagnosis.getDiagnosis()));
        assertThat(diagnosis.getValue().getOwnerCode(), is(expectedDiagnosis.getOwnerCode()));
        assertThat(diagnosis.getValue().getOwnerName(), is(expectedDiagnosis.getOwnerName()));
        assertThat(diagnosis.getValue().getAssignToName(), is(expectedDiagnosis.getAssignToName()));
        assertThat(diagnosis.getValue().getAssignToCode(), is(expectedDiagnosis.getAssignToCode()));
        assertThat(diagnosis.getValue().getFacilityCode(), is(expectedDiagnosis.getFacilityCode()));
        assertThat(diagnosis.getValue().getFacilityName(), is(expectedDiagnosis.getFacilityName()));
    }

    @Test(expected = PatientNotFoundException.class)
    public void testAddTaskPatientNotFound() throws Exception {
        when(mockPatientDao.findByPid("23")).thenReturn(null);

        MockHttpServletRequest mockRequest = new MockHttpServletRequest();

        controller.postAddTask("23", "urn:va:foo:ABCD:23", "Wobb", mockRequest);
    }
}
