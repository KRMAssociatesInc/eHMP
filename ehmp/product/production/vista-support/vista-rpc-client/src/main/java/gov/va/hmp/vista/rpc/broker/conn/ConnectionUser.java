package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.conn.ConnectionUserDetails;

import java.util.Collections;
import java.util.Map;

/**
 * TODO: Document gov.va.cpe.vista.protocol
 */
public class ConnectionUser implements ConnectionUserDetails {
    private String DUZ;
    private String credentials;
    private String name;
    private String standardName;
    private String division;
    private Map<String, String> divisionNames;
    private boolean verifyCodeChanged;
    private String title;
    private String serviceSection;
    private String language;
    private String dTime;
    private String vpid;

    @Override
    public String getDUZ() {
        return DUZ;
    }

    public void setDUZ(String DUZ) {
        this.DUZ = DUZ;
    }

    @Override
    public String getCredentials() {
        return credentials;
    }

    public void setCredentials(String credentials) {
        this.credentials = credentials;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getStandardName() {
        return standardName;
    }

    public void setStandardName(String standardName) {
        this.standardName = standardName;
    }

    @Override
    public String getPrimaryStationNumber() {
        return division.substring(0, 3);
    }

    @Override
    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    @Override
    public Map<String, String> getDivisionNames() {
        return divisionNames;
    }

    public void setDivisionNames(Map<String, String> divisionNames) {
        this.divisionNames = Collections.unmodifiableMap(divisionNames);
    }

    public boolean isVerifyCodeChanged() {
        return verifyCodeChanged;
    }

    public void setVerifyCodeChanged(boolean verifyCodeChanged) {
        this.verifyCodeChanged = verifyCodeChanged;
    }

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getServiceSection() {
        return serviceSection;
    }

    public void setServiceSection(String serviceSection) {
        this.serviceSection = serviceSection;
    }

    @Override
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    @Override
    public String getDTime() {
        return dTime;
    }

    public void setDTime(String dTime) {
        this.dTime = dTime;
    }

    @Override
    public String getVPID() {
        return vpid;
    }

    public void setVpid(String vpid) {
        this.vpid = vpid;
    }
}