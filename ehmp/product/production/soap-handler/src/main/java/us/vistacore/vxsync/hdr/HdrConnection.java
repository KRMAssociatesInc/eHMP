package us.vistacore.vxsync.hdr;

import java.io.IOException;
import java.net.HttpURLConnection;
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

import us.vistacore.vxsync.config.HdrConfiguration;

/**
 * Created by kumblep on 1/14/15.
 */
public class HdrConnection
{
    public static final String DIVISION="500";
    private static final Logger LOG = LoggerFactory.getLogger(HdrConnection.class);
    private static HdrConfiguration hdrConfig;

    public static HdrConfiguration getHdrConfig() {
        return hdrConfig;
    }

    public static void setHdrConfig(HdrConfiguration hdrConfig) {
        HdrConnection.hdrConfig = hdrConfig;
    }

    /*
    returns the rest URL to get HDR domain data
    @param - String icn,String domain
    @return - String - URL
     */
    public static String getURL(String icn,String domain)
    {
         String answer = hdrConfig.getProtocol() + "://" + hdrConfig.getUri() + hdrConfig.getPath() + domain +
                         "?_type=json&clientName=HMP&templateId=GenericObservationRead1&" +
                         "filterId=GENERIC_VISTA_LIST_DATA_FILTER&nationalId=" + icn;
         LOG.debug("Using HDR url: " + answer);
         return answer;
    }

    public static HttpURLConnection createConnection(URL url) throws IOException {
        if (hdrConfig.getProtocol().equals("https")) {
            // configure();
            return (HttpsURLConnection) url.openConnection();
        }
        return (HttpURLConnection) url.openConnection();
    }


    public static void configure() {
        TrustManager[] certs = new TrustManager[]
                {
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
            LOG.warn("GeneralSecurityException while configuring HttpsURLConnection.", ex);
        }
        if(ctx == null)
        {
            LOG.warn("CTX variable is null");
        }
        else
        {
            HttpsURLConnection.setDefaultSSLSocketFactory(ctx.getSocketFactory());

            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });
            LOG.debug("ConnectionBuilder.configure: Configuration finished.");
        }
    }


}

