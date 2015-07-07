package gov.va.hmp.jira;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/10/14
 * Time: 12:23 PM
 * To change this template use File | Settings | File Templates.
 */
public interface IJiraDao {
    public JiraTicket getByStackHashHeadless(String stackHash) throws Exception;
    public JiraTicket getByStackHash(String stackHash, JiraAuth auth) throws Exception;
    public JiraTicket submitTicket(JiraTicket ticket, String stackhash, JiraAuth auth) throws URISyntaxException;
    public JiraTicket submitTicketHeadless(JiraTicket ticket, String stackhash) throws URISyntaxException;
    public JiraTicket appendCommentsHeadless(JiraTicket ticket, String comments) throws URISyntaxException;
    public boolean isHeadlessAvailable();
    public JiraAuth initJiraCredentials(String username, String password);

    public void submitAttachment(JiraTicket ticket, String screenshot, JiraAuth auth) throws IOException;

    public void submitAppInfoAttachment(JiraTicket ticket, String appInfo, JiraAuth auth) throws IOException;

    List<JiraTicket> getBuyoffAssignmentsForUser(JiraAuth auth);
}
