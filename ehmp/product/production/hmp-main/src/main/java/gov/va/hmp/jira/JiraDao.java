package gov.va.hmp.jira;

import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.HmpEncryption;
import gov.va.hmp.HmpProperties;
import org.apache.commons.codec.binary.Base64;
import org.drools.core.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 1/10/14
 * Time: 1:00 PM
 * To change this template use File | Settings | File Templates.
 */

public class JiraDao implements IJiraDao, InitializingBean {

    private Environment environment;

    private static Logger log = LoggerFactory.getLogger(JiraDao.class);
    private boolean headlessAvailable = false;
    private String jiraHost = "webserver.was.redacted.us";
    private String projectKey = "MSTHRE";

    public JiraTicket getByStackHashHeadless(String stackHash) throws Exception {

        if(stackHash==null || stackHash.equals("")) {return null;}
        JiraTicket result = null;

        String url = getHeadlessBaseUrl()+"search?jql=project=%22"+projectKey+"%22+AND+%22Stack%20Hash%22%7E%22"+stackHash+"%22";
        Map<String, Object> rslt = headlessAuth.getRestTemplate().getForEntity(new URI(url), Map.class).getBody();
        if(rslt!=null && rslt.get("total")!=null && Integer.parseInt(rslt.get("total").toString())>0) {
            result = new JiraTicket((Map<String, Object>) ((List)rslt.get("issues")).get(0));
        }

        return result;
    }

    public JiraTicket getByStackHash(String stackHash, JiraAuth auth) throws Exception {

        if(stackHash==null || stackHash.equals("")) {return null;}
        JiraTicket result = null;

        String url = "https://"+ auth.getUsername() +":"+ auth.getPassword() +"@"+jiraHost+"/rest/api/2/search?jql=project=%22"+projectKey+"%22+AND+%22Stack%20Hash%22%7E%22"+stackHash+"%22";
        Map<String, Object> rslt = auth.getRestTemplate().getForEntity(new URI(url), Map.class).getBody();
        if(rslt!=null && rslt.get("total")!=null && Integer.parseInt(rslt.get("total").toString())>0) {
            result = new JiraTicket((Map<String, Object>) ((List)rslt.get("issues")).get(0));
        }

        return result;
    }

    private HmpEncryption hmpEncryption;

    @Autowired
    public void setHmpEncryption(HmpEncryption hmpEncryption) {
        this.hmpEncryption = hmpEncryption;
    }

    private String getHeadlessBaseUrl() throws IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException {
        String url = "https://"+hmpEncryption.decrypt(getUsername())+":"+hmpEncryption.decrypt(getPassword())+"@"+jiraHost+"/rest/api/2/";
        return url;
    }

    private boolean jiraCredsFound() {
        if(getUsername()!=null && getPassword()!=null) {
            try {
                getHeadlessBaseUrl();
                return true;
            } catch(Exception e) {
                // TODO: Cleaner test for valid credentials.
            }
        }
        return false;
    }

