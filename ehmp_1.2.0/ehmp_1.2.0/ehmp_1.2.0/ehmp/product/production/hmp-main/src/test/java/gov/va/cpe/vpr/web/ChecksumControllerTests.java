package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.service.IChecksumService;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ChecksumControllerTests {

    private ChecksumController controller;
    private MockHttpServletRequest mockRequest;
    private IGenericPatientObjectDAO mockPatientObjectDao;
    private IVistaAccountDao mockVistaAccountDao;
    private IChecksumService mockChecksumService;
    private IVistaVprDataExtractEventStreamDAO mockVistaPatientDataService;
    private ISyncService mockSyncService;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockPatientObjectDao = mock(IGenericPatientObjectDAO.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        mockEnvironment = mock(Environment.class);
        mockChecksumService = mock(IChecksumService.class);
        mockSyncService = mock(ISyncService.class);
        mockVistaPatientDataService = mock(IVistaVprDataExtractEventStreamDAO.class);

        controller = new ChecksumController();
        controller.setGenericPatientObjectDao(mockPatientObjectDao);
        controller.setVistaAccountDao(mockVistaAccountDao);
        controller.setEnvironment(mockEnvironment);
        controller.setChecksumService(mockChecksumService);
        controller.setSyncService(mockSyncService);
        controller.setVistaPatientDataService(mockVistaPatientDataService);
    }

    @Test
    public void testAccounts() throws Exception {
        VistaAccount vista1 = new VistaAccount();
        vista1.setVistaId("ABCD");
        vista1.setName("Rub");
        VistaAccount vista2 = new VistaAccount();
        vista2.setVistaId("EFGH");
        vista2.setName("Dub");
        when(mockVistaAccountDao.findAllByVistaIdIsNotNull()).thenReturn(Arrays.asList(vista1, vista2));

        ModelAndView mav = controller.accounts(mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Map> jsonc = (JsonCCollection<Map>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getCurrentItemCount(), is(2));
        assertThat((String) jsonc.getItems().get(0).get("name"), is("Rub"));
        assertThat((String) jsonc.getItems().get(0).get("id"), is("ABCD"));
        assertThat((String) jsonc.getItems().get(1).get("name"), is("Dub"));
        assertThat((String) jsonc.getItems().get(1).get("id"), is("EFGH"));

        verify(mockVistaAccountDao).findAllByVistaIdIsNotNull();
    }

    @Test
    public void testPatients() throws Exception {
        PatientDemographics pt1 = MockPatientUtils.create("23", "10101", "ABCD", "229");
        PatientDemographics pt2 = MockPatientUtils.create("24", "10102", "ABCD", "230");
        when(mockPatientObjectDao.findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded")).thenReturn(Arrays.asList(pt1, pt2));

        mockRequest.setParameter("vistaId", "ABCD");
        ModelAndView mav = controller.patients(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Map> jsonc = (JsonCCollection<Map>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat((String) jsonc.getItems().get(0).get("name"), is(pt1.getFullName()));
        assertThat((String) jsonc.getItems().get(0).get("pid"), is(pt1.getPid()));
        assertThat((String) jsonc.getItems().get(0).get("dfn"), is(pt1.getLocalPatientIdForSystem("ABCD")));
        assertThat((String) jsonc.getItems().get(1).get("name"), is(pt2.getFullName()));
        assertThat((String) jsonc.getItems().get(1).get("pid"), is(pt2.getPid()));
        assertThat((String) jsonc.getItems().get(1).get("dfn"), is(pt2.getLocalPatientIdForSystem("ABCD")));

        verify(mockPatientObjectDao).findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded");
    }

    @Test
    public void testAllPatients() throws Exception {
        VistaAccount vista1 = new VistaAccount();
        vista1.setVistaId("ABCD");
        vista1.setName("Rub");
        VistaAccount vista2 = new VistaAccount();
        vista2.setVistaId("EFGH");
        vista2.setName("Dub");
        when(mockVistaAccountDao.findAllByVistaIdIsNotNull()).thenReturn(Arrays.asList(vista1, vista2));
        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn("FUBAR");

        PatientDemographics pt1 = MockPatientUtils.create("23", "10101", "ABCD", "229");
        pt1.setData("fullName", "Yo");
        PatientDemographics pt2 = MockPatientUtils.create("24", "10102", "ABCD", "230");
        pt2.setData("fullName", "Yope");
        when(mockPatientObjectDao.findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded")).thenReturn(Arrays.asList(pt1, pt2));

        ModelAndView mav = controller.getAllPatient(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        ArrayNode output = (ArrayNode) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(output.size(), is(2));
        assertThat(output.get(0).get("idValue").asText(), is("23:ABCD"));
        assertThat(output.get(0).get("pid").asText(), is("23"));
        assertThat(output.get(0).get("vistaId").asText(), is("ABCD"));
        assertThat(output.get(0).get("vistaAccount").asText(), is("Rub"));
        assertThat(output.get(0).get("patientName").asText(), is("Yo"));
        assertThat(output.get(0).get("dfn").asText(), is("229"));
        assertThat(output.get(0).get("server").asText(), is("FUBAR"));
        assertThat(output.get(1).get("idValue").asText(), is("24:ABCD"));
        assertThat(output.get(1).get("pid").asText(), is("24"));
        assertThat(output.get(1).get("vistaId").asText(), is("ABCD"));
        assertThat(output.get(1).get("vistaAccount").asText(), is("Rub"));
        assertThat(output.get(1).get("patientName").asText(), is("Yope"));
        assertThat(output.get(1).get("dfn").asText(), is("230"));
        assertThat(output.get(1).get("server").asText(), is("FUBAR"));
    }

    @Test
    public void testUpdateUid() throws Exception {
        VistaDataChunk extractItem = MockVistaDataChunks.createFromJson("{\"foo\":\"bar\"}","ABCD", "23", "foo");
        when(mockVistaPatientDataService.fetchOneByUid("ABCD", "42", "urn:va:foo:ABCD:23")).thenReturn(extractItem);
        ModelAndView mav = controller.updateUid("urn:va:foo:ABCD:23", "42", "ABCD");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((Boolean) mav.getModel().get("success"), is(true));
        verify(mockSyncService).sendImportVistaDataExtractItemMsg(extractItem);
    }

    @Test
    public void testSubmitChecksum() throws Exception {
        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn("FUBAR");
        ModelAndView mav = controller.submitChecksum("229", "101", "ABCD");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        verify(mockChecksumService).checkPatientData("101", "ABCD", "FUBAR", "1");
    }

    @Test
    public void testCheckChecksumStatus() throws Exception {
        ModelAndView mav = controller.checkChecksumStatus("foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        verify(mockChecksumService).fuPatientData("foo");
    }

    @Test
    public void testVistaChecksum() throws Exception {
        JsonNode mockChecksumJson = POMUtils.parseJSONtoNode("{\"foo\":\"bar\"}");
        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn("FUBAR");
        when(mockChecksumService.getVistaChecksum("229", "ABCD", "FUBAR")).thenReturn(mockChecksumJson);
        ModelAndView mav = controller.vistaChecksum("229", "ABCD");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((JsonNode) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), sameInstance(mockChecksumJson));
        verify(mockChecksumService).getVistaChecksum("229", "ABCD", "FUBAR");
    }

    @Test
    public void testJdsChecksum() throws Exception {
        JsonNode mockChecksumJson = POMUtils.parseJSONtoNode("{\"foo\":\"bar\"}");
        when(mockChecksumService.getJdsChecksum("101", "ABCD")).thenReturn(mockChecksumJson);
        ModelAndView mav = controller.jdsChecksum("101", "ABCD");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((JsonNode) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), sameInstance(mockChecksumJson));
        verify(mockChecksumService).getJdsChecksum("101", "ABCD");
    }
}
