package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.team.Category;
import gov.va.cpe.team.TeamPosition;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.sync.vista.VistaOperationalDataDAO;
import gov.va.hmp.app.Page;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDefConfigTemplate;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.vista.Foo;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.internal.stubbing.answers.ReturnsArgumentAt;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.security.util.InMemoryResource;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

public class InitOperationalDomainMessageHandlerTests {

    public static final String MOCK_VISTA_ID = "ABCD";

    public static final Resource MOCK_RESOURCE = new InMemoryResource("{\"data\":{\"totalItems\":2,\"items\":[{\"uid\":\"foo\"},{\"uid\":\"bar\"}]}}");

    private InitOperationalDomainMessageHandler handler;
    private ResourceLoader mockResourceLoader;
    private IGenericPOMObjectDAO mockJdsDao;
    private VistaOperationalDataDAO mockVistaOperationalDataService;
    Message mockMessage;
    Session mockSession;
    SimpleMessageConverter converter;
    private IVprSyncErrorDao mockErrorDao;

    @Before
    public void setUp() throws Exception {
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        when(mockJdsDao.save(any(IPOMObject.class))).thenAnswer(new ReturnsArgumentAt(0));
        mockResourceLoader = mock(ResourceLoader.class);
        when(mockResourceLoader.getResource(anyString())).thenReturn(MOCK_RESOURCE);
        mockVistaOperationalDataService = mock(VistaOperationalDataDAO.class);
        when(mockVistaOperationalDataService.save(eq(MOCK_VISTA_ID), any(IPOMObject.class))).thenAnswer(new ReturnsArgumentAt(1));
        mockErrorDao = mock(IVprSyncErrorDao.class);

        handler = new InitOperationalDomainMessageHandler();
        handler.setJdsDao(mockJdsDao);
        handler.setResourceLoader(mockResourceLoader);
        handler.setVistaOperationalDataService(mockVistaOperationalDataService);
        handler.setErrorDao(mockErrorDao);
        converter = mock(SimpleMessageConverter.class);
        mockMessage = Mockito.mock(Message.class);
        mockSession = Mockito.mock(Session.class);
        handler.converter = converter;
    }

    @Test
    public void testOnMessageMissingParams() throws Exception {
        Map msg = new HashMap();
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);
        verify(mockErrorDao).save(any(SyncError.class));
    }

    @Test
    public void testOnMessageMissingVistaId() throws Exception {
        Map msg = new HashMap();
        msg.put(SyncMessageConstants.VISTA_ID, MOCK_VISTA_ID);
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);
        verify(mockErrorDao).save(any(SyncError.class));
    }

    @Test
    public void testOnMessageMissingDomain() throws Exception {
        Map msg = new HashMap();
        msg.put(SyncMessageConstants.DOMAIN, Foo.class.getName());
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);
        verify(mockErrorDao).save(any(SyncError.class));
    }

    @Test
    public void testOnMessageForCategoryDomain() throws Exception {
        testDomainClass(Category.class, "classpath:gov/va/cpe/team/team-categories.json");
    }

    @Test
    public void testOnMessageForTeamPositionDomain() throws Exception {
        testDomainClass(TeamPosition.class, "classpath:gov/va/cpe/team/team-positions.json");
    }

    @Test
    public void testOnMessageForPageDomain() throws Exception {
        testDomainClass(Page.class, "classpath:gov/va/cpe/mega/megamenu-pages.json");
    }

    @Test
    public void testOnMessageForBoardColumnConfigTemplateDomain() throws Exception {
        testDomainClass(ViewDefDefColDefConfigTemplate.class, "classpath:gov/va/cpe/viewdefdef/boardcolumn-config-templates.json");
    }

    private void testDomainClass(Class<? extends IPOMObject> domainClass, String expectedResourceLocation) throws JMSException {
        Map msg = new HashMap();
        msg.put(SyncMessageConstants.VISTA_ID, MOCK_VISTA_ID);
        msg.put(SyncMessageConstants.DOMAIN, domainClass.getName());

        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);

        verify(mockResourceLoader).getResource(expectedResourceLocation);
        verify(mockVistaOperationalDataService, times(2)).save(eq(MOCK_VISTA_ID), any(domainClass));
        verify(mockJdsDao, times(2)).save(any(domainClass));
    }

}
