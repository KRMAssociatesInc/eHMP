package gov.va.jmeadows.util.document.retrieve;

import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.JMeadowsQueryBuilder;
import gov.va.med.jmeadows.webservice.*;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.util.concurrent.ExecutionException;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class RetrieveDodDocumentServiceTest {

    private RetrieveDodDocumentService retrieveDodDocumentService;
    private Environment mockEnvironment;
    private RetrieveDocumentConfiguration config;
    private JMeadowsData mockJMeadowsClient;
    private NoteImage testNoteImage;

    private String url = "test.url";
    private long timeoutMS = 45000;
    private String userName = "test.username";
    private String userIen = "test.ien";
    private String userSiteCode = "test.sitecode";
    private String userSiteName = "test.sitename";
    private User user;
    private String complexNoteUrl;
    private JMeadowsQueryBuilder queryBuilder;

    @Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn(userIen);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn(userSiteCode);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn(userSiteName);
        when(mockEnvironment.getProperty(HmpProperties.DOC_RETRIEVE_MAX_THREADS)).thenReturn("2");
        when(mockEnvironment.getProperty(HmpProperties.DOC_RETRIEVE_TIMEOUT_MS)).thenReturn("30000");

        config = new RetrieveDocumentConfiguration(mockEnvironment);

        mockJMeadowsClient = mock(JMeadowsData.class);

        testNoteImage = new NoteImage();
        testNoteImage.setNoteBytes("Test note image".getBytes());
        testNoteImage.setContentType("application/octet-stream");
        testNoteImage.setContentDisposition("Content-Disposition', \"attachment; filename=dodnote.rtf");

        try {
            when(mockJMeadowsClient.getBHIENoteImage(any(JMeadowsQuery.class))).thenReturn(testNoteImage);
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        user = new User();
        user.setUserIen("test.ien");
        Site hostSite = new Site();
        hostSite.setSiteCode("test.site.code");
        hostSite.setAgency("VA");
        hostSite.setMoniker("test.moniker");
        hostSite.setName("test.site.name");
        user.setHostSite(hostSite);

        complexNoteUrl = "http://localhost:8080/MockDoDAdaptor/async/complex/note/2157582888";

        queryBuilder = new JMeadowsQueryBuilder()
                .user(user)
                .itemId(complexNoteUrl);

        retrieveDodDocumentService = new RetrieveDodDocumentService(config);
        retrieveDodDocumentService.setJMeadowsClient(mockJMeadowsClient);
    }

    @Test
    public void testRetrieveDoDDocument() {
        try {
            NoteImage noteImage = retrieveDodDocumentService.retrieveDodDocument(queryBuilder.build()).get();

            try {
                verify(mockJMeadowsClient).getBHIENoteImage(any(JMeadowsQuery.class));
            } catch (JMeadowsException_Exception e) {
                fail(e.getMessage());
            }

            assertThat(noteImage.getNoteBytes(), is(testNoteImage.getNoteBytes()));
            assertThat(noteImage.getContentType(), is(testNoteImage.getContentType()));
            assertThat(noteImage.getContentDisposition(), is(testNoteImage.getContentDisposition()));

        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testFailure() {
        try {
            when(mockJMeadowsClient.getBHIENoteImage(any(JMeadowsQuery.class))).thenThrow(new JMeadowsException_Exception("test exception", new JMeadowsException()));
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }

        try {
            retrieveDodDocumentService.retrieveDodDocument(queryBuilder.build()).get();
            fail("Test should have thrown exception");
        } catch (Exception e) {
            assertTrue(e.getCause() instanceof HystrixRuntimeException);
        }
    }
}
