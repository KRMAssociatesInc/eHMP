package gov.va.hmp.vista.rpc.conn;

import org.springframework.util.StringUtils;

/**
 * TODOC: Provide summary documentation of class AccessVerifyConnectionSpec
 *
 * @see ConnectionFactory
 */
public class AccessVerifyConnectionSpec implements ConnectionSpec {

    public static final String DIVISION_CREDENTIALS_DELIMITER = ":";
    public static final String ACCESS_VERIFY_CODE_DELIMITER = ";";

    private final String clientAddress;
    private final String clientHostName;
    private final String division;
    private final String accessCode;
    private final String verifyCode;

    public AccessVerifyConnectionSpec(String division, final String accessCode, final String verifyCode, String clientAddress, String clientHostName) {
        this.division = division;
        this.accessCode = accessCode;
        this.verifyCode = verifyCode;
        this.clientAddress = clientAddress;
        this.clientHostName = clientHostName;
    }

    public String getClientAddress() {
        return clientAddress;
    }

    public String getClientHostName() {
        return clientHostName;
    }

    public String getDivision() {
        return division;
    }

    public String getAccessCode() {
        return accessCode;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public String getCredentials() {
        return getAccessCode() + ACCESS_VERIFY_CODE_DELIMITER + getVerifyCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AccessVerifyConnectionSpec that = (AccessVerifyConnectionSpec) o;

        if (accessCode != null ? !accessCode.equals(that.accessCode) : that.accessCode != null) return false;
        if (division != null ? !division.equals(that.division) : that.division != null) return false;
        if (verifyCode != null ? !verifyCode.equals(that.verifyCode) : that.verifyCode != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = division != null ? division.hashCode() : 0;
        result = 31 * result + (accessCode != null ? accessCode.hashCode() : 0);
        result = 31 * result + (verifyCode != null ? verifyCode.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        if (StringUtils.hasText(getDivision()))
            return getDivision() + DIVISION_CREDENTIALS_DELIMITER + getAccessCode() + ACCESS_VERIFY_CODE_DELIMITER + getVerifyCode();
        else
            return getAccessCode() + ACCESS_VERIFY_CODE_DELIMITER + getVerifyCode();
    }

}
