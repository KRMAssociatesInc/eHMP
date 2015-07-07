package gov.va.hmp.plugins.osgi;

import org.apache.felix.http.proxy.ProxyListener;
import org.junit.Test;
import org.osgi.framework.BundleContext;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockServletContext;

import javax.servlet.ServletContextEvent;
import javax.servlet.http.HttpSessionBindingEvent;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class OsgiHttpServiceProxyListenerTests {

    @Test
    public void testRecordEventsUntilContextInitialized() throws Exception {
        MockHttpSession mockSession = new MockHttpSession();
        MockServletContext mockServletContext = new MockServletContext();
        BundleContext mockBundleContext = mock(BundleContext.class);
        mockServletContext.setAttribute(BundleContext.class.getName(), mockBundleContext);
        final ProxyListener mockProxyListener = mock(ProxyListener.class);

        HttpSessionBindingEvent e1 = new HttpSessionBindingEvent(mockSession, "foo", "bar");
        HttpSessionBindingEvent e2 = new HttpSessionBindingEvent(mockSession, "baz", "spaz");
        ServletContextEvent e3 = new ServletContextEvent(mockServletContext);

        OsgiHttpServiceProxyListener l = new OsgiHttpServiceProxyListener() {
            @Override
            protected ProxyListener createProxyListener() {
                return mockProxyListener;
            }
        };
        l.attributeAdded(e1);
        l.attributeAdded(e2);
        l.contextInitialized(e3);

        verify(mockProxyListener).contextInitialized(e3);
        verify(mockProxyListener).attributeAdded(e1);
        verify(mockProxyListener).attributeAdded(e2);
    }
}
