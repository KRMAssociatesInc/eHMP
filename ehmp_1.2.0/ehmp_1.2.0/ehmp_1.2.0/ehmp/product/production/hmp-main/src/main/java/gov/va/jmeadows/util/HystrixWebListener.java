package gov.va.jmeadows.util;


import com.netflix.hystrix.Hystrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Web listener that will clean up hystrix thread pools.
 */
public class HystrixWebListener implements ServletContextListener {

    private static final Logger LOG = LoggerFactory.getLogger(HystrixWebListener.class);

    /**
     * Notification that the web application has been initialized.
     * @param event ServletContextEvent
     */
    public void contextInitialized(ServletContextEvent event) {
        LOG.debug("HystrixWebListener - contextInitialized");
    }

    /**
     * Notification that the servlet context is about to be shut down.
     * @param event ServletContextEvent
     */
    public void contextDestroyed(ServletContextEvent event) {
        LOG.debug("HystrixWebListener - contextDestroyed");
        LOG.debug("Invoke Hystrix.reset()");
        Hystrix.reset();
        LOG.debug("Completed Hystrix.reset()");
    }
}
