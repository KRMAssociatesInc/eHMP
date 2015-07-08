package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.util.NullChecker;
import gov.va.vlerdas.service.VlerDasVitalsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.TimeUnit;

/**
 * Service for retrieving all of a given patient's data from the VLER DAS system.
 * This is the main entry point for the VLER DAS client.
 */
@Service
public class VlerDasPatientService implements IVlerDasPatientService, EnvironmentAware {

    private static final Logger LOG = LoggerFactory.getLogger(VlerDasPatientService.class);

    private VlerDasConfiguration configuration;
    private VlerDasVitalsService vitalsService;
    private int parallelismMin = 1;


    public VlerDasVitalsService getVitalsService() {
        return vitalsService;
    }

    @Autowired
    public void setVitalsService(VlerDasVitalsService vitalsService) {
        this.vitalsService = vitalsService;
    }

    public VlerDasConfiguration getConfiguration() {
        return configuration;
    }

    @Autowired
    public void setConfiguration(VlerDasConfiguration configuration) {
        this.configuration = configuration;
    }

    /**
     * Fetches all patient data for the given patient.
     * @param patientIds the patient's ID
     * @return a list of chunks containing the patient's data
     */
    @Override
    public List<VistaDataChunk> fetchVlerDasPatientData(PatientIds patientIds) {

        long startTime = System.currentTimeMillis();

        int availableProcessors = Runtime.getRuntime().availableProcessors();
        int parallelism = (availableProcessors > parallelismMin) ? availableProcessors : parallelismMin;
        ForkJoinPool pool = new ForkJoinPool(parallelism);
        List<VistaDataChunk> chunks = new LinkedList<>();

        if (patientIds == null) {
            throw new IllegalArgumentException("patientIds must not be null");
        }
        if (StringUtils.isEmpty(patientIds.getIcn()) && StringUtils.isEmpty(patientIds.getEdipi())) {
            throw new IllegalArgumentException("Patient must have an ICN or EDIPI");
        }

        // vitals
        VlerDasQuery vitalsQuery = new VlerDasQuery(patientIds, VlerDasDomain.VITALS);
        ForkJoinTask<List<VistaDataChunk>> vitalsTask = pool.submit(new FetchVlerDasDataTask(vitalsService, vitalsQuery));

        //TODO add handling for other domains


        try {
            // get patient data
            List<VistaDataChunk> vistaDataChunks = vitalsTask.join();
            if (NullChecker.isNotNullish(vistaDataChunks)) {
                chunks.addAll(vistaDataChunks);
            }

            //TODO add handling for other domains


        } finally {
            LOG.debug("Total time to fetch VLER DAS patient data: " + (System.currentTimeMillis() - startTime) +
                    "ms, PID: " + patientIds.getPid() + ", using # of CPU: " + parallelism);

            pool.shutdown();

            try {
                if (!pool.awaitTermination(3, TimeUnit.SECONDS)) {
                    pool.shutdownNow();

                    if (!pool.awaitTermination(3, TimeUnit.SECONDS)) {
                        LOG.error("Error terminating pool");
                    }
                }
            } catch (InterruptedException ie) {
                pool.shutdownNow();
            }
        }
        return chunks;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.parallelismMin = Integer.parseInt(environment.getProperty(HmpProperties.JMEADOWS_PARALLELISM));
    }
}
