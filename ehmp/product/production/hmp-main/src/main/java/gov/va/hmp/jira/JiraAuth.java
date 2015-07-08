package gov.va.hmp.jira;

import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.io.Serializable;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/30/14
 * Time: 10:20 AM
 * To change this template use File | Settings | File Templates.
 */
public class JiraAuth implements Serializable {

    private String username;
    private transient String password;
    private Map<String, Object> project;
    private Map<String, Object> issueType;

    /*
     *  These have to each have their own restTemplate, because they seem to
     */
    private transient RestTemplate restTemplate;

    public RestTemplate getRestTemplate() {
        if(restTemplate==null) {
            restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
        }
        return restTemplate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Map<String, Object> getProject() {
        return project;
    }

    public void setProject(Map<String, Object> project) {
        this.project = project;
    }

    public Map<String, Object> getIssueType() {
        return issueType;
    }

    public void setIssueType(Map<String, Object> issueType) {
        this.issueType = issueType;
    }

    public String getStackTraceFieldId() {

        return stackTraceFieldId;
    }

    public void setStackTraceFieldId(String stackTraceFieldId) {
        this.stackTraceFieldId = stackTraceFieldId;
    }

    private String stackTraceFieldId;
}
