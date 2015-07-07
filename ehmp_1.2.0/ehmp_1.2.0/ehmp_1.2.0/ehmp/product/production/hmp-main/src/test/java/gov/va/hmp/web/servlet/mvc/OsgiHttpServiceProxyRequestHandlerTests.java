package gov.va.hmp.web.servlet.mvc;

import gov.va.hmp.web.servlet.mvc.OsgiHttpServiceProxyRequestHandler;
import org.junit.Before;
import org.junit.Test;
import org.osgi.framework.BundleContext;
import org.osgi.framework.Filter;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class OsgiHttpServiceProxyRequestHandlerTests {

    private BundleContext mockBundleContext;
    private OsgiHttpServiceProxyRequestHandler proxyRequestHandler;

    @Before
    public void setUp() throws Exception {
        mockBundleContext = mock(BundleContext.class);
        proxyRequestHandler = new OsgiHttpServiceProxyRequestHandler();
        proxyRequestHandler.setBeanName("thingy");
        proxyRequestHandler.setBundleContext(mockBundleContext);

        when(mockBundleContext.createFilter(anyString())).thenReturn(mock(Filter.class));
    }

    @Test
    public void testAfterPropertiesSet() throws Exception {
        proxyRequestHandler.afterPropertiesSet();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetWithMissingBundleContext() throws Exception {
        proxyRequestHandler.setBundleContext(null);
        proxyRequestHandler.afterPropertiesSet();
    }
}
