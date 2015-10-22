package us.vistacore.mocks.resources;

import us.vistacore.mocks.util.NullChecker;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is a temporary way to serve up VLER DAS data via stubbed files.
 */
@Path("/vlerdas")
public class MockVlerDasResource {

    private static Logger logger = LoggerFactory.getLogger(MockVlerDasResource.class);

    /** The Constant MOCK_DATA_DIR. */
    private static final String MOCK_DATA_DIR = "vlerdas/";

    /** The Constant FILENAME_EXTENSION. */
    private static final String FILENAME_EXTENSION = ".xml";

    /** The Constant FILENAME_EXTENSION. */
    private static final String NOT_FOUND_FILEPATH = MOCK_DATA_DIR + "NOT_FOUND.xml";

    /**
     * Gets the patient generated data.
     *
     * @param patientId the patient id
     * @param domain the domain
     * @return the patient generated data
     */
    @GET
    @Path("/{domain}/{patientId}/")
    public Response getPatientGeneratedData(@PathParam("patientId") String patientId, @PathParam("domain") String domain) {
        String filename = getFilePath(patientId, domain);
        System.out.println("filename=" + filename);
        String content = "";
        try {
            content = readFile(filename);
        } catch (IOException e) {
            String message = "MockVlerDasResource.getPatientGeneratedData: Error while reading data file for patient " + patientId;
            logger.warn(message, e);
            return Response.status(Response.Status.NO_CONTENT).type(MediaType.TEXT_PLAIN).entity(message + ": " + e.toString()).build();
        }

        logger.debug("content=" + content);

        if (NullChecker.isNullish(content)) {
            String message = "MockVlerDasResource.getPatientGeneratedData: empty data file for patient " + patientId;
            logger.debug(message);
            try {
                content = readFile(NOT_FOUND_FILEPATH);
            } catch (IOException e) {
                message = "MockVlerDasResource.getPatientGeneratedData: Error while reading data file " + NOT_FOUND_FILEPATH;
                logger.warn(message, e);
                return Response.status(Response.Status.NO_CONTENT).type(MediaType.TEXT_PLAIN).entity(message + ": " + e.toString()).build();

            }

            if (NullChecker.isNullish(content)) {
                return Response.status(Response.Status.NO_CONTENT).type(MediaType.TEXT_PLAIN).entity(message).build();
            }
        }

        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_ATOM_XML).entity(content).build();
    }

    /**
     * Reads a file from the classpath.
     *
     * @param filename the filename
     * @return the string
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private String readFile(String filename) throws IOException {
        String sFileData = null;

        final InputStream isFileData = MockVlerDasResource.class.getClassLoader().getResourceAsStream(filename);

        if (isFileData != null) {
            final StringWriter swFileData = new StringWriter();

            IOUtils.copy(isFileData, swFileData);
            sFileData = swFileData.toString();
        }

        return sFileData;
    }

    /**
     * Gets the file path.
     *
     * @param patientId the patient id
     * @param domain the domain
     * @return the file path
     */
    private String getFilePath(String patientId, String domain) {
        return MOCK_DATA_DIR + domain + File.separator + patientId + FILENAME_EXTENSION;
    }


}
