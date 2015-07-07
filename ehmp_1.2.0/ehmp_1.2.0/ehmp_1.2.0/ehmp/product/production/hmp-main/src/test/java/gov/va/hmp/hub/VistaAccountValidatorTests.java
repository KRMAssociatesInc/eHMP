package gov.va.hmp.hub;

import org.junit.Before;
import org.junit.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class VistaAccountValidatorTests {

    private Validator validator;

    @Before
    public void setUp() throws Exception {
        validator = new VistaAccountValidator();
    }

    @Test
    public void testSupports() throws Exception {
        assertThat(validator.supports(VistaAccount.class), is(true));
        assertThat(validator.supports(String.class), is(false));
    }

    @Test
    public void testValidVistaAccount() throws Exception {
        VistaAccount vistaAccount = new VistaAccount();
        vistaAccount.setVistaId("ABCD");
        vistaAccount.setDivision("500");
        vistaAccount.setHost("example.org");
        vistaAccount.setName("VistA for Unit Tests");

        Errors errors = new BeanPropertyBindingResult(vistaAccount, "foo");
        validator.validate(vistaAccount, errors);
        assertThat(errors.hasErrors(), is(false));
    }

    @Test
    public void testInvalidVistaAccountMissingRequiredFields() throws Exception {
        VistaAccount vistaAccount = new VistaAccount();

        Errors errors = new BeanPropertyBindingResult(vistaAccount, "foo");
        validator.validate(vistaAccount, errors);
        assertThat(errors.hasFieldErrors("vistaId"), is(true));
        assertThat(errors.hasFieldErrors("division"), is(true));
        assertThat(errors.hasFieldErrors("host"), is(true));
        assertThat(errors.hasFieldErrors("name"), is(true));
    }

    @Test
    public void testInvalidPort() throws Exception {
        VistaAccount vistaAccount = new VistaAccount();
        vistaAccount.setPort(-1);

        Errors errors = new BeanPropertyBindingResult(vistaAccount, "foo");
        validator.validate(vistaAccount, errors);
        assertThat(errors.hasFieldErrors("port"), is(true));
    }
}
