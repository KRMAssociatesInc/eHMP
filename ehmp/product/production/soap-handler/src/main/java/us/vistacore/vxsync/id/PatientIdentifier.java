package us.vistacore.vxsync.id;


public abstract class PatientIdentifier {
	private IdentifierType idType;
	private String localId;
	
	public PatientIdentifier() {}
	
	public abstract String getPrefix();
	
	//override this if a prefix is not appropriate
	public String getPrefixedId(){
		return getPrefix()+';'+localId;
	}
	
	public String getLocalId() {
		return localId;
	}
	public IdentifierType getIdType() {
		return idType;
	}
	
	protected void setLocalId(String id) {
		this.localId = id;
	}
	protected void setIdType(IdentifierType type) {
		idType = type;
	}
	
	public static PatientIdentifier getPatientId(String idString) {
		if(Edipi.isIdType(idString)) {
			return new Edipi(idString);
		} else if(Dfn.isIdType(idString)) {
			return new Dfn(idString);
		} else if(idString.contains("^")) {
			if(MviEdipi.isIdType(idString)) {
				return new MviEdipi(idString);
			} else if(MviIcn.isIdType(idString)) {
				return new MviIcn(idString);
			} else if(MviDfn.isIdType(idString)) {
				return new MviDfn(idString);
			}
		} else if(Icn.isIdType(idString)) {
			return new Icn(idString);
		}
		return null;
	}
}
