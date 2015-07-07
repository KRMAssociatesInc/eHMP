package us.vistacore.vxsync.id;

public class Icn extends PatientIdentifier {

	public Icn(String id) {
		setIdType(IdentifierType.ICN);
		setLocalId(id);
		
	}
	protected Icn() {
		setIdType(IdentifierType.ICN);
	}
	
	@Override
	public String getPrefix() {
		return "";
	}
	
	@Override
	public String getPrefixedId() {
		return super.getLocalId();
	}
	
	public static boolean isIdType(String id) {
		return id.matches("[0-9]+V[0-9]+");
	}
	
	@Override
	public String toString() {
		return getPrefixedId();
	}

}
