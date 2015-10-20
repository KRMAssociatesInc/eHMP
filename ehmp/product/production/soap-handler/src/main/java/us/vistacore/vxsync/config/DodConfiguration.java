package us.vistacore.vxsync.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DodConfiguration {
    @JsonProperty
    private String host;

    @JsonProperty
    private int port;

    @JsonProperty
    private String protocol;

    @JsonProperty
    private String retry;

    @JsonProperty
    private String path;

    @JsonProperty
    private String query;

    @JsonProperty
    private String timeoutms;

    @JsonProperty
    private String userien;

    @JsonProperty
    private String username;

    @JsonProperty
    private String usersitecode;

    @JsonProperty
    private String usersitename;

    @JsonProperty
    private String parallelismmin;
    
    @JsonProperty
    private String dodDocServiceEnabled;

    public String getDodDocServiceEnabled() {
		return dodDocServiceEnabled;
	}

	public void setDodDocServiceEnabled(String dodDocServiceEnabled) {
		this.dodDocServiceEnabled = dodDocServiceEnabled;
	}

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getRetry() {
        return retry;
    }

    public void setRetry(String retry) {
        this.retry = retry;
    }

    public String getTimeoutms() {
        return timeoutms;
    }

    public void setTimeoutms(String timeoutms) {
        this.timeoutms = timeoutms;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getUserien() {
        return userien;
    }

    public void setUserien(String userien) {
        this.userien = userien;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsersitecode() {
        return usersitecode;
    }

    public void setUsersitecode(String usersitecode) {
        this.usersitecode = usersitecode;
    }

    public String getUsersitename() {
        return usersitename;
    }

    public void setUsersitename(String usersitename) {
        this.usersitename = usersitename;
    }

    public String getParallelismmin() {
        return parallelismmin;
    }

    public void setParallelismmin(String parallelismmin) {
        this.parallelismmin = parallelismmin;
    }
}
