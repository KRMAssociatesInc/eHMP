package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class EditorControllerTests {

    private EditorController c = new EditorController();
    private MockHttpServletRequest mockRequest = new MockHttpServletRequest();
    private UserContext mockUserContext;
    private IPatientDAO mockPatientDao;
    private IGenericPatientObjectDAO mockJdsDao;
    private IVistaVprPatientObjectDao mockVistaDao;

    @Before
    public void setUp() throws Exception {
        mockUserContext = mock(UserContext.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockJdsDao = mock(IGenericPatientObjectDAO.class);
        mockVistaDao = mock(IVistaVprPatientObjectDao.class);

        c.setGenericJdsDAO(mockJdsDao);
        c.setVistaDAO(mockVistaDao);
    }

    @Test
    public void testSubmitFieldValue() throws Exception {
        IPatientObject mockFoo = mock(IPatientObject.class);
        when(mockJdsDao.findByUID("urn:va:foo:bar")).thenReturn(mockFoo);

        ModelAndView mav = c.submitJdsFieldValue("urn:va:foo:bar", "baz", "spaz", null, mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        verify(mockFoo).setData("baz", "spaz");
        verify(mockVistaDao).save(mockFoo);
    }

    @Test
    public void testSubmitJSONFieldValue() throws Exception {
        IPatientObject mockFoo = mock(IPatientObject.class);
        when(mockJdsDao.findByUID("urn:va:foo:bar")).thenReturn(mockFoo);

        ModelAndView mav = c.submitJdsFieldValue("urn:va:foo:bar", "baz", "{\"baz\":\"spaz\"}", null, mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), sameInstance((Object) mockFoo));

        Map json = Collections.singletonMap("baz", "spaz");
        verify(mockFoo).setData("baz", json);
        verify(mockVistaDao).save(mockFoo);
    }

    @Test
    public void testSubmitVistaData() throws Exception {
        IPatientObject mockFoo = mock(IPatientObject.class);
        when(mockJdsDao.findByUID("urn:va:foo:bar")).thenReturn(mockFoo);

        ModelAndView mav = c.submitVistaData("urn:va:foo:bar", "baz", "spaz", mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), sameInstance((Object) mockFoo));

        verify(mockFoo).setData("baz", "spaz");
        verify(mockVistaDao).save(mockFoo);
    }
}
