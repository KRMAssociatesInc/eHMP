package gov.va.hmp.auth;

import org.mockito.ArgumentMatcher;
import org.springframework.security.core.Authentication;

public class EqualsAuthentication extends ArgumentMatcher<Authentication> {

    private Authentication expected;

    public EqualsAuthentication(Authentication expected) {
        this.expected = expected;
    }

    public boolean matches(Object o) {
        if (!(o instanceof Authentication)) return false;

        Authentication actual = (Authentication) o;

        return expected.getPrincipal().equals(actual.getPrincipal()) &&
                expected.getName().equals(actual.getName()) &&
                expected.getCredentials().equals(actual.getCredentials()) &&
                expected.getDetails().equals(actual.getDetails()) &&
                expected.isAuthenticated() == actual.isAuthenticated();
    }
}
