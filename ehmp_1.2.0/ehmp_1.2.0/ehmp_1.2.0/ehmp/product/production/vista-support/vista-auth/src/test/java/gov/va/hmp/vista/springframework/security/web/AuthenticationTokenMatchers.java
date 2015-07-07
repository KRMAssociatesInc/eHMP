package gov.va.hmp.vista.springframework.security.web;

import org.springframework.security.core.Authentication;

import static org.mockito.Matchers.argThat;

public class AuthenticationTokenMatchers {

    static <T extends Authentication> T eq(T authRequest) {
        return (T) argThat(new EqualsAuthentication(authRequest));
    }
}
