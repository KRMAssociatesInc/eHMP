package us.vistacore.vxsync;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


public class ConnectionException extends WebApplicationException {

	private static final long serialVersionUID = -1413342512199326623L;
	
	public ConnectionException(String message) {
        super(Response.status(Response.Status.SERVICE_UNAVAILABLE)
            .entity(message).type(MediaType.TEXT_PLAIN).build());
    }
}
