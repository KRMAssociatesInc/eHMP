package us.vistacore.vxsync;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class ServerException extends WebApplicationException {

	private static final long serialVersionUID = 1L;

	public ServerException(String message) {
        super(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(message).type(MediaType.TEXT_PLAIN).build());
    }
}
