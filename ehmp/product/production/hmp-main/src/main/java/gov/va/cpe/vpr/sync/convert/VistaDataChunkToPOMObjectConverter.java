package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.IImportPostProcessor;
import gov.va.cpe.vpr.sync.vista.ImportException;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Map;

public class VistaDataChunkToPOMObjectConverter implements Converter<VistaDataChunk, IPOMObject> {

    private Map<Class<? extends IPOMObject>, IImportPostProcessor> postProcessors;

    public VistaDataChunkToPOMObjectConverter() {
        this(Collections.<Class<? extends IPOMObject>, IImportPostProcessor>emptyMap());
    }

    public VistaDataChunkToPOMObjectConverter(Map<Class<? extends IPOMObject>, IImportPostProcessor> postProcessors) {
        this.postProcessors = postProcessors;
    }

    @Override
    public IPOMObject convert(VistaDataChunk chunk) {
        try {
            Map<String, Object> data = POMUtils.parseJSONtoMap(chunk.getContent());
            if (data == null) throw new ImportException("Reading chunk JSON resulted in a null Map", chunk);
            if (StringUtils.hasText(chunk.getPatientId())) {
                data.put("pid", chunk.getPatientId());
            }

            String uid = (String) data.get("uid");
            if (!StringUtils.hasText(uid)) throw new ImportException("No UID found in import chunk", chunk);

            Class<? extends IPOMObject> domainClass = UidUtils.getDomainClassByUid(uid);
            if (domainClass == null) throw new ImportException("No domain class found for item '" + uid + "' and domain '" + chunk.getDomain() + "'. Verify there is a corresponding UID pattern in " + UidUtils.class, chunk);

            IPOMObject  obj = POMUtils.newInstance(domainClass, data);

            IImportPostProcessor importPostProcessor = postProcessors.get(obj.getClass());
            if (importPostProcessor != null) {
                obj = importPostProcessor.postProcess(obj);
            }
            return obj;
        } catch (Exception e) {
            throw new ImportException(chunk, e);
        }
    }
}
