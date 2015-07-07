package gov.va.cpe.vpr.sync.vista;

import java.util.List;

public class VistaDataChunkBatch {
    private List<VistaDataChunk> chunks;
    private String startId;
    private String lastId;

    public VistaDataChunkBatch(List<VistaDataChunk> chunks, String startId, String lastId) {
        this.chunks = chunks;
        this.startId = startId;
        this.lastId = lastId;
    }

    public List<VistaDataChunk> getChunks() {
        return chunks;
    }

    public String getStartId() {
        return startId;
    }

    public String getLastId() {
        return lastId;
    }
}
