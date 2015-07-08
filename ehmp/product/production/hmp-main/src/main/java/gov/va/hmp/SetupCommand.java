package gov.va.hmp;

import gov.va.hmp.hub.VistaAccount;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class SetupCommand {

    private String serverId;
    private String serverHost;
    private Integer httpPort;
    private Integer httpsPort;
    private boolean demo = false;
    private boolean hmpPropertiesEncrypted;
    private VistaAccount vista = new VistaAccount();

    public String getServerId() {
		return serverId;
	}

	public void setServerId(String serverId) {
		this.serverId = serverId;
	}

	public String getServerHost() {
		return serverHost;
	}

	public void setServerHost(String serverHost) {
		this.serverHost = serverHost;
	}

	public Integer getHttpPort() {
		return httpPort;
	}

	public void setHttpPort(Integer httpPort) {
		this.httpPort = httpPort;
	}

	public Integer getHttpsPort() {
		return httpsPort;
	}

	public void setHttpsPort(Integer httpsPort) {
		this.httpsPort = httpsPort;
	}

    public boolean isDemo() {
        return demo;
    }

    public void setDemo(boolean demo) {
        this.demo = demo;
    }

    public VistaAccount getVistaAccount() {
		return vista;
	}

	public void setVistaAccount(VistaAccount vista) {
		this.vista = vista;
	}

    /*
     * Yes everything below should be inside of a wired-in or otherwise centralized encryption utility, 
     * but brute force gets us thru round 1 of ATO.
     */

	public boolean isHmpPropertiesEncrypted() {
		return hmpPropertiesEncrypted;
	}

	public void setHmpPropertiesEncrypted(boolean encrypted) {
		this.hmpPropertiesEncrypted = encrypted;
	}

    public void encrypt(HmpEncryption enc) throws NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, NoSuchPaddingException, IllegalBlockSizeException {
    	if(!hmpPropertiesEncrypted) {
    		//this.serverHost = serverHost!=null?VprEncryption.getInstance().encrypt(serverHost):serverHost;
    		vista.encrypt(enc);
    		hmpPropertiesEncrypted = true;
    	}
    }
    
    public void decrypt(HmpEncryption enc) throws NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, NoSuchPaddingException, IllegalBlockSizeException {
    	if(hmpPropertiesEncrypted) {
    		//this.serverHost = serverHost!=null?VprEncryption.getInstance().decrypt(serverHost):serverHost;
    		vista.decrypt(enc);
    		hmpPropertiesEncrypted = false;
    	}
    }
}
