package gov.va.hmp.web.velocity.tools;

import gov.va.hmp.auth.UserContext;
import gov.va.cpe.param.IParamService;
import gov.va.hmp.healthtime.CPRSDateTimePrinterSet;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Before;
import org.junit.Test;
import org.mockito.internal.util.reflection.Whitebox;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.util.Locale;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class HmpToolTests {

    private HmpTool hmpTool;
    private IParamService mockParamService;
    private ResourceLoader mockResourceLoader;
    private UserContext mockUserContext;
    private CPRSDateTimePrinterSet dateTimePrinterSet = new CPRSDateTimePrinterSet();

    @Before
    public void setUp() throws Exception {
        mockParamService = mock(IParamService.class);
        mockResourceLoader = mock(ResourceLoader.class);
        mockUserContext = mock(UserContext.class);
        when(mockUserContext.getHealthTimePrinterSet()).thenReturn(dateTimePrinterSet);

        hmpTool = new HmpTool();
        Whitebox.setInternalState(hmpTool, "paramService", mockParamService);
        Whitebox.setInternalState(hmpTool, "resourceLoader", mockResourceLoader);
        Whitebox.setInternalState(hmpTool, "userContext", mockUserContext);
    }

    @Test
    public void testUserPrefDefault() throws Exception {
        when(mockParamService.getUserPreference("foo")).thenReturn(null);

        String foobar = hmpTool.userPref("foo", "bar");
        assertThat(foobar, is("bar"));
    }

    @Test
    public void testUserPref() throws Exception {
        when(mockParamService.getUserPreference("foo")).thenReturn("baz");

        String foobar = hmpTool.userPref("foo", "bar");
        assertThat(foobar, is("baz"));
    }

    @Test
    public void testUserPrefResourceDefault() throws Exception {
        when(mockParamService.getUserPreference("foo")).thenReturn(null);

        String foobar = hmpTool.userPrefResource("foo", "bar");
        assertThat(foobar, is("bar"));
    }

    @Test
    public void testUserPrefResourceDoesntExistDefault() throws Exception {
        when(mockParamService.getUserPreference("foo")).thenReturn("baz");
        Resource mockResource = mock(Resource.class);
        when(mockResource.exists()).thenReturn(false);
        when(mockResourceLoader.getResource("baz")).thenReturn(mockResource);

        String foobar = hmpTool.userPrefResource("foo", "bar");
        assertThat(foobar, is("bar"));
    }

    @Test
    public void testUserPrefResource() throws Exception {
        when(mockParamService.getUserPreference("foo")).thenReturn("baz");
        Resource mockResource = mock(Resource.class);
        when(mockResource.exists()).thenReturn(true);
        when(mockResourceLoader.getResource("baz")).thenReturn(mockResource);

        String foobar = hmpTool.userPrefResource("foo", "bar");
        assertThat(foobar, is("baz"));
    }

    @Test
    public void testFormatDateWithPattern() throws Exception {
        String s = hmpTool.formatDate(new PointInTime(2013,5,23,4,15,23), "MMM dd,yy@HH:mm");
        assertThat(s, is("May 23,13@04:15"));
    }

    @Test
    public void testFormatDate() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatDate(t);
        assertThat(s, is(dateTimePrinterSet.date().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatDateTime() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatDateTime(t);
        assertThat(s, is(dateTimePrinterSet.dateTime().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatTime() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatTime(t);
        assertThat(s, is(dateTimePrinterSet.time().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatYear() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatYear(t);
        assertThat(s, is(dateTimePrinterSet.year().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatDateStringWithPattern() throws Exception {
        String s = hmpTool.formatDate(new PointInTime(2013,5,23,4,15,23).toString(), "MMM dd,yy@HH:mm");
        assertThat(s, is("May 23,13@04:15"));
    }

    @Test
    public void testFormatDateString() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatDate(t.toString());
        assertThat(s, is(dateTimePrinterSet.date().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatDateTimeString() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatDateTime(t.toString());
        assertThat(s, is(dateTimePrinterSet.dateTime().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatTimeString() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatTime(t.toString());
        assertThat(s, is(dateTimePrinterSet.time().print(t, Locale.ENGLISH)));
    }

    @Test
    public void testFormatYearString() {
        PointInTime t = new PointInTime(2013, 5, 23, 4, 15, 23);
        String s = hmpTool.formatYear(t.toString());
        assertThat(s, is(dateTimePrinterSet.year().print(t, Locale.ENGLISH)));
    }
}
