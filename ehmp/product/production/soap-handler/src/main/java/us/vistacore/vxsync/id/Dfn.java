package us.vistacore.vxsync.id;

public class Dfn extends PatientIdentifier {

	public static final String SITE_HASH_PATTERN = "^[a-zA-Z0-9]{4};.+";

	private String siteHash;
	
	public Dfn(String id) {
		setIdType(IdentifierType.DFN);
		String[] parts = id.split(";");
		siteHash = parts[0];
		this.setLocalId(parts[1]);
	}
	protected Dfn() {
		setIdType(IdentifierType.DFN);
	}
	
	@Override
	public String getPrefix() {
		return siteHash;
	}
	
	protected void setSiteHash(String hash) {
		this.siteHash = hash;
	}
	
	public static boolean isIdType(String id) {
		return id.matches(Dfn.SITE_HASH_PATTERN);
	}
	
	public String toString() {
		return getPrefixedId();
	}

}
