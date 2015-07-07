package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.med.jmeadows.webservice.*;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static gov.va.jmeadows.JMeadowsClientUtils.calendarToPointInTime;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsMedicationServiceTest {

    private JMeadowsData mockJMeadowsClient;
    private JMeadowsMedicationService jMeadowsMedicationService;
    private Environment mockEnvironment;

    private String vistaId = "B362";
    private String icn = "123456789";
    private String dfn = "4321";
    private String pid = vistaId +";"+ dfn;
    private String uid = "urn:va:patient:"+vistaId+":"+ dfn +":"+ icn;
    private String edipi = "0000000001";

    private String url = "test.url";
    private long timeoutMS = 45000;
    private String userName = "test.username";
    private String userIen = "test.ien";
    private String userSiteCode = "test.sitecode";
    private String userSiteName = "test.sitename";

    private User user;
    private Patient patient;

    /*@Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn("http://10.4.4.104/jMeadows/JMeadowsDataService?wsdl");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" +4500);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn("VEHU,TEN");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn("20012");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn("200");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn("CAMP MASTER");


        this.mockJMeadowsClient = JMeadowsClientFactory.getInstance(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsLabService = new JMeadowsLabService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsLabService.setJMeadowsClient(mockJMeadowsClient);

        user = new User();
        user.setUserIen("20012");
        Site hostSite = new Site();
        hostSite.setSiteCode("200");
        hostSite.setAgency("VA");
        hostSite.setMoniker("CAMP MASTER");
        hostSite.setName("CAMP MASTER");
        user.setHostSite(hostSite);

        patient = new Patient();
        patient.setEDIPI("test.edipi");
    } */



    @Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn(userIen);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn(userSiteCode);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn(userSiteName);

        this.mockJMeadowsClient = mock(JMeadowsData.class);
        this.jMeadowsMedicationService = new JMeadowsMedicationService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsMedicationService.setJMeadowsClient(mockJMeadowsClient);

        user = new User();
        user.setUserIen("test.ien");
        Site hostSite = new Site();
        hostSite.setSiteCode("test.site.code");
        hostSite.setAgency("VA");
        hostSite.setMoniker("test.moniker");
        hostSite.setName("test.site.name");
        user.setHostSite(hostSite);

        patient = new Patient();
        patient.setEDIPI("test.edipi");
    }

    @Test
    public void testFetchPatientOutpatientMedications() {
        try {

            when(this.mockJMeadowsClient.getPatientMedications(any(JMeadowsQuery.class))).thenReturn(createTestData());

            JMeadowsQuery query = new JMeadowsQueryBuilder()
                    .user(user)
                    .patient(patient)
                    .build();

            PatientIds patientIds = new PatientIds.Builder()
                    .pid(pid)
                    .icn(icn)
                    .uid(uid)
                    .edipi(edipi)
                    .build();

            List<VistaDataChunk> vistaDataChunkList = jMeadowsMedicationService.fetchDodPatientOutpatientMedications(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(2));

            List<Medication> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsMedicationService.DOMAIN_MEDICATION, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i+1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;" + edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

                Medication testMed = testDataList.get(i);

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:med:DOD:"+edipi+":"+testMed.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat(testMed.getActive(), is(jsonMap.get("vaStatus")));
                assertThat(testMed.getActive(), is(jsonMap.get("medStatus")));
                assertThat(testMed.getMedType(), is(jsonMap.get("medType")));
//                assertThat(testMed.getMedType(), is(jsonMap.get("vaType")));
                assertThat("UNKNOWN", is(jsonMap.get("vaType")));
                assertThat(testMed.getComment(), is(jsonMap.get("patientInstruction")));
                assertThat(testMed.getDrugName(), is(jsonMap.get("productFormName")));
                assertThat(testMed.getMedId(), is(jsonMap.get("productFormCode")));
                assertThat(testMed.getSigCode(), is(jsonMap.get("sig")));
                assertThat(testMed.getDrugName(), is(jsonMap.get("name")));

                assertThat(calendarToPointInTime(testMed.getFillOrderDate()).toString(),
                        is(jsonMap.get("overallStart")));


                assertThat(calendarToPointInTime(testMed.getStopDate()).toString(),
                        is(jsonMap.get("overallStop")));

                List<Map<String, Object>> orders = (List<Map<String, Object>>)jsonMap.get("orders");
                assertThat(orders.size(), is(1));
                Map<String, Object> order = orders.get(0);

                assertThat(Integer.parseInt(testMed.getDaysSupply()), is(order.get("daysSupply")));
                assertThat(testMed.getQuantity(), is(order.get("quantityOrdered")));
                assertThat(Integer.parseInt(testMed.getRefills()), is(order.get("fillsRemaining")));
                assertThat(testMed.getOrderingProvider(), is(order.get("providerName")));


                List<Map<String, Object>> fills = (List<Map<String, Object>>)jsonMap.get("fills");
                List<PrescriptionFill> pfills = testMed.getPrescriptionFills();

                assertThat(fills.size(), is(pfills.size()));


                int j = 0;
                for(PrescriptionFill aFill : pfills)
                {
                    Map<String, Object> fill = fills.get(j);
                    assertThat(aFill.getDispensingQuantity(), is(fill.get("quantityDispensed")));
                    assertThat(aFill.getDispensingPharmacy(), is(fill.get("dispensingPharmacy")));
                    assertThat(calendarToPointInTime(aFill.getDispenseDate()).toString(),
                            is(fill.get("dispenseDate")));

                    j++;
                }



            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }


    @Test
    public void testFetchPatientInpatientMedications() {
        try {

            when(this.mockJMeadowsClient.getPatientMedications(any(JMeadowsQuery.class))).thenReturn(createTestData());

            JMeadowsQuery query = new JMeadowsQueryBuilder()
                    .user(user)
                    .patient(patient)
                    .build();

            PatientIds patientIds = new PatientIds.Builder()
                    .pid(pid)
                    .icn(icn)
                    .uid(uid)
                    .edipi(edipi)
                    .build();

            List<VistaDataChunk> vistaDataChunkList = jMeadowsMedicationService.fetchDodPatientInpatientMedications(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(2));

            List<Medication> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsMedicationService.DOMAIN_MEDICATION, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i+1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;" + edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

                Medication testMed = testDataList.get(i);

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:med:DOD:"+edipi+":"+testMed.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat(testMed.getActive(), is(jsonMap.get("vaStatus")));
                assertThat(testMed.getActive(), is(jsonMap.get("medStatus")));
                assertThat(testMed.getMedType(), is(jsonMap.get("medType")));
//                assertThat(testMed.getMedType(), is(jsonMap.get("vaType")));
                assertThat("UNKNOWN", is(jsonMap.get("vaType")));
                assertThat(testMed.getComment(), is(jsonMap.get("patientInstruction")));
                assertThat(testMed.getDrugName(), is(jsonMap.get("productFormName")));
                assertThat(testMed.getMedId(), is(jsonMap.get("productFormCode")));
                assertThat(testMed.getSigCode(), is(jsonMap.get("sig")));
                assertThat(testMed.getDrugName(), is(jsonMap.get("name")));

                assertThat(calendarToPointInTime(testMed.getFillOrderDate()).toString(),
                        is(jsonMap.get("overallStart")));


                assertThat(calendarToPointInTime(testMed.getStopDate()).toString(),
                        is(jsonMap.get("overallStop")));

                List<Map<String, Object>> orders = (List<Map<String, Object>>)jsonMap.get("orders");
                assertThat(orders.size(), is(1));
                Map<String, Object> order = orders.get(0);

                assertThat(Integer.parseInt(testMed.getDaysSupply()), is(order.get("daysSupply")));
                assertThat(testMed.getQuantity(), is(order.get("quantityOrdered")));
                assertThat(Integer.parseInt(testMed.getRefills()), is(order.get("fillsRemaining")));
                assertThat(testMed.getOrderingProvider(), is(order.get("providerName")));


                List<Map<String, Object>> fills = (List<Map<String, Object>>)jsonMap.get("fills");
                List<PrescriptionFill> pfills = testMed.getPrescriptionFills();

                assertThat(fills.size(), is(pfills.size()));


                int j = 0;
                for(PrescriptionFill aFill : pfills)
                {
                    Map<String, Object> fill = fills.get(j);
                    assertThat(aFill.getDispensingQuantity(), is(fill.get("quantityDispensed")));
                    assertThat(aFill.getDispensingPharmacy(), is(fill.get("dispensingPharmacy")));
                    assertThat(calendarToPointInTime(aFill.getDispenseDate()).toString(),
                            is(fill.get("dispenseDate")));

                    j++;
                }



            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyMedicationList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientMedications(any(JMeadowsQuery.class))).thenReturn(null);

            JMeadowsQuery query = new JMeadowsQueryBuilder()
                    .user(user)
                    .patient(patient)
                    .build();

            PatientIds patientIds = new PatientIds.Builder()
                    .pid(pid)
                    .icn(icn)
                    .uid(uid)
                    .edipi(edipi)
                    .build();

            List<VistaDataChunk> vistaDataChunkList = jMeadowsMedicationService.fetchDodPatientOutpatientMedications(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

            //return empty list
            when(this.mockJMeadowsClient.getPatientMedications(any(JMeadowsQuery.class))).thenReturn(new ArrayList<Medication>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<Medication> createTestData()   {

        //create two test outpatient medications

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");


        Medication med1 = new Medication()  ;

        XMLGregorianCalendar fillOrderDate1 = null;

        try {
            fillOrderDate1 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            fillOrderDate1.setYear(2010);
            fillOrderDate1.setMonth(8);
            fillOrderDate1.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        med1.setFillOrderDate(fillOrderDate1);

        XMLGregorianCalendar stopDate1 = null;

        try {
            stopDate1 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            stopDate1.setYear(2011);
            stopDate1.setMonth(5);
            stopDate1.setDay(8);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        med1.setStopDate(stopDate1);

        med1.setComment("med1.comment");
        med1.setDrugName("med1.drugname");
        med1.setDaysSupply("14");
        med1.setLastDispensingPharmacy("med1.lastdispensingPharm");
        med1.setQuantity("2");
        med1.setOrderingProvider("med1.orderingProvider");
        med1.setRefills("3");
        med1.setSigCode("med1.sigcode");
        med1.setMedId("med1.medid");
        med1.setActive("med1.status");
        med1.setMedType("med1.type");
        med1.setRXNumber("44");
        med1.setCdrEventId("123");

        //add 2 fill dates
        for(int i = 0; i < 2; i++)
        {
            PrescriptionFill prescriptionFill = new PrescriptionFill();

            XMLGregorianCalendar dispenseDate = null;

            try {
                dispenseDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
                dispenseDate.setYear(2011);
                dispenseDate.setMonth(5);
                dispenseDate.setDay(8);
            }catch (DatatypeConfigurationException dce) {
                fail(dce.getMessage());
            }

            prescriptionFill.setDispenseDate(dispenseDate);
            prescriptionFill.setDispensingPharmacy("med1.dispensingPharm."+(i+1));
            prescriptionFill.setDispensingQuantity("" + (i + 1));

            med1.getPrescriptionFills().add(prescriptionFill);
        }

        med1.setSite(dodSite);
        med1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);

        Medication med2 = new Medication()  ;

        XMLGregorianCalendar fillOrderDate2 = null;

        try {
            fillOrderDate2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            fillOrderDate2.setYear(2011);
            fillOrderDate2.setMonth(5);
            fillOrderDate2.setDay(17);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        med2.setFillOrderDate(fillOrderDate2);

        XMLGregorianCalendar stopDate2 = null;

        try {
            stopDate2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            stopDate2.setYear(2012);
            stopDate2.setMonth(5);
            stopDate2.setDay(19);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        med2.setStopDate(stopDate2);

        med2.setComment("med2.comment");
        med2.setDrugName("med2.drugname");
        med2.setDaysSupply("14");
        med2.setLastDispensingPharmacy("med2.lastdispensingPharm");
        med2.setQuantity("3");
        med2.setOrderingProvider("med2.orderingProvider");
        med2.setRefills("1");
        med2.setSigCode("med2.sigcode");
        med2.setMedId("med2.medid");
        med2.setActive("med2.status");
        med2.setMedType("med2.type");
        med2.setRXNumber("35");
        med2.setCdrEventId("456");

        //add 2 fill dates
        for(int i = 0; i < 2; i++)
        {
            PrescriptionFill prescriptionFill = new PrescriptionFill();

            XMLGregorianCalendar dispenseDate = null;

            try {
                dispenseDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
                dispenseDate.setYear(2011);
                dispenseDate.setMonth(5);
                dispenseDate.setDay(8);
            }catch (DatatypeConfigurationException dce) {
                fail(dce.getMessage());
            }

            prescriptionFill.setDispenseDate(dispenseDate);
            prescriptionFill.setDispensingPharmacy("med1.dispensingPharm."+(i+1));
            prescriptionFill.setDispensingQuantity("" + (i + 1));

            med2.getPrescriptionFills().add(prescriptionFill);
        }

        med2.setSite(dodSite);
        med2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);


        return Arrays.asList(med1, med2);

    }
}
