package gov.va.cpe.vpr.pom.jds;

import org.hamcrest.CoreMatchers;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.nio.charset.Charset;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class DefaultJdsExceptionTranslatorTests {

    public static final String ERROR_RESPONSE_JSONC = "{\"apiVersion\":\"1.0\",\"error\":{\"message\":\"BBQ SAUCE!\"}}";

    private DefaultJdsExceptionTranslator t;

    @Before
    public void setUp() throws Exception {
        t = new DefaultJdsExceptionTranslator();
    }

    @Test
    public void testHttpServerErrorException() throws Exception {
        DataAccessException e = t.translate("foo", "/vpr/34", new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "An Internal Server Error Occurred", ERROR_RESPONSE_JSONC.getBytes(), Charset.forName("UTF-8")));
    }

    @Test
    public void testHttpServerErrorExceptionWithEmptyResponseBody() throws Exception {
        DataAccessException e = t.translate("foo", "/vpr/34", new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @Test
    public void testResourceAccessException() throws Exception {
        ResourceAccessException original = new ResourceAccessException("network is down or sommat like that");

        DataAccessException e = t.translate("foo", "/vpr/34", original);

        assertThat(e, instanceOf(DataAccessResourceFailureException.class));
        assertThat((ResourceAccessException) e.getRootCause(), sameInstance(original));
    }
}
