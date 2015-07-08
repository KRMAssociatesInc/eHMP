package gov.va.vlerdas.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.VlerDasConfiguration;
import gov.va.vlerdas.VlerDasDataFetchCommand;
import gov.va.vlerdas.VlerDasException;
import gov.va.vlerdas.VlerDasQuery;

import org.apache.abdera.model.Document;
import org.apache.abdera.model.Feed;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Base class for the VLER DAS domain-specific data-fetch services
 */
public abstract class BaseVlerDasService implements IVlerDasService {

    private VlerDasConfiguration configuration;

    @Override
    public List<VistaDataChunk> fetchData(VlerDasQuery query) throws VlerDasException {
        Document<Feed> vlerData = new VlerDasDataFetchCommand(configuration, query).fetchData();
        return transform(vlerData, query.getPatientIds());
    }

    @Autowired
    public void setConfiguration(VlerDasConfiguration configuration) {
        this.configuration = configuration;
    }

    public VlerDasConfiguration getConfiguration() {
        return configuration;
    }

    /**
     * Transform domain data from VLER DAS atom feed format into VPR format
     * @param vlerData the data in VLER DAS format
     * @param patientIds 
     * @return The transformed data
     */
    protected abstract List<VistaDataChunk> transform(Document<Feed> vlerData, PatientIds patientIds);
}
