package gov.va.hmp.auth;

import org.springframework.security.core.GrantedAuthority;

public class VistaSecurityKey implements GrantedAuthority {

    public static final String VISTA_KEY_PREFIX = "VISTA_KEY_";

    private String key;

    public VistaSecurityKey(String key) {
        this.key = key;
    }

    @Override
    public String getAuthority() {
        return VISTA_KEY_PREFIX + key.replace(' ', '_');
    }

    public String getKey() {
        return key;
    }

    @Override
    public String toString() {
        return getAuthority();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        VistaSecurityKey that = (VistaSecurityKey) o;

        if (!key.equals(that.key)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return key.hashCode();
    }
}
