package gov.va.cpe.vpr.util;

import java.io.IOException;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class ConnectionBuilder {
    
    private static Logger logger = LoggerFactory.getLogger(ConnectionBuilder.class);

    private ConnectionBuilder() { }
    
    public static void configure() {
        TrustManager[] certs = new TrustManager[] {
            new X509TrustManager() {
                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
                @Override
                public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException { }
                @Override
                public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException { }
            }
        };
        SSLContext ctx = null;
        try {
            ctx = SSLContext.getInstance("TLS");
            ctx.init(null, certs, new SecureRandom());
        } catch (java.security.GeneralSecurityException ex) {
            logger.warn("GeneralSecurityException while configuring HttpsURLConnection.", ex);
        }
		if(ctx == null) 
		{
			logger.warn("CTX variable is null");
		}
		else
       	{
			 HttpsURLConnection.setDefaultSSLSocketFactory(ctx.getSocketFactory());
        
      		 HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
           		 public boolean verify(String hostname, SSLSession session) {
               	 return true;
           		 }
       		 });
			logger.debug("ConnectionBuilder.configure: Configuration finished.");
		}
    }
    
    public static HttpsURLConnection createConnection(URL url) throws IOException {
        configure();
        return (HttpsURLConnection) url.openConnection();
    }

}
