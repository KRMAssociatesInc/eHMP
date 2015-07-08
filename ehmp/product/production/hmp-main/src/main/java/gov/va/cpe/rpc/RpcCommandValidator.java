package gov.va.cpe.rpc;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class RpcCommandValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return RpcCommand.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        RpcCommand rpc = (RpcCommand) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "context", "default.blank.message", new Object[]{"context", RpcCommand.class});
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "default.blank.message", new Object[]{"name", RpcCommand.class});
    }
}
