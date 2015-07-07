package gov.va.hmp.hub;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class VistaAccountValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return VistaAccount.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        VistaAccount vistaAccount = (VistaAccount) target;
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "vistaId", "default.blank.message", new Object[]{"vistaId", VistaAccount.class});
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "division", "default.blank.message", new Object[]{"division", VistaAccount.class});
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "host", "default.blank.message", new Object[]{"host", VistaAccount.class});
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "default.blank.message", new Object[]{"name", VistaAccount.class});
        if (vistaAccount.getPort() <= 0) {
            errors.rejectValue("port", "default.invalid.min.message", new Object[]{"port",
                    VistaAccount.class,
                    vistaAccount.getPort(),
                    0},
                    "[Assertion failed] - the 'port' property on a " + VistaAccount.class + " must be greater than zero.");
        }
    }
}
