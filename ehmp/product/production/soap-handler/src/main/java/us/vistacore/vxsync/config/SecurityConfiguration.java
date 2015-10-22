package us.vistacore.vxsync.config;

public class SecurityConfiguration {

	private String keystore;
	private String truststore;
	private String ksPassword;
	private String tsPassword;
	
	public void setKeystore(String keystore) {
		this.keystore = keystore;
		if(keystore != null && !keystore.equals("")) {
			System.setProperty("javax.net.ssl.keyStore", keystore);
		}
	}
	public void setTruststore(String truststore) {
		this.truststore = truststore;
		if(truststore != null && !truststore.equals("")) {
			System.setProperty("javax.net.ssl.trustStore", truststore);
		}
	}
	public void setKsPassword(String ksPassword) {
		this.ksPassword = ksPassword;
		if(ksPassword != null && !ksPassword.equals("")) {
			System.setProperty("javax.net.ssl.keyStorePassword", new String(ksPassword));
		}
	}
	public void setTsPassword(String tsPassword) {
		this.tsPassword = tsPassword;
		if(tsPassword != null && !tsPassword.equals("")) {
			System.setProperty("javax.net.ssl.trustStorePassword", new String(tsPassword));
		}
	}
	
}
