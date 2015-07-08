package gov.va.cpe.vpr.web;

import gov.va.cpe.web.SetupController;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.SetupCommand;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.SystemInfo;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class SetupControllerTests {

    private SetupController controller;
    private Environment mockEnvironment;
    private ApplicationContext mockApplicationContext;
    private IVistaAccountDao mockVistaAccountDao;
    private RpcOperations mockRpcTemplate;

    @Before
    public void setUp() throws Exception {
        mockEnvironment = mock(Environment.class);
        mockApplicationContext = mock(ApplicationContext.class);
        when(mockApplicationContext.getEnvironment()).thenReturn(mockEnvironment);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        mockRpcTemplate = mock(RpcOperations.class);

        controller = new SetupController();
        controller.setApplicationContext(mockApplicationContext);
        controller.setEnvironment(mockEnvironment);
        controller.setSynchronizationRpcTemplate(mockRpcTemplate);
        controller.setVistaAccountDao(mockVistaAccountDao);
    }

    @Test
    public void testSetupCompleteRedirectsToRootOfApplication() throws Exception {
        when(mockEnvironment.getProperty(HmpProperties.SETUP_COMPLETE)).thenReturn("true");

        SetupCommand setup = new SetupCommand();
        Errors setupErrors = new BeanPropertyBindingResult(setup, "setup");
        ModelAndView mav = controller.index(setup, setupErrors, null, null, false);
        assertThat(mav.getViewName(), is("redirect:/"));
    }

//    @Test
//    public void testSetupNotCompleteAndHmpPropertiesDoesntExist() throws Exception {
//        Resource mockHomeDir = mock(Resource.class);
//        Resource mockHmpPropertiesFile = mock(Resource.class);
//        when(mockEnvironment.getProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(null);
//        when(mockApplicationContext.getResource("file:./")).thenReturn(mockHomeDir);
//        when(mockHomeDir.createRelative(HmpProperties.HMP_PROPERTIES_FILE_NAME)).thenReturn(mockHmpPropertiesFile);
//        when(mockHmpPropertiesFile.exists()).thenReturn(true);
//
//        SetupCommand setup = new SetupCommand();
//        Errors setupErrors = new BeanPropertyBindingResult(setup, "setup");
//        ModelAndView mav = controller.index(setup, setupErrors, null, null, false);
//        assertThat(mav.getViewName(), is("/setup/restart"));
//    }
//
//    @Test
//    public void testSetupNotCompleteResultsInSetupPageWithDefaultsFilledIn() throws Exception {
//        Resource mockHomeDir = mock(Resource.class);
//        Resource mockHmpPropertiesFile = mock(Resource.class);
//        when(mockEnvironment.getProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(null);
//        when(mockApplicationContext.getResource("file:./")).thenReturn(mockHomeDir);
//        when(mockHomeDir.createRelative(HmpProperties.HMP_PROPERTIES_FILE_NAME)).thenReturn(mockHmpPropertiesFile);
//        when(mockHmpPropertiesFile.exists()).thenReturn(false);
//
//        String serverId = UUID.randomUUID().toString();
//        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn(serverId);
//        when(mockEnvironment.getProperty(HmpProperties.SERVER_HOST)).thenReturn("example.org");
//        when(mockEnvironment.getProperty(HmpProperties.SERVER_PORT_HTTP)).thenReturn("1234");
//        when(mockEnvironment.getProperty(HmpProperties.SERVER_PORT_HTTPS)).thenReturn("5678");
//
//        List<VistaAccount> mockVistaAccounts = new ArrayList<>();
//        when(mockVistaAccountDao.findAll()).thenReturn(mockVistaAccounts);
//
//        SetupCommand setup = new SetupCommand();
//        Errors setupErrors = new BeanPropertyBindingResult(setup, "setup");
//        ModelAndView mav = controller.index(setup, setupErrors, null, null, false);
//
//        assertThat(mav.getModel().get("setup"), is(sameInstance((Object) setup)));
//        assertThat(mav.getModel().get("vistaAccounts"), is(sameInstance((Object) mockVistaAccounts)));
//        assertThat(mav.getViewName(), is("/setup/index"));
//        verify(mockVistaAccountDao).findAll();
//
//        assertThat(setup.getServerId(), is(serverId));
//        assertThat(setup.getServerHost(), is("example.org"));
//        assertThat(setup.getHttpPort(), is(1234));
//        assertThat(setup.getHttpsPort(), is(5678));
//    }

    @Test
    public void testTestNewVistaConnection() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        // TODO: should probably do this with a command object instead
        request.setParameter("vista.division", "500");
        request.setParameter("vista.host", "example.org");
        request.setParameter("vista.port", "1234");
        request.setParameter("vista.name", "FOO");
        request.setParameter("vista.production", "false");
        request.setParameter("access", "10vehu");
        request.setParameter("verify", "vehu10");

        final Connection mockConnection = mock(Connection.class);
        SystemInfo mockSystemInfo = mock(SystemInfo.class);
        when(mockConnection.getSystemInfo()).thenReturn(mockSystemInfo);
        when(mockRpcTemplate.execute(any(ConnectionCallback.class), eq(new RpcHost("example.org", 1234)), eq("500"), eq("10vehu"), eq("vehu10"))).thenAnswer(new Answer<String>() {
            @Override
            public String answer(InvocationOnMock invocation) throws Throwable {
                Object[] args = invocation.getArguments();
                ConnectionCallback<String> callback = (ConnectionCallback<String>) args[0];
                return callback.doInConnection(mockConnection);
            }
        });

        ModelAndView mav = controller.test(request);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCResponse.class)));

        verify(mockRpcTemplate).execute(any(ConnectionCallback.class), eq(new RpcHost("example.org", 1234)), eq("500"), eq("10vehu"), eq("vehu10"));
        verify(mockVistaAccountDao).findByDivisionHostAndPort("500", "example.org", 1234);

        ArgumentCaptor<VistaAccount> saveArgCaptor = ArgumentCaptor.forClass(VistaAccount.class);
        verify(mockVistaAccountDao).save(saveArgCaptor.capture());
        assertThat(saveArgCaptor.getValue().getHost(), is("example.org"));
        assertThat(saveArgCaptor.getValue().getPort(), is(1234));
        assertThat(saveArgCaptor.getValue().getName(), is("FOO"));
        assertThat(saveArgCaptor.getValue().getDivision(), is("500"));
        assertThat(saveArgCaptor.getValue().isProduction(), is(false));
        assertThat(saveArgCaptor.getValue().getVprUserCredentials(), is("10vehu;vehu10"));
    }
}
