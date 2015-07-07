package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.util.NullChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;

import static gov.va.jmeadows.JMeadowsClientUtils.createDodJMeadowsQueryBuilder;
import static gov.va.jmeadows.JMeadowsClientUtils.validatePatientIds;
import static gov.va.jmeadows.JMeadowsNoteService.NoteType.INPATIENT;
import static gov.va.jmeadows.JMeadowsNoteService.NoteType.OUTPATIENT;

/**
 * Class retrieves clinical data from the jMeadows webservice.
 */
@Service
public class JMeadowsPatientService implements IJMeadowsPatientService, EnvironmentAware {

    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsPatientService.class);

    private JMeadowsConfiguration jMeadowsConfiguration;

    private IJMeadowsAllergyService jMeadowsAllergyService;
    private IJMeadowsVitalService jMeadowsVitalService;
    private IJMeadowsLabService jMeadowsLabService;
    private IJMeadowsDemographicsService jMeadowsDemographicsService;
    private IJMeadowsProblemService jMeadowsProblemService;
    private IJMeadowsMedicationService jMeadowsMedicationService;
    private IJMeadowsNoteService jMeadowsNoteService;
    private IJMeadowsConsultNoteService jMeadowsConsultNoteService;
    private IJMeadowsRadiologyService jMeadowsRadiologyService;
    private IJMeadowsImmunizationService jMeadowsImmunizationService;
    private IJMeadowsOrderService jMeadowsOrderService;
    private IJMeadowsEncounterService jMeadowsEncounterService;
    private IJMeadowsAppointmentService jMeadowsAppointmentService;

    private int parallelism = 1;
    private static ForkJoinPool pool;

    @Autowired
    public void setJMeadowsConfiguration(JMeadowsConfiguration jMeadowsConfiguration) {
        this.jMeadowsConfiguration = jMeadowsConfiguration;
    }

    @Autowired
    public void setJMeadowsAllergyService(IJMeadowsAllergyService IJMeadowsAllergyService) {
        this.jMeadowsAllergyService = IJMeadowsAllergyService;

    }

    @Autowired
    public void setJMeadowsLabService(IJMeadowsLabService IJMeadowsLabService) {
        this.jMeadowsLabService = IJMeadowsLabService;

    }

    @Autowired
    public void setJMeadowsMedicationService(IJMeadowsMedicationService IJMeadowsMedicationService) {
        this.jMeadowsMedicationService = IJMeadowsMedicationService;

    }

    @Autowired
    public void setJMeadowsRadiologyService(IJMeadowsRadiologyService IJMeadowsRadiologyService)
    {
        this.jMeadowsRadiologyService = IJMeadowsRadiologyService;

    }

    @Autowired
    public void setJMeadowsDemographicsService(IJMeadowsDemographicsService IJMeadowsDemographicsService)
    {
        this.jMeadowsDemographicsService = IJMeadowsDemographicsService;

    }

    @Autowired
    public void setJMeadowsVitalService(IJMeadowsVitalService IJMeadowsVitalService) {
        this.jMeadowsVitalService = IJMeadowsVitalService;
    }

    @Autowired
    public void setJMeadowsProblemService(IJMeadowsProblemService IJMeadowsProblemService) {
        this.jMeadowsProblemService = IJMeadowsProblemService;
    }

    @Autowired
    public void setJMeadowsNoteService(IJMeadowsNoteService IJMeadowsProgressNoteService) {
        this.jMeadowsNoteService = IJMeadowsProgressNoteService;
    }

    @Autowired
    public void setJMeadowsConsultNoteService(IJMeadowsConsultNoteService IJMeadowsConsultNoteService) {
        this.jMeadowsConsultNoteService = IJMeadowsConsultNoteService;
    }


    @Autowired
    public void setJMeadowsImmunizationService(IJMeadowsImmunizationService IJMeadowsImmunizationService) {
        this.jMeadowsImmunizationService = IJMeadowsImmunizationService;
    }

    @Autowired
    public void setJMeadowsOrderService(IJMeadowsOrderService ijMeadowsOrderService) {
        this.jMeadowsOrderService = ijMeadowsOrderService;
    }

    @Autowired
    public void setJMeadowsEncounterService(IJMeadowsEncounterService ijMeadowsEncounterService) {
        this.jMeadowsEncounterService = ijMeadowsEncounterService;
    }

    @Autowired
    public void setJMeadowsAppointmentService(IJMeadowsAppointmentService ijMeadowsAppointmentService) {
        this.jMeadowsAppointmentService = ijMeadowsAppointmentService;
    }

    @PostConstruct
    public void init() {
        //create pool w/ parallelism value from hmp properties
        //max number of threads used by this pool is parallelism value
        pool = new ForkJoinPool(parallelism);
    }

    /**
     * Retrieves DoD clinical data from jMeadows.
     *
     * @param patientIds Patient identifiers container.
     * @return List of patient DoD clinical data.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientData(PatientIds patientIds) {
        LOG.debug("JMeadowsPatientService.fetchDodPatientData - Entering method...");

        validatePatientIds(patientIds);

        List<VistaDataChunk> oaVistaDataChunk = new ArrayList<VistaDataChunk>();

        JMeadowsQueryBuilder queryBuilder = createDodJMeadowsQueryBuilder(patientIds, jMeadowsConfiguration);

        long startTime = System.currentTimeMillis();
        
        Map<String,ForkJoinTask<List<VistaDataChunk>>> tasksList = new HashMap<String,ForkJoinTask<List<VistaDataChunk>>>();
        
        //allergy
        tasksList.put("Allergies", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsAllergyService, "fetchDodPatientAllergies", new Object[]{queryBuilder.build(), patientIds})));
        
        //vitals
        tasksList.put("Vitals", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsVitalService, "fetchDodPatientVitals", new Object[]{queryBuilder.build(), patientIds})));
        
        //labs
        tasksList.put("Labs", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsLabService, "fetchDodPatientLabs", new Object[]{queryBuilder.build(), patientIds})));

        //outpatient meds
        tasksList.put("OutpatientMedications", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsMedicationService, "fetchDodPatientOutpatientMedications",
                new Object[]{queryBuilder.build(), patientIds})));
        
        //inpatient meds
        tasksList.put("InpatientMedications", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsMedicationService, "fetchDodPatientInpatientMedications",
                new Object[]{queryBuilder.build(), patientIds})));
        
        //radiology reports
        tasksList.put("RadiologyReports", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsRadiologyService, "fetchDodPatientRadiologyReports",
                new Object[]{queryBuilder.build(), patientIds})));
        
        //problems
        tasksList.put("Problems", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsProblemService, "fetchDodPatientProblems", new Object[]{queryBuilder.build(), patientIds})));
        
        //outpatient notes
        tasksList.put("OutpatientNotes", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsNoteService, "fetchDodNotes", new Object[]{OUTPATIENT, queryBuilder.build(), patientIds})));
        
        //inpatient notes
        tasksList.put("InpatientNotes", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsNoteService, "fetchDodNotes", new Object[]{INPATIENT, queryBuilder.build(), patientIds})));
        
        //consult notes
        tasksList.put("Consults", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsConsultNoteService, "fetchDodConsults", new Object[]{queryBuilder.build(), patientIds})));
        
        //demographics
        tasksList.put("Demographics", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsDemographicsService, "fetchDodPatientDemographics",
                new Object[]{queryBuilder.build(), patientIds})));

        //immunizations
        tasksList.put("Immunizations", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsImmunizationService, "fetchDodPatientImmunizations",
                new Object[]{queryBuilder.build(), patientIds})));

        //orders
        tasksList.put("Orders", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsOrderService, "fetchDodPatientOrders", new Object[]{queryBuilder.build(), patientIds})));

        //encounters
        tasksList.put("Encounters", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsEncounterService, "fetchDodPatientEncounters", new Object[]{queryBuilder.build(), patientIds})));

        //appointments
        tasksList.put("Appointments", pool.submit(new FetchDoDPatientDataTask(
                jMeadowsAppointmentService, "fetchDodPatientAppointments", new Object[]{queryBuilder.build(), patientIds})));
        
        try {
        	Set<String> keys = tasksList.keySet();
        	if (NullChecker.isNotNullish(keys)){
        		for(String key : keys){
        			oaVistaDataChunk.addAll(tasksList.get(key).join());
        		}
        	}
        }
        catch(RuntimeException  re){
            ForkJoinTask<List<VistaDataChunk>> task;
            Set<String> keys = tasksList.keySet();

            if (NullChecker.isNotNullish(keys)){
                for(String key : keys){
                    task = tasksList.get(key);
                    if (!task.isDone()){
                        if(task.cancel(true)){
                            LOG.debug(key + " task cancelled successfully!.");        				
                        }
                        else{
                            LOG.debug(key + " task could not be cancelled!.");	        			
                        }
                    }
                }
            }

            throw re;
        }
        finally {
            LOG.debug("total time to fetch DoD patient data: " + (System.currentTimeMillis() - startTime) +
                    "ms, PID: " + patientIds.getPid() + ", parallelism: " + pool.getParallelism());
        }

        LOG.debug("JMeadowsPatientService.fetchDodPatientData - Leaving method with " + oaVistaDataChunk.size() + " VistaDataChunk objects.");
        return oaVistaDataChunk;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.parallelism = Integer.parseInt(environment.getProperty(HmpProperties.JMEADOWS_PARALLELISM));
    }
}
