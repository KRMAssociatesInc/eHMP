package gov.va.cpe.vpr.web;

import gov.va.cpe.web.SetupCommandValidator;
import gov.va.hmp.SetupCommand;
import gov.va.hmp.hub.VistaAccountValidator;
import org.junit.Before;
import org.junit.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class SetupCommandValidatorTests {
    private Validator validator;

    @Before
    public void setUp() throws Exception {
        validator = new SetupCommandValidator(new VistaAccountValidator());
    }

    @Test
    public void testSupports() throws Exception {
        assertThat(validator.supports(SetupCommand.class), is(true));
        assertThat(validator.supports(String.class), is(false));
    }

    @Test
    public void testValidSetupCommand() throws Exception {
        SetupCommand setup = new SetupCommand();

        setup.setServerId("some-string-that-uniquely-identifies-this-instance");
        setup.setServerHost("example.org");
        setup.setHttpPort(8080);
        setup.setHttpsPort(8443);
        setup.getVistaAccount().setVistaId("ABCD");
        setup.getVistaAccount().setDivision("500");
        setup.getVistaAccount().setHost("example.org");
        setup.getVistaAccount().setName("VistA for Unit Tests");

        Errors errors = new BeanPropertyBindingResult(setup, "foo");
        validator.validate(setup, errors);
        assertThat(errors.hasErrors(), is(false));
    }

    @Test
    public void testInvalidSetupCommand() throws Exception {
        SetupCommand setup = new SetupCommand();

        Errors errors = new BeanPropertyBindingResult(setup, "foo");
        validator.validate(setup, errors);
        assertThat(errors.hasErrors(), is(true));
        assertThat(errors.hasFieldErrors("serverId"), is(true));
        assertThat(errors.hasFieldErrors("serverHost"), is(true));
        assertThat(errors.hasFieldErrors("httpPort"), is(true));
        assertThat(errors.hasFieldErrors("httpsPort"), is(true));
        assertThat(errors.hasFieldErrors("vistaAccount.vistaId"), is(true));
        assertThat(errors.hasFieldErrors("vistaAccount.name"), is(true));
        assertThat(errors.hasFieldErrors("vistaAccount.division"), is(true));
        assertThat(errors.hasFieldErrors("vistaAccount.host"), is(true));
    }
}
