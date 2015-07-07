package gov.va.hmp.jira;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.MessageDigest;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/3/14
 * Time: 11:43 AM
 * To change this template use File | Settings | File Templates.
 */
@Service
public class JiraService implements IJiraService {
    IJiraDao dao;

    @Autowired
    public void setDao(IJiraDao dao) {
        this.dao = dao;
    }

    @Override
    public JiraAuth initJiraCredentials(String username, String password) {
        return dao.initJiraCredentials(username, password);
    }

    @Override
    public List<JiraTicket> getBuyoffAssignments(JiraAuth auth) {
        return dao.getBuyoffAssignmentsForUser(auth);  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public JiraTicket submitJiraTicket(List<String> stackTrace, String summary, String description, JiraAuth auth) throws Exception {
        JiraTicket ticket = null;
        String stackhash = null;
        if(stackTrace!=null && stackTrace.size()>1) {
            stackhash = getStackHashForTicket(stackTrace);
            ticket = dao.getByStackHash(stackhash, auth);
        }

        if(ticket==null) {
            ticket = new JiraTicket();
            Map<String, Object> fields = ticket.getFields();
            fields.put("summary",summary);
            fields.put("description",description);
            ticket = dao.submitTicket(ticket, stackhash, auth);
        } else {
            ticket = dao.appendCommentsHeadless(ticket, summary + ": " + description);
        }

        return ticket;
    }

    @Override
    public JiraTicket submitJiraTicketWithImage(String summary, String description, JiraAuth auth, String screenshot, String appInfo) throws Exception {
        JiraTicket ticket = new JiraTicket();
        Map<String, Object> fields = ticket.getFields();
        fields.put("summary",summary);
        fields.put("description",description);
        ticket = dao.submitTicket(ticket, null, auth);
        String id = ticket.getId();
        if(id!=null && !id.isEmpty()) {
            dao.submitAttachment(ticket, screenshot, auth);
            if(!StringUtils.isEmpty(appInfo)) {
                dao.submitAppInfoAttachment(ticket, appInfo, auth);
            }
        }

        return ticket;
    }

    private String getStackHashForTicket(List<String> stackTrace) {

        // No more than eight
        StringBuffer hexString = new StringBuffer();
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
            for(int i = 0; i<stackTrace.size() && i<8; i++) {
                md.update(stackTrace.get(i).getBytes());
            }
            byte[] hash = md.digest();

            for (int i = 0; i < hash.length; i++) {
                if ((0xff & hash[i]) < 0x10) {
                    hexString.append("0" + Integer.toHexString((0xFF & hash[i])));
                } else {
                    hexString.append(Integer.toHexString(0xFF & hash[i]));
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return hexString.toString();
    }
}