    @Override
    public JiraTicket submitTicketHeadless(JiraTicket ticket, String stackhash) throws URISyntaxException {
        String url = null;
        try {
            url = getHeadlessBaseUrl()+"issue";
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (InvalidKeyException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (BadPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        JiraTicket resp = null;
        try {
            if(ticket.fields.get("project")==null) {ticket.fields.put("project", headlessAuth.getProject());}
            if(ticket.fields.get("issuetype")==null) {ticket.fields.put("issuetype", headlessAuth.getIssueType());}
            if(stackhash!=null && !stackhash.isEmpty()) {ticket.fields.put(headlessAuth.getStackTraceFieldId(), stackhash);}
            resp = new JiraTicket(headlessAuth.getRestTemplate().postForEntity(new URI(url),ticket.getData(),Map.class).getBody());
        } catch(HttpClientErrorException e) {
            e.printStackTrace();
            String message = e.getResponseBodyAsString() ;
            System.out.println(message);
        }
        return resp;
    }

    @Override
    public JiraTicket submitTicket(JiraTicket ticket, String stackhash, JiraAuth auth) throws URISyntaxException {
        String url = "https://"+auth.getUsername()+":"+auth.getPassword()+"@"+jiraHost+"/rest/api/2/issue";
        JiraTicket resp = null;
        try {
            if(ticket.fields.get("project")==null) {ticket.fields.put("project", auth.getProject());}
            if(ticket.fields.get("issuetype")==null) {ticket.fields.put("issuetype", auth.getIssueType());}
            if(stackhash!=null && !stackhash.isEmpty()) {ticket.fields.put(auth.getStackTraceFieldId(), stackhash);}
            resp = new JiraTicket(auth.getRestTemplate().postForEntity(new URI(url), ticket.getData(), Map.class).getBody());
        } catch(HttpClientErrorException e) {
            e.printStackTrace();
            String message = e.getResponseBodyAsString() ;
            System.out.println(message);
        }
        return resp;
    }

    @Override
    public void submitAppInfoAttachment(JiraTicket ticket, String json, JiraAuth auth) throws IOException {

    	String filename = StringUtils.deleteAny(ticket.getId(), "\\./") + ".json";
        File f = new File(System.getProperty("java.io.tmpdir"), filename);
        if(f.exists()) {f.delete();}
        if(!f.exists()) {f.createNewFile();}
        
        try (FileOutputStream fos = new FileOutputStream(f)) {
	        String prettyVal = POMUtils.MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(POMUtils.parseJSONtoNode(json));
	        fos.write(prettyVal.getBytes());
        }

        try {
            String url = "https://"+auth.getUsername()+":"+auth.getPassword()+"@"+jiraHost+"/rest/api/2/issue/"+ticket.getId()+"/attachments";

            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
            parts.add("file",new FileSystemResource(f.getAbsolutePath()));

            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.set("X-Atlassian-Token", "nocheck");
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parts, requestHeaders);

            HttpComponentsClientHttpRequestFactory fact = new HttpComponentsClientHttpRequestFactory();
            RestTemplate rt = new RestTemplate(fact);
            rt.exchange(url, HttpMethod.POST, requestEntity, String.class);
        } finally {
            f.delete();
        }
    }

    @Override
    public List<JiraTicket> getBuyoffAssignmentsForUser(JiraAuth auth) {
        List<JiraTicket> rslt = new ArrayList<>();
        try {
            String url = getHeadlessBaseUrl()+"search?jql=(assignee="+auth.getUsername()+" AND status=10010)";
            Map<String, Object> resp = auth.getRestTemplate().getForObject(url, Map.class);
            if(resp!=null && resp.get("issues") instanceof List) {
                for(Map<String, Object> ticket: (List<Map<String, Object>>)resp.get("issues")) {
                    rslt.add(new JiraTicket(ticket));
                }
            }
        } catch(HttpClientErrorException e) {
            e.printStackTrace();
            String message = e.getResponseBodyAsString() ;
            System.out.println(message);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (InvalidKeyException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (BadPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return rslt;
    }

    @Override
    public void submitAttachment(JiraTicket ticket, String screenshot, JiraAuth auth) throws IOException {
    	
    	if(screenshot.startsWith("data:image/png;base64")) {screenshot = screenshot.substring("data:image/png;base64".length());}
        byte[] blob = Base64.decodeBase64(screenshot);

        String filename = StringUtils.deleteAny(ticket.getId(), "\\./") + ".bmp";
    	File f = new File(System.getProperty("java.io.tmpdir"), filename);
    	if(f.exists()) {f.delete();}
    	if(!f.exists()) {f.createNewFile();}
    	try (FileOutputStream fos = new FileOutputStream(f)) {
    		fos.write(blob);
    	}

        try {
            String url = "https://"+auth.getUsername()+":"+auth.getPassword()+"@"+jiraHost+"/rest/api/2/issue/"+ticket.getId()+"/attachments";

            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
            parts.add("file",new FileSystemResource(f.getAbsolutePath()));

            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.set("X-Atlassian-Token", "nocheck");
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parts, requestHeaders);

            HttpComponentsClientHttpRequestFactory fact = new HttpComponentsClientHttpRequestFactory();
            RestTemplate rt = new RestTemplate(fact);
            rt.exchange(url, HttpMethod.POST, requestEntity, String.class);
        } finally {
            f.delete();
        }
    }
    
    @Override
    public JiraTicket appendCommentsHeadless(JiraTicket ticket, String comments) throws URISyntaxException {
        JiraTicket rslt = null;
        try {
            String url = getHeadlessBaseUrl()+"issue/"+ticket.getId()+"/comment";
            JiraTicket resp = null;
            Map<String, Object> cmap = new HashMap<String, Object>();
            cmap.put("body",comments);
            headlessAuth.getRestTemplate().postForEntity(new URI(url),cmap,Map.class);
            rslt = new JiraTicket(headlessAuth.getRestTemplate().getForEntity(new URI(getHeadlessBaseUrl()+"issue/"+ticket.getId()),Map.class).getBody());
        } catch(HttpClientErrorException e) {
            e.printStackTrace();
            String message = e.getResponseBodyAsString() ;
            System.out.println(message);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (InvalidKeyException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (BadPaddingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return rslt;
    }

    @Autowired
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    private String getUsername() {
        return environment.getProperty(HmpProperties.JIRA_USERNAME);
    }

    private String getPassword() {
        return environment.getProperty(HmpProperties.JIRA_PASSWORD);
    }

    JiraAuth headlessAuth = null;
    /**
     * Try to initialize headless ticket submission mode
     * @throws Exception
     */
    public void afterPropertiesSet() throws Exception {

        String pk = environment.getProperty(HmpProperties.JIRA_PROJECT);
        if(pk!=null) {
            projectKey = pk;
        }
        String jh = environment.getProperty(HmpProperties.JIRA_HOST);
        if(jh!=null) {
            jiraHost = jh;
        }

        if(!jiraCredsFound()) {
            return;
        }

        String url = getHeadlessBaseUrl()+"issue/createmeta?expand=projects.issuetypes.fields";

        try {
            headlessAuth = new JiraAuth();

            Map rslt = headlessAuth.getRestTemplate().getForObject(url, Map.class);

            Object projects = rslt.get("projects");

            if(projects!=null && projects instanceof List && ((List)projects).size()>0 && ((List)projects).get(0) instanceof Map && ((Map)((List)projects).get(0)).get("key").equals(projectKey)) {

                headlessAuth.setProject((Map<String, Object>) ((List) projects).get(0));
                Object issueTypes = ((Map)headlessAuth.getProject()).get("issuetypes");
                if(issueTypes != null && issueTypes instanceof List) {
                    for(Map<String, Object> issueType: (List<Map<String, Object>>)issueTypes) {
                        if(issueType.get("name").equals("Story")) {
                            headlessAuth.setIssueType(issueType);
                            Map<String, Map<String, Object>> fields = (Map<String, Map<String, Object>>) issueType.get("fields");
                            for(String key: fields.keySet()) {
                                if(fields.get(key).get("name").equals("Stack Hash")) {
                                    headlessAuth.setStackTraceFieldId(key);
                                }
                            }
                        }
                    }
                }
            }

            if(headlessAuth.getIssueType()==null || headlessAuth.getProject()==null || headlessAuth.getStackTraceFieldId() ==null) {
                headlessAuth = null;
                log.warn("Cannot initialize JiraDao. Project, Issue Type, or Field not found.");
                return;
            }
        } catch(HttpClientErrorException e) {
            headlessAuth = null;
            log.warn("Unable to obtain metadata from Jira", e);
            return;
        }

        headlessAvailable = true;
    }

    public boolean isHeadlessAvailable() {
        return headlessAvailable;
    }

    /*
        What if a different session tries to log in with invalid credentials?
        DAO should not be session-aware.

     */
    @Override
    public JiraAuth initJiraCredentials(String username, String password) {
        JiraAuth authrslt = new JiraAuth();
        String aurl =  "https://"+username+":"+password+"@"+jiraHost+"/rest/auth/1/session";
        String url = "https://"+username+":"+password+"@"+jiraHost+"/rest/api/2/issue/createmeta?expand=projects.issuetypes.fields";
        try {
            Map rslt = authrslt.getRestTemplate().getForObject(aurl, Map.class);
            if(rslt.get("name")!=null) {
                rslt = authrslt.getRestTemplate().getForObject(url, Map.class);
//                if(this.project==null | this.issueType==null) {
                    Object projects = rslt.get("projects");
                    if(projects!=null && projects instanceof List && ((List)projects).size()>0 && ((List)projects).get(0) instanceof Map && ((Map)((List)projects).get(0)).get("key").equals(projectKey)) {
                        authrslt.setProject((Map<String, Object>) ((List) projects).get(0));
                        Object issueTypes = ((Map)authrslt.getProject()).get("issuetypes");
                        if(issueTypes != null && issueTypes instanceof List) {
                            for(Map<String, Object> issueType: (List<Map<String, Object>>)issueTypes) {
                                if(issueType.get("name").equals("Story")) {
                                    authrslt.setIssueType(issueType);
                                    Map<String, Map<String, Object>> fields = (Map<String, Map<String, Object>>) issueType.get("fields");
                                    for(String key: fields.keySet()) {
                                        if(fields.get(key).get("name").equals("Stack Hash")) {
                                            authrslt.setStackTraceFieldId(key);
                                        }
                                    }
                                }
                            }
                        }
//                    }

                    if(authrslt.getIssueType()==null || authrslt.getProject()==null) {
                        log.warn("Cannot initialize JiraDao. Project and/or Issue Type not found.");
                        authrslt = null;
                    } else {
                        authrslt.setUsername(username);
                        authrslt.setPassword(password);
                    }
                }
            } else {
                authrslt = null;
            }
        } catch(HttpClientErrorException e) {
            log.warn("Unable to obtain metadata from Jira", e);
            authrslt = null;
        }
        return authrslt;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
