package gov.va.hmp.vista.springframework.security.userdetails;

import gov.va.hmp.vista.rpc.RpcHost;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

/**
 * Provides core information for VistA users.
 */
public interface VistaUserDetails extends UserDetails {

    /**
     * The hostname and port of the VistA system to which this user is signed in.
     */
    RpcHost getHost();

    /**
     * A unique identifier for this VistA system this user is logged into.
     * <p/>
     * Defined as the hex string of the CRC-16 of the domain name of the VistA system the user is currently logged into.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DOMAIN NAME(8989.3,.01)"
     */
    String getVistaId();

    /**
     * Returns the user's DUZ.  A user's DUZ is their internal entry number (IEN) from the NEW PERSON file.
     *
     * @see "Vista FileMan NEW PERSON(200)
     */
    String getDUZ();

    /**
     * Returns the credentials the user was authenticated with.
     */
    String getCredentials();

    /**
     * Returns the user's name from the <code>.01</code> field of the VistA FileMan <code>NEW PERSON(200)</code> file.
     * <p>It should be 3-35 upper-case characters in length, and be in the format {Family(Last)},{Given(First)} {Middle} {Suffix}.
     *
     * @see "VistA FileMan NEW PERSON,NAME(200,0.1)"
     */
    String getName();

    /**
     * Returns the name-cased user name for display.
     *
     * @see #getName()
     * @see gov.va.hmp.vista.util.VistaStringUtils#nameCase(String)
     */
    String getDisplayName();

    /**
     *  Returns the primary station number that the user is currently working in. This is intended to be the station
     *  number of the parent institution of the division the user is signed into.
     *
     *  @see "VistA FileMan INSTITUTION(4)"
     */
    String getPrimaryStationNumber();

    /**
     * Returns the division (station number) that the user is currently signed in to.
     *
     * @see "VistA FileMan NEW PERSON,DIVISION(200,16)"
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DEFAULT INSTITUTION(8989.3,217)"
     * @see "VistA FileMan INSTITUTION(4)"
     */
    String getDivision();

    /**
     * Returns the name of the division the user is currently signed in to.
     */
    String getDivisionName();

    /**
     * Returns the name-cased division name for display.
     *
     * @see #getDivisionName()
     * @see gov.va.hmp.vista.util.VistaStringUtils#nameCase(String)
     */
    String getDisplayDivisionName();

    /**
     * Returns the user's title.
     *
     * @see "VistA FileMan NEW PERSON,TITLE(200,8)"
     */
    String getTitle();

    /**
     * Returns the name-cased title for display.
     *
     * @see #getTitle()
     * @see gov.va.hmp.vista.util.VistaStringUtils#nameCase(String)
     */
    String getDisplayTitle();

    /**
     * Returns the user's Service/Section.
     *
     * @see "VistA FileMan NEW PERSON,SERVICE/SECTION(200,29)"
     * @see "VistA FileMan SERVICE/SECTION(49)"
     */
    String getServiceSection();

    /**
     * Returns the name-cased Service/Section for display.
     *
     * @see #getServiceSection()
     * @see gov.va.hmp.vista.util.VistaStringUtils#nameCase(String)
     */
    String getDisplayServiceSection();

    /**
     * Returns the user's language choice.
     * <p>A setting for the user overrides the site default.
     *
     * @see "VistA FileMan NEW PERSON,LANGUAGE(200,200.07)"
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DEFAULT LANGUAGE(8989.3,207)"
     * @see "VistA FileMan LANGUAGE(.85)"
     */
    String getLanguage();

    /**
     * Returns the user's DTIME value.  DTIME is a variable provided by VistA Kernel that is number of seconds the user
     * has to respond to a timed read.
     * <p>A setting for the user overrides the site default.
     *
     * @see "VistA FileMan NEW PERSON,TIMED READ(200,200.1)"
     */
    String getDTime();

    /**
     * Returns the user's VA-wide Person Identifier (VPID) value.
     */
    String getVPID();

    Map<String, Object> getAttributes();
}
