package gov.va.cpe.rpc;

import org.junit.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class RpcCommandValidatorTests {

    private Validator v = new RpcCommandValidator();

    @Test
    public void testSupports() throws Exception {
        assertThat(v.supports(RpcCommand.class), is(true));
    }

    @Test
    public void testValid() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");
        rpc.setName("BAR");

        Errors errors = new BeanPropertyBindingResult(rpc, "rpc");
        v.validate(rpc, errors);
        assertThat(errors.hasErrors(), is(false));
    }

    @Test
    public void testMissingRpcContextIsInvalid() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setName("BAR");

        Errors errors = new BeanPropertyBindingResult(rpc, "rpc");
        v.validate(rpc, errors);
        assertThat(errors.hasErrors(), is(true));
    }

    @Test
    public void testMissingRpcNameIsInvalid() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");

        Errors errors = new BeanPropertyBindingResult(rpc, "rpc");
        v.validate(rpc, errors);
        assertThat(errors.hasErrors(), is(true));
    }
}
