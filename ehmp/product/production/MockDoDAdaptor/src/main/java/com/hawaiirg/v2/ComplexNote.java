package com.hawaiirg.v2;

import org.apache.commons.io.IOUtils;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Path("complex/note/{noteId}")
public class ComplexNote {

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getComplexNote(@PathParam("noteId") String noteId) {
        String noteFilename = noteId + ".rtf";

        InputStream dataIs = this.getClass().getClassLoader().getResourceAsStream("data"+ File.separatorChar+noteFilename);

        byte[] docBytes = new byte[0];
        try {
            docBytes = IOUtils.toByteArray(dataIs);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Response
                .ok(docBytes, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + noteFilename + "\"")
                .build();
    }
}
