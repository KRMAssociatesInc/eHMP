package gov.va.hmp.plugins.web;

import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCError;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.plugins.IHmpPluginService;
import gov.va.hmp.plugins.osgi.OsgiFrameworkLauncherFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class HmpPluginController implements ApplicationContextAware {

    private IHmpPluginService pluginService;
    private ApplicationContext applicationContext;

    @Autowired
    public void setPluginService(IHmpPluginService pluginService) {
        this.pluginService = pluginService;
    }

    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @RequestMapping(value = "/plugins/{apiVersion}/list", method = RequestMethod.GET)
    public ModelAndView list(@PathVariable String apiVersion, HttpServletRequest request) {
        List<Map<String, Object>> summaries = pluginService.getPlugins();
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(request, summaries);
        return contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/plugins/{apiVersion}/upload", method = RequestMethod.POST)
    public ModelAndView upload(@PathVariable String apiVersion, @RequestParam MultipartFile file, HttpServletRequest request) {
        try {
            Resource pluginsDir = OsgiFrameworkLauncherFactoryBean.getPluginsDir(this.applicationContext);
            Resource pluginResource = pluginsDir.createRelative(file.getOriginalFilename());
            FileCopyUtils.copy(file.getBytes(), pluginResource.getFile());

            String message = "Uploaded plugin '" + file.getOriginalFilename() + "'";
            JsonCResponse<Map<String, Object>> jsonc = JsonCResponse.create(request, Collections.singletonMap("message", message));
            jsonc.params.remove("file"); // don't want to echo back bytes in 'file' param
            return contentNegotiatingModelAndView(jsonc);
        } catch (IOException e) {
            return contentNegotiatingModelAndView(JsonCError.createError(request, "500", e));
        }
    }

//    @RequestMapping(value = "/plugins/{apiVersion}/{bundleId}", method = RequestMethod.GET)
//    public ModelAndView stop(@PathVariable String apiVersion, @PathVariable Long bundleId, HttpServletRequest request) {
//        pluginService.stop(bundleId);
//        String message = "Stopped plugin '" + bundleId + "'";
//        JsonCResponse<Map<String, Object>> jsonc = JsonCResponse.create(request, Collections.singletonMap("message", message));
//        return contentNegotiatingModelAndView(jsonc);
//    }

    @RequestMapping(value = "/plugins/{apiVersion}/{bundleId}", method = RequestMethod.POST, params = "action=stop")
    public ModelAndView stop(@PathVariable String apiVersion, @PathVariable Long bundleId, HttpServletRequest request) {
        pluginService.stop(bundleId);
        String message = "Stopped plugin '" + bundleId + "'";
        JsonCResponse<Map<String, Object>> jsonc = JsonCResponse.create(request, Collections.singletonMap("message", message));
        return contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/plugins/{apiVersion}/{bundleId}", method = RequestMethod.POST, params = "action=start")
    public ModelAndView start(@PathVariable String apiVersion, @PathVariable Long bundleId, HttpServletRequest request) {
        pluginService.start(bundleId);
        String message = "Started plugin '" + bundleId + "'";
        JsonCResponse<Map<String, Object>> jsonc = JsonCResponse.create(request, Collections.singletonMap("message", message));
        return contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/plugins/{apiVersion}/{bundleId}", method = RequestMethod.DELETE)
    public ModelAndView uninstall(@PathVariable String apiVersion, @PathVariable Long bundleId, HttpServletRequest request) {
        pluginService.uninstall(bundleId);
        String message = "Uninstalled plugin '" + bundleId + "'";
        JsonCResponse<Map<String, Object>> jsonc = JsonCResponse.create(request, Collections.singletonMap("message", message));
        return contentNegotiatingModelAndView(jsonc);
    }
}
