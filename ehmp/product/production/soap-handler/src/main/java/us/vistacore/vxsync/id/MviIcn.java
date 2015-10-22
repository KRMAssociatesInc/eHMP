package us.vistacore.vxsync.id;

import org.apache.commons.lang.StringUtils;

/**
 * This covers patient ids of the type "ID^IDTYPE^AssigningFacility^AssigningAuthority^IDStatus"
 * @author risherm
 *
 */
public class MviIcn extends Icn implements MviId {
	
	private static final String AUTHORITY = "USVHA";
	private String[] idparts;

	public MviIcn(String id) {
		setIdType(IdentifierType.EXTENDED_ICN);
		idparts = id.split("\\^");
		this.setLocalId(idparts[0]);
	}
	
	public MviIcn(Icn icn) {
		setIdType(IdentifierType.EXTENDED_ICN);
		idparts = new String[] {icn.getLocalId(), "NI", "200M", AUTHORITY};
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
