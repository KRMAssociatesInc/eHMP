package us.vistacore.vxsync.term.jlv;

/**
 * This represents a mapped code that was retrieved from JLV.
 * 
 * @author Les.Westberg
 *
 */
public class JLVMappedCode {
	private String code;
	private String codeSystem;
	private String displayText;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getCodeSystem() {
		return codeSystem;
	}
	public void setCodeSystem(String codeSystem) {
		this.codeSystem = codeSystem;
	}
	public String getDisplayText() {
		return displayText;
	}
	public void setDisplayText(String displayText) {
		this.displayText = displayText;
	}

}
