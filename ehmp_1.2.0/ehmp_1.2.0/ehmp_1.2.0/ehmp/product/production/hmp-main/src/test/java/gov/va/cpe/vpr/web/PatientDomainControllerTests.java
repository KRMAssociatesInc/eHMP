package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.service.IDomainService;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class PatientDomainControllerTests {

    private PatientDomainController controller;
    private IDomainService mockDomainService;
    private IGenericPatientObjectDAO mockPatientObjectDao;
    private IVistaVprPatientObjectDao mockVistaVprPatientDao;
    private IPatientDAO mockPatientDao;

    @Before
    public void setUp() throws Exception {
        mockDomainService = mock(IDomainService.class);
        mockPatientObjectDao = mock(IGenericPatientObjectDAO.class);
        mockVistaVprPatientDao = mock(IVistaVprPatientObjectDao.class);
        mockPatientDao = mock(IPatientDAO.class);

        controller = new PatientDomainController();
        controller.setPatientDomainService(mockDomainService);
        controller.setGenericPatientRelatedDao(mockPatientObjectDao);
        controller.setVistaVprPatientObjectDao(mockVistaVprPatientDao);
        controller.setPatientDao(mockPatientDao);
    }

    @Test
    public void testList() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        IntervalOfTime dateRange = IntervalOfTime.forTheLast(1);
        PatientDemographics mockPt = MockPatientUtils.create("23");
        Pageable pageRequest = new PageRequest(0, 100);
        Foo foo1 = new Foo("fadfadf", false);
        foo1.setData("pid", "23");
        Page mockPage = new PageImpl(Arrays.asList(foo1), pageRequest, 3030);

        when(mockPatientDao.findByPid("23")).thenReturn(mockPt);
        when(mockDomainService.queryForPage(eq(mockPt), eq("foo"), eq(dateRange), eq("all"), anyMap(), eq(pageRequest))).thenReturn(mockPage);

        ModelAndView mav = controller.list("v1", "23", "foo", "all", dateRange, "json", pageRequest, mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        JsonCCollection<Foo> jsonc = (JsonCCollection<Foo>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.getStartIndex(), is(0));
        assertThat(jsonc.getItemsPerPage(), is(100));
        assertThat(jsonc.getTotalItems(), is(3030));
        assertThat(jsonc.getCurrentItemCount(), is(1));
        assertThat(jsonc.getItems().get(0).getPid(), is("23"));
        assertThat(jsonc.getItems().get(0).getBar(), is("fadfadf"));
        assertThat(jsonc.getItems().get(0).isBaz(), is(false));
    }

    @Test
    public void testGetForUID() throws Exception {
        Foo foo = new Foo();
        foo.setData("uid", "urn:va:foo:ABCD:1234");
        when(mockPatientObjectDao.findByUID("urn:va:foo:ABCD:1234")).thenReturn(foo);

        ModelAndView mav = controller.getForUID("urn:va:foo:ABCD:1234");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((Foo) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), sameInstance(foo));
    }

    @Test
    public void testPostObject() throws Exception {
        when(mockDomainService.getDomainClass("foo")).thenReturn(Foo.class);

        ModelAndView mav = controller.post("{\"bar\":\"spaz\",\"baz\":true}", "23", "foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<Map> saveArg = ArgumentCaptor.forClass(Map.class);
        verify(mockVistaVprPatientDao).save(eq(Foo.class), saveArg.capture());
        assertThat((String) saveArg.getValue().get("pid"), is("23"));
        assertThat((String) saveArg.getValue().get("bar"), is("spaz"));
        assertThat((Boolean) saveArg.getValue().get("baz"), is(true));
    }

    @Test
    public void testPostData() throws Exception {
        when(mockDomainService.getDomainClass("foo")).thenReturn(Foo.class);
        Foo mockFoo = new Foo("spaz", true);
        mockFoo.setData("pid", "23");
        when(mockVistaVprPatientDao.save(eq(Foo.class), anyMap())).thenReturn(mockFoo);

        ModelAndView mav = controller.post("{\"data\":[{\"bar\":\"spaz\",\"baz\":true}]}", "23", "foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<Map> saveArg = ArgumentCaptor.forClass(Map.class);
        verify(mockVistaVprPatientDao).save(eq(Foo.class), saveArg.capture());
        assertThat((String) saveArg.getValue().get("pid"), is("23"));
        assertThat((String) saveArg.getValue().get("bar"), is("spaz"));
        assertThat((Boolean) saveArg.getValue().get("baz"), is(true));

        List<Foo> data = (List<Foo>) mav.getModel().get("data");
        assertThat(data.get(0).getPid(), is("23"));
        assertThat(data.get(0).getBar(), is("spaz"));
        assertThat(data.get(0).isBaz(), is(true));
    }

    @Test
    public void testPostList() throws Exception {
        when(mockDomainService.getDomainClass("foo")).thenReturn(Foo.class);

        ModelAndView mav = controller.post("{\"list\":[{\"bar\":\"spaz\",\"baz\":true}]}", "23", "foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<Map> saveArg = ArgumentCaptor.forClass(Map.class);
        verify(mockVistaVprPatientDao).save(eq(Foo.class), saveArg.capture());
        assertThat((String) saveArg.getValue().get("pid"), is("23"));
        assertThat((String) saveArg.getValue().get("bar"), is("spaz"));
        assertThat((Boolean) saveArg.getValue().get("baz"), is(true));
    }
}
