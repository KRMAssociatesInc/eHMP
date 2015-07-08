package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.service.IDomainService;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class NonPatientDomainControllerTests {

    private NonPatientDomainController c = new NonPatientDomainController();
    private UserContext mockUserContext;
    private IDomainService mockDomainService;
    private IGenericPOMObjectDAO mockGenericDao;
    private IVistaVprObjectDao mockVistaDao;

    @Before
    public void setUp() throws Exception {
        mockUserContext = mock(UserContext.class);
        mockDomainService = mock(IDomainService.class);
        mockGenericDao = mock(IGenericPOMObjectDAO.class);
        mockVistaDao = mock(IVistaVprObjectDao.class);

        c.setUserContext(mockUserContext);
        c.setDomainService(mockDomainService);
        c.setGenericDao(mockGenericDao);
        c.setVistaVprObjectDao(mockVistaDao);
    }

    @Test
    public void testList() throws Exception {
        when(mockDomainService.getDomainClass("foo")).thenReturn(Foo.class);
        List<Foo> fooList = Arrays.asList(new Foo(), new Foo());
        when(mockGenericDao.findAll(Foo.class)).thenReturn(fooList);

        ModelAndView mav = c.list("foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get("data"), is((Object) fooList));

        verify(mockDomainService).getDomainClass("foo");
        verify(mockGenericDao).findAll(Foo.class);
    }

    @Test
    public void testSet() throws Exception {
        when(mockDomainService.getDomainClass("foo")).thenReturn(Foo.class);
        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "23"));
        when(mockUser.getDisplayName()).thenReturn("Osiris McGillicutty");

        Foo mockFoo = new Foo("spaz", true);
        when(mockVistaDao.save(eq(Foo.class), anyMap())).thenReturn(mockFoo);

        ModelAndView mav = c.set("{\"bar\":\"spaz\",\"baz\":true}", "foo");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is((Object) mockFoo));

        Map<String, Object> expectedVals = new LinkedHashMap<>();
        expectedVals.put("ownerUid", UidUtils.getUserUid("ABCD", "23"));
        expectedVals.put("ownerName", "Osiris McGillicutty");
        expectedVals.put("bar", "spaz");
        expectedVals.put("baz", true);

        verify(mockVistaDao).save(Foo.class, expectedVals);
        verify(mockDomainService).getDomainClass("foo");
        verifyZeroInteractions(mockGenericDao);
    }
}
