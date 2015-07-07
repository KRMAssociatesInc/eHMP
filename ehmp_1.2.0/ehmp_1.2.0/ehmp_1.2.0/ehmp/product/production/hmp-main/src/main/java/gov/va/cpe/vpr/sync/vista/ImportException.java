package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class ImportException extends RuntimeException {

    private final VistaDataChunk chunk;

    public ImportException(String message, VistaDataChunk chunk) {
        super(message);
        this.chunk = chunk;
    }

    public ImportException(VistaDataChunk chunk, Throwable cause) {
        super(ImportException.getMessage(chunk), cause);
        this.chunk = chunk;
    }

    public VistaDataChunk getChunk() {
        return chunk;
    }

    static String getMessage(VistaDataChunk chunk) {
        try {
            return "error importing JSON chunk " + (chunk.getItemIndex() + 1) +
                    " of " + chunk.getItemCount() + " from " + chunk.getRpcUri() + "\n" +
                    new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(chunk.getJson());
        } catch (IOException e) {
            return "error importing JSON chunk";
        }
    }
}
