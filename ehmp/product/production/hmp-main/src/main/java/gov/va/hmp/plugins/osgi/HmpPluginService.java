package gov.va.hmp.plugins.osgi;

import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.hmp.plugins.IHmpPluginService;
import org.osgi.framework.*;
import org.osgi.framework.wiring.BundleRevision;
import org.osgi.service.blueprint.container.BlueprintContainer;
import org.osgi.service.component.ComponentConstants;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;

import static org.osgi.framework.Constants.*;

@Service
public class HmpPluginService implements IHmpPluginService, InitializingBean {
    public static final String USER_PLUGIN_BUNDLE = "user";
    public static final String SYSTEM_BUNDLE = "system";

    public static final String HMP_MODULE_NAME = "hmp.module.name";

    private BundleContext bundleContext;
    private IBroadcastService broadcastService;

    @Autowired
    public void setBundleContext(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Autowired
    public void setBroadcastService(IBroadcastService broadcastService) {
        this.broadcastService = broadcastService;
    }

    private Map<String, Object> getBundleDescriptor(Bundle bundle) {
        HashMap<String, Object> summary = new HashMap<>();
        summary.put("bundleId", bundle.getBundleId());
        summary.put("symbolicName", bundle.getSymbolicName());
        summary.put("version", bundle.getVersion().toString());
        summary.put("category", getBundleCategory(bundle));
        summary.put("stateRaw", bundle.getState());
        summary.put("state", getBundleState(bundle));
        summary.put("fragment", isFragment(bundle));

        Map<String, String> headers = dictionaryToMap(bundle.getHeaders());
        if (headers.containsKey(BUNDLE_NAME)) {
            summary.put("name", headers.get(BUNDLE_NAME));
        }
        if (headers.containsKey(BUNDLE_DESCRIPTION)) {
            summary.put("description", headers.get(BUNDLE_DESCRIPTION));
        }
        if (headers.containsKey(BUNDLE_VENDOR)) {
            summary.put("vendor", headers.get(BUNDLE_VENDOR));
        }
        if (headers.containsKey(BUNDLE_DOCURL)) {
            summary.put("docUrl", headers.get(BUNDLE_DOCURL));
        }
        summary.put("headers", headers);

        ServiceReference[] services = bundle.getRegisteredServices();
        if (services != null) {
            List<Map<String, Object>> serviceDescriptors = new ArrayList<>(services.length);
            for (ServiceReference service : services) {
                Map<String, Object> serviceDescriptor = createServiceDescriptor(service);
                if (includeServiceDescriptor(serviceDescriptor)) {
                    serviceDescriptors.add(serviceDescriptor);
                }
            }
            summary.put("services", serviceDescriptors);
        }

        return summary;
    }

    private Map<String, Object> createServiceDescriptor(ServiceReference service) {
        Map<String, Object> serviceDescriptor = new HashMap<>();
        String[] keys = service.getPropertyKeys();
        for (String key : keys) {
            Object value = service.getProperty(key);
            if (ObjectUtils.isArray(value)) {
                serviceDescriptor.put(key, StringUtils.arrayToCommaDelimitedString((Object[]) value));
            } else {
                serviceDescriptor.put(key, value.toString());
            }
        }
        if (!serviceDescriptor.containsKey(HMP_MODULE_NAME)) {
            if (serviceDescriptor.containsKey("osgi.service.blueprint.compname"))
                serviceDescriptor.put(HMP_MODULE_NAME, serviceDescriptor.get("osgi.service.blueprint.compname"));
            else if (serviceDescriptor.containsKey(ComponentConstants.COMPONENT_NAME))
                serviceDescriptor.put(HMP_MODULE_NAME, serviceDescriptor.get(ComponentConstants.COMPONENT_NAME));
        }

        return serviceDescriptor;
    }

    private String getBundleState(Bundle bundle) {
        if (isFragment(bundle)) return "Fragment";

        int state = bundle.getState();
        switch (state) {
            case Bundle.UNINSTALLED:
                return "Uninstalled";
            case Bundle.INSTALLED:
                return "Installed";
            case Bundle.RESOLVED:
                return "Disabled";
            case Bundle.STARTING:
                return "Starting";
            case Bundle.STOPPING:
                return "Stopping";
            case Bundle.ACTIVE:
                return "Active";
            default:
                return "Unknown";
        }
    }

    // filter out "framework" service descriptors;
    private boolean includeServiceDescriptor(Map<String, Object> serviceDescriptor) {
        if (BlueprintContainer.class.getName().equals(serviceDescriptor.get("objectClass"))) return false;
        return true;
    }

    @Override
    public List<Map<String, Object>> getPlugins() {
        Bundle[] bundles = bundleContext.getBundles();
        List<Map<String, Object>> summaries = new ArrayList<>(bundles.length);
        for (Bundle bundle : bundles) {
            Map<String, Object> summary = getBundleDescriptor(bundle);
            summaries.add(summary);
        }
        return summaries;
    }

    @Override
    public void start(Long bundleId) {
        try {
            Bundle bundle = bundleContext.getBundle(bundleId);
            if (bundle == null) throw new NotFoundException("Bundle '" + bundleId + "' not found");
            if (SYSTEM_BUNDLE.equalsIgnoreCase(getBundleCategory(bundle)))
                throw new IllegalArgumentException("Bundle '" + bundleId + "' is a system bundle and cannot be started");
            bundle.start();
        } catch (BundleException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void stop(Long bundleId) {
        try {
            Bundle bundle = bundleContext.getBundle(bundleId);
            if (bundle == null) throw new NotFoundException("Bundle '" + bundleId + "' not found");
            if (SYSTEM_BUNDLE.equalsIgnoreCase(getBundleCategory(bundle)))
                throw new IllegalArgumentException("Bundle '" + bundleId + "' is a system bundle and cannot be stopped");
            bundle.stop();
        } catch (BundleException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void uninstall(Long bundleId) {
        try {
            Bundle bundle = bundleContext.getBundle(bundleId);
            if (bundle == null) throw new NotFoundException("Bundle '" + bundleId + "' not found");
            if (SYSTEM_BUNDLE.equalsIgnoreCase(getBundleCategory(bundle)))
                throw new IllegalArgumentException("Bundle '" + bundleId + "' is a system bundle and cannot be uninstalled");
            bundle.uninstall();
            // TODO: delete file from plugins dir?
        } catch (BundleException e) {
            throw new RuntimeException(e);
        }
    }

    private String getBundleCategory(Bundle bundle) {
        String location = bundle.getLocation();
        if (StringUtils.hasText(location) && location.contains(OsgiFrameworkLauncherFactoryBean.PLUGINS_DIR)) {
            return USER_PLUGIN_BUNDLE;
        }
        return SYSTEM_BUNDLE;
    }

    private boolean isFragment(Bundle bundle) {
        return (bundle.adapt(BundleRevision.class).getTypes() & BundleRevision.TYPE_FRAGMENT) != 0;
    }

    private static <K, V> Map<K, V> dictionaryToMap(Dictionary<K, V> source) {
        Map<K, V> sink = new HashMap<>();
        if (source == null) return sink;

        for (Enumeration<K> keys = source.keys(); keys.hasMoreElements(); ) {
            K key = keys.nextElement();
            sink.put(key, source.get(key));
        }
        return sink;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.bundleContext.addBundleListener(new BundleEventBroadcaster());
    }

    private class BundleEventBroadcaster implements BundleListener {
        @Override
        public void bundleChanged(BundleEvent event) {
            if (shouldBroadcast(event)) {
                Map<String, Object> evt = new HashMap<String, Object>();
                evt.put("eventName", "bundle" + getBundleEventType(event.getType()));
                evt.put("bundleId", event.getBundle().getBundleId());
                evt.put("bundle", getBundleDescriptor(event.getBundle()));

                broadcastService.broadcastMessage(evt);
            }
        }

        private boolean shouldBroadcast(BundleEvent event) {
            return event.getType() == BundleEvent.RESOLVED || event.getType() == BundleEvent.UNRESOLVED || event.getType() == BundleEvent.STARTED || event.getType() == BundleEvent.STOPPED || event.getType() == BundleEvent.UPDATED;
        }

        private String getBundleEventType(int type) {
            switch (type) {
                case BundleEvent.INSTALLED:
                    return "installed";
                case BundleEvent.STARTED:
                    return "started";
                case BundleEvent.STOPPED:
                    return "stopped";
                case BundleEvent.UPDATED:
                    return "updated";
                case BundleEvent.UNINSTALLED:
                    return "uninstalled";
                case BundleEvent.RESOLVED:
                    return "resolved";
                case BundleEvent.UNRESOLVED:
                    return "unresolved";
                case BundleEvent.STARTING:
                    return "starting";
                case BundleEvent.STOPPING:
                    return "stopping";
                case BundleEvent.LAZY_ACTIVATION:
                    return "lazyactivation";
                default:
                    return "";
            }
        }
    }
}
