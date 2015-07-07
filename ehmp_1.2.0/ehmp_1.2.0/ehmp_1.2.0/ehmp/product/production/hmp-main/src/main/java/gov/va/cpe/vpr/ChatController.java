package gov.va.cpe.vpr;

import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

import javax.jms.JMSException;
import javax.jms.Message;

@Controller
@RequestMapping("/chat/**")
public class ChatController {

    private IBroadcastService broadcastService;
    private UserContext userContext;
	private Map<String, Map<String, Object>> userList = new HashMap<String, Map<String, Object>>();

    @Autowired
    public void setBroadcastService(IBroadcastService broadcastService) {
        this.broadcastService = broadcastService;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }
    
    @RequestMapping(value = "/chat/users", method = RequestMethod.GET)
    public ModelAndView users() {
    	
    	// add/update the current user to the user list
    	// TODO:This memory leaks as nothing is removed when the session expires.  Should probably be derived from the SessionManager
 		HmpUserDetails user = userContext.getCurrentUser();
 		String uuid = user.getUid();
 		Map<String, Object> userDat = userList.get(uuid);
 		if(userDat==null) {
 			userDat = new HashMap<String, Object>();
 			userList.put(uuid, userDat);
 			userDat.put("uid", uuid);
 			userDat.put("name", user.getName());
 			userDat.put("displayName", user.getDisplayName());
 		}
 		userDat.put("regtime", System.currentTimeMillis());
    	
    	
        List<Map<String, Object>> usrs = new ArrayList<>();
        for (String uid : userList.keySet()) {
            usrs.add(userList.get(uid));
        }

        return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("data", usrs));
    }

    @RequestMapping(value = "/chat/sendMessage", method = RequestMethod.POST)
    public ModelAndView sendMessage(@RequestParam("uid") String uid, @RequestParam("message") String message) {
        HmpUserDetails user = userContext.getCurrentUser();
        Map from = new HashMap();
        from.put("displayName", user.getDisplayName());
        from.put("uid", user.getUid());
        Map body = new HashMap();
        body.put("from", from);
        body.put("message", message);

        Map msg = new HashMap();
        msg.put("eventName", "chatMessage");
        msg.put("chatMessage", body);

        Map msgHdr = new HashMap();
        msgHdr.put("type", "chat");
        msgHdr.put("to", uid);
        broadcastService.broadcastMessage(msg, msgHdr);

        Map rslt = Collections.singletonMap("message", body);

        return ModelAndViewFactory.contentNegotiatingModelAndView(rslt);
    }
   
    /** Filter to only receive chat messages targeted at this user */
    private static class ChatMessageFilter implements IBroadcastMessageFilter {
    	private String targetUid;

		public ChatMessageFilter(String targetUser) {
    		this.targetUid = targetUser;
		}

		@Override
		public boolean include(Message msg) throws JMSException {
			String tp = msg.getStringProperty("type");
			String toUid = msg.getStringProperty("to");
			if(tp!=null && tp.equalsIgnoreCase("chat") && toUid !=null && toUid.equalsIgnoreCase(targetUid)) {
				return true;
			}
			return false;
		}
    }
}
