package gov.va.hmp.helloworld;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {

    public void start(BundleContext context) throws Exception {
        // TODO add activation code here
		System.out.println("Hello World!");
    }

    public void stop(BundleContext context) throws Exception {
        // TODO add deactivation code here
		System.out.println("Goodbye World!");
    }

}
