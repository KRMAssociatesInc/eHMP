package gov.va.hmp.auth;

import org.springframework.security.core.GrantedAuthority;

public enum OrderingRole implements GrantedAuthority {
    NONE(0),
    CLERK(1),
    NURSE(2),
    DOCTOR(3),
    STUDENT(4),
    BADKEYS(5);

    private int role;

    OrderingRole(int roleValue) {
        this.role = roleValue;
    }

    @Override
    public String getAuthority() {
        return "VISTA_ORDERING_ROLE_" + this.toString();
    }

    public int asInt() {
        return role;
    }

    public static OrderingRole fromInt(int roleValue) {
        for (OrderingRole role : values()) {
            if (role.ordinal() == roleValue) return role;
        }
        throw new IllegalArgumentException("invalid orderingRole: " + roleValue);
    }
}
