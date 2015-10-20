package us.vistacore.mocks.resources;

import static us.vistacore.mocks.util.NullChecker.isNotNullish;
import static us.vistacore.mocks.util.NullChecker.isNullish;

import us.vistacore.mocks.webapi.JsonResponseMessage;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("repositories.domain.ext")
public class MockCDSResource {

    private static Logger logger = LoggerFactory.getLogger(MockCDSResource.class);

    private static final String DATA_RESOURCE_PATH = "mockcds/";
    private static final String DATA_RESOURCE_EXTENSION = ".json";

    protected static final String EXPECTED_TEMPLATE = "GenericObservationRead1";
    protected static final String EXPECTED_FILTER = "GENERIC_VISTA_LIST_DATA_FILTER";
    protected static final String EXPECTED_TYPE = "json";

    @GET
    @Path("/fpds/{domain}")
    public Response fpds(@PathParam("domain") String domain,
                         @QueryParam("clientName") String clientName,
                         @QueryParam("clientRequestInitiationTime") String clientRequestInitiationTime,
                         @QueryParam("requestId") String requestId,
                         @QueryParam("nationalId") String nationalId, // ICN
                         @QueryParam("excludeIdentifier") List<String> excludeIdentifier,
                         @QueryParam("resolvedIdentifier") List<String> resolvedIdentifier, // <dfn>-<assigningFacility>-<assigningAuthority>
                         @QueryParam("max") int max,
                         @DefaultValue(EXPECTED_TYPE) @QueryParam("_type") String type,
                         @QueryParam("templateId") String templateId,
                         @QueryParam("filterId") String filterId) {
        Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
        String content = "";

        try {
            content = Resources.toString(Resources.getResource(DATA_RESOURCE_PATH + domain + DATA_RESOURCE_EXTENSION), Charsets.UTF_8);
            status = Response.Status.OK;

            if (!EXPECTED_TEMPLATE.equalsIgnoreCase(templateId)) {
                status = Response.Status.BAD_REQUEST;
                content = buildJsonResponse(status, "Bad Template Id: " + templateId);
            } else if (!EXPECTED_FILTER.equalsIgnoreCase(filterId)) {
                status = Response.Status.BAD_REQUEST;
                content = buildJsonResponse(status, "Bad Filter Id: " + filterId);
            } else if (isNullish(clientName)) {
                status = Response.Status.BAD_REQUEST;
                content = buildJsonResponse(status, "Missing required parameter: clientName");
            } else if ((isNotNullish(type)) && !EXPECTED_TYPE.equalsIgnoreCase(type)) {
                status = Response.Status.BAD_REQUEST;
                content = buildJsonResponse(status, "Requested datatype of " + type + " is not supported.");
            }
        } catch (IOException | IllegalArgumentException e) {
            logger.warn("MockCDSResource.fpds: Error while reading data file.", e);
            status = Response.Status.NO_CONTENT;
            content = buildJsonResponse(status, "Requested data domain of " + domain + " is not supported.");
        }

        return Response.status(status).type(MediaType.APPLICATION_JSON).entity(content).build();
    }

    private String buildJsonResponse(Response.Status status, String content) {
        return new JsonResponseMessage(status, content).toJson();
    }

}
