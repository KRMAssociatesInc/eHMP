package gov.va.hmp.plugins.osgi;

import org.junit.Before;
import org.junit.Test;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleListener;
import org.osgi.framework.Version;
import org.osgi.framework.wiring.BundleRevision;

import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class HmpPluginServiceTests {

    private HmpPluginService service;
    private BundleContext mockBundleContext = mock(BundleContext.class);

    @Before
    public void setUp() throws Exception {
        service = new HmpPluginService();
        service.setBundleContext(mockBundleContext);
    }

    @Test
    public void testGetAddons() throws Exception {
        Bundle mockBundle1 = createMockBundle(1,"3.2.3");
        Bundle mockBundle2 = createMockBundle(2,"1.0.6");
        Bundle mockBundle3 = createMockBundle(3,"5.6.7");
        when(mockBundleContext.getBundles()).thenReturn(new Bundle[] { mockBundle1, mockBundle2, mockBundle3 });

        List<Map<String,Object>> addons = service.getPlugins();
        assertThat(addons.size(), is(3));

        assertThat((Long) addons.get(0).get("bundleId"), is(1L));
        assertThat((String) addons.get(0).get("version"), is("3.2.3"));

        assertThat((Long) addons.get(1).get("bundleId"), is(2L));
        assertThat((String) addons.get(1).get("version"), is("1.0.6"));

        assertThat((Long) addons.get(2).get("bundleId"), is(3L));
        assertThat((String) addons.get(2).get("version"), is("5.6.7"));
    }

    @Test
    public void testStartBundle() throws Exception {
        Bundle mockBundle = createMockBundle(42L, "1.2.3");
        when(mockBundleContext.getBundle(42L)).thenReturn(mockBundle);
        when(mockBundle.getLocation()).thenReturn("/a/mock/directory/where/user/bundles/are/located/in/" + OsgiFrameworkLauncherFactoryBean.PLUGINS_DIR);

        service.start(42L);

        verify(mockBundleContext).getBundle(42L);
        verify(mockBundle).start();
    }

    @Test
    public void testStopBundle() throws Exception {
        Bundle mockBundle = createMockBundle(42L, "1.2.3");
        when(mockBundleContext.getBundle(42L)).thenReturn(mockBundle);
        when(mockBundle.getLocation()).thenReturn("/a/mock/directory/where/user/bundles/are/located/in/" + OsgiFrameworkLauncherFactoryBean.PLUGINS_DIR);

        service.stop(42L);

        verify(mockBundleContext).getBundle(42L);
        verify(mockBundle).stop();
    }

    @Test
    public void testAfterPropertiesSet() throws Exception {
        service.afterPropertiesSet();
        verify(mockBundleContext).addBundleListener(any(BundleListener.class));
    }

    @Test
    public void testUninstallBundle() throws Exception {
        Bundle mockBundle = createMockBundle(42L, "1.2.3");
        when(mockBundleContext.getBundle(42L)).thenReturn(mockBundle);
        when(mockBundle.getLocation()).thenReturn("/a/mock/directory/where/user/bundles/are/located/in/" + OsgiFrameworkLauncherFactoryBean.PLUGINS_DIR);

        service.uninstall(42L);

        verify(mockBundleContext).getBundle(42L);
        verify(mockBundle).uninstall();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testUninstallSystemBundle() throws Exception {
        Bundle mockBundle = createMockBundle(23L, "2.3.4");
        when(mockBundleContext.getBundle(23L)).thenReturn(mockBundle);
        when(mockBundle.getLocation()).thenReturn("/a/mock/directory/where/system/bundles/are/located");

        service.uninstall(23L);

        verify(mockBundleContext).getBundle(23L);
    }

    private Bundle createMockBundle(long bundleId, String version) {
        Bundle bundle = mock(Bundle.class);
        when(bundle.getBundleId()).thenReturn(bundleId);
        when(bundle.getVersion()).thenReturn(new Version(version));

        BundleRevision mockRevision = mock(BundleRevision.class);
        when(bundle.adapt(BundleRevision.class)).thenReturn(mockRevision);
        when(mockRevision.getTypes()).thenReturn(0);
        return bundle;
    }
}
