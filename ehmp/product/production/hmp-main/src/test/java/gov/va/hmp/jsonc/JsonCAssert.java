package gov.va.hmp.jsonc;

import gov.va.hmp.jsonc.JsonCResponse;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class JsonCAssert {
    public static void assertError(JsonCResponse jsonc, String code, String message) {
        assertThat(jsonc.getSuccess(), is(false));
        assertThat(jsonc.data, nullValue());
        assertThat(jsonc.error.code, is(code));
        assertThat(jsonc.error.message, is(message));

        assertThat(jsonc.error.errors.size(), is(1));
        assertThat((String) jsonc.error.errors.get(0).get("code"), is(code));
        assertThat((String) jsonc.error.errors.get(0).get("message"), is(message));
    }

    public static void assertExceptionError(JsonCResponse jsonc, String code, Exception ex) {
        assertThat(jsonc.getSuccess(), is(false));
        assertThat(jsonc.data, nullValue());
        assertThat(jsonc.error.code, is(code));
        assertThat(jsonc.error.message, is(ex.getMessage()));

        assertThat(jsonc.error.errors.size(), is(1));
        assertThat((String) jsonc.error.errors.get(0).get("code"), is(code));
        assertThat((String) jsonc.error.errors.get(0).get("message"), is(ex.getMessage()));
        assertThat((String) jsonc.error.errors.get(0).get("exception"), is(ex.getClass().getName()));

        StringWriter sw = new StringWriter();
        ex.printStackTrace(new PrintWriter(sw));
        String stackTrace = sw.toString();
        assertThat((String) jsonc.error.errors.get(0).get("stackTrace"), is(stackTrace));

        Throwable cause = ex.getCause();
        if (cause != null) {
            assertThat((String) jsonc.error.errors.get(0).get("causedBy"), is(cause.getClass().getName()));
            assertThat((String) jsonc.error.errors.get(0).get("causedByMessage"), is(cause.getMessage()));

            StackTraceElement stackTraceElement = cause.getStackTrace()[0];
            assertThat((String) jsonc.error.errors.get(0).get("causedByFileName"), is(stackTraceElement.getFileName()));
            assertThat((Integer) jsonc.error.errors.get(0).get("causedByLineNumber"), is(stackTraceElement.getLineNumber()));
            assertThat((String) jsonc.error.errors.get(0).get("causedByClassName"), is(stackTraceElement.getClassName()));
            assertThat((String) jsonc.error.errors.get(0).get("causedByMethodName"), is(stackTraceElement.getMethodName()));
        }
    }
}
