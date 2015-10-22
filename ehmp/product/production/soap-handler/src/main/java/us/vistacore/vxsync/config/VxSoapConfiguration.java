package us.vistacore.vxsync.config;

import io.dropwizard.Configuration;

import org.apache.commons.lang.StringUtils;
import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.hdr.HdrConnection;
import us.vistacore.vxsync.dod.JMeadowsConfig;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import us.vistacore.vxsync.dod.JMeadowsConnection;
import us.vistacore.vxsync.mvi.MviSoapConnection;
import us.vistacore.vxsync.vler.EntityDocQueryConnection;
import us.vistacore.vxsync.vler.EntityDocRetrieveConnection;
import us.vistacore.vxsync.vler.VlerConfig;
import us.vistacore.vxsync.term.TerminologyService;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;


public class VxSoapConfiguration extends Configuration {
    @NotEmpty
    @JsonProperty
    private String template;

    @NotEmpty
    @JsonProperty
    private String defaultName = "VX Sync";

    @Valid
    @NotNull
    @JsonProperty("service")
    private ServicesEnabled servicesEnabled = new ServicesEnabled();

    @Valid
    @JsonProperty("hdr")
    private HdrConfiguration hdrConfiguration = new HdrConfiguration();

    @Valid
    @JsonProperty("pgd")
    private PgdConfiguration pgdConfiguration = new PgdConfiguration();

    @Valid
    @JsonProperty("vler")
    private VlerConfiguration vlerConfiguration = new VlerConfiguration();

    @Valid
    @JsonProperty("jmeadows")
    private DodConfiguration dodConfiguration = new DodConfiguration();

    @Valid
    @JsonProperty("mvi")
    private MviConfiguration mviConfiguration = new MviConfiguration();

    @Valid
    @JsonProperty("h2")
    private H2Configuration h2Configuration = new H2Configuration();
    
    @Valid
    @JsonProperty("security")
    private SecurityConfiguration securityConfig = new SecurityConfiguration();

    private static final Logger LOG = LoggerFactory.getLogger(VxSoapConfiguration.class);


    public ServicesEnabled getServicesEnabled() {
        return servicesEnabled;
    }

    public void setServicesEnabled(ServicesEnabled service) {
        this.servicesEnabled = service;
    }

    public String getTemplate() {
        return template;
    }

    public String getDefaultName() {
        return defaultName;
    }

    public HdrConfiguration getHdrConfiguration() {
        return hdrConfiguration;
    }


    public PgdConfiguration getPgdConfiguration() {
        return pgdConfiguration;
    }

    public void setPgdConfiguration(PgdConfiguration pgdConfiguration) {
        this.pgdConfiguration = pgdConfiguration;
    }

    public VlerConfiguration getVlerConfiguration() {
        return vlerConfiguration;
    }

    public void setVlerConfiguration(VlerConfiguration vlerConfiguration) {

        this.vlerConfiguration = vlerConfiguration;

        LOG.debug("VxSoapConfiguration.setVlerConfiguration - Entering method...()");

        VlerConfig vlerConfig = new VlerConfig();

        vlerConfig.setDocQueryUrl(generateUrlString(vlerConfiguration.getProtocol(),
                vlerConfiguration.getHost(),
                vlerConfiguration.getPort(),
                vlerConfiguration.getDocquerypath(),
                vlerConfiguration.getDocquerypathquery()));

        vlerConfig.setDocQueryTimeoutMs(Integer.parseInt(vlerConfiguration.getDocretrievetimeoutms()));

        vlerConfig.setDocRetrieveUrl(generateUrlString(vlerConfiguration.getProtocol(),
                vlerConfiguration.getHost(),
                vlerConfiguration.getPort(),
                vlerConfiguration.getDocretrievepath(),
                vlerConfiguration.getDocretrievepathquery()));

        vlerConfig.setDocRetrieveTimeoutMs(Integer.parseInt(vlerConfiguration.getDocquerytimeoutms()));
        vlerConfig.setSystemUsername(vlerConfiguration.getSystemusername());
        vlerConfig.setSystemSiteCode(vlerConfiguration.getSystemsitecode());

        EntityDocQueryConnection.setVlerConfig(vlerConfig);
        EntityDocRetrieveConnection.setVlerConfig(vlerConfig);

    }

