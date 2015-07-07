package gov.va.hmp.vista.rpc.jmx;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import gov.va.hmp.vista.rpc.pool.ConnectionManager;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import javax.management.InstanceNotFoundException;
import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Centralized JMX MBean name utilities
 */
public class ManagementContext implements ApplicationContextAware, InitializingBean {
    public static final String DEFAULT_DOMAIN = "gov.va.hmp.vista.rpc";

    private static final Logger LOG = LoggerFactory.getLogger(ManagementContext.class);

    private String jmxDomainName = DEFAULT_DOMAIN;
    private MBeanServer mBeanServer;
    private Map<Object, ObjectName> registeredNames = Collections.synchronizedMap(new HashMap<Object, ObjectName>());
    private ApplicationContext applicationContext;
    private boolean initialized = false;

    public ManagementContext() {
        this(ManagementFactory.getPlatformMBeanServer());
    }

    public ManagementContext(MBeanServer mBeanServer) {
        this.mBeanServer = mBeanServer;
    }

    public boolean isInitialized() {
        return initialized;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        start();
    }

    public void start() {
        this.initialized = true;
        for (Map.Entry<Object, ObjectName> entry : registeredNames.entrySet()) {
            try {
                if (entry.getKey() instanceof DefaultConnectionManager) {
                    mBeanServer.registerMBean(new ConnectionManagerView((DefaultConnectionManager) entry.getKey()), entry.getValue());
                } else if (entry.getKey() instanceof ConnectionMetrics) {
                    mBeanServer.registerMBean(new ConnectionMetricsView((ConnectionMetrics) entry.getKey()), entry.getValue());
                } else {
                    LOG.warn("Unrecognized MBean registration: something isn't configured correctly.");
                }
            } catch (Exception e) {
                LOG.error("Unable to register ConnectionManager MBean", e);
            }
        }
    }

    public void registerConnectionManagerMBean(DefaultConnectionManager connectionManager) {
        ObjectName jmxName = unregisterConnectionManagerMBean(connectionManager);
        jmxName = createConnectionManagerMBeanName(connectionManager);
        registeredNames.put(connectionManager, jmxName);
        if (initialized) {
            try {
                mBeanServer.registerMBean(new ConnectionManagerView(connectionManager), jmxName);
            } catch (Exception e) {
                LOG.error("Unable to register ConnectionManager MBean", e);
            }
        }

    }

    private ObjectName createConnectionManagerMBeanName(DefaultConnectionManager connectionManager) {
        ObjectName jmxName;
        String beanName = getBeanName(connectionManager);
        jmxName = createCustomComponentMBeanName("ConnectionManager", beanName);
        return jmxName;
    }

    private String getBeanName(ConnectionManager connectionManager) {
        if (applicationContext != null) {
            String[] beanNames = applicationContext.getBeanNamesForType(connectionManager.getClass(), false, false);
            for (String beanName : beanNames) {
                if (connectionManager.equals(applicationContext.getBean(beanName))) {
                    return beanName;
                }
            }

        }
        return "connectionManager(" + connectionManager.hashCode() + ")";
    }

    public ObjectName unregisterConnectionManagerMBean(DefaultConnectionManager connectionManager) {
        ObjectName jmxName = registeredNames.get(connectionManager);
        if (jmxName != null) {
            try {
                mBeanServer.unregisterMBean(jmxName);
            } catch (InstanceNotFoundException e) {
                // NOOP
            } catch (Exception e) {
                LOG.error("Unable to unregister ConnectionManager MBean", e);
            }
        }
        return jmxName;
    }

    public void registerHostMetricsMBean(ConnectionManager connectionManager, RpcHost host, ConnectionMetrics metrics) {
        ObjectName jmxName = unregisterHostMetricsMBean(connectionManager, host, metrics);
        jmxName = createHostMetricsMBeanName(connectionManager, host);
        registeredNames.put(metrics, jmxName);
        if (this.initialized) {
            try {
                mBeanServer.registerMBean(new ConnectionMetricsView(metrics), jmxName);
            } catch (Exception e) {
                LOG.error("Unable to register HostMetrics MBean", e);
            }
        }
    }

    public ObjectName unregisterHostMetricsMBean(ConnectionManager connectionManager, RpcHost host, ConnectionMetrics metrics) {
        ObjectName jmxName = registeredNames.get(metrics);
        if (jmxName != null) {
            try {
                mBeanServer.unregisterMBean(jmxName);
            } catch (InstanceNotFoundException e) {
                // NOOP
            } catch (Exception e) {
                LOG.error("Unable to unregister HostMetrics MBean", e);
            }
        }
        return jmxName;
    }

    private ObjectName createHostMetricsMBeanName(ConnectionManager connectionManager, RpcHost host) {
        ObjectName connectionManagerJmxName = registeredNames.get(connectionManager);
        ObjectName jmxName = null;
        if (connectionManagerJmxName != null) {
            jmxName = createCustomComponentMBeanName("ConnectionManager.Host", host.toHostString(), connectionManagerJmxName.getKeyProperty("type"), connectionManagerJmxName.getKeyProperty("name"));
        } else {
            jmxName = createCustomComponentMBeanName("ConnectionManager.Host", host.toHostString());
        }
        return jmxName;
    }

    private ObjectName createCustomComponentMBeanName(String type, String name) {
        return createCustomComponentMBeanName(type, name, null, null);
    }

    private ObjectName createCustomComponentMBeanName(String type, String name, String parentType, String parentName) {
        ObjectName result = null;
        String tmp = jmxDomainName + ":" + "type=" + sanitizeString(type) + ",name=" + sanitizeString(name);
        if (parentType != null && parentName != null) {
            tmp += "," + sanitizeString(parentType) + "=" + sanitizeString(parentName);
        }
        try {
            result = new ObjectName(tmp);
        } catch (MalformedObjectNameException e) {
            LOG.error("Couldn't create ObjectName from: " + type + " , " + name);
        }
        return result;
    }

    /**
     * The ':' and '/' characters are reserved in ObjectNames
     *
     * @param in
     * @return sanitized String
     */
    private static String sanitizeString(String in) {
        String result = null;
        if (in != null) {
            result = in.replace(':', '_');
            result = result.replace('/', '_');
            result = result.replace('\\', '_');
        }
        return result;
    }
}
