package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.*;

/**
 * Defines an object to assist in bun a response to the client.
 * The VistA Connection creates a <code>RpcResponse</code> object and
 * returns it via <code>send</code> method.
 * <p/>
 * <p>An RPC response is essentially just a String, but this object includes
 * the "Application" and "Security" segments of the RPC message.
 *
 * @see RpcTemplate
 * @see gov.va.hmp.vista.rpc.conn.Connection
 */
public class RpcResponse implements Serializable {

    /**
     * The RPC response line-separator characters, represented as a
     * string for convenience.
     */
    public static final String LINE_DELIMITER = "\r\n";

    private String requestUri;
    private String securitySegment;
    private String applicationSegment;
    private String response;
    private String[] lines = null;
    private Map<RpcPhase, Long> elapsedMillisByPhase = new TreeMap();
    private long elapsedMillis = -1;
    private String vistaId;
    private String DUZ;
    private String division;
    private String divisionName;

    /**
     * Construct an RpcResponse given the string representation of an RPC response.
     *
     * @param response the string representation of an RPC response
     */
    public RpcResponse(String response) {
        this("", "", response);
    }

    /**
     * Construct an RpcResponse given response headers (segments) and the string representation of the RPC response itself.
     *
     * @param securitySegment    the security segment of an RPC response
     * @param applicationSegment the application segment of an RPC response
     * @param response           the string representation of an RPC response
     */
    public RpcResponse(String securitySegment, String applicationSegment, String response) {
        this.securitySegment = securitySegment;
        this.applicationSegment = applicationSegment;
        this.response = response;
    }

    public String getRequestUri() {
        return requestUri;
    }

    public void setRequestUri(String uri) {
        this.requestUri = uri;
    }

    public String getApplicationSegment() {
        return applicationSegment;
    }

    public String getSecuritySegment() {
        return securitySegment;
    }

    public long getElapsedMillis() {
        if (elapsedMillis == -1 && !elapsedMillisByPhase.isEmpty()) {
            elapsedMillis = 0;
            for (RpcPhase phase : RpcPhase.values()) {
                if (getElapsedMillis(phase) != -1) {
                     elapsedMillis += getElapsedMillis(phase);
                }
            }
        }
        return elapsedMillis;
    }

    public long getElapsedMillis(RpcPhase phase) {
        Long elapsedMillis = elapsedMillisByPhase.get(phase);
        if (elapsedMillis == null) return -1;
        return elapsedMillis;
    }

//    public void setElapsedMillis(long elapsedMillis) {
//        this.elapsedMillis = elapsedMillis;
//    }

    public void setElapsedMillis(RpcPhase phase, long elapsedMillis) {
        this.elapsedMillisByPhase.put(phase, elapsedMillis);
        this.elapsedMillis = -1;
    }

    /**
     * A unique identifier for the VistA system in which this RPC response originated, if known.
     *
     * Defined as the hex string of the CRC-16 of the domain name of the VistA system.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DOMAIN NAME(8989.3,.01)"
     */
    public String getVistaId() {
        return vistaId;
    }

    public void setVistaId(String vistaId) {
        this.vistaId = vistaId;
    }

    /**
     * Returns the user DUZ this RPC response was executed under, if known.  A user's DUZ is their internal entry number (IEN) from the NEW PERSON file.
     *
     * @see "Vista FileMan NEW PERSON(200)
     */
    public String getDUZ() {
        return DUZ;
    }

    public void setDUZ(String DUZ) {
        this.DUZ = DUZ;
    }

    /**
     * Returns the division (station number) in which the RPC response originated.
     *
     * @see "VistA FileMan NEW PERSON,DIVISION(200,16)"
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DEFAULT INSTITUTION(8989.3,217)"
     * @see "VistA FileMan INSTITUTION(4)"
     */
    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    /**
     * Returns the name of the division in which the RPC response originated.
     *
     * @see #getDivision()
     */
    public String getDivisionName() {
        return divisionName;
    }

    public void setDivisionName(String divisionName) {
        this.divisionName = divisionName;
    }

    /**
     * Returns the string representation of the RPC response.
     *
     * @return
     */
    @JsonProperty("body")
    public String toString() {
        return response;
    }

    /**
     * Returns the length of this response. The length is equal to the number of Unicode code units in the string.
     *
     * @return the length of the sequence of characters represented by this object.
     */
    public int length() {
        return response.length();
    }

    public String[] toLines() {
        if (lines == null)
            lines = response.split(LINE_DELIMITER);
        return lines;
    }

    public List<String> toLinesList() {
        return Arrays.asList(toLines());
    }
}
