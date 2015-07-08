package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsPatientServiceTest {

    private Environment mockEnvironment;
    private String mockAllergyJsonContent = "test.allergy.json";
    private String mockVitalJsonContent = "test.vital.json";

    private String mockLabJsonContent = "test.lab.json";
    private String mockProblemJsonContent = "test.problem.json";
    private String mockMedJsonContent = "test.med.json";
    private String mockRadiologyJsonContent = "test.rad.json";
    private String mockDemographicsJsonContent = "test.patient.json";
    private String mockNoteJsonContent = "test.note.json";
    private String mockConsultJsonContent = "test.consult.json";
    private String mockImmunizationJsonContent = "test.immunization.json";
    private String mockEncounterJsonContent = "test.encounter.json";
    private String mockAppointmentJsonContent = "test.appointment.json";

    private JMeadowsPatientService jMeadowsPatientService;


    @Before
    public void setup() {
        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn("test.url");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("45000");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn("test.username");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn("test.ien");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn("test.sitecode");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn("test.sitename");

        JMeadowsConfiguration jMeadowsConfiguration = new JMeadowsConfiguration(mockEnvironment);

        jMeadowsPatientService = new JMeadowsPatientService();
        jMeadowsPatientService.init();
        jMeadowsPatientService.setJMeadowsConfiguration(jMeadowsConfiguration);

    }


    @Test
    public void testFetchDoDPatientData() {

        jMeadowsPatientService.setJMeadowsAllergyService(createMockAllergyService());
        jMeadowsPatientService.setJMeadowsVitalService(createMockVitalService());
        jMeadowsPatientService.setJMeadowsLabService(createMockLabService());
        jMeadowsPatientService.setJMeadowsDemographicsService(createMockDemographicsService());
        jMeadowsPatientService.setJMeadowsProblemService(createMockProblemService());
        jMeadowsPatientService.setJMeadowsMedicationService(createMockMedService());
        jMeadowsPatientService.setJMeadowsRadiologyService(createMockRadiologyService());
        jMeadowsPatientService.setJMeadowsNoteService(createMockNoteService());
        jMeadowsPatientService.setJMeadowsConsultNoteService(createMockConsultNoteService());
        jMeadowsPatientService.setJMeadowsImmunizationService(createMockImmunizationService());
        jMeadowsPatientService.setJMeadowsEncounterService(createMockEncounterService());
        jMeadowsPatientService.setJMeadowsAppointmentService(createMockAppointmentService());

        PatientIds patientIds = new PatientIds.Builder()
                .pid("test.pid")
                .icn("test.icn")
                .uid("")
                .edipi("test.edipi")
                .build();

        List<VistaDataChunk> respList = jMeadowsPatientService.fetchDodPatientData(patientIds);

        assertNotNull(respList);

        assertTrue(getVistaDataChunkIndexWithContent(respList,mockAllergyJsonContent) != -1);       
        assertTrue(getVistaDataChunkIndexWithContent(respList,mockVitalJsonContent) != -1);

    }

    @Test
    public void testIllegalParamsCheck() {
        PatientIds patientIds = null;

        Exception exception = null;

        try {
            jMeadowsPatientService.fetchDodPatientData(patientIds);
        } catch (Exception e) {
            exception = e;
        }

        assertThat(exception, instanceOf(IllegalArgumentException.class));
    }

    private JMeadowsAllergyService createMockAllergyService() {
        //setup mock allergy retriever
        JMeadowsAllergyService jMeadowsAllergyService = mock(JMeadowsAllergyService.class);

        //create fetchDodPatientAllergies return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockAllergyJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            //mock fetchDodPatientAllergies method
            when(jMeadowsAllergyService
                    .fetchDodPatientAllergies(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsAllergyService;
    }


    private JMeadowsVitalService createMockVitalService() {
        //setup mock vital retriever
        JMeadowsVitalService jMeadowsVitalService = mock(JMeadowsVitalService.class);
        //create fetchDodPatientVitals return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockVitalJsonContent);
        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);
        try {
            //mock fetchDodPatientVitals method
            when(jMeadowsVitalService
                    .fetchDodPatientVitals(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
        return jMeadowsVitalService;
    }


    private JMeadowsLabService createMockLabService() {

        JMeadowsLabService jMeadowsLabService = mock(JMeadowsLabService.class);

        //create fetchDodPatientLabs return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockLabJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

           //mock fetchDodPatientChemistryLabs method
           when(jMeadowsLabService
                    .fetchDodPatientLabs(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsLabService;


    }


    private JMeadowsDemographicsService createMockDemographicsService() {
        //setup mock demographics retriever
        JMeadowsDemographicsService jMeadowsDemographicsService = mock(JMeadowsDemographicsService.class);

        //create fetchDodPatientDemographics return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockDemographicsJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            //mock fetchDodPatientDemographics method
            when(jMeadowsDemographicsService.fetchDodPatientDemographics(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsDemographicsService;
    }


    private JMeadowsProblemService createMockProblemService() {
        //setup mock problems retriever
        JMeadowsProblemService jMeadowsProblemService = mock(JMeadowsProblemService.class);

        //create fetchDodPatientProblems return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockProblemJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            //mock fetchDodPatientProblems method
            when(jMeadowsProblemService.fetchDodPatientProblems(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsProblemService;
    }

    private JMeadowsMedicationService createMockMedService() {
        //setup mock med retriever
        JMeadowsMedicationService jMeadowsMedicationService = mock(JMeadowsMedicationService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockMedJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {


            when(jMeadowsMedicationService.fetchDodPatientOutpatientMedications(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsMedicationService;
    }

    private JMeadowsRadiologyService createMockRadiologyService() {
        //setup mock radiology retriever
        JMeadowsRadiologyService jMeadowsRadiologyService = mock(JMeadowsRadiologyService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockRadiologyJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {


            when(jMeadowsRadiologyService.fetchDodPatientRadiologyReports(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsRadiologyService;
    }

    private JMeadowsNoteService createMockNoteService() {
        //setup mock med retriever
        JMeadowsNoteService jMeadowsNoteService = mock(JMeadowsNoteService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockNoteJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            when(jMeadowsNoteService.fetchDodNotes(any(JMeadowsNoteService.NoteType.class),
                    any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsNoteService;
    }

    private JMeadowsConsultNoteService createMockConsultNoteService() {
        //setup mock med retriever
        JMeadowsConsultNoteService jMeadowsConsultNoteService = mock(JMeadowsConsultNoteService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockConsultJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            when(jMeadowsConsultNoteService.fetchDodConsults(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsConsultNoteService;
    }

    private JMeadowsImmunizationService createMockImmunizationService() {
        //setup
        JMeadowsImmunizationService jMeadowsImmunizationService = mock(JMeadowsImmunizationService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockImmunizationJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            when(jMeadowsImmunizationService.fetchDodPatientImmunizations(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsImmunizationService;
    }

    private JMeadowsEncounterService createMockEncounterService() {
        //setup
        JMeadowsEncounterService jMeadowsEncounterService = mock(JMeadowsEncounterService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockEncounterJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            when(jMeadowsEncounterService.fetchDodPatientEncounters(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsEncounterService;
    }

    private JMeadowsAppointmentService createMockAppointmentService() {
        //setup
        JMeadowsAppointmentService jMeadowsAppointmentService = mock(JMeadowsAppointmentService.class);


        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(mockAppointmentJsonContent);

        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {

            when(jMeadowsAppointmentService.fetchDodPatientAppointments(any(JMeadowsQuery.class), any(PatientIds.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        return jMeadowsAppointmentService;
    }
    
    private int getVistaDataChunkIndexWithContent(List<VistaDataChunk> vistaDataChunkList, String content){
        if (vistaDataChunkList != null){
            for (int index = 0; index < vistaDataChunkList.size(); index++){
                if (vistaDataChunkList.get(index).getContent() == content){
                    return index;
                }
            }
        }
        
        return -1;
    }

}
