package us.vistacore.vxsync.mvi;

import java.util.concurrent.atomic.AtomicLong;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.hl7.v3.PRPAIN201309UV02;
import org.hl7.v3.PRPAIN201310UV02;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.id.*;
import us.vistacore.vxsync.utility.DataConverter;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;

@Path("/mvi")
public class MviRestEndpoint {

	private final String template;
	private final String defaultName;
	private final AtomicLong counter;
	private static final MessageBuilder mviMessageBuilder = new MessageBuilder();
	private final MviSoapConnection connection = new MviSoapConnection();
	private static final Logger LOG = LoggerFactory.getLogger(MviRestEndpoint.class);
	
	public MviRestEndpoint(String template, String defaultName) {
		this.template = template;
		this.defaultName = defaultName;
		this.counter = new AtomicLong();
	}
	
	@Path("/correspondingIds")
	@GET
	@Produces("application/json")
	@Timed
	/** 
	 * Only one of the parameters is required. The first non-null value will be used.
	 * If the first value is invalid for the specified type, an error will be returned.
	 * 
	 * @param edipi
	 * @param icn
	 * @param dfn
	 * @param pid
	 * @return
	 */
	public String getCorrespondingIds(@QueryParam("edipi") String edipi,
									  @QueryParam("icn") String icn,
									  @QueryParam("dfn") String dfn,
									  @QueryParam("pid") String pid) {
		LOG.debug("Received request to getCorrespondingIds");
		PatientIdentifier id = null;
		if (edipi != null) {
			if(Edipi.isIdType(edipi)) {
				id = new Edipi(edipi);
			}
		} else if (icn != null) {
			if(Icn.isIdType(icn)){
				id = new Icn(icn);
			}
		} else if (dfn != null) {
			if(Dfn.isIdType(dfn)) {
				id = new Dfn(dfn);
			}
		} else if (pid != null) {
			id = PatientIdentifier.getPatientId(pid);
		}
		
		if(id != null) {
			if(!(id instanceof MviId)) {
				LOG.debug("Converting standard pid "+id.toString()+" to MVI compatible format");
				if(id instanceof Dfn) {
					id = new MviDfn((Dfn)id);
				}
				if(id instanceof Icn) {
					id = new MviIcn((Icn)id);
				}
				if(id instanceof Edipi) {
					id = new MviEdipi((Edipi)id);
				}
			}
			PRPAIN201309UV02 payload = mviMessageBuilder.getCorrespondingIds((MviId)id);
			PRPAIN201310UV02 response = connection.send1309Message(payload);
			if(response != null) {
				try {
                    LOG.debug("Converting response to JSON...");
                    String answer = DataConverter.convertObjectToJSON(response);
                    LOG.debug("replying: " + answer);
                    return answer;
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
			} else {
				LOG.error("There was a problem processing the SOAP response");
			}
		} else {
			LOG.warn("No valid pid parameter found");
		}
		return null;
	}
}
