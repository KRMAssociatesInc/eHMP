package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;

import java.util.*;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;

public class MapToVistaDataChunk implements Converter<Map<String, Object>, VistaDataChunk> {

    private IPatientDAO patientDao;

    @Required
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    public VistaDataChunk convert(Map<String, Object> m) {
        Set<String> keys = new HashSet<String>(Arrays.asList(
                VISTA_ID,
                PATIENT_DFN,
                PATIENT_ID,
                PATIENT_ICN,
                RPC_URI,
                RPC_ITEM_INDEX,
                RPC_ITEM_COUNT,
                RPC_ITEM_CONTENT,
                DOMAIN,
                IS_BATCH,
                CHUNK_TYPE
        ));

        Map chunkFields = subMap(m, keys);
        Map remainingFields = remainderMap(m, keys);

        VistaDataChunk c = new VistaDataChunk();
        c.setSystemId((String) chunkFields.get(VISTA_ID));
        c.setLocalPatientId((String) chunkFields.get(PATIENT_DFN));
        c.setPatientId((String) chunkFields.get(PATIENT_ID));
        c.setPatientIcn((String) chunkFields.get(PATIENT_ICN));
        c.setLocalPatientId((String) chunkFields.get(PATIENT_DFN));
        c.setRpcUri((String) chunkFields.get(RPC_URI));
        c.setItemIndex((Integer) chunkFields.get(RPC_ITEM_INDEX));
        c.setItemCount((Integer) chunkFields.get(RPC_ITEM_COUNT));
        c.setContent((String) chunkFields.get(RPC_ITEM_CONTENT));
        c.setDomain((String) chunkFields.get(DOMAIN));
        c.setBatch((Boolean) chunkFields.get(IS_BATCH));
        c.setType((String)chunkFields.get(CHUNK_TYPE));
        c.setParams(remainingFields);
        return c;
    }

    private Map subMap(Map<String, Object> m, Set<String> keys) {
        Map r = new HashMap();
        for (String key : keys) {
            if (m.containsKey(key)) r.put(key, m.get(key));
        }
        return r;
    }

    private Map remainderMap(Map<String, Object> m, Set<String> keys) {
        Map r = new HashMap();
        for (String key : m.keySet()) {
            if (!keys.contains(key)) {
                r.put(key, m.get(key));
            }
        }
        return r;
    }

}
