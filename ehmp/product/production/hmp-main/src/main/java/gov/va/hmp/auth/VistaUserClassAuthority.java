package gov.va.hmp.auth;

import com.fasterxml.jackson.annotation.JsonValue;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.security.core.GrantedAuthority;

/**
 * Exposes a VistA user class as a Spring Security {@link org.springframework.security.core.GrantedAuthority}
 *
 * @see "VistA FileMan USR CLASS(8930)"
 */
public class VistaUserClassAuthority implements GrantedAuthority {

    public static final String VISTA_USER_CLASS_PREFIX = "VISTA_USER_CLASS_";

    private String uid;
    private String userClass;
    private PointInTime effectiveDate;
    private PointInTime expirationDate;

    public VistaUserClassAuthority(String uid, String userClass) {
        this(uid, userClass, null, null);
    }

    public VistaUserClassAuthority(String uid, String userClass, PointInTime effectiveDate, PointInTime expirationDate) {
        this.uid = uid;
        this.userClass = userClass;
        this.effectiveDate = effectiveDate;
        this.expirationDate = expirationDate;
    }

    @JsonValue
    @Override
    public String getAuthority() {
        return VISTA_USER_CLASS_PREFIX + userClass.replace(' ', '_');
    }

    public String getUid() {
        return uid;
    }

    public String getUserClass() {
        return userClass;
    }

    public PointInTime getEffectiveDate() {
        return effectiveDate;
    }

    public PointInTime getExpirationDate() {
        return expirationDate;
    }
    
    public String toString() {
    	return getAuthority() + String.format(" [effective: %s; expires: %s]", effectiveDate, expirationDate);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        VistaUserClassAuthority that = (VistaUserClassAuthority) o;

        if (!userClass.equals(that.userClass)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return userClass.hashCode();
    }
}
