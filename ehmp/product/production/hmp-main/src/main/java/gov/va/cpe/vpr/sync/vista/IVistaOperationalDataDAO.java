package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.hmp.jsonc.JsonCCollection;

import java.util.List;
import java.util.Map;

/**
 * Interface to VistA's VPR GET OPERATIONAL DATA abd VPR PUT OBJECT Remote Procedure Calls for fetching and saving operational data from VistA.
 * <p/>
 * Operational data includes the contents of the VPR OBJECT file in addition to domains like "person" (from FileMan NEW PERSON file), "location"
 * (from FileMan HOSPITAL LOCATION file) and others.
 */
public interface IVistaOperationalDataDAO {
    <T extends IPOMObject> T fetchOne(String vistaId, Class<T> type, String domain, String localId);

    <T> List<VistaDataChunk> fetchAllByDomain(String vistaId, Class<T> type);

    List<VistaDataChunk> fetchAllByDomain(String vistaId, String domain);

    <T> VistaDataChunkBatch fetchBatchByDomain(String vistaId, Class<T> type, int limit, String start);

    VistaDataChunkBatch fetchBatchByDomain(String vistaId, String domain, int limit, String start);

    /**
     * Interface to the <code>VPR PUT OBJECT</code> Remote Procedure Call.
     *
     * @param vistaId
     * @param entity
     * @param <T>
     * @return
     */
    <T extends IPOMObject> T save(String vistaId, T entity);

    /**
     * Subscribes
     * @param vistaId
     */
	void subscribe(String vistaId);

    void resetServerSubscriptions(String vistaId);
}
