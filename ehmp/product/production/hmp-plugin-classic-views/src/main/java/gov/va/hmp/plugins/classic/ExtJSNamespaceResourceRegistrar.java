package gov.va.hmp.plugins.classic;

import gov.va.hmp.module.ExtJSClass;
import org.osgi.service.http.HttpService;

import java.util.HashSet;
import java.util.Set;

// TODO: add support for "compiled"/minified javascript
public class ExtJSNamespaceResourceRegistrar {

    public static final String DEFAULT_RESOURCE_BASE = "/js/";

    private String resourceBase = DEFAULT_RESOURCE_BASE;
    private Set<String> namespacePaths = new HashSet<String>();

    public String getResourceBase() {
        return resourceBase;
    }

    public void setResourceBase(String resourceBase) {
        this.resourceBase = resourceBase;
    }

    public void setExtJSClasses(Set<ExtJSClass> classes) {
         for (ExtJSClass extJSClass : classes) {
             namespacePaths.add(getNamespacePath(extJSClass.getClassName()));
         }
    }

    public void bindHttpService(HttpService httpService) {
        for (String namespacePath : namespacePaths) {
            try {
                httpService.registerResources(resourceBase + namespacePath, resourceBase + namespacePath, null);
                System.out.println(namespacePath + " registered");
            } catch (Exception e) {
                System.out.println("Unable to register HTTP resources");
            }
        }
    }

    public void unbindHttpService(HttpService httpService) {
        for (String namespacePath : namespacePaths) {
            try {
                httpService.unregister(resourceBase + namespacePath);
                System.out.println(namespacePath + " unregistered");
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to unregister HTTP resources");
            }
        }
    }

    private String getNamespace(String className) {
        int dot = className.lastIndexOf('.');
        return className.substring(0, dot);
    }

    private String getNamespacePath(String className) {
        return getNamespace(className).replace('.', '/');
    }

    private Set<String> getNamespacePaths() {
        return namespacePaths;
    }

}
