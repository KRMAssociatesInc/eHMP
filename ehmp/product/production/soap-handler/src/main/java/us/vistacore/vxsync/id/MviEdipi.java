package us.vistacore.vxsync.id;

import org.apache.commons.lang.StringUtils;

/**
 * This covers patient ids of the type "ID^IDTYPE^AssigningFacility^AssigningAuthority^IDStatus"
 * @author risherm
 *
 */
public class MviEdipi extends Edipi implements MviId {
	
	private static final String AUTHORITY = "USDOD";
	private String[] idparts;

	public MviEdipi(String id) {
		setIdType(IdentifierType.EXTENDED_EDIPI);
		idparts = id.split("\\^");
		this.setLocalId(idparts[0]);
	}
	
	public MviEdipi(Edipi edipi) {
		setIdType(IdentifierType.EXTENDED_EDIPI);
		idparts = new String[] {edipi.getLocalId(), "NI", "200DOD", AUTHORITY};
		this.setLocalId(idparts[0]);
	}
	
	public static boolean isIdType(String id) {
		String[] parts = id.split("\\^");
		return (parts[3].equals(AUTHORITY) && parts[1].equals("NI"));
	}
	
	public String toString() {
		return StringUtils.join(idparts, '^');
	}

}
