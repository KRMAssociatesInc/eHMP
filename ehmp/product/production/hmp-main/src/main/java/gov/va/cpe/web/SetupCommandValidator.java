package gov.va.cpe.web;

import gov.va.hmp.SetupCommand;
import gov.va.hmp.hub.VistaAccount;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class SetupCommandValidator implements Validator {

    private Validator vistaAccountValidator;

    public SetupCommandValidator(Validator vistaAccountValidator) {
        if (vistaAccountValidator == null) {
            throw new IllegalArgumentException(
                    "The supplied [Validator] is required and must not be null.");
        }
        if (!vistaAccountValidator.supports(VistaAccount.class)) {
            throw new IllegalArgumentException(
                    "The supplied [Validator] must support the validation of [VistaAccount] instances.");
        }

        this.vistaAccountValidator = vistaAccountValidator;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return SetupCommand.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SetupCommand setup = (SetupCommand) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "serverId", "default.blank.message", new Object[]{"serverId", SetupCommand.class});
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "serverHost", "default.blank.message", new Object[]{"serverHost", SetupCommand.class});
        ValidationUtils.rejectIfEmpty(errors, "httpPort", "default.null.message", new Object[]{"httpPort", SetupCommand.class});
        ValidationUtils.rejectIfEmpty(errors, "httpsPort", "default.null.message", new Object[]{"httpsPort", SetupCommand.class});

        try {
            errors.pushNestedPath("vistaAccount");
            ValidationUtils.invokeValidator(vistaAccountValidator, setup.getVistaAccount(), errors);
        } finally {
            errors.popNestedPath();
        }
    }

}
