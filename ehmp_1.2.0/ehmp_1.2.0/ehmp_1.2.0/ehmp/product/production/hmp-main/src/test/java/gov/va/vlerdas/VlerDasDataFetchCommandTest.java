package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;
import org.apache.abdera.model.Document;
import org.apache.abdera.protocol.Response;
import org.apache.abdera.protocol.client.AbderaClient;
import org.apache.abdera.protocol.client.ClientResponse;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

/**
 */
public class VlerDasDataFetchCommandTest {

    private static final String TEST_BASE_URL = "http://localhost:8080/test";
    private static final String TEST_ICN = "testIcn123";
    private static final String TEST_EDIPI = "testEdipi123";
    private static final VlerDasDomain TEST_DOMAIN = VlerDasDomain.VITALS;

    private VlerDasDataFetchCommand command;

    @Before
    public void setUp() {
        VlerDasConfiguration config = Mockito.mock(VlerDasConfiguration.class);
        Mockito.when(config.getBaseUrl()).thenReturn(TEST_BASE_URL);

        VlerDasQuery query = new VlerDasQuery(new PatientIds.Builder().icn(TEST_ICN).build(), TEST_DOMAIN);

        command = new VlerDasDataFetchCommand(config, query);
    }

    @Test
    public void testConstructUrl() {

        String url = command.constructUrl(TEST_ICN);

        Assert.assertEquals(TEST_BASE_URL + "/" + TEST_DOMAIN.getValue() + "/" + TEST_ICN, url);
    }

    @Test
    public void testGetPid() throws Exception {

        PatientIds idsWithIcn = createMockPatientIds(TEST_ICN, TEST_EDIPI);
        Assert.assertEquals(TEST_ICN, command.getPid(idsWithIcn));

        PatientIds idsWithEdipi = createMockPatientIds(null, TEST_EDIPI);
        Assert.assertEquals(TEST_EDIPI, command.getPid(idsWithEdipi));
    }

    @Test
    public void testGetPidInvalidIds() {
        PatientIds emptyIcn = createMockPatientIds("", "");
        PatientIds emptyIcnAndEdipi = createMockPatientIds("", "");

        try {
            command.getPid(emptyIcn);
            Assert.fail("Expected VlerDasException");
        } catch (VlerDasException iae) {
            // this was expected
        }

        try {
            command.getPid(emptyIcnAndEdipi);
            Assert.fail("Expected VlerDasException");
        } catch (VlerDasException iae) {
            // this was expected
        }
    }

    @Test
    public void testFetchDataSuccessResponse() {
        Document mockResults = Mockito.mock(Document.class);

        // create mock successful response
        AbderaClient successfulClient = Mockito.mock(AbderaClient.class);
        ClientResponse successResponse = Mockito.mock(ClientResponse.class);
        Mockito.when(successResponse.getType()).thenReturn(Response.ResponseType.SUCCESS);
        Mockito.when(successResponse.getDocument()).thenReturn(mockResults);
        Mockito.when(successfulClient.get(Mockito.anyString())).thenReturn(successResponse);

        // test successful fetch
        try {
            command.setWsClient(successfulClient);
            Assert.assertNotNull(command.fetchData());

        } catch (Throwable t) {
            t.printStackTrace();
            Assert.fail("fetchData should not have thrown an exception");
        }
    }

    @Test
    public void testFetchDataFailureResponse() {
        Document mockResults = Mockito.mock(Document.class);

        // create mock failed response
        AbderaClient failedClient = Mockito.mock(AbderaClient.class);
        ClientResponse failureResponse = Mockito.mock(ClientResponse.class);
        Mockito.when(failureResponse.getType()).thenReturn(Response.ResponseType.SERVER_ERROR);
        Mockito.when(failureResponse.getDocument()).thenReturn(mockResults);
        Mockito.when(failedClient.get(Mockito.anyString())).thenReturn(failureResponse);

        // test failed fetch
        try {
            command.setWsClient(failedClient);
            command.fetchData();

            Assert.fail("fetchData should have thrown an exception");

        } catch (VlerDasException vde) {
            // this was expected
        }
    }

    private PatientIds createMockPatientIds(String icn, String edipi) {
        PatientIds mockIds = Mockito.mock(PatientIds.class);
        Mockito.when(mockIds.getIcn()).thenReturn(icn);
        Mockito.when(mockIds.getEdipi()).thenReturn(edipi);
        return mockIds;
    }
}
