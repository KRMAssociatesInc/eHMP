package gov.va.hmp.app;

import gov.va.cpe.tabs.ChartTab;
import gov.va.cpe.tabs.UserTabPrefs;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.app.PageController;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.servlet.ModelAndView;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class PageControllerTests {

    private PageController c;
    private IGenericPOMObjectDAO mockGenericPOMObjectDao;
    private UserContext mockUserContext;
    private IVistaVprObjectDao mockVprDao;

    @Before
    public void setUp() throws Exception {
        mockGenericPOMObjectDao = mock(IGenericPOMObjectDAO.class);
        mockUserContext = mock(UserContext.class);
        mockVprDao = mock(IVistaVprObjectDao.class);

        c = new PageController();
        c.setGenericDAO(mockGenericPOMObjectDao);
        c.setUserContext(mockUserContext);
        c.setVprDao(mockVprDao);
    }

    @Test
    public void testListPages() throws Exception {
        ModelAndView mav = c.listPages();

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        verify(mockGenericPOMObjectDao).findAll(ChartTab.class);
    }

    @Test
    public void testGetPagesForCurrentUser() throws Exception {
        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "1234"));
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);

        ModelAndView mav = c.getPagesForCurrentUser();

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        verify(mockGenericPOMObjectDao).findAll(UserTabPrefs.class); // TODO: shouldn't need to retrieve all usertabprefs to find one, should be able to use a JDS query using user's UID
    }

    @Test
    public void testSetPages() throws Exception {
        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUser.getUid()).thenReturn(UidUtils.getUserUid("ABCD", "1234"));
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);

        ModelAndView mav = c.setPages("{\"data\":[{\"foo\":\"bar\"}]}");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<UserTabPrefs> saveArg = ArgumentCaptor.forClass(UserTabPrefs.class);
        verify(mockVprDao).save(saveArg.capture());
        assertThat(saveArg.getValue().getUserId(), is(UidUtils.getUserUid("ABCD", "1234")));
        assertThat(saveArg.getValue().getTabs().size(), is(equalTo(1)));
    }

    @Test
    public void testAddNewTab() throws Exception {
        ModelAndView mav = c.addNewTabOption("{\"name\":\"foo\",\"category\":\"bar\"}");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<ChartTab> saveArg = ArgumentCaptor.forClass(ChartTab.class);
        verify(mockVprDao).save(saveArg.capture());

        assertThat(saveArg.getValue().getName(), is("foo"));
        assertThat(saveArg.getValue().getCategory(), is("bar"));
    }
}
