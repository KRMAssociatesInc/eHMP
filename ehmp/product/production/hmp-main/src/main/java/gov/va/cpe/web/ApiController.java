package gov.va.cpe.web;

import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.UriTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Controller
public class ApiController {
    public static final String SWAGGER_VERSION = "1.2";

    private ApplicationContext applicationContext;
    private RequestMappingHandlerMapping handlerMapping;

    @Autowired
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setHandlerMapping(RequestMappingHandlerMapping handlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    @RequestMapping(value = "/api/api-docs", method = RequestMethod.GET, produces = "application/json")
    public ModelAndView resourceListing() {
        String platformName = applicationContext.getMessage("platform.name", null, Locale.ENGLISH);

        Map<String, Object> info = new HashMap<String, Object>();

        info.put("title", platformName + " Core Web Service APIs");
        info.put("description", platformName + " REST APIs provide access to resources (data entities) via URI paths. To use a REST API, your application will make an HTTP request and parse the response. By default, the response format is JSON. If you wish, you can request XML instead of JSON, and in some cases, other formats (such as HTML or PDF) may also be requested.  Your methods will be the standard HTTP methods like GET, PUT, POST and DELETE (see API descriptions below for which methods are available for each resource).");

        Map<String, Object> resourceListing = new HashMap<String, Object>();
        resourceListing.put("apiVersion", applicationContext.getEnvironment().getProperty(HmpProperties.VERSION));
        resourceListing.put("swaggerVersion", SWAGGER_VERSION);
        resourceListing.put("info", info);

        List<ApiDescriptor> apis = Arrays.asList(new ApiDescriptor("vpr", "Read only access to patient data."),
                new ApiDescriptor("vista-rpc", "Execute existing VistA remote procedure calls."),
                new ApiDescriptor("roster", "Configure and manage lists of patients.")
//                new ApiDescriptor("pref", "Configure system and user preferences.  Similar to Parameters System <code>XPAR</code> in VistA."),
//                new ApiDescriptor("gadget", "Configure and register new user interface components."),
//                new ApiDescriptor("order-entry", "Order menus and quick orders placement. Supports ordering user interfaces (UI)."),
//                new ApiDescriptor("tiu", "Update progress notes and other clinical documentation."),
//                new ApiDescriptor("esig", "Electronically sign documents and orders."),
//                new ApiDescriptor("clio", "Add clinical observations to the patient record."),
//                new ApiDescriptor("order-management", "Update and validate orders.")
        );
        resourceListing.put("apis", apis);
        String json = POMUtils.toJSON(resourceListing);
        return ModelAndViewFactory.stringModelAndView(json, "application/json");
    }

    @RequestMapping(value = "/api/api-docs/{apiName}", method = RequestMethod.GET, produces = "application/json")
    public ModelAndView apiDocs(@PathVariable String apiName) throws IOException {
        ClassUtils.addResourcePathToPackagePath(this.getClass(), "/" + apiName + ".json");
        Resource apiResource = applicationContext.getResource("classpath:/" + ClassUtils.addResourcePathToPackagePath(this.getClass(), "/" + apiName + ".json"));
        Map<String, Object> apiDescriptor = new HashMap<String, Object>();
        if (apiResource.exists()) {
        	InputStream is = apiResource.getInputStream();
        	try {
        		apiDescriptor = POMUtils.parseJSONtoMap(apiResource.getInputStream());
        	} finally {
        		is.close();
    		}
        }

        if (!apiDescriptor.containsKey("apiVersion"))
            apiDescriptor.put("apiVersion", applicationContext.getEnvironment().getProperty(HmpProperties.VERSION));
        apiDescriptor.put("swaggerVersion", SWAGGER_VERSION);
//        apiDescriptor.put("produces", Arrays.asList("application/json","application/xml"));
        apiDescriptor.put("resourcePath", "/" + apiName);
        String json = POMUtils.toJSON(apiDescriptor);
        return ModelAndViewFactory.stringModelAndView(json, "application/json");
    }

    /**
     * Automatic listing of all @RequestMapping or WS endpoints.
     *
     * @return
     */
    @RequestMapping(value = "/api/endpoints", method = RequestMethod.GET)
    public ModelAndView endpoints() {
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();
        List<ApiResourceDescriptor> resources = new ArrayList<ApiResourceDescriptor>();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            for (String pattern : entry.getKey().getPatternsCondition().getPatterns()) {
                // TODO: set parameter type (xsd:string, xsd:int, hl7:datetime), etc.
                List<ApiParamDescriptor> params = new ArrayList<ApiParamDescriptor>();
                for (MethodParameter p : entry.getValue().getMethodParameters()) {
                    p.initParameterNameDiscovery(null);

                    ApiParamDescriptor param = null;
                    if (p.hasParameterAnnotation(PathVariable.class)) {
                        PathVariable annotation = p.getParameterAnnotation(PathVariable.class);
                        RequestMapping requestMapping = entry.getValue().getMethodAnnotation(RequestMapping.class);
                        UriTemplate uriTemplate = new UriTemplate(pattern);
                        final String value = annotation.value();
                        param = new ApiParamDescriptor(StringUtils.hasText(value) ? value : uriTemplate.getVariableNames().get(p.getParameterIndex()));
                        param.setStyle("template");
                        param.setRequired(true);
                    } else if (p.hasParameterAnnotation(RequestParam.class)) {
                        RequestParam annotation = p.getParameterAnnotation(RequestParam.class);
                        // TODO: parameterName isn't set with @RequestParam default (method argument name is used), find out where Spring is looking that up
                        final String value = annotation.value();
                        param = new ApiParamDescriptor(StringUtils.hasText(value) ? value : p.getParameterName());
                        param.setRequired(annotation.required());
                    }

                    if (param != null) {
                        params.add(param);
                    }
                }

                // TODO: set return type content-type, etc.
                ApiResourceDescriptor descriptor = new ApiResourceDescriptor();
                descriptor.setPath(pattern);
                descriptor.setMethods(new ArrayList(entry.getKey().getMethodsCondition().getMethods()));
                descriptor.setParams(params);
                resources.add(descriptor);
            }

        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(resources));
    }
}
