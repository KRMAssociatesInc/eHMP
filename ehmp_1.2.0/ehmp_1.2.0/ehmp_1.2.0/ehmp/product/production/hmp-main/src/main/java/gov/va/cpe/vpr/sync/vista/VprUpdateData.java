package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Class that holds the results of one call to one VistA system's VPR updates.
 *
 * @see VprUpdateJob
 */
public class VprUpdateData {

    private String lastUpdate;
    private PointInTime startDateTime;
    private PointInTime endDateTime;
    private List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>();
    private Set<String> uidsToDelete = new HashSet<>();
    private List<Exception> exceptions = new ArrayList<Exception>();
    private PointInTime callTime;
    private List<String> updatedDomains;

    public List<String> getUpdatedDomains() {
		return updatedDomains;
	}

	public void setUpdatedDomains(List<String> updatedDomains) {
		this.updatedDomains = updatedDomains;
	}

	public String getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(String lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    /**
     * A list of {@link gov.va.cpe.vpr.sync.vista.VistaDataChunk}s to insert or update in the VPR.
     */
    public List<VistaDataChunk> getChunks() {
        return chunks;
    }

    public void setChunks(List<VistaDataChunk> chunks) {
        this.chunks = chunks;
    }

    /**
     * A list of UIDs to individial items to remove from the VPR.
     * <p/>
     * These are usually generated from "enterred in error" or "retracted" items.
     */
    public Set<String> getUidsToDelete() {
        return uidsToDelete;
    }

    public void setUidsToDelete(Set<String> uidsToDelete) {
        this.uidsToDelete = uidsToDelete;
    }

    public List<Exception> getExceptions() {
        return exceptions;
    }

    public void setExceptions(List<Exception> exceptions) {
        this.exceptions = exceptions;
    }

    public PointInTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(PointInTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public PointInTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(PointInTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    @JsonIgnore
    public void setCallTime(PointInTime callTime) {
        this.callTime = callTime;
    }

    @JsonIgnore
    public PointInTime getCallTime() {
        return callTime;
    }
}
