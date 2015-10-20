package us.vistacore.vxsync.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VlerConfiguration {

    @JsonProperty
    private String host;

    @JsonProperty
    private String protocol;

    @JsonProperty
    private int port;

    @JsonProperty
    private String docquerypath;

    @JsonProperty String docquerypathquery;

    @JsonProperty
    private String docquerytimeoutms;

    @JsonProperty
    private String docretrievepath;

    @JsonProperty
    private String docretrievepathquery;

    @JsonProperty
    private String docretrievetimeoutms;

    @JsonProperty
    private String systemusername;

    @JsonProperty
    private String systemsitecode;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getDocquerypath() {
        return docquerypath;
    }

    public void setDocquerypath(String docquerypath) {
        this.docquerypath = docquerypath;
    }

    public String getDocquerypathquery() {
        return docquerypathquery;
    }

    public void setDocquerypathquery(String docquerypathquery) {
        this.docquerypathquery = docquerypathquery;
    }

    public String getDocquerytimeoutms() {
        return docquerytimeoutms;
    }

    public void setDocquerytimeoutms(String docquerytimeoutms) {
        this.docquerytimeoutms = docquerytimeoutms;
    }

    public String getDocretrievepath() {
        return docretrievepath;
    }

    public void setDocretrievepath(String docretrievepath) {
        this.docretrievepath = docretrievepath;
    }

    public String getDocretrievepathquery() {
        return docretrievepathquery;
    }

    public void setDocretrievepathquery(String docretrievepathquery) {
        this.docretrievepathquery = docretrievepathquery;
    }

    public String getDocretrievetimeoutms() {
        return docretrievetimeoutms;
    }

    public void setDocretrievetimeoutms(String docretrievetimeoutms) {
        this.docretrievetimeoutms = docretrievetimeoutms;
    }

    public String getSystemusername() {
        return systemusername;
    }

    public void setSystemusername(String systemusername) {
        this.systemusername = systemusername;
    }

    public String getSystemsitecode() {
        return systemsitecode;
    }

    public void setSystemsitecode(String systemsitecode) {
        this.systemsitecode = systemsitecode;
    }
}
