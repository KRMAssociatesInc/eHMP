package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

@SuppressWarnings("serial")
public class ImmunizationList extends AbstractPOMObject {

	private String localId;
	private String mnemonic;
	private String name;
	
	
	
	@JsonCreator
	public ImmunizationList(Map<String, Object> vals) {
		super(vals);
		// TODO Auto-generated constructor stub
	}

	public String getLocalId() {
		return localId;
	}

	public void setLocalId(String localId) {
		this.localId = localId;
	}

	public String getMnemonic() {
		return mnemonic;
	}

	public void setMnemonic(String mnemonic) {
		this.mnemonic = mnemonic;
	}

	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}
	
	@JsonIgnore
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}
	
	
}
