package gov.va.hmp.jsonc;

import org.junit.Test;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.MessageCodesResolver;
import org.springframework.validation.ValidationUtils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JsonCErrorTests {

    @Test
    public void testConstruct() {
        JsonCError jsonc = new JsonCError("foo", "bar");

        JsonCAssert.assertError(jsonc, "foo", "bar");
    }

    @Test
    public void testConstructFromException() throws Exception {
        RuntimeException cause = new RuntimeException("baz");
        RuntimeException ex = new RuntimeException("bar", cause);

        StringWriter stackTrace = new StringWriter();
        ex.printStackTrace(new PrintWriter(stackTrace));

        JsonCError jsonc = new JsonCError("foo", ex);

        JsonCAssert.assertExceptionError(jsonc, "foo", ex);
    }

    @Test
    public void testConstructFromSpringErrors() {
        MessageCodesResolver mockMessageCodesResolver = mock(MessageCodesResolver.class);
        when(mockMessageCodesResolver.resolveMessageCodes("default.blank.message", "foo", "bar", null)).thenReturn(new String[] {"Property [bar] cannot be blank"});
        when(mockMessageCodesResolver.resolveMessageCodes("default.blank.message", "foo", "baz", null)).thenReturn(new String[] {"Property [baz] cannot be blank"});

        MapBindingResult errors = new MapBindingResult(new HashMap(), "foo");
        errors.setMessageCodesResolver(mockMessageCodesResolver);
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "bar", "default.blank.message");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "baz", "default.blank.message");

        JsonCError jsonc = new JsonCError(errors);

        assertThat(jsonc.getCode(), is("Property [bar] cannot be blank"));
        assertThat(jsonc.getMessage(), is("Field error in object 'foo' on field 'bar': rejected value [null]; codes [Property [bar] cannot be blank]; arguments []; default message [null]"));

        List<Map<String,Object>> errorList = jsonc.getErrors();
        assertThat((String) errorList.get(0).get("code"), is("Property [bar] cannot be blank"));
        assertThat((String) errorList.get(0).get("message"), is("Field error in object 'foo' on field 'bar': rejected value [null]; codes [Property [bar] cannot be blank]; arguments []; default message [null]"));
        assertThat((String) errorList.get(1).get("code"), is("Property [baz] cannot be blank"));
        assertThat((String) errorList.get(1).get("message"), is("Field error in object 'foo' on field 'baz': rejected value [null]; codes [Property [baz] cannot be blank]; arguments []; default message [null]"));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructFromSpringErrorsWithNoErrors() {
        JsonCError jsonc = new JsonCError(new MapBindingResult(new HashMap(), "foo"));
    }
}
