package gov.va.hmp.plugins.classic;

import gov.va.hmp.module.ExtJSApplication;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.http.HttpService;

import java.util.concurrent.atomic.AtomicReference;

@Component(immediate = true, property = {"hmp.module.name=CPE Classic Views Workspace","service.description=Workspace in the style of CPRS"})
public class ClassicViewsApplication implements ExtJSApplication {
    @Override
    public String getClassName() {
        return "gov.va.cprs.CPRSApp";
    }
}
