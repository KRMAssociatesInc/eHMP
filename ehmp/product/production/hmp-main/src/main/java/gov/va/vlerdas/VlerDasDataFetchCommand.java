package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;

import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.abdera.Abdera;
import org.apache.abdera.model.Document;
import org.apache.abdera.model.Feed;
import org.apache.abdera.protocol.Response.ResponseType;
import org.apache.abdera.protocol.client.AbderaClient;
import org.apache.abdera.protocol.client.ClientResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 */
public class VlerDasDataFetchCommand {

    private static final Logger LOGGER = LoggerFactory.getLogger(VlerDasDataFetchCommand.class);

    private VlerDasQuery query;
    private VlerDasConfiguration config;
    private AbderaClient wsClient;


    /**
     * Constructor
     * @param config the VLER DAS client configuration
     * @param query the query parameters
     */
    public VlerDasDataFetchCommand(VlerDasConfiguration config, VlerDasQuery query) {
        this.query = query;
        this.config = config;

        TrustManager tm = new X509TrustManager() {
            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }
            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType)
                    throws CertificateException {
            }
            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType)
                    throws CertificateException {
            }
        };

        AbderaClient.registerTrustManager(tm);
        Abdera abderaService = new Abdera();
        wsClient = new AbderaClient(abderaService);
    }

    public void setWsClient(AbderaClient wsClient) {
        this.wsClient = wsClient;
    }

    public AbderaClient getWsClient() {
        return wsClient;
    }

    /**
     * Executes the command
     * @return the feed received from the VLER DAS system
     * @throws VlerDasException if an unsuccessful response is received from the VLER DAS webservice call
     */
    public Document<Feed> fetchData() throws VlerDasException {
        String pid = getPid(query.getPatientIds());
        String url = constructUrl(pid);

        ClientResponse response = doAbderaRequest(url);
        Document<Feed> vlerData = null;

        if (response.getType() == ResponseType.SUCCESS) {
            vlerData = response.getDocument();
        } else {
            LOGGER.warn("Received failed response from VLER DAS service: " + response.getStatus() + "/"
                    + response.getStatusText() + ", URI=\"" + response.getUri() + "\"");
            throw new VlerDasException("Unable to fetch patient data from VLER DAS for ICN: " + pid);
        }

        return vlerData;
    }

    /**
     * Constructs the URL used to call VLER DAS for the given patient.
     * @param pid the patient id (can be either a IDN or EDIPI
     * @return the URL
     */
    protected String constructUrl(String pid) {
        String domain = query.getDomain().getValue();
        String url = config.getBaseUrl();

        if (!url.endsWith("/")) {
            url += '/';
        }
        return url + domain + "/" + pid; //TODO this will change when we get the info for the real system
    }

    /**
     * Returns the pid to be used when querying VLER DAS. The pid can be either the
     * ICN or the EDIPI
     * @param ids set of ids for the patient who is being queried
     * @return the pid
     */
    protected String getPid(PatientIds ids) throws VlerDasException {
        String pid = ids.getIcn();

        if (pid == null || pid.length() == 0) {
            pid = ids.getEdipi();
        }
        if (pid == null || pid.length() == 0) {
            throw new VlerDasException("Patient does not have an ICN or EDIPI - unable to query VLER DAS");
        }
        return pid;
    }

    private ClientResponse doAbderaRequest(String url) {
        return wsClient.get(url);
    }

//    public static void main(String[] args) {
//        VlerDasConfiguration config = new VlerDasConfiguration(null);
//        config.setBaseUrl("https://10.3.3.5/vlerdas/");
//        VlerDasQuery query = new VlerDasQuery(new PatientIds.Builder().icn("5000000339V988748").build(), VlerDasDomain.VITALS);
//        VlerDasDataFetchCommand command = new VlerDasDataFetchCommand(config, query);
//
//        try {
//            command.fetchData().writeTo(System.out);
//        } catch (Throwable t) {
//            t.printStackTrace();
//        }
//    }
}
