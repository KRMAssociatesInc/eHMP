package gov.va.hmp.hub;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.sync.expirationrulesengine.IntegrationLevelExpirationRule;
import gov.va.cpe.vpr.sync.msg.SyncDodMessageHandler;
import gov.va.hmp.HmpEncryption;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class VistaAccount {

    static final int DEFAULT_PORT = 9200;

    private Integer id;
    private String vistaId;
    private String division;
    private String name;
    private String host;
    private int port = DEFAULT_PORT;
    private Integer region;
    private boolean production = false;
    private String vprUserCredentials;
    private boolean vprAutoUpdate = true;
    private boolean odcAutoInit = true;
	private String onExceptionRetryCount;
	private String startupWaitTime;

   
	public String getOnExceptionRetryCount() {
		return onExceptionRetryCount;
	}

	public void setOnExceptionRetryCount(String onExceptionRetryCount) {
		this.onExceptionRetryCount = onExceptionRetryCount;
	}

	public String getStartupWaitTime() {
		return startupWaitTime;
	}

	public void setStartupWaitTime(String startupWaitTime) {
		this.startupWaitTime = startupWaitTime;
	}

    private boolean encrypted;
    private long calculatedVistaTimeDiff;

    private int dodIntegrationLevel;

    @Override
    public String toString() {
        //return "${name} (vrpcb://${division}@${host}:${port})";
        StringBuffer buff = new StringBuffer();
        buff.append(name);
        buff.append(" ");
        buff.append("(vrpcb://");
        if (division != null) {
            buff.append(division);
            buff.append("@");
        }
        buff.append(":");
        buff.append(port);
        buff.append(")");
        return buff.toString();
    }

    @JsonIgnore
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getVistaId() {
        return vistaId;
    }

    public void setVistaId(String vistaId) {
        this.vistaId = vistaId;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public Integer getRegion() {
        return region;
    }

    public void setRegion(Integer region) {
        this.region = region;
    }

    public boolean isProduction() {
        return production;
    }

    public void setProduction(boolean production) {
        this.production = production;
    }

    @JsonView(JSONViews.JDBView.class)
    public String getVprUserCredentials() {
        return vprUserCredentials;
    }

    public boolean isEncrypted() {
		return encrypted;
	}

	public void setEncrypted(boolean encrypted) {
		this.encrypted = encrypted;
	}

	public void setVprUserCredentials(String vprUserCredentials) {
        this.vprUserCredentials = vprUserCredentials;
    }

    public boolean isVprAutoUpdate() {
        return vprAutoUpdate;
    }

    public void setVprAutoUpdate(boolean vprAutoUpdate) {
        this.vprAutoUpdate = vprAutoUpdate;
    }

    public boolean isOdcAutoInit() {
        return odcAutoInit;
    }

    public void setOdcAutoInit(boolean odcAutoInit) {
        this.odcAutoInit = odcAutoInit;
    }

    public void encrypt(HmpEncryption enc) throws IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException {
    	if(!encrypted) {
    		//this.host = host!=null?VprEncryption.getInstance().encrypt(host):host;
    		this.vprUserCredentials = vprUserCredentials!=null? enc.encrypt(vprUserCredentials):vprUserCredentials;
    		encrypted = true;
    	}
    }
    
    public void decrypt(HmpEncryption enc) throws IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException {
    	if(encrypted) {
    		//this.host = host!=null?VprEncryption.getInstance().decrypt(host):host;
    		this.vprUserCredentials = vprUserCredentials!=null? enc.decrypt(vprUserCredentials):vprUserCredentials;
    		encrypted = false;
    	}
    }

    public void setCalculatedVistaTimeDiff(long calculatedVistaTimeDiff) {
        this.calculatedVistaTimeDiff = calculatedVistaTimeDiff;
    }

    public long getCalculatedVistaTimeDiff() {
        return calculatedVistaTimeDiff;
    }

    @JsonIgnore
    public int getIntegrationLevel(String vistaId) {
        if (vistaId != null) {
            if (vistaId.equals(SyncDodMessageHandler.SITE_ID)) {
                return getDodIntegrationLevel();
            }
        }
        return IntegrationLevelExpirationRule.NOT_INTEGRATED;
    }

    public int getDodIntegrationLevel() {
        return dodIntegrationLevel;
    }

    public void setDodIntegrationLevel(int dodIntegrationLevel) {
        this.dodIntegrationLevel = dodIntegrationLevel;
    }

}
