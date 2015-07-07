package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.springframework.core.convert.converter.Converter;

import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.*;

public class VistaDataChunkToMap implements Converter<VistaDataChunk, Map<String, Object>> {

    public Map<String, Object> convert(VistaDataChunk c) {
        Map<String, Object> m = new HashMap<String, Object>();

        m.put(VISTA_ID, c.getSystemId());
        m.put(PATIENT_DFN, c.getLocalPatientId());

        m.putAll(c.getParams());

        m.put(PATIENT_ID, c.getPatientId());
        m.put(PATIENT_ICN, c.getPatientIcn());
        m.put(PATIENT_DFN, c.getLocalPatientId());

        m.put(DOMAIN, c.getDomain());

        m.put(RPC_URI, c.getRpcUri());
        m.put(RPC_ITEM_INDEX, c.getItemIndex());
        m.put(RPC_ITEM_COUNT, c.getItemCount());
        m.put(RPC_ITEM_CONTENT, c.getContent());

        m.put(IS_BATCH, c.isBatch());
        m.put(CHUNK_TYPE, c.getType());

        if(c.getContent()!=null && POMUtils.isValidJSON(c.getContent())) {
            m.putAll(POMUtils.parseJSONtoMap(c.getContent()));
        }

        return m;
    }
}
