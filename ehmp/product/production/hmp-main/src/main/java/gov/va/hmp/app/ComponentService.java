package gov.va.hmp.app;

import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import gov.va.hmp.module.ExtJSComponent;
import gov.va.hmp.module.PatientDataDisplayType;
import gov.va.hmp.plugins.osgi.HmpPluginService;
import org.osgi.framework.BundleContext;
import org.osgi.framework.Constants;
import org.osgi.framework.ServiceReference;
import org.osgi.util.tracker.ServiceTracker;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComponentService implements IComponentService, DisposableBean {

    private BundleContext bundleContext;
    private ServiceTracker<ExtJSComponent, ExtJSComponent> extJSComponentServiceTracker;

    @Autowired
    public void setBundleContext(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
        this.extJSComponentServiceTracker = new ServiceTracker<ExtJSComponent, ExtJSComponent>(this.bundleContext, ExtJSComponent.class, null);
        this.extJSComponentServiceTracker.open();
    }

    @Override
    public List<ComponentDescriptor> getComponents() {
        List<ComponentDescriptor> descriptors = new ArrayList<>();
        ServiceReference<ExtJSComponent>[] extjsComponentReferences = extJSComponentServiceTracker.getServiceReferences();
        if (extjsComponentReferences != null) {
            for (ServiceReference<ExtJSComponent> extjsComponentRef : extjsComponentReferences) {
                ComponentDescriptor descriptor = createComponentDescriptor(extjsComponentRef);
                descriptors.add(descriptor);
            }
        }
        return descriptors;
    }

    @Override
    public List<ComponentDescriptor> getComponents(final PatientDataDisplayType type) {
        List<ComponentDescriptor> descriptors = getComponents();
        descriptors = (List<ComponentDescriptor>) Collections2.filter(descriptors, new Predicate<ComponentDescriptor>() {
            @Override
            public boolean apply(ComponentDescriptor descriptor) {
                return type == descriptor.getPatientDataDisplayType();
            }
        });
        return descriptors;
    }

    private ComponentDescriptor createComponentDescriptor(ServiceReference<ExtJSComponent> extjsComponentRef) {
        String id = extjsComponentRef.getBundle().getSymbolicName() + ":" + extjsComponentRef.getProperty("osgi.service.blueprint.compname"); // TODO: need to standardize module IDs across blueprint and SCR
        String name = (String) extjsComponentRef.getProperty(HmpPluginService.HMP_MODULE_NAME);
        String description = (String) extjsComponentRef.getProperty(Constants.SERVICE_DESCRIPTION);
        ExtJSComponent extJSComponent = extJSComponentServiceTracker.getService(extjsComponentRef);
        return new ComponentDescriptor(id, name, extJSComponent.getPatientDataDisplayType(), description);
    }

    @Override
    public void destroy() throws Exception {
        extJSComponentServiceTracker.close();
    }
}
