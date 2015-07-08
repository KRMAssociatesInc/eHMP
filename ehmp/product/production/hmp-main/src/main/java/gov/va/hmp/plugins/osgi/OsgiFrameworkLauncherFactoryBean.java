package gov.va.hmp.plugins.osgi;

import gov.va.hmp.Bootstrap;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleException;
import org.osgi.framework.Constants;
import org.osgi.framework.launch.Framework;
import org.osgi.framework.launch.FrameworkFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class OsgiFrameworkLauncherFactoryBean implements FactoryBean<Framework>, ApplicationContextAware, InitializingBean, DisposableBean {

    public static final String PLUGINS_DIR = "plugins/";
    private static final String SYSTEM_PACKAGES_RESOURCE = "system-packages.txt";

    private static final Logger LOGGER = LoggerFactory.getLogger(OsgiFrameworkLauncherFactoryBean.class);

    private ApplicationContext applicationContext;
    private Map<String, String> configuration = new HashMap<String, String>();
    private Framework framework;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    public void setConfiguration(Map<String, String> configuration) {
        this.configuration = configuration;
    }

    @Override
    public Framework getObject() throws Exception {
        return framework;
    }

    @Override
    public Class<?> getObjectType() {
        return Framework.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void destroy() throws Exception {
       if (framework != null) {
           framework.stop();
           framework.waitForStop(0);
       }
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (!configuration.containsKey(Constants.FRAMEWORK_STORAGE)) {
            File storageDir = Bootstrap.getHmpHomeDirectory(this.applicationContext).createRelative("osgi-storage").getFile();
            if (!storageDir.exists()) {
                storageDir.mkdir();
            }
            configuration.put(Constants.FRAMEWORK_STORAGE, storageDir.getCanonicalPath());
        }
        if (!configuration.containsKey(Constants.FRAMEWORK_STORAGE_CLEAN_ONFIRSTINIT)) {
            configuration.put(Constants.FRAMEWORK_STORAGE_CLEAN, Constants.FRAMEWORK_STORAGE_CLEAN_ONFIRSTINIT);
        }
        if (!configuration.containsKey(Constants.FRAMEWORK_SYSTEMPACKAGES_EXTRA)) {
        	InputStreamReader isr = new InputStreamReader(getClass().getResourceAsStream(SYSTEM_PACKAGES_RESOURCE));
            String rawSystemPackages = FileCopyUtils.copyToString(isr);
            String[] lines = rawSystemPackages.split("\\r?\\n");
            String systemPackages = StringUtils.collectionToCommaDelimitedString(Arrays.asList(lines));
            configuration.put(Constants.FRAMEWORK_SYSTEMPACKAGES_EXTRA, systemPackages);
            LOGGER.debug(systemPackages);
            isr.close();
        }
        if (!configuration.containsKey("felix.fileinstall.dir")) {
            File pluginsDir = getPluginsDir(this.applicationContext).getFile();
            if (!pluginsDir.exists()) {
                pluginsDir.mkdir();
            }
            configuration.put("felix.fileinstall.dir", pluginsDir.getCanonicalPath());
        }

        ServiceLoader<FrameworkFactory> factoryLoader = ServiceLoader.load(FrameworkFactory.class);
        FrameworkFactory frameworkFactory = factoryLoader.iterator().next();

        framework = frameworkFactory.newFramework(configuration);
        framework.start();

        // install some bundles
        List<Bundle> installedBundles = new ArrayList<Bundle>();
        File bundlesDir = Bootstrap.getHmpHomeDirectory(this.applicationContext).createRelative("bundles").getFile();
        if (!bundlesDir.exists()) throw new ServiceConfigurationError("HMP OSGi system bundles missing or configured incorrectly (cannot find 'bundles' folder inside '"+Bootstrap.getHmpHomeDirectory(this.applicationContext).getFile().getAbsolutePath());
        for (File f : bundlesDir.listFiles()) {
             if (f.getName().endsWith("jar")) {
                 try {
                     Bundle bundle = framework.getBundleContext().installBundle("file:" + f.getCanonicalPath());
                     installedBundles.add(bundle);
                 } catch (BundleException e) {
                    LOGGER.error("Unable to install bundle: " + f.getName(), e);
                 }
             }
        }

        // start the installed bundles
        for (Bundle bundle : installedBundles) {
            if (bundle.getHeaders().get(Constants.FRAGMENT_HOST) == null) {
                try {
                    bundle.start();
                    LOGGER.info("Started bundle: {}({})", bundle.getSymbolicName(), bundle.getVersion().toString());
                } catch (BundleException e) {
                    LOGGER.error("Unable to start bundle: " + bundle.getSymbolicName(), e);
                }
            }
        }
    }

    public static Resource getPluginsDir(ApplicationContext applicationContext) throws IOException {
        return Bootstrap.getHmpHomeDirectory(applicationContext).createRelative(PLUGINS_DIR);
    }
}
