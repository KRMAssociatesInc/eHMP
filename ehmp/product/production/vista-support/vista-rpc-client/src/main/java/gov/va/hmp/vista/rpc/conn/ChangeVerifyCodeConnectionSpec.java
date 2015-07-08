package gov.va.hmp.vista.rpc.conn;

public class ChangeVerifyCodeConnectionSpec extends AccessVerifyConnectionSpec {

    private final String newVerifyCode;
    private final String confirmNewVerifyCode;

    public ChangeVerifyCodeConnectionSpec(String division, String accessCode, String oldVerifyCode, String newVerifyCode, String confirmNewVerifyCode, String clientAddress, String clientHostName) {
        super(division, accessCode, oldVerifyCode, clientAddress, clientHostName);
        this.newVerifyCode = newVerifyCode;
        this.confirmNewVerifyCode = confirmNewVerifyCode;
    }

    public String getNewVerifyCode() {
        return newVerifyCode;
    }

    public String getConfirmNewVerifyCode() {
        return confirmNewVerifyCode;
    }

    @Override
    public String toString() {
        return super.toString() + ACCESS_VERIFY_CODE_DELIMITER + newVerifyCode + ACCESS_VERIFY_CODE_DELIMITER + confirmNewVerifyCode;
    }
    
    @Override
    public String getCredentials() {
        return getAccessCode() + ACCESS_VERIFY_CODE_DELIMITER + getVerifyCode() + ACCESS_VERIFY_CODE_DELIMITER + getNewVerifyCode() + ACCESS_VERIFY_CODE_DELIMITER + getConfirmNewVerifyCode();
    }
}
