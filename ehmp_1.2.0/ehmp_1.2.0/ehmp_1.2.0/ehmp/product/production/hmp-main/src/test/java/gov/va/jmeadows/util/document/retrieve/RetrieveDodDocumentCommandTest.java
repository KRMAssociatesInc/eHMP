package gov.va.jmeadows.util.document.retrieve;

import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.jmeadows.JMeadowsQueryBuilder;
import gov.va.med.jmeadows.webservice.*;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.ExecutionException;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class RetrieveDodDocumentCommandTest {

    private static final Integer MAX_THREADS = 2;
    private static final Integer TIMEOUT_MS = 30 * 1000;

    private RetrieveDodDocumentCommand testDodDocCmd;
    private JMeadowsData mockJMeadowsClient;
    private NoteImage testNoteImage;

    private User user;
    private String complexNoteUrl;

    @Before
    public void setup() {
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

        JMeadowsQueryBuilder queryBuilder = new JMeadowsQueryBuilder()
                .user(user)
                .itemId(complexNoteUrl);

        testDodDocCmd = new RetrieveDodDocumentCommand(mockJMeadowsClient, queryBuilder.build(), MAX_THREADS, TIMEOUT_MS);
    }

    @Test
    public void testRetrieval() {

        try {
            NoteImage noteImage = testDodDocCmd.queue().get();

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
            NoteImage noteImage = testDodDocCmd.queue().get();
            fail("Test should have thrown exception");
        } catch (Exception e) {
            assertTrue(e.getCause() instanceof HystrixRuntimeException);
        }
    }
}
