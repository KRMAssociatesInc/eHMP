package us.vistacore.vxsync.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MviConfiguration {

	@JsonProperty
	private String host;
	
	@JsonProperty
	private String path;
	
	@JsonProperty
	private int port;
	
	@JsonProperty
	private String protocol;
	
	@JsonProperty
	private String method;
	
	@JsonProperty
	private String wsdl;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
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

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getWsdl() {
		return wsdl;
	}

	public void setWsdl(String wsdl) {
		this.wsdl = wsdl;
	}
	
	
}
