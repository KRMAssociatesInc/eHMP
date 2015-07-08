package gov.va.hmp.app;

import com.google.common.collect.ImmutableSet;
import gov.va.cpe.vpr.HMPApp;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.module.ExtJSApplication;
import gov.va.hmp.plugins.osgi.HmpPluginService;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.ComponentConstants;
import org.osgi.util.tracker.ServiceTracker;
import org.osgi.util.tracker.ServiceTrackerCustomizer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

import static gov.va.hmp.app.AcceptanceStatus.*;

@Service
public class AppService implements IAppService, ApplicationContextAware, DisposableBean, InitializingBean {

    public static final String DEFAULT_WORKSPACE = "cpe;staging";

    public static final String CODE = "code";
    public static final String TYPE = "type";
    public static final String NAME = "name";
    public static final String REQUIRE_AUTHORITIES = "requireAuthorities";
    public static final String MAIN_MENU_ITEM_TYPE = "gov.va.cpe.appbar.mainmenu";
    public static final String ACCEPTANCE_STATUS = "acceptStatus";

    private static List<Map<String, Object>> DEFAULT_WORKSPACES = new ArrayList<>(Arrays.asList(
//            createMainMenuItem("cpe", GOLD, "gov.va.hmp.ux.UnderConstructionApp", null, "CPE", "Clinical", null),
//            createMainMenuItem("cpe", ACCEPTANCE_CANDIDATE, "gov.va.hmp.ux.UnderConstructionApp", null, "CPE", "Clinical", null),
            createMainMenuItem("cpe", STAGING, "gov.va.cpe.CPEApp", null, "CPE", "Clinical", null),
            createMainMenuItem("cpe", INCUBATING, "gov.va.cpe.CPEIncubator", null, "CPE", "Clinical", ImmutableSet.of("VISTA_KEY_VPR_EXPERIMENTAL", "VISTA_KEY_VPR_ADMIN", "VISTA_KEY_XUPROG")),
            createMainMenuItem("team", INCUBATING, "gov.va.hmp.team.TeamManagementApplication", null, "CPE Configuration", "Admin", ImmutableSet.of("VISTA_KEY_VPR_EXPERIMENTAL", "VISTA_KEY_VPR_ADMIN", "VISTA_KEY_XUPROG")),
            createMainMenuItem("hmp-config", STAGING, "gov.va.hmp.config.HmpConfigApplication", null, "HMP Configuration", "Admin", ImmutableSet.of("VISTA_KEY_VPR_ADMIN", "VISTA_KEY_XUPROG")),
            createMainMenuItem("admin", STAGING, "gov.va.hmp.admin.AdminApp", null, "System Admin", "Admin",ImmutableSet.of("VISTA_KEY_VPR_ADMIN", "VISTA_KEY_XUPROG")),
            createMainMenuItem("admin-api", INCUBATING, null, "/api", "API Docs", "Development", ImmutableSet.of("VISTA_KEY_XUPROG")),
            createMainMenuItem("roles", INCUBATING, "gov.va.hmp.team.RoleApp", null, "Role-y Poley", "Development", ImmutableSet.of("VISTA_KEY_XUPROG")),
            createMainMenuItem("pageanalyzer", INCUBATING, null, "/lib/ext-4.2.2.1144/examples/page-analyzer/page-analyzer.html", "Page Analyzer", "Debug", ImmutableSet.of("VISTA_KEY_XUPROG")),
            createMainMenuItem("test", INCUBATING, "gov.va.hmp.TestBenchApp", null, "CPE Test Bench", "Debug", ImmutableSet.of("VISTA_KEY_XUPROG")),
            createMainMenuItem("theme-viewer", INCUBATING, null, "/examples/themes/index.html", "Theme Viewer", "Debug", ImmutableSet.of("VISTA_KEY_XUPROG"))
    ));

