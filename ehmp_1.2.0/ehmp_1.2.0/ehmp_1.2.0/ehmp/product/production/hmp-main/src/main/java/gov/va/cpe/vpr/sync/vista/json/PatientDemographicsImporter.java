package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.ImportException;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.springframework.core.convert.converter.Converter;

import java.util.Map;

public class PatientDemographicsImporter implements Converter<VistaDataChunk, PatientDemographics> {
    @Override
    public PatientDemographics convert(VistaDataChunk chunk) {
        try {
            Map<String, Object> data = POMUtils.parseJSONtoMap(chunk.getContent());
            if (data == null) throw new ImportException("reading chunk JSON resulted in a null Map", chunk);
            PatientDemographics patient = new PatientDemographics(data);
            return patient;
        } catch (Exception e) {
            throw new ImportException(chunk, e);
        }
    }
}



