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
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsLabServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";

    private JMeadowsData mockJMeadowsClient;
    private JMeadowsLabService jMeadowsLabService;
    private Environment mockEnvironment;

    private String vistaId = "9E7A";
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
    }    */



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
        this.jMeadowsLabService = new JMeadowsLabService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsLabService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientLabs() {
        try {

            when(this.mockJMeadowsClient.getPatientLabResults(any(JMeadowsQuery.class))).thenReturn(createTestLabData());

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsLabService.fetchDodPatientLabs(query, patientIds);

            assertNotNull(vistaDataChunkList);


            assertThat(vistaDataChunkList.size(), is(6));

            List<LabResult> testDataList = createTestLabData();

            if (testDataList.size() > 0)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(0);

                assertThat(JMeadowsLabService.DOMAIN_LAB, is(vistaDataChunk.getDomain()));
                assertThat(4, is(vistaDataChunk.getItemCount()));
                assertThat(1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;" + edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

                LabResult testLab = testDataList.get(0);

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat(testLab.getFacilityName(), is(jsonMap.get("facilityName")));
                assertThat(testLab.getTestName(), is(jsonMap.get("displayName")));
                assertThat(testLab.getSpecimen(), is(jsonMap.get("specimen")));
                assertThat(testLab.getOrderId(), is(jsonMap.get("orderId")));
                assertThat(testLab.getResult(), is(jsonMap.get("result")));

                String labOrderDate = (String) jsonMap.get("observed");

                String escapedAccession = testLab.getAccession().replaceAll("[\\s, ^, :]", "-");

                if (testLab.getAccession().contains("CH")) {

                    assertThat("urn:va:lab-category:CH", is(jsonMap.get("categoryCode")));
                    Double low = Double.parseDouble((String) jsonMap.get("low"));
                    assertThat(low, notNullValue());

                    Double high = Double.parseDouble((String) jsonMap.get("high"));
                    assertThat(high, notNullValue());

                    assertThat(testLab.getUnits(), is(jsonMap.get("units")));

                    assertThat("Laboratory", is(jsonMap.get("kind")));
                    assertThat(testLab.getTestName(), is(jsonMap.get("typeName")));

                    String abnormalFlag = (String) jsonMap.get("interpretationCode");
                    assertNotNull(abnormalFlag);
                    assertTrue(abnormalFlag.equals("urn:hl7:observation-interpretation:H") ||
                            abnormalFlag.equals("urn:hl7:observation-interpretation:L") ||
                            abnormalFlag.equals("urn:hl7:observation-interpretation:HH") ||
                            abnormalFlag.equals("urn:hl7:observation-interpretation:LL"));

                    String abnormalFlagName = (String) jsonMap.get("interpretationName");
                    assertNotNull(abnormalFlagName);
                    assertTrue(abnormalFlagName.equals("High") ||
                            abnormalFlagName.equals("Low") ||
                            abnormalFlagName.equals("High alert") ||
                            abnormalFlagName.equals("Low alert"));

                    String testUid = String.format("urn:va:lab:DOD:%s:%s_%s_%s", edipi, labOrderDate,
                            escapedAccession, testLab.getCodes().get(0).getCode());

                    assertThat(testUid, is(jsonMap.get("uid")));
                }
                else if (testLab.getAccession().contains("AP")) {
                    assertThat("urn:va:lab-category:AP", is(jsonMap.get("categoryCode")));
                    assertThat("Pathology", is(jsonMap.get("kind")));
                    assertThat(null, is(jsonMap.get("typeName")));

                    String testUid = String.format("urn:va:lab:DOD:%s:%s_%s",
                            edipi, labOrderDate, escapedAccession);

                    assertThat(testUid, is(jsonMap.get("uid")));
                }
                else if (testLab.getAccession().contains("MI")) {
                    assertThat("urn:va:lab-category:MI", is(jsonMap.get("categoryCode")));
                    assertThat("Microbiology", is(jsonMap.get("kind")));
                    assertThat(null, is(jsonMap.get("typeName")));

                    String testUid = String.format("urn:va:lab:DOD:%s:%s_%s",
                            edipi, labOrderDate, escapedAccession);

                    assertThat(testUid, is(jsonMap.get("uid")));
                }

                assertThat(testLab.getComment(), is(jsonMap.get("comment")));


            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyLabList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientLabResults(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsLabService.fetchDodPatientLabs(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));


            //return empty list
            when(this.mockJMeadowsClient.getPatientLabResults(any(JMeadowsQuery.class))).thenReturn(new ArrayList<LabResult>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testParseReferenceRange() {

        Map<String, String> refRangeMap = jMeadowsLabService.parseReferenceRange(".2-1.3");

        assertThat(refRangeMap.get("low"), is("0.2"));
        assertThat(refRangeMap.get("high"), is("1.3"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("6.3-8.2");

        assertThat(refRangeMap.get("low"), is("6.3"));
        assertThat(refRangeMap.get("high"), is("8.2"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("6.3-.22");

        assertThat(refRangeMap.get("low"), is("6.3"));
        assertThat(refRangeMap.get("high"), is("0.22"));

        refRangeMap = jMeadowsLabService.parseReferenceRange(".35-4.94");

        assertThat(refRangeMap.get("low"), is("0.35"));
        assertThat(refRangeMap.get("high"), is("4.94"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("0.0-2.5");

        assertThat(refRangeMap.get("low"), is("0.0"));
        assertThat(refRangeMap.get("high"), is("2.5"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("0-400");

        assertThat(refRangeMap.get("low"), is("0"));
        assertThat(refRangeMap.get("high"), is("400"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("(25-28.5)");

        assertThat(refRangeMap.get("low"), is("25"));
        assertThat(refRangeMap.get("high"), is("28.5"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("0-40.5");

        assertThat(refRangeMap.get("low"), is("0"));
        assertThat(refRangeMap.get("high"), is("40.5"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("2.5-10)");

        assertThat(refRangeMap.get("low"), is("2.5"));
        assertThat(refRangeMap.get("high"), is("10"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("(5 - 200)");

        assertThat(refRangeMap.get("low"), is("5"));
        assertThat(refRangeMap.get("high"), is("200"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("(5.2 - 21.7)");

        assertThat(refRangeMap.get("low"), is("5.2"));
        assertThat(refRangeMap.get("high"), is("21.7"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("(.23 - .5)");

        assertThat(refRangeMap.get("low"), is("0.23"));
        assertThat(refRangeMap.get("high"), is("0.5"));

        refRangeMap = jMeadowsLabService.parseReferenceRange("2.5-somestringvalue");
        assertTrue(refRangeMap.isEmpty());

        refRangeMap = jMeadowsLabService.parseReferenceRange("somestringvalue-22.5");
        assertTrue(refRangeMap.isEmpty());

        refRangeMap = jMeadowsLabService.parseReferenceRange("(string - otherstring)");
        assertTrue(refRangeMap.isEmpty());

        refRangeMap = jMeadowsLabService.parseReferenceRange("NEGATIVE");
        assertTrue(refRangeMap.isEmpty());

        refRangeMap = jMeadowsLabService.parseReferenceRange("null");
        assertTrue(refRangeMap.isEmpty());
    }

    private Code generateNcid(String codeVal) {
        Code code = new Code();
        code.setSystem("DOD_NCID");
        code.setCode(codeVal);
        return code;
    }


    private List<LabResult> createTestLabData()   {

        //create two test lab results

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");


        LabResult labResult1 = new LabResult();
        labResult1.setAccession("accession test:3^CH");

        labResult1.setTestName("result.test.1");
        labResult1.setResult("result.result.1");
        labResult1.setHiLoFlag("result.hilo.1");
        labResult1.setReferenceRange("0-240");
        labResult1.setUnits("results.units.1");

        XMLGregorianCalendar labDate = null;
        try {
            labDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        } catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }
        labDate.setTime(14, 40, 00);
        labDate.setDay(6);
        labDate.setMonth(3);
        labDate.setYear(2013);

        labResult1.setResultDate(labDate);
        labResult1.setOrderDate(labDate);
        labResult1.setComment("result.comment.1");
        labResult1.setVerifiedBy("result.verfiedby.1");
        labResult1.setUnits("result.units.1");
        labResult1.setSpecimen("result.specimen.1");
        labResult1.setFacilityName("result.facility.1");
        //lab results are unable to use cdr event id as a uid
        labResult1.setCdrEventId(null);
        labResult1.setHiLoFlag("Lower Than Normal");

        labResult1.setSite(dodSite);
        labResult1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        //order id and ncid are used to generate lab uid
        labResult1.setOrderId("1234");
        labResult1.getCodes().add(generateNcid("1"));

        LabResult labResult2 = new LabResult();
        labResult2.setAccession("accession test2 :^CH");
        labResult2.setTestName("result.test.2");
        labResult2.setResult("result.result.2");
        labResult2.setHiLoFlag("result.hilo.2");
        labResult2.setReferenceRange("(10-15)");
        //lab results are unable to use cdr event id as a uid
        labResult2.setCdrEventId(null);
        labResult2.setUnits("result.units.2");
        labResult2.setHiLoFlag("Critical High");

        XMLGregorianCalendar labDate2 = null;
        try {
            labDate2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }
        labDate2.setTime(12, 30, 20);
        labDate2.setDay(5);
        labDate2.setMonth(6);
        labDate2.setYear(2010);

        labResult2.setResultDate(labDate2);
        labResult2.setOrderDate(labDate2);
        labResult2.setComment("result.comment.3");
        labResult2.setVerifiedBy("result.verfiedby.3");
        labResult2.setUnits("result.units.3");
        labResult2.setSpecimen("result.specimen.3");
        labResult2.setFacilityName("result.facility.3");

        labResult2.setSite(dodSite);
        labResult2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        //order id and ncid are used to generate lab uid
        labResult2.setOrderId("1234");
        labResult2.getCodes().add(generateNcid("2"));

        //anatomic pathology
        LabResult labResult3 = new LabResult();
        labResult3.setAccession("accession test3 :^AP");
        labResult3.setTestName("result.test.3");
        labResult3.setResult("result.result.3");
        labResult3.setHiLoFlag("result.hilo.3");
        labResult3.setReferenceRange("(2.2-4.5)");
        //lab results are unable to use cdr event id as a uid
        labResult3.setCdrEventId(null);
        labResult3.setHiLoFlag("Higher Than Normal");

        labDate = null;
        try {
            labDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }
        labDate.setTime(14, 40, 00);
        labDate.setDay(6);
        labDate.setMonth(3);
        labDate.setYear(2013);

        labResult3.setResultDate(labDate);
        labResult3.setOrderDate(labDate);
        labResult3.setComment("result.comment.3");
        labResult3.setVerifiedBy("result.verfiedby.3");
        labResult3.setUnits("result.units.3");
        labResult3.setSpecimen("result.specimen.3");
        labResult3.setFacilityName("result.facility.3");

        labResult3.setSite(dodSite);
        labResult3.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        //order id is used to generate lab uid
        labResult3.setOrderId("1234");

        //microbiology
        LabResult labResult4 = new LabResult();
        labResult4.setAccession("accession test4 :^MI");
        labResult4.setTestName("result.test.4");
        labResult4.setResult("result.result.4");
        labResult4.setHiLoFlag("result.hilo.4");
        labResult4.setReferenceRange("(2.2-4.2)");


        //lab results are unable to use cdr event id as a uid
        labResult4.setCdrEventId(null);

        labDate = null;
        try {
            labDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }
        labDate.setTime(14, 40, 00);
        labDate.setDay(6);
        labDate.setMonth(3);
        labDate.setYear(2013);

        labResult4.setResultDate(labDate);
        labResult4.setOrderDate(labDate);
        labResult4.setComment("result.comment.4");
        labResult4.setVerifiedBy("result.verfiedby.4");
        labResult4.setUnits("result.units.4");
        labResult4.setSpecimen("result.specimen.4");
        labResult4.setFacilityName("result.facility.4");

        labResult4.setSite(dodSite);
        labResult4.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        //order id is used to generate lab uid
        labResult4.setOrderId("1234");


        return Arrays.asList(labResult1,labResult2,labResult3,labResult4);

    }
}
