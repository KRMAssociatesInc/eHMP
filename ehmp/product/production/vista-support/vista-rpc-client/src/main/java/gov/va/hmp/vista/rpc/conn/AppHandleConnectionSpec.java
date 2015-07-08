package gov.va.hmp.vista.rpc.conn;

import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * TODOC: Provide summary documentation of class AppHandleConnectionSpec
 */
public class AppHandleConnectionSpec implements ConnectionSpec {

    private final String division;
    private final String handle;
    private final String clientAddress;
    private final String clientHostName;

    public AppHandleConnectionSpec(final String handle, String clientAddress, String clientHostName) {
       this(handle, null, clientAddress, clientHostName);
    }

    public AppHandleConnectionSpec(final String handle, final String division, String clientAddress, String clientHostName) {
        super();
        this.handle = handle;
        this.division = division;
        this.clientAddress = clientAddress;
        this.clientHostName = clientHostName;

        Assert.hasText(this.clientAddress, "[Assertion failed] - 'clientAddress' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(this.clientHostName, "[Assertion failed] - 'clientHostName' argument must have text; it must not be null, empty, or blank");
    }

    public String getDivision() {
        return division;
    }

    public String getHandle() {
        return handle;
    }

    public String getClientAddress() {
        return clientAddress;
    }

    public String getClientHostName() {
        return clientHostName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppHandleConnectionSpec that = (AppHandleConnectionSpec) o;

        if (!clientAddress.equals(that.clientAddress)) return false;
        if (!clientHostName.equals(that.clientHostName)) return false;
        if (division != null ? !division.equals(that.division) : that.division != null) return false;
        if (!handle.equals(that.handle)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = division != null ? division.hashCode() : 0;
        result = 31 * result + handle.hashCode();
        result = 31 * result + clientAddress.hashCode();
        result = 31 * result + clientHostName.hashCode();
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(clientHostName);
        sb.append('(');
        sb.append(clientAddress);
        sb.append(')');
        if (division != null) {
           sb.append(division);
           sb.append(RpcUriUtils.DIVISION_CREDENTIALS_DELIMITER);
        }
        sb.append(handle);
        return sb.toString();
    }
}
