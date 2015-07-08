package gov.va.hmp.plugins.osgi;

import org.apache.felix.http.proxy.ProxyListener;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.EventObject;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Records events that occur before contextInitialized() and then play them back for the Apache Felix ProxyListener (so that the Http Service Bridge works)
 *
 * Jetty appears to fire attributeAdded events before the contextInitialized event when reinstating persistent sessions which means there is no ServletContext and thus no
 * BundleContext available to delegate
 */
public class OsgiHttpServiceProxyListener implements HttpSessionAttributeListener, HttpSessionListener, ServletContextListener {

    private static Logger LOGGER = LoggerFactory.getLogger(OsgiHttpServiceProxyListener.class);
    
    private AtomicReference<ProxyListener> httpServiceProxyListener = new AtomicReference<>();
    private Queue<QueuedEvent> events = new ConcurrentLinkedQueue<>();

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOGGER.debug("contextInitialized");
        if (sce.getServletContext().getAttribute(BundleContext.class.getName()) == null) {
            LOGGER.error("Servlet attribute '" + BundleContext.class.getName() + "' is required to be set for this ServletContextListener to function correctly.");
        } else {
            httpServiceProxyListener.set(createProxyListener());
            httpServiceProxyListener.get().contextInitialized(sce);
            // now play back all the events that occurred up until now
            for(QueuedEvent queuedEvent: events) {
                try {
                    Method m = ProxyListener.class.getMethod(queuedEvent.getMethod(), queuedEvent.getEvent().getClass());
                    m.invoke(httpServiceProxyListener.get(), queuedEvent.getEvent());
                } catch (NoSuchMethodException e) {
                    LOGGER.error("unable to dispatch " + queuedEvent.getMethod() + "() to Apache Felix ProxyListener", e);
                } catch (InvocationTargetException e) {
                    LOGGER.error("unable to dispatch " + queuedEvent.getMethod() + "() to Apache Felix ProxyListener", e);
                } catch (IllegalAccessException e) {
                    LOGGER.error("unable to dispatch " + queuedEvent.getMethod() + "() to Apache Felix ProxyListener", e);
                }
            }

            events.clear();
        }
    }

    protected ProxyListener createProxyListener() {
        return new ProxyListener();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        LOGGER.debug("contextDestroyed");
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().contextDestroyed(sce); 
        } else {
            events.add(createQueuedEvent("contextDestroyed", sce));
        }
    }

    private QueuedEvent createQueuedEvent(String method, EventObject e) {
        return new QueuedEvent(method, e);
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        LOGGER.debug("sessionCreated");
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().sessionCreated(se);
        } else {
            events.add(createQueuedEvent("sessionCreated", se));
        }
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        LOGGER.debug("sessionDestroyed");
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().sessionDestroyed(se);
        } else {
            events.add(createQueuedEvent("sessionDestroyed", se));
        }
    }

    @Override
    public void attributeAdded(HttpSessionBindingEvent se) {
        LOGGER.debug("attributeAdded " + se.getName());
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().attributeAdded(se);
        } else {
            events.add(createQueuedEvent("attributeAdded", se));
        }
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent se) {
        LOGGER.debug("attributeRemoved");
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().attributeRemoved(se);
        } else {
            events.add(createQueuedEvent("attributeRemoved", se));
        }
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent se) {
        LOGGER.debug("attributeReplaced");
        if (httpServiceProxyListener.get() != null) {
            httpServiceProxyListener.get().attributeReplaced(se);
        } else {
            events.add(createQueuedEvent("attributeReplaced", se));
        }
    }

    private static class QueuedEvent {
        private String method;
        private EventObject event;

        public QueuedEvent(String method, EventObject event) {
            this.method = method;
            this.event = event;
        }

        public String getMethod() {
            return method;
        }

        public EventObject getEvent() {
            return event;
        }
    }
}