    public DodConfiguration getDodConfiguration()
    {
        return dodConfiguration;
    }

    public MviConfiguration getMviConfiguration() {
    	return mviConfiguration;
    }

    public void setMviConfiguration(MviConfiguration mviConfiguration) {
    	this.mviConfiguration = mviConfiguration;
    	MviSoapConnection.setConfiguration(mviConfiguration);
    }

    public H2Configuration getH2Configuration() {
    	return h2Configuration;
    }

    public void setH2Configuration(H2Configuration h2Config) {
    	this.h2Configuration = h2Config;
    	TerminologyService.setConfiguration(h2Config);
    }

       /*
    Get the configuration details from config.json and populate it
    @param - HdrConfiguration hdrConfiguration - contains hdr configuration from config.json
     */

    public void setHdrConfiguration(HdrConfiguration hdrConfiguration)
    {
        LOG.debug("VxSoapConfiguration.setHdrConfiguration - Entering method...()");

        HdrConfiguration hdrConfig = new HdrConfiguration();
        hdrConfig.setProtocol(hdrConfiguration.getProtocol());
        hdrConfig.setUri(hdrConfiguration.getUri());
        hdrConfig.setPath(hdrConfiguration.getPath());
        HdrConnection.setHdrConfig(hdrConfig);
    }


    /*
    Get the configuration details from config.json and populate it in JMeadowsConfig
    @param - DodConfiguration dodConfiguration - contains dod configuration from config.json
     */
    public  void setDodConfiguration(DodConfiguration dodConfiguration)
    {
        LOG.debug("VxSoapConfiguration.setDodConfiguration - Entering method...()");

        JMeadowsConfig jMeadowsConfig=JMeadowsConnection.getNewJMeadowsConfigInstance();

        jMeadowsConfig.setPath(dodConfiguration.getPath());
        jMeadowsConfig.setRetry(dodConfiguration.getRetry());
        jMeadowsConfig.setUserName(dodConfiguration.getUsername());
        if(dodConfiguration.getDodDocServiceEnabled()!=null)
            jMeadowsConfig.setDodDocServiceEnabled(dodConfiguration.getDodDocServiceEnabled());

        jMeadowsConfig.setUrl(generateUrlString(
                dodConfiguration.getProtocol(),
                dodConfiguration.getHost(),
                dodConfiguration.getPort(),
                dodConfiguration.getPath(),
                dodConfiguration.getQuery()));

        jMeadowsConfig.setTimeoutMS(Integer.parseInt(dodConfiguration.getTimeoutms()));
        jMeadowsConfig.setUserIen(dodConfiguration.getUserien());
        jMeadowsConfig.setUserSiteName(dodConfiguration.getUsersitename());
        jMeadowsConfig.setUserSiteCode(dodConfiguration.getUsersitecode());
        jMeadowsConfig.setParallelismmin(dodConfiguration.getParallelismmin());

        JMeadowsConnection.setJMeadowsConfig(jMeadowsConfig);

    }

    /**
     * Generates a url from parameters.
     * @param protocol protocol name
     * @param host host name
     * @param port port value
     * @param path url
     * @return A URL generated parameters.
     */
    protected String generateUrlString(String protocol, String host, int port, String path, String query) {

        if (("http".equalsIgnoreCase(protocol) && port == 80) ||
                ("https".equalsIgnoreCase(protocol) && port == 443)) {
            port = -1;
        }

        try {
            return new URI(protocol, null, host, port, path, query, null).toString();
        } catch (URISyntaxException e){
            LOG.error("Error generating url: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
