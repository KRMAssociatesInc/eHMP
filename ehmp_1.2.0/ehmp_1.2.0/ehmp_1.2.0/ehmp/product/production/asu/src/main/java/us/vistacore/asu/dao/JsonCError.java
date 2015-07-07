package us.vistacore.asu.dao;

import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.Map;

public class JsonCError extends JsonCResponse<JsonCResponse.Error> {

    public JsonCError() {
        // NOOP
    }

    public JsonCError(String code, String message) {
        this.setError(code, message);
    }

    public JsonCError(String code, Exception e) {
        this.setError(code, e);
    }

    public JsonCError(Errors errors) {
        if (!errors.hasErrors()) throw new IllegalArgumentException();

        List<ObjectError> errorList = errors.getAllErrors();
        ObjectError firstError = errorList.get(0);
        this.setError(firstError.getCode(), firstError.toString());
        for (int i = 1; i < errorList.size(); i++) {
            ObjectError err = errorList.get(i);
            this.addError(err.getCode(), err.toString());
        }
    }

//    public JsonCError(JsonNode errors) {
//        super();
//    }

    /**
     * Represents the code for this error. This property value will usually represent the HTTP response code. If there are multiple errors, code will be the error code for the first error.
     */
    public String getCode() {
        return this.error.code;
    }

    /**
     * A human readable message providing more details about the error. If there are multiple errors, message will be the message for the first error.
     */
    public String getMessage() {
        return this.error.message;
    }

    /**
     * Container for any additional information regarding the error. If the service returns multiple errors, each element in the errors array represents a different error.
     */
    public List<Map<String, Object>> getErrors() {
        return this.error.errors;
    }
}
