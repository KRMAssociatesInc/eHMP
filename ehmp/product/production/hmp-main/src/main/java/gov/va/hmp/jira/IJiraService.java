package gov.va.hmp.jira;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/3/14
 * Time: 11:26 AM
 * To change this template use File | Settings | File Templates.
 */
public interface IJiraService {

    public JiraTicket submitJiraTicket(List<String> stackTrace, String summary, String description, JiraAuth auth) throws Exception;

    public JiraTicket submitJiraTicketWithImage(String title, String description, JiraAuth auth, String screenshot, String appInfo) throws Exception;

    void setDao(IJiraDao dao);

    JiraAuth initJiraCredentials(String username, String password);

    Object getBuyoffAssignments(JiraAuth auth);
}
