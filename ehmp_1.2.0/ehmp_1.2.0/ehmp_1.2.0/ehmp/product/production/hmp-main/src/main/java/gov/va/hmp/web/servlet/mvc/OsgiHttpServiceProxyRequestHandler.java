package gov.va.hmp.web.servlet.mvc;

import org.apache.felix.http.proxy.DispatcherTracker;
import org.osgi.framework.BundleContext;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.util.Assert;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.context.support.WebApplicationObjectSupport;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Properties;

/**
 * Spring MVC {@link HttpRequestHandler} implementation that facilitates bridging between Spring MVC request handlers
 * and an embedded OSGi HTTPService implementation.  Similar to Apache Felix's {@link
 * org.apache.felix.http.proxy.ProxyServlet} which bridges between Servlets and .
 *
 * @see org.apache.felix.http.proxy.ProxyServlet
 */
public class OsgiHttpServiceProxyRequestHandler extends WebApplicationObjectSupport implements HttpRequestHandler, BeanNameAware, InitializingBean, DisposableBean {

    private String beanName;
    private BundleContext bundleContext;
    private DispatcherTracker tracker;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
    }

    @Required
    public void setBundleContext(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.notNull(bundleContext, "[Assertion failed] - bundleContext is required; it must not be null");

        this.tracker = new DispatcherTracker(bundleContext, null, new DelegatingServletConfig());
        this.tracker.open();
    }

    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpServlet dispatcher = this.tracker.getDispatcher();
        if (dispatcher != null) {
            dispatcher.service(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        }
    }

    @Override
    public void destroy() throws Exception {
        this.tracker.close();
    }

    /**
     * Internal implementation of the ServletConfig interface, to be passed to the wrapped dispatcher tracker.
     */
    private class DelegatingServletConfig implements ServletConfig {

        private Properties initParameters = new Properties();

        public String getServletName() {
            return beanName;
        }

        public ServletContext getServletContext() {
            return OsgiHttpServiceProxyRequestHandler.this.getServletContext();
        }

        public String getInitParameter(String paramName) {
            return initParameters.getProperty(paramName);
        }

        public Enumeration getInitParameterNames() {
            return initParameters.keys();
        }
    }
}
