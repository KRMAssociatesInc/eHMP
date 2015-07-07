package gov.va.hmp.ptselect;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.hasKey;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class PatientSelectControllerTests {

    private IPatientSelectService mockPtSelectService;
    private PatientSelectController controller;
    private PatientSelectsAndMetadata mockPatients;
    private Pageable mockPageable = new PageRequest(0, 100);

    @Before
    public void setUp() throws Exception {
        Map<String, Object> pt1 = new HashMap<String, Object>();
        pt1.put("pid", "129");
        pt1.put("sensitive", false);
        pt1.put("birthDate", new PointInTime(1957, 10, 4));
        pt1.put("ssn", "987654321");

        Map<String, Object> pt2 = new HashMap<String, Object>();
        pt2.put("pid", "229");
        pt2.put("sensitive", true);
        pt2.put("birthDate", new PointInTime(1969, 7, 20));
        pt2.put("ssn", "123456789");

        List<PatientSelect> ptList = new ArrayList<>();
        ptList.add(new PatientSelect(pt1));
        ptList.add(new PatientSelect(pt2));
        mockPatients = new PatientSelectsAndMetadata("mockSourceName", "mockSourceType", "mockSort", new PageImpl<>(ptList));

        mockPtSelectService = mock(IPatientSelectService.class);
        controller = new PatientSelectController();
        controller.setPatientSelectService(mockPtSelectService);
    }

    @Test
    public void testFetchWardList() throws Exception {
        List<Map<String, Object>> mockWards = createListOfMaps("129", "7A SURG", "229", "GEN MED");

        PageRequest pageRequest = new PageRequest(0, 5);
        when(mockPtSelectService.searchWards("abc", pageRequest)).thenReturn(new PageImpl(mockWards, pageRequest, 23));

        ModelAndView mav = controller.fetchWardList("v1", "abc", pageRequest, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<Map<String, Object>> jsonc = (JsonCCollection<Map<String, Object>>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getTotalItems(), is(23));
        assertThat(jsonc.getCurrentItemCount(), is(2));

        verify(mockPtSelectService).searchWards("abc", pageRequest);
    }

    @Test
    public void testFetchClinicList() throws Exception {
        List<Map<String, Object>> mockClinics = createListOfMaps("129", "10TH FLOOR", "229", "PRIMARY CARE");

        PageRequest pageRequest = new PageRequest(0, 5);
        when(mockPtSelectService.searchClinics("bcd", pageRequest)).thenReturn(new PageImpl(mockClinics, pageRequest, 23));

        ModelAndView mav = controller.fetchClinicList("v1", "bcd", pageRequest, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<Map<String, Object>> jsonc = (JsonCCollection<Map<String, Object>>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getTotalItems(), is(23));
        assertThat(jsonc.getCurrentItemCount(), is(2));

        verify(mockPtSelectService).searchClinics("bcd", pageRequest);
    }

    @Test
    public void testFetchSpecialtyList() throws Exception {
        List<Map<String, Object>> mockSpecialties = createListOfMaps("129", "BLIND REHAB", "229", "CARDIOLOGY");

        PageRequest pageRequest = new PageRequest(0, 5);
        when(mockPtSelectService.searchSpecialties("cde", pageRequest)).thenReturn(new PageImpl(mockSpecialties, pageRequest, 23));

        ModelAndView mav = controller.fetchSpecialtyList("v1", "cde", pageRequest, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<Map<String, Object>> jsonc = (JsonCCollection<Map<String, Object>>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getTotalItems(), is(23));
        assertThat(jsonc.getCurrentItemCount(), is(2));

        verify(mockPtSelectService).searchSpecialties("cde", pageRequest);
    }

    @Test
    public void testFetchProviderList() throws Exception {
        List<Map<String, Object>> mockProviders = createListOfMaps("129", "AVIVAUSER,THIRTYTHREE", "229", "PHARMACIST,ONE");

        PageRequest pageRequest = new PageRequest(0, 5);
        when(mockPtSelectService.searchProviders("def", pageRequest)).thenReturn(new PageImpl<>(mockProviders, pageRequest, 23));

        ModelAndView mav = controller.fetchProviderList("v1", "def", pageRequest, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<Map<String, Object>> jsonc = (JsonCCollection<Map<String, Object>>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getTotalItems(), is(23));
        assertThat(jsonc.getCurrentItemCount(), is(2));

        verify(mockPtSelectService).searchProviders("def", pageRequest);
    }

    @Test
    public void testSearchPatients() throws Exception {
        when(mockPtSelectService.searchPatients("abcd", mockPageable)).thenReturn(mockPatients.getPatients());

        ModelAndView mav = controller.searchPatients("v1", "abcd", mockPageable, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<PatientSelect> jsonc = (JsonCCollection<PatientSelect>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertMockPatientsInResponseAndSensitvePatientsScreened(jsonc);
        assertThat(jsonc.getAdditionalData(), not(hasKey("sourceName")));
        assertThat(jsonc.getAdditionalData(), not(hasKey("sourceType")));
        assertThat(jsonc.getAdditionalData(), not(hasKey("sort")));

        verify(mockPtSelectService).searchPatients("abcd", mockPageable);
    }

    @Test
    public void testSearchPatientsInWard() throws Exception {
        when(mockPtSelectService.searchPatientsInWard("abcd", "34", mockPageable)).thenReturn(mockPatients);

        ModelAndView mav = controller.searchPatientsInWard("v1", "abcd", "34", mockPageable, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<PatientSelect> jsonc = (JsonCCollection<PatientSelect>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertMockPatientsInResponseAndSensitvePatientsScreened(jsonc);
        assertMockListMetadata(jsonc);

        verify(mockPtSelectService).searchPatientsInWard("abcd", "34", mockPageable);
    }

    @Test
    public void testSearchPatientsInClinic() throws Exception {
        when(mockPtSelectService.searchPatientsInClinic("abcd", "37", "T-1m..T", mockPageable)).thenReturn(mockPatients);

        ModelAndView mav = controller.searchPatientsInClinic("v1", "abcd", "37", "T-1m..T", mockPageable, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<PatientSelect> jsonc = (JsonCCollection<PatientSelect>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertMockPatientsInResponseAndSensitvePatientsScreened(jsonc);
        assertMockListMetadata(jsonc);

        verify(mockPtSelectService).searchPatientsInClinic("abcd", "37", "T-1m..T", mockPageable);
    }

    @Test
    public void testSearchPatientsByProvider() throws Exception {
        when(mockPtSelectService.searchPatientsByProvider("abcd", "37", mockPageable)).thenReturn(mockPatients);

        ModelAndView mav = controller.searchPatientsByProvider("v1", "abcd", "37", mockPageable, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<PatientSelect> jsonc = (JsonCCollection<PatientSelect>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertMockPatientsInResponseAndSensitvePatientsScreened(jsonc);
        assertMockListMetadata(jsonc);

        verify(mockPtSelectService).searchPatientsByProvider("abcd", "37", mockPageable);
    }

    @Test
    public void testSearchPatientsInSpecialty() throws Exception {
        when(mockPtSelectService.searchPatientsInSpecialty("abcd", "42", mockPageable)).thenReturn(mockPatients);

        ModelAndView mav = controller.searchPatientsInSpecialty("v1", "abcd", "42", mockPageable, new MockHttpServletRequest());
        assertJsonCResponse(mav);

        JsonCCollection<PatientSelect> jsonc = (JsonCCollection<PatientSelect>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertMockPatientsInResponseAndSensitvePatientsScreened(jsonc);
        assertMockListMetadata(jsonc);

        verify(mockPtSelectService).searchPatientsInSpecialty("abcd", "42", mockPageable);
    }

    private void assertJsonCResponse(ModelAndView mav) {
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), instanceOf(JsonCCollection.class));
    }

    private List<Map<String, Object>> createListOfMaps(String id1, String name1, String id2, String name2) {
        Map<String, Object> obj1 = new HashMap<String, Object>();
        obj1.put("id", id1);
        obj1.put("name", name1);

        Map<String, Object> obj2 = new HashMap<String, Object>();
        obj2.put("id", id2);
        obj2.put("name", name2);

        List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
        items.add(obj1);
        items.add(obj2);

        return items;
    }

    private void assertMockPatientsInResponseAndSensitvePatientsScreened(JsonCCollection<PatientSelect> jsonc) {
        assertThat(jsonc.getTotalItems(), is(2));
        assertThat(jsonc.getItems().get(0).getPid(), is("129"));
        assertThat(jsonc.getItems().get(0).isSensitive(), is(false));
        assertThat(jsonc.getItems().get(0).getBirthDate(), is(new PointInTime(1957, 10, 4)));
        assertThat(jsonc.getItems().get(0).getSsn(), is("987654321"));

        assertThat(jsonc.getItems().get(1).getPid(), is("229"));
        assertThat(jsonc.getItems().get(1).isSensitive(), is(true));
        assertThat(jsonc.getItems().get(1).getBirthDate(), is(nullValue()));
        assertThat(jsonc.getItems().get(1).getSsn(), is(nullValue()));
    }

    private void assertMockListMetadata(JsonCCollection<PatientSelect> jsonc) {
        assertThat((String) jsonc.getAdditionalData().get("defaultPatientListSourceName"), is("mockSourceName"));
        assertThat((String) jsonc.getAdditionalData().get("defaultPatientListSourceType"), is("mockSourceType"));
        assertThat((String) jsonc.getAdditionalData().get("defaultPatientListSourceSort"), is("mockSort"));
    }
}
