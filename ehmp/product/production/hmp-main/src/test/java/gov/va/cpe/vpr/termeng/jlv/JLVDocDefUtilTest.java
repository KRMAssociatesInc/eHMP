package gov.va.cpe.vpr.termeng.jlv;

import static org.junit.Assert.*;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.*;

public class JLVDocDefUtilTest {
    private String EXAMPLE_CHUNK = 
                    "{\"documentClass\":\"DISCHARGE SUMMARY\"," + 
                     "\"documentDefUid\":\"urn:va:doc-def:9E7A:1\", " + 
                     "\"documentTypeCode\":\"DS\"," + 
                     "\"documentTypeName\":\"Discharge Summary\"," + 
                     "\"encounterName\":\"7A GEN MED Mar 25, 2004\"," + 
                     "\"encounterUid\":\"urn:va:visit:9E7A:3:3313\"," + 
                     "\"entered\":20040331090458," + 
                     "\"facilityCode\":998," + 
                     "\"facilityName\":\"ABILENE (CAA)\"," + 
                     "\"localId\":2745," + 
                     "\"localTitle\":\"Discharge Summary\"," + 
                     "\"referenceDateTime\":20040325191705," + 
                     "\"status\":\"COMPLETED\"," + 
                     "\"text\":[" + 
                     "{" + 
                         "\"clinicians\":[" + 
                         "{" + 
                             "\"name\":\"VEHU,EIGHT\"," + 
                             "\"role\":\"AU\"," + 
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}," + 
                         "{" + 
                             "\"name\":\"VEHU,EIGHT\"," + 
                             "\"role\":\"S\"," + 
                             "\"signature\":\"\"," + 
                             "\"signedDateTime\":20040331090512," + 
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}," + 
                         "{" + 
                             "\"name\":\"VEHU,EIGHT\"," + 
                             "\"role\":\"ES\"," + 
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}," + 
                         "{" + 
                             "\"name\":\"VEHU,EIGHT\"," + 
                             "\"role\":\"EC\"," + 
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}," + 
                         "{" + 
                             "\"name\":\"V8\"," + 
                             "\"role\":\"E\"," + 
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}," + 
                         "{\"name\":\"VEHU,EIGHT\"," + 
                             "\"role\":\"ATT\"," +
                             "\"uid\":\"urn:va:user:9E7A:20010\"" + 
                         "}]," + 
                         "\"content\":\"ADMISSION DIAGNOSIS: 1.Respite Care 2. S/P Cervical spine fracture and" + 
                                      " fusion with residual neurologic deficits 3. CAD h/o MI s/p stent " + 
                                      "placement and AICD implantation PROBLEMS ADDRESSED IN NURSING HOME " + 
                                      "AND COURSE OF TREATMENT(include any procedures performed during " + 
                                      "admission):The patient is a 86-yr old who was admitted for a 5-day " + 
                                      "respite so spouse can take a rest.The patient has an internist and a " + 
                                      "cardiologist that follows him and goes to Clinic once or twice a year " + 
                                      "for medications. His last respite was for a week in September of " + 
                                      "last year. He has HHA two hours a day for 2 days. His dxes are as above. " + 
                                      "All his meds were continued except that because of an above " + 
                                      " therapeutic INR.  DISCHARGE DIAGNOSES(include GAF " + 
                                      "score): Same as admn dxes BEHAVIORAL ISSUES: None. " + 
                                      "AMBULATORY STATUS:He walks with a walker for short distances. Transfers " + 
                                      "independently NUTRITIONAL STATUS: Fair REHAB. " + 
                                      "POTENTIAL: N/A PHYSICIAN RECOMMENDATIONS FOR CARE(also see " + 
                                      "attached medication list):Active Outpatient Medications " + 
                                      "(including Supplies):METOPROLOL 50MG S.T. TAKE ONE TABLET " + 
                                      "BY BY MOUTH TWICE A    ACTIVE DAY SIMVASTATIN 40MG TAB TAKE " + 
                                      "ONE TABLET BY BY MOUTH EVERY      ACTIVE  EVENING\"," + 
                         "\"dateTime\":20040325191705," + 
                         "\"status\":\"COMPLETED\"," + 
                         "\"uid\":\"urn:va:document:9E7A:3:2745\"" + 
                     "}]," + 
                     "\"uid\":\"urn:va:document:9E7A:3:2745\"," + 
                     "\"urgency\":\"routine\"" + 
                 "}";    
    private String EXAMPLE_RESPONSE = 
                "{" +
                    "\"apiVersion\": \"1.0\"," +
                    "\"data\": {" +
                        "\"updated\": 20140813175207," +
                        "\"totalItems\": 1," +
                        "\"currentItemCount\": 1," +
                        "\"items\": [" +
                            "{" +
                                "\"abbreviation\": \"DCS\"," +
                                "\"name\": \"DISCHARGE SUMMARY\"," +
                                "\"displayName\": \"Discharge Summary\"," +
                                "\"statusName\": \"ACTIVE\"," +
                                "\"statusUid\": \"urn:va:doc-status:9E7A:11\"," +
                                "\"typeName\": \"TITLE\"," +
                                "\"typeUid\": \"urn:va:doc-type:9E7A:DOC\"," +
                                "\"classOwner\": \"urn:va:asu-class:9E7A:55\"," +
                                "\"nationalStandard\": true," +
                                "\"uid\": \"urn:va:doc-def:9E7A:1\"," +
                                "\"summary\": \"Discharge Summary\"," +
                                "\"nationalTitle\": {" +
                                    "\"name\": \"DISCHARGE SUMMARY\"," +
                                    "\"vuid\": \"urn:va:vuid:4693715\"" +
                                "}," +
                                "\"nationalTitleType\": {" +
                                    "\"name\": \"DISCHARGE SUMMARY\"," +
                                    "\"vuid\": \"urn:va:vuid:4696112\"" +
                                "}" +
                            "}" +
                        "]" +
                    "}" +
                "}";                    

    private JLVDocDefUtil testSubject = null;
    private JdsOperations mockJdsTemplate;
    private JsonNode exampleChunkNode = null;

    @Before
    public void setUp() throws Exception {
        mockJdsTemplate = mock(JdsOperations.class);
        testSubject = new JLVDocDefUtil(mockJdsTemplate);
        
        ObjectMapper jsonMapper = new ObjectMapper();
        JsonFactory jsonFactory = jsonMapper.getFactory(); // since 2.1 use mapper.getFactory() instead
        JsonParser jsonParser = jsonFactory.createParser(EXAMPLE_RESPONSE);
        JsonNode exampleJsonResponse = jsonMapper.readTree(jsonParser);
        when(mockJdsTemplate.getForJsonNode(any(String.class))).thenReturn(exampleJsonResponse);
        
        jsonParser = jsonFactory.createParser(EXAMPLE_CHUNK);
        exampleChunkNode = jsonMapper.readTree(jsonParser);
    }

    @Test
    public void testInsertVuid() {
        PatientDemographics pt = null;
        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk("1", "", exampleChunkNode, "document", 1, 1, pt, null, true, VistaDataChunk.NEW_OR_UPDATE);
        testSubject.insertVuidFromDocDefUid(chunk);
        assertNotNull(chunk.getJsonMap());
        assertEquals("The vuid was not correct.", "urn:va:vuid:4693715", chunk.getJsonMap().get("documentDefUidVuid"));
    }
    
}