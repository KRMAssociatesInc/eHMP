package gov.va.hmp.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;

import java.util.Set;

/**
 * Extends {@link VistaUserDetails} to include HMP user properties, including VistA security keys, user classes, and PCMM team positions.
 */
public interface HmpUserDetails extends VistaUserDetails {
    /**
     * Returns the user's UID to uniquely identify them across all VistA systems.
     * <p/>
     * This takes the form of qualifiying the VistA DUZ with a unique ID of the VistA instance the user
     */
    String getUid();

    /**
     * Returns the number of seconds a user is inactive before they are signed out of CPRS/HMP.
     *
     * @see "VistA Parameter ORWOR TIMEOUT CHART"
     */
    int getTimeoutSeconds();

    /**
     * Returns the number of seconds a warning will be displayed once a user has been inactive for {@link #getTimeoutSeconds()} before they are signed out of CPRS/HMP.
     * <p/>
     * @see #getTimeoutSeconds()
     * @see "VistA Parameter ORWOR TIMEOUT COUNTDOWN"
     */
    int getTimeoutCountdownSeconds();

    /**
     * Returns the user's CPRS ordering role.
     * <p/>
     * Note: This is also included in Spring Security's API for listing a user's "authorities", as one of:
     * <ul>
     * <li>VISTA_ORDERING_ROLE_NONE</li>
     * <li>VISTA_ORDERING_ROLE_CLERK</li>
     * <li>VISTA_ORDERING_ROLE_NURSE</li>
     * <li>VISTA_ORDERING_ROLE_DOCTOR</li>
     * <li>VISTA_ORDERING_ROLE_STUDENT</li>
     * <li>VISTA_ORDERING_ROLE_BADKEYS</li>
     * </ul>
     *
     * @see #getAuthorities()
     */
    OrderingRole getOrderingRole();

    /**
     * Tests if the user has the specified authority.
     * <p/>
     * Note: VistA security keys, VistA ASU user classes and other authorities are mapped to Spring Security's flat list
     * via a naming convention that employs a prefix and replacing all spaces with underscores.
     * 
     * @param authority The name of the authority (no spaces
     * @return <code>true</code> if the user has the specified authority, <code>false</code> otherwise.
     * @see #getAuthorities()
     */
    boolean hasAuthority(String authority);

    /**
     * Tests if the user has the specified VistA security key.
     *
     * @param key The name of the key in VistA, with spaces allowed in key names. e.g. <code>VPR EXPERIMENTAL</code> or <code>XU PROG</code>
     * @return <code>true</code> if the user has the specified key, <code>false</code> otherwise.
     */
    boolean hasVistaKey(String key);

    /**
     * Tests if the user has the specified VistA user class.
     *
     * @param userClass The name of the user class in VistA, with spaces allowed in class names names. e.g. <code>CLINICAL COORDINATOR</code> or <code>INTERDISCIPLINARY USER</code>
     * @return <code>true</code> if the user has the specified user class, <code>false</code> otherwise.
     *
     * @see "VistA FileMan USR CLASS(8930)"
     */
    boolean hasVistaUserClass(String userClass);

    /**
     * Returns the user's list of VistA security keys.
     * <p/>
     * Note: These are also included in Spring Security's API for listing a user's "authorities", with the key name
     * prefixed with <code>VISTA_KEY_</code> and all spaces replaced with underscore characters.
     *
     * @see #getAuthorities()
     */
    @JsonIgnore
    Set<VistaSecurityKey> getSecurityKeys();

    /**
     * Returns the user's list of VistA ASU user classes.
     * <p/>
     * Note: These are also included in Spring Security's API for listing a user's "authorities", with the USER CLASS name
     * prefixed with <code>VISTA_USER_CLASS_</code> and all spaces replaced with underscore characters. 
     *
     * @see #getAuthorities()
     * @see "VistA FileMan USR CLASS(8930)"
     */
    @JsonIgnore
    Set<VistaUserClassAuthority> getUserClasses();

    /**
     * Returns the user's PCMM team positions.
     */
    @JsonIgnore
    Set<TeamPosition> getTeamPositions();
}
