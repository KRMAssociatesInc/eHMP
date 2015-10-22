package us.vistacore.vxsync.id;

public class Edipi extends PatientIdentifier {

	public static final String PREFIX = "DOD";
	
	public Edipi(String id) {
		setIdType(IdentifierType.EDIPI);
		String[] parts = id.split(";");
		setLocalId(parts[1]);
	}
	
	protected Edipi(){
		setIdType(IdentifierType.EDIPI);
	}
	
	@Override
	public String getPrefix() {
		return PREFIX;
	}

	public static boolean isIdType(String id) {
		return id.startsWith(PREFIX);
	}
	
	public String toString() {
		return getPrefixedId();
	}
	
}
