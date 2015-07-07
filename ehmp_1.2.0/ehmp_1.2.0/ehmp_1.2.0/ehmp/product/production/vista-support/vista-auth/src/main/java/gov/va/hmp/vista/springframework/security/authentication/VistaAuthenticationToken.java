package gov.va.hmp.vista.springframework.security.authentication;

import gov.va.hmp.vista.rpc.conn.AccessVerifyConnectionSpec;
import gov.va.hmp.vista.rpc.conn.AppHandleConnectionSpec;
import gov.va.hmp.vista.rpc.conn.ConnectionSpec;
import gov.va.hmp.vista.rpc.conn.ConnectionSpecFactory;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;

import java.util.Collection;

import static org.springframework.util.StringUtils.hasLength;

public class VistaAuthenticationToken extends UsernamePasswordAuthenticationToken {

    static final String UNAUTHENTICATED = "UNAUTHENTICATED";
    private static final String SEP = ";";

    private String remoteAddress;
    private String remoteHostName;

    private String vistaId;

    private String accessCode;
    private String verifyCode;
    private String newVerifyCode;
    private String confirmVerifyCode;

    private String appHandle;

    public VistaAuthenticationToken(String vistaId, String division, String accessCode, String verifyCode, String remoteAddress, String remoteHostName) {
        this(vistaId, division, accessCode, verifyCode, null, null, remoteAddress, remoteHostName);
    }

    public VistaAuthenticationToken(String vistaId, String division, String accessCode, String verifyCode, String newVerifyCode, String confirmVerifyCode, String remoteAddress, String remoteHostName) {
        super(UNAUTHENTICATED + "@" + vistaId + SEP + division, (hasLength(accessCode) && hasLength(verifyCode) && hasLength(remoteAddress) ? accessCode + SEP + verifyCode : null));
        this.remoteAddress = StringUtils.hasText(remoteAddress) ? remoteAddress : null;
        this.remoteHostName = StringUtils.hasText(remoteHostName) ? remoteHostName : null;
        this.vistaId = vistaId;
        this.accessCode = hasLength(accessCode) ? accessCode : null;
        this.verifyCode = hasLength(verifyCode) ? verifyCode : null;
        this.newVerifyCode = hasLength(newVerifyCode) ? newVerifyCode : null;
        this.confirmVerifyCode = hasLength(confirmVerifyCode) ? confirmVerifyCode : null;

        String details = createDetails();
        super.setDetails(hasLength(details) ? details : null);
    }

    public VistaAuthenticationToken(String vistaId, String division, String appHandle, String remoteAddress, String remoteHostName) {
        super(UNAUTHENTICATED + "@" + vistaId + SEP + division, (hasLength(appHandle) ? appHandle : null));
        this.remoteAddress = StringUtils.hasText(remoteAddress) ? remoteAddress : null;
        this.remoteHostName = StringUtils.hasText(remoteHostName) ? remoteHostName : null;
        this.vistaId = vistaId;
        this.appHandle = appHandle;
        String details = createDetails();
        super.setDetails(hasLength(details) ? details : null);
    }

    public VistaAuthenticationToken(VistaUserDetails user, String credentials, String remoteAddress, String remoteHostName, Collection<? extends GrantedAuthority> authorities) {
        super(user, credentials, authorities);
        this.remoteAddress = StringUtils.hasText(remoteAddress) ? remoteAddress : null;
        this.remoteHostName = StringUtils.hasText(remoteHostName) ? remoteHostName : null;
        this.vistaId = user.getVistaId();
        String details = createDetails();
        ConnectionSpec auth = ConnectionSpecFactory.create(details != null ? details + credentials : credentials);
        if (auth instanceof AccessVerifyConnectionSpec) {
            AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
            this.accessCode = hasLength(av.getAccessCode()) ? av.getAccessCode() : null;
            this.verifyCode = hasLength(av.getVerifyCode()) ? av.getVerifyCode() : null;
        } else if (auth instanceof AppHandleConnectionSpec) {
            AppHandleConnectionSpec ah = (AppHandleConnectionSpec) auth;
            this.appHandle = ah.getHandle();
        }
        super.setDetails(hasLength(details) ? details : null);
    }

    private String createDetails() {
        return remoteHostName + "(" + remoteAddress + ")";
    }

    public String getVistaId() {
        return vistaId;
    }

    public VistaUserDetails getVistaUserDetails() {
        if (isAuthenticated())
            return (VistaUserDetails) getPrincipal();
        return null;
    }

    public String getDuz() {
        if (isAuthenticated())
            return getVistaUserDetails().getDUZ();
        return null;
    }

    public String getDivision() {
        if (isAuthenticated())
            return getVistaUserDetails().getDivision();
        else
            return ((String) getPrincipal()).substring(((String) getPrincipal()).lastIndexOf(SEP) + 1);
    }

    public String getAccessCode() {
        return accessCode;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public String getNewVerifyCode() {
        return newVerifyCode;
    }

    public String getConfirmVerifyCode() {
        return confirmVerifyCode;
    }

    public String getAppHandle() {
        return appHandle;
    }

    public String getRemoteAddress() {
        return remoteAddress;
    }

    public String getRemoteHostName() {
        return remoteHostName;
    }

    public void setDetails(Object details) {
        // NOOP
    }
}
