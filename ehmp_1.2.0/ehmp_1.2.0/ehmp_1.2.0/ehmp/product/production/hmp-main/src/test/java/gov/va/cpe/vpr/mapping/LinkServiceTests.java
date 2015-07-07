package gov.va.cpe.vpr.mapping;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.cpe.vpr.ws.link.ILinkGenerator;
import gov.va.cpe.vpr.ws.link.LinkRelation;
import gov.va.cpe.vpr.ws.link.PatientRelatedSelfLinkGenerator;
import gov.va.hmp.feed.atom.Link;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class LinkServiceTests {
    private ApplicationContext mockAppContext;
    private IPatientDAO mockPatientDao;
    private PatientRelatedSelfLinkGenerator mockPtRelatedSelfLinkGenerator;

    private LinkService linkService;

    @Before
    public void setUp() throws Exception {
        mockPtRelatedSelfLinkGenerator = mock(PatientRelatedSelfLinkGenerator.class);
        mockAppContext = mock(ApplicationContext.class);
        when(mockAppContext.getBean(PatientRelatedSelfLinkGenerator.class)).thenReturn(mockPtRelatedSelfLinkGenerator);
        mockPatientDao = mock(IPatientDAO.class);

        linkService = new LinkService();
        linkService.setApplicationContext(mockAppContext);
        linkService.setPatientDao(mockPatientDao);
    }

    @Test
    public void testGetPatientHref() throws Exception {
        PatientDemographics mockPatient = MockPatientUtils.create("42");
        Link mockPatientLink = new Link("http://example.org/patient/42", LinkRelation.SELF.toString());

        when(mockPatientDao.findByPid("42")).thenReturn(mockPatient);
        when(mockPtRelatedSelfLinkGenerator.supports(mockPatient)).thenReturn(true);
        when(mockPtRelatedSelfLinkGenerator.generateLink(mockPatient)).thenReturn(mockPatientLink);

        assertThat(linkService.getPatientHref("42"), is(mockPatientLink.getHref()));

        verify(mockPatientDao).findByPid("42");
        verify(mockAppContext).getBean(PatientRelatedSelfLinkGenerator.class);
        verify(mockPtRelatedSelfLinkGenerator).supports(mockPatient);
        verify(mockPtRelatedSelfLinkGenerator).generateLink(mockPatient);
    }

    @Test
    public void testGetPatientWithUnknownPid() throws Exception {
        when(mockPatientDao.findByPid("23")).thenReturn(null);

        assertThat(linkService.getPatientHref("23"), nullValue());

        verify(mockPatientDao).findByPid("23");
    }

    @Test
    public void testGetSelfLink() throws Exception {
        when(mockPtRelatedSelfLinkGenerator.supports(any(Foo.class))).thenReturn(true);

        Foo foo = new Foo();
        foo.setData("uid", "urn:va:foo");
        foo.setData("pid", "42");

        Link mockSelfLink = new Link("http://example.org/foo/bar/baz", LinkRelation.SELF.toString());
        when(mockPtRelatedSelfLinkGenerator.generateLink(foo)).thenReturn(mockSelfLink);

        Link link = linkService.getSelfLink(foo);
        assertThat(link, sameInstance(mockSelfLink));
        assertThat(link.getHref(), is("http://example.org/foo/bar/baz"));
        assertThat(link.getRel(), is("self"));

        verify(mockAppContext).getBean(PatientRelatedSelfLinkGenerator.class);
        verify(mockPtRelatedSelfLinkGenerator).supports(foo);
        verify(mockPtRelatedSelfLinkGenerator).generateLink(foo);
        verifyZeroInteractions(mockPatientDao);
    }

    @Test
    public void testGetLinks() throws Exception {
        ILinkGenerator mockLinkGenerator1 = mock(ILinkGenerator.class);
        ILinkGenerator mockLinkGenerator2 = mock(ILinkGenerator.class);
        ILinkGenerator mockLinkGenerator3 = mock(ILinkGenerator.class);
        ILinkGenerator mockLinkGenerator4 = mock(ILinkGenerator.class);

        SortedMap linkGenerators = new TreeMap();
        linkGenerators.put("one", mockLinkGenerator1);
        linkGenerators.put("two", mockLinkGenerator2);
        linkGenerators.put("three", mockLinkGenerator3);
        linkGenerators.put("four", mockLinkGenerator4);

        Link mockLink1 = new Link("http://example.org/foo/one", "mock-one");
        Link mockLink2 = new Link("http://example.org/foo/two", "mock-two");
        Link mockLink3 = new Link("http://example.org/foo/three", "mock-three");

        when(mockAppContext.getBeansOfType(ILinkGenerator.class)).thenReturn(linkGenerators);

        Foo foo = new Foo();
        foo.setData("uid", "urn:va:foo");
        foo.setData("pid", "42");

        when(mockLinkGenerator1.supports(foo)).thenReturn(true);
        when(mockLinkGenerator1.generateLink(foo)).thenReturn(mockLink1);
        when(mockLinkGenerator2.supports(foo)).thenReturn(true);
        when(mockLinkGenerator2.generateLink(foo)).thenReturn(mockLink2);
        when(mockLinkGenerator3.supports(foo)).thenReturn(true);
        when(mockLinkGenerator3.generateLink(foo)).thenReturn(mockLink3);
        when(mockLinkGenerator4.supports(foo)).thenReturn(false);

        List<Link> links = linkService.getLinks(foo);
        assertThat(links.size(), is(3));
        assertThat(links.get(0).getHref(), is(mockLink1.getHref()));
        assertThat(links.get(1).getHref(), is(mockLink3.getHref()));
        assertThat(links.get(2).getHref(), is(mockLink2.getHref()));
        assertThat(links.get(0).getRel(), is(mockLink1.getRel()));
        assertThat(links.get(1).getRel(), is(mockLink3.getRel()));
        assertThat(links.get(2).getRel(), is(mockLink2.getRel()));

        verify(mockLinkGenerator1).supports(foo);
        verify(mockLinkGenerator1).generateLink(foo);
        verify(mockLinkGenerator2).supports(foo);
        verify(mockLinkGenerator2).generateLink(foo);
        verify(mockLinkGenerator3).supports(foo);
        verify(mockLinkGenerator3).generateLink(foo);
        verify(mockLinkGenerator4).supports(foo);
        verifyNoMoreInteractions(mockLinkGenerator4);
    }

    @Test
    public void testGetLinksForNull() throws Exception {
        List<Link> links = linkService.getLinks(null);
        assertThat(links.isEmpty(), is(true));
    }
}
