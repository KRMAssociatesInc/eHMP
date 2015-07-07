package gov.va.cpe.vpr;

import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.ModelAndView;

import javax.jms.JMSException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/broadcast/**")
public class BroadcastController {

    private static final Logger LOGGER = LoggerFactory.getLogger(BroadcastController.class);

    private IBroadcastService svc;

    @Autowired
    public void setBroadcastService(IBroadcastService broadcastService) {
        this.svc = broadcastService;
    }

    @RequestMapping(value = "/broadcast/listen", method = RequestMethod.GET)
    @ResponseBody
    public DeferredResult<ModelAndView> broadcastListen(@RequestParam(defaultValue = "0") String clientid,
    									  @RequestParam(required = false) String pid,
                                          @RequestParam(defaultValue = "0") long timeoutMS,
                                          HttpSession httpSession) throws JMSException {
        if (timeoutMS <= 0) {
            // compute a smarter timeout, basically 30s less than the session timeout
            // session timeout should be low (like 1m)
            int timeoutSecs = Math.max(httpSession.getMaxInactiveInterval() - 30, 30);
            if (timeoutSecs > 60) timeoutSecs = 60;
            timeoutMS = 1000 * timeoutSecs;
        }
        
        // setup the pid filter if requested
        IBroadcastMessageFilter filter = null;
        if (pid != null) filter = new IBroadcastMessageFilter.PIDMessageFilter(pid);
        
        String jsessid = httpSession.getId();
        DeferredResult<ModelAndView> result = new DeferredResult<>(timeoutMS, "[]");
        svc.registerUIListener(jsessid, clientid, result, filter);
        return result;
    }

    @RequestMapping(value = "/broadcast/send", method = RequestMethod.GET)
    @ResponseBody
    public String sendMessage(@RequestParam String message,
                              @RequestParam(required = false) String pid,
                              @RequestParam(required = false) String jobid,
                              HttpSession httpSession) {
        Map<String, Object> headers = new HashMap<>();
        if (pid != null) headers.put("pid", pid);
        if (jobid != null) headers.put("jobid", jobid);
        headers.put("jsessionid", httpSession.getId());

        svc.broadcastMessage(message, headers);
        return "SENT: " + StringEscapeUtils.escapeHtml(message);
    }

    @RequestMapping(value = "/broadcast/close", method = RequestMethod.GET)
    @ResponseBody
    public String closeListener(@RequestParam(defaultValue = "0") String clientid, HttpServletRequest req) {
        svc.clearResult(req.getSession().getId(), clientid);
        LOGGER.debug("/broadcast/close: " + clientid);
        return "closed";
    }

    @RequestMapping(value = "/broadcast/stats", method = RequestMethod.GET)
    public ModelAndView broadcastServiceStats() {
        Map<String, Object> ret = svc.getServiceStats();
        return ModelAndViewFactory.contentNegotiatingModelAndView(ret);
    }
}
