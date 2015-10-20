package us.vistacore.vxsync.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HdrConfiguration {
    @JsonProperty
    private String uri;

    @JsonProperty
    private String path;

    @JsonProperty
    private String protocol;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

 }
