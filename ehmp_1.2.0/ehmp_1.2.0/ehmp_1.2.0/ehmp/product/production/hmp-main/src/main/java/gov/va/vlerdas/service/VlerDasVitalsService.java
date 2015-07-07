package gov.va.vlerdas.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.util.VlerDasVitalsMapper;

import org.apache.abdera.model.Document;
import org.apache.abdera.model.Feed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for fetching vitals data from VLER DAS
 */
@Service
public class VlerDasVitalsService extends BaseVlerDasService {

    private static final Logger LOGGER = LoggerFactory.getLogger(VlerDasVitalsService.class);

    @Override
    protected List<VistaDataChunk> transform(Document<Feed> vlerData, PatientIds patientIds) {
        return VlerDasVitalsMapper.getVistaDataChunks(vlerData, patientIds);
    }
}
