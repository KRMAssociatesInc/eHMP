package gov.va.hmp.jira;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/3/14
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class JiraController {

    @Autowired IJiraService svc;

    Logger logger = LoggerFactory.getLogger(JiraController.class);

    @RequestMapping(value="/jira/submitBlob", method=RequestMethod.POST)
    public ModelAndView submitBlob(HttpServletRequest req,
           @RequestParam(required=false) String title,
           @RequestParam(required=false) String description,
           @RequestParam(required=false) String screenshot,
           @RequestParam(required=false) String appInfo) throws Exception {
        HttpSession session = req.getSession();
        Object auth = session.getAttribute("jiraAuth");

        Map<String, Object> response;
        if(auth!=null) {
            JiraTicket ticket = svc.submitJiraTicketWithImage(title, description, (JiraAuth)auth, screenshot, appInfo);
            response = ticket.getData();
            response.put("success","true");
        } else {
            response = new HashMap<>();
            response.put("success","false");
            response.put("message","Jira credentials not found in user session.");
        }

        return contentNegotiatingModelAndView(response);

    }

    @RequestMapping(value = "/jira/submit", method = RequestMethod.POST)
    public org.springframework.web.servlet.ModelAndView submitJiraTicket(
            HttpServletRequest request,
            @RequestParam(required=true) String summary,
            @RequestParam(required=true) String description,
            @RequestParam(required=false) String stacktrace,
            @RequestParam(required=false) Object screenshot) throws Exception {
        HttpSession session = request.getSession();
        Object auth = session.getAttribute("jiraAuth");
        Map<String, Object> response;
        if(auth!=null) {
            List<String> stacktraceList = new ArrayList<>();
            if(stacktrace!=null) {
                stacktraceList = Arrays.asList(stacktrace.split("\n"));
            }
            JiraTicket ticket = svc.submitJiraTicket(stacktraceList, summary, description, (JiraAuth)auth);
            response = ticket.getData();
            response.put("success","true");
        } else {
            response = new HashMap<>();
            response.put("success","false");
            response.put("message","Jira credentials not found in user session.");
        }

        return contentNegotiatingModelAndView(response);
    }

    @RequestMapping(value = "/jira/authenticate", method=RequestMethod.GET)
    public ModelAndView authenticated(HttpServletRequest request) {
        Map<String, Object> rslt = new HashMap<String, Object>();

        if(
            request.getSession().getAttribute("jiraAuth") != null
                ) {
            rslt.put("success","true");
            rslt.put("authenticated","true");
            rslt.put("username",request.getSession().getAttribute("jiraUsername"));
        } else {
            rslt.put("success","true");
            rslt.put("authenticated","false");
        }

        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/jira/authenticate", method=RequestMethod.POST)
    public ModelAndView authenticate(HttpServletRequest request, String username, String password) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success","true");
        result.put("authenticated","false");
        try{
            JiraAuth auth = svc.initJiraCredentials(username, password);
            if(auth!=null) {
                HttpSession sess = request.getSession();
                sess.setAttribute("jiraAuth",auth);
                sess.setAttribute("jiraUsername", username);
                result.put("authenticated","true");
                result.put("username", username);
            }
        } catch(Exception e) {
            logger.warn("Jira authentication failed",e);
        }
        return contentNegotiatingModelAndView(result);
    }

    @RequestMapping(value="/jira/buyoff", method=RequestMethod.GET)
    public ModelAndView getBuyoffAssignments(HttpServletRequest request) {
        JiraAuth auth = (JiraAuth)request.getSession().getAttribute("jiraAuth");
        return contentNegotiatingModelAndView(svc.getBuyoffAssignments(auth));
    }

}
