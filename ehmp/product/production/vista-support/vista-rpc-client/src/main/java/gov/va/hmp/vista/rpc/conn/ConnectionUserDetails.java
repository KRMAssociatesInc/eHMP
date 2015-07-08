package gov.va.hmp.vista.rpc.conn;

import java.util.Map;

/**
 * The interface <code>ConnectionUserDetails</code> provides information about the current user connected to a VistA
 * instance through a <code>Connection</code> instance. A component calls the method {@link Connection#getUserDetails()} to get a
 * <code>ConnectionUserDetails</code> instance.
 *
 * @see Connection
 */
public interface ConnectionUserDetails {
    /**
     * Returns the user's DUZ.  A user's DUZ is their internal entry number (IEN) from the NEW PERSON file.
     *
     * @see "Vista FileMan NEW PERSON(200)
     */
    String getDUZ();

    /**
     * Returns the credentials the connection was authenticated with.
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
     * Returns the user's full name from the VistA FileMan <code>NAME COMPONENTS(20)</code> file.
     *
     * <p>Could potentially include Family(Last), Given(First), Middle, Prefix, Suffix and Degree name components.
     *
     * @see "VistA Routine NAME^XUSER"
     * @see "VistA FileMan NAME COMPONENTS(20)"
     */
    String getStandardName();

    /**
     *  Returns the primary station number that the user is currently working in. This is intended to be the station
     *  number of the parent institution of the division the user is signed into.
     *
     *  @see "VistA FileMan INSTITUTION(4)"
     */
    String getPrimaryStationNumber();

    /**
     * Returns the division (station number) that the user is currently working in.
     *
     * @see "VistA FileMan MEDICAL CENTER DIVISION(40.8)"
     * @see "VistA FileMan NEW PERSON,DIVISION(200,16)"
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DEFAULT INSTITUTION(8989.3,217)"
     * @see "VistA FileMan INSTITUTION(4)"
     */
    String getDivision();

    /**
     * Returns the one or more divisions that this user may sign-on and do work for.  The keys in the Map are station
     * numbers and the values are station names.
     *
     * @see "VistA FileMan NEW PERSON,DIVISION(200,16)"
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DEFAULT INSTITUTION(8989.3,217)"
     * @see "VistA FileMan INSTITUTION(4)"
     */
    Map<String, String> getDivisionNames();

    /**
     * Returns the user's title.
     *
     * @see "VistA FileMan NEW PERSON,TITLE(200,8)"
     */
    String getTitle();

    /**
     * Returns the user's Service/Section.
     *
     * @see "VistA FileMan NEW PERSON,SERVICE/SECTION(200,29)"
     * @see "VistA FileMan SERVICE/SECTION(49)"
     */
    String getServiceSection();

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
}
