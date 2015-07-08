package gov.va.cpe.web;

import java.util.*;

public class ApiResourceDescriptor {

    private String apiName;
    private String apiVersion;
    private String id;
    private String type;
    private String domain;
    private String name;
    private String title;
    private String description;
    private String path;
    private List params;
    private Map usageExamples = new LinkedHashMap();
    private List<ApiParamDescriptor> methods;

    public ApiResourceDescriptor() {
        ApiParamDescriptor descriptor = new ApiParamDescriptor();
        descriptor.setName("pid");
        descriptor.setStyle("template");
        descriptor.setTitle("");
        ApiParamDescriptor descriptor1 = new ApiParamDescriptor();
        descriptor1.setName("format");
        descriptor1.setStyle("query");
        descriptor1.setTitle("the preferred response format");

        params = new ArrayList<ApiParamDescriptor>(Arrays.asList(descriptor, descriptor1));
    }

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<ApiParamDescriptor> getParams() {
        return params;
    }

    public void setParams(List<ApiParamDescriptor> params) {
        this.params = params;
    }

    public Map getUsageExamples() {
        return usageExamples;
    }

    public void setUsageExamples(Map usageExamples) {
        this.usageExamples = usageExamples;
    }

    public List getMethods() {
        return methods;
    }

    public void setMethods(List methods) {
        this.methods = methods;
    }
}