    private UserContext userContext;
    private ApplicationContext applicationContext;
    private BundleContext bundleContext;
    private ServiceTracker<ExtJSApplication, ExtJSApplication> extJSApplicationServiceTracker;
    private IBroadcastService broadcastService;

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setBundleContext(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Autowired
    public void setBroadcastService(IBroadcastService broadcastService) {
        this.broadcastService = broadcastService;
    }

    @Override
    public void destroy() throws Exception {
        extJSApplicationServiceTracker.close();
    }

    private static Map<String, Object> createMainMenuItem(String code, AcceptanceStatus acceptanceStatus, String extClass, String href, String name, String menu, Set<String> requireAuthorities) {
        Map<String, Object> menuitem = new LinkedHashMap<>();
        menuitem.put(TYPE, MAIN_MENU_ITEM_TYPE);
        menuitem.put(CODE, createCode(code, acceptanceStatus));
        menuitem.put(ACCEPTANCE_STATUS, acceptanceStatus);
        if (StringUtils.hasText(extClass)) {
            menuitem.put("extClass", extClass);
        }

        if (href == null) {
            href = "/app/" + menuitem.get(CODE);
        } else {
            if (href.startsWith("http")) {
                menuitem.put("hrefTarget", "_blank");
            }
        }

        menuitem.put("href", href);

        menuitem.put(NAME, name);
        menuitem.put("menu", menu);
        if (requireAuthorities != null) {
            menuitem.put(REQUIRE_AUTHORITIES, requireAuthorities);
        }

        return menuitem;
    }

    private static String createCode(String prefix, AcceptanceStatus status) {
        return status.equals(GOLD) ? prefix : prefix + ";" + status.toString();
    }

    private Set<HMPApp> getSpringApps() {
        // get a list of all the apps registered (via decorator interface)
        return new HashSet<HMPApp>(applicationContext.getBeansOfType(HMPApp.class).values());
    }

    public Map<String, Object> getApp(String code) {
        Map<String, Object> apps = getApps();
        if (apps.containsKey(code)) {
            return ((Map<String, Object>) (apps.get(code)));
        } else {
            Map<String, Object> app = findAppWithSameCodeAndDifferentAcceptanceStatus(apps, code);
            if (app != null) {
                return app;
            }

            ServiceReference<ExtJSApplication>[] extjsAppReferences = extJSApplicationServiceTracker.getServiceReferences();
            if (extjsAppReferences != null) {
                // TODO: look into using a service query here instead of a loop
                for (ServiceReference<ExtJSApplication> extjsAppRef : extjsAppReferences) {
                    ExtJSApplication extjsApp = extJSApplicationServiceTracker.getService(extjsAppRef);
                    // TODO: use service properties, or expose these as props on the service interface?
                    String id = (String) extjsAppRef.getProperty(ComponentConstants.COMPONENT_NAME); // this only works for SCR components, not blueprint ones
                    int semicolon = code.indexOf(';');
                    if (semicolon != -1) {
                        code = code.substring(0, semicolon);
                    }
                    if (code.equalsIgnoreCase(id)) {
                        String name = (String) extjsAppRef.getProperty(HmpPluginService.HMP_MODULE_NAME); // use extjsApp.getName() instead of service property?

                        // TODO: grab acceptance status from OSGi component metadata or new ExtJSApplication interface method
                        return createMainMenuItem(id, INCUBATING, extjsApp.getClassName(), null, name, "Clinical", null);
                    }
                }
            }

            return null;
        }
    }

    private Map<String, Object> findAppWithSameCodeAndDifferentAcceptanceStatus(Map<String, Object> apps, String code) {
        int semicolon = code.indexOf(';');
        String prefix = semicolon != -1 ? code.substring(0, semicolon) : code;

        for (AcceptanceStatus status : AcceptanceStatus.values()) {
            String similarCode = createCode(prefix, status);
            if (apps.containsKey(similarCode)) {
                return ((Map<String, Object>) (apps.get(similarCode)));
            }
        }
        return null;
    }

    public Map<String, Object> getApps() {
        return getApps(null);
    }

    public Map<String, Object> getMainMenu() {
        Map<String, Object> apps = getApps(MAIN_MENU_ITEM_TYPE);

        ServiceReference<ExtJSApplication>[] extjsAppReferences = extJSApplicationServiceTracker.getServiceReferences();
        if (extjsAppReferences != null) {
            for (ServiceReference<ExtJSApplication> extjsAppRef : extjsAppReferences) {
                ExtJSApplication extjsApp = extJSApplicationServiceTracker.getService(extjsAppRef);
                // TODO: use service properties, or expose these as props on the service interface?
                String id = (String) extjsAppRef.getProperty(ComponentConstants.COMPONENT_NAME); // this only works for SCR components, not blueprint ones
                String name = (String) extjsAppRef.getProperty(HmpPluginService.HMP_MODULE_NAME); // use extjsApp.getName() instead of service property?

                // TODO: where does category come from? Oh yeah, probably menu builder
                apps.put(id, createMainMenuItem(id, STAGING, extjsApp.getClassName(), null, name, "Clinical", null));
            }
        }

        return apps;
    }

    public Map<String, Object> getApps(String type) {
        Map<String, Object> ret = new LinkedHashMap<>();

        // start with the default apps (hard coded static list)
        List<Map<String, Object>> apps = new ArrayList<>(DEFAULT_WORKSPACES);

        // add in the spring beans
        for (HMPApp app : getSpringApps()) {
            apps.add(app.getAppInfo());
        }

        for (Map<String, Object> a : apps) {
            // filter by type (if specified)
            if (StringUtils.hasText(type) && !type.equals(a.get(TYPE))) {
                continue;
            }

            // filter by required authorities (if declared by app)
            Set<String> requireAuthorities = (Set<String>) a.get(REQUIRE_AUTHORITIES);
            if (requireAuthorities != null && (!userContext.isLoggedIn() || !currentUserHasAnyOfAuthorities(requireAuthorities))) {
                continue;
            }

            // filter by required security keys (if declared by app)
            String requireKey = (String) a.get("requireKey");
            if (StringUtils.hasText(requireKey) && !userContext.getCurrentUser().hasVistaKey(requireKey)) {
                continue;
            }

            String code = (String) a.get(CODE);
            if (StringUtils.hasText(code)) {
                ret.put(code, a);
            }
        }

        return ret;
    }

    private boolean currentUserHasAnyOfAuthorities(Set<String> authorities) {
        if (authorities == null) return false;
        for (String authority : authorities) {
            if (userContext.getCurrentUser().hasAuthority(authority)) {
                return true;
            }
        }
        return false;
    }

    private void fireMainMenuChangeEvent(ExtJSApplication service) {
        Map<String, Object> evt = new HashMap<String, Object>();
        evt.put("eventName", "mainmenuchange");
        evt.put("mainmenu", getMainMenu());

        broadcastService.broadcastMessage(evt);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        extJSApplicationServiceTracker = new ServiceTracker<ExtJSApplication, ExtJSApplication>(this.bundleContext, ExtJSApplication.class, new MenuEventBroadcaster());
        extJSApplicationServiceTracker.open();
    }

    private class MenuEventBroadcaster implements ServiceTrackerCustomizer<ExtJSApplication, ExtJSApplication> {
        @Override
        public ExtJSApplication addingService(ServiceReference<ExtJSApplication> reference) {
            ExtJSApplication service = extJSApplicationServiceTracker.addingService(reference);
            fireMainMenuChangeEvent(service);
            return service;
        }

        @Override
        public void modifiedService(ServiceReference<ExtJSApplication> reference, ExtJSApplication service) {
            fireMainMenuChangeEvent(service);
        }

        @Override
        public void removedService(ServiceReference<ExtJSApplication> reference, ExtJSApplication service) {
            fireMainMenuChangeEvent(service);
        }
    }
}
