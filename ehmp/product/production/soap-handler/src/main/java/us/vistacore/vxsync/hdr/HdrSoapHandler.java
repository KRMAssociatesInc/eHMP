package us.vistacore.vxsync.hdr;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.concurrent.atomic.AtomicLong;

import javax.net.ssl.HttpsURLConnection;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.ConnectionException;
import us.vistacore.vxsync.ServerException;

import com.codahale.metrics.annotation.Timed;

@Path("/hdr")
public class HdrSoapHandler {
    private final String template;
    private final String defaultName;
    private final AtomicLong counter;
    private static final Logger LOG = LoggerFactory.getLogger(HdrSoapHandler.class);

    //array of hdr domains
    private String[] hdrDomains={"med",
            "treatment",
            "diagnosis",
            "visit",
            "education",
            "pov",
            "lab",
            "vlerdocument",
            "skin",
            "surgery",
            "immunization",
            "obs",
            "document",
            "order",
            "auxiliary",
            "mh",
            "consult",
            "procedure",
            "vital",
            "task",
            "cpt",
            "image",
            "problem",
            "factor",
            "roadtrip",
            "appointment",
            "ptf",
            "exam",
            "allergy"};

    public HdrSoapHandler(String template, String defaultName) {
        this.template = template;
        this.defaultName = defaultName;
        this.counter = new AtomicLong();
    }

    /*
    REST end point which makes a call to all the hdr domains, retrieves the data , combines the result and
    returns it back.
    @param - icn
    @return - JSON String
     */
    @Path("/getAllDomainData")
    @GET
    @Timed
    public String getHdrDataAllDomains(@QueryParam("icn")String icn)
    {
        HttpURLConnection conn = null;
        InputStream inputstream=null;
        try {
            StringBuffer hdrOutput=new StringBuffer("[");

            for(int i=0;i<hdrDomains.length;i++)
            {
                URL url = new URL(HdrConnection.getURL(icn, hdrDomains[i]));
                conn = HdrConnection.createConnection(url);
                if (conn.getResponseCode() != HttpsURLConnection.HTTP_OK) {
                    LOG.warn("getHdrData: unexpected response code from HDR connection: " + conn.getResponseCode() +
                            " " + conn.getResponseMessage());
                    return null;
                }

                inputstream = conn.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputstream));
                String line;
                while ((line = reader.readLine()) != null) {
                    hdrOutput.append(line);
                }
                if(i<hdrDomains.length-1)
                {
                    hdrOutput.append(",");
                }

            }
            hdrOutput.append("]");
            inputstream.close();
            conn.disconnect();

            return(hdrOutput.toString());
        }
		catch(javax.xml.ws.WebServiceException e)
		{
			LOG.error("Error getting HDR Data for all hdr domains - icn "+icn+" "+e);
		    Throwable cause = e; 
		    while ((cause = cause.getCause()) != null)
		    {
		        if(cause instanceof SocketTimeoutException)
		        {
					throw new ConnectionException("Error reported from JMeadows");
		        }
		    }
			throw new ServerException("Error reported from JMeadows");
		}
		catch (Exception e) {
			LOG.error("Error getting HDR Data for all hdr domains - icn "+icn+" "+e);
			throw new ServerException("Error reported from JMeadows");
		}
    }

   /*
    REST end point which makes a call to a hdr domains and returns back the JSON output
    @param - icn
    @param - domain
    @return - JSON String - domain data
     */

    @Path("/getData")
    @GET
    @Timed
    public String getHdrData(@QueryParam("icn")String icn,@QueryParam("domain")String domain)
    {
        try {
            StringBuffer hdrOutput=new StringBuffer();
            URL url = new URL(HdrConnection.getURL(icn, domain));
            HttpURLConnection conn = HdrConnection.createConnection(url);
            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK)
            {
                LOG.warn("getHdrData: unexpected response code from HDR connection: " + conn.getResponseCode() +
                            " " + conn.getResponseMessage());
                return null;
            }

            InputStream inputstream = conn.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputstream));
            String line;
            while ((line = reader.readLine()) != null)
            {
                hdrOutput.append(line);
            }
            inputstream.close();
            conn.disconnect();
            return(hdrOutput.toString());
        }
		catch(javax.xml.ws.WebServiceException e)
		{
			LOG.error("Error getting HDR Data for domain "+domain+" icn "+icn+" "+e);
		    Throwable cause = e; 
		    while ((cause = cause.getCause()) != null)
		    {
		        if(cause instanceof SocketTimeoutException)
		        {
					throw new ConnectionException("Error reported from JMeadows");
		        }
		    }
			throw new ServerException("Error reported from JMeadows");
		}
		catch (Exception e) {
			LOG.error("Error getting HDR Data for domain "+domain+" icn "+icn+" "+e);
			throw new ServerException("Error reported from JMeadows");
		}
    }
}
