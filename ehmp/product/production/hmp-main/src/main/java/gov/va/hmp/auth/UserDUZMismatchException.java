package gov.va.hmp.auth;

import org.springframework.security.core.AuthenticationException;

public class UserDUZMismatchException extends AuthenticationException {

    public UserDUZMismatchException(String msg) {
        super(msg);
    }

}
