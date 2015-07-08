package gov.va.cpe.vpr.web;

import gov.va.cpe.param.IParamService;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/param")
@Controller
public class ParamController {

    private IParamService paramService;

    @Autowired
    public void setParamService(IParamService svc) {
        this.paramService = svc;
    }

    @RequestMapping(value = "/get/{id}")
    @ResponseBody
    public String get(@PathVariable String id, @RequestParam(value = "instance", required = false) String instance, 
    		@RequestParam(value = "key", required = false) String key, @RequestParam(value = "default", required = false) String defaultVal) {
        if (StringUtils.hasText(key)) {
            final Object val = paramService.getUserParamVal(id, key, instance);
            return StringEscapeUtils.escapeHtml(val != null ? val.toString() : defaultVal);
        }
        
        final String param = paramService.getUserParam(id, instance);
        return StringEscapeUtils.escapeHtml(param != null ? param : defaultVal);
    }

    /**
     * Updates specified key/value's in the parameter.  Unspecified, existing values are not altered/removed.
     */
    @RequestMapping(value = "/set/{id}")
    public String set(@PathVariable final String id, @RequestParam(value = "instance", required = false) String instance, @RequestParam Map params) {
        paramService.setUserParamVals(id, instance, params);
        return "redirect:/param/get/" + id;
    }

    @RequestMapping(value = "/replace/{id}")
    public String replace(@PathVariable final String id, @RequestParam(value = "instance", required = false) String instance, @RequestParam Map params) {
        paramService.clearUserParam(id, instance);
        paramService.setUserParamVals(id, instance, params);
        return "redirect:/param/get/" + id;
    }

    /**
     * Stores the body of the post as the new contents of the param. Any existing values are replaced.
     */
    @RequestMapping(value = "/put/{id}", method = RequestMethod.POST)
    public String put(@PathVariable final String id, @RequestParam(value = "instance", required = false) String instance, @RequestBody Map data) {
        paramService.setUserParamVals(id, instance, data);
        return "redirect:/param/get/" + id;
    }

    @RequestMapping(value = "/list/{id}")
    @ResponseBody
    public String list(@PathVariable String id) {
        return "[" + StringUtils.collectionToDelimitedString(paramService.getUserParamInstanceIDs(id), ", ") + "]";
    }

    @RequestMapping(value = "/delete/{id}")
    @ResponseBody
    public String delete(@PathVariable String id, @RequestParam(required = false) String instance) {
        paramService.clearUserParam(id, instance);
        return "";
    }
}
