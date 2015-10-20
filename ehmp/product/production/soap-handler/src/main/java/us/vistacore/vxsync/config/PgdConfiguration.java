package us.vistacore.vxsync.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PgdConfiguration {
    @JsonProperty
    private String uri;

    @JsonProperty
    private String retry;

    @JsonProperty
    private String protocol;

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getRetry() {
        return retry;
    }

    public void setRetry(String retry) {
        this.retry = retry;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
}
