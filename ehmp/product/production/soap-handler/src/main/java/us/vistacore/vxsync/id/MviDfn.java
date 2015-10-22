package us.vistacore.vxsync.id;

import org.apache.commons.lang.StringUtils;

/**
 * This covers patient ids of the type "ID^IDTYPE^AssigningFacility^AssigningAuthority^IDStatus"
 * @author risherm
 *
 */
public class MviDfn extends Dfn implements MviId {
	
	private static final String AUTHORITY = "USVHA";
	private String[] idparts;

	public MviDfn(String id) {
		setIdType(IdentifierType.EXTENDED_DFN);
		idparts = id.split("\\^");
		this.setLocalId(idparts[0]);
		this.setSiteHash(idparts[2]);
	}
	
	public MviDfn(Dfn dfn) {
		setIdType(IdentifierType.EXTENDED_DFN);
		idparts = new String[] {dfn.getLocalId(), "PI", dfn.getPrefix(), AUTHORITY};
		this.setLocalId(idparts[0]);
		this.setSiteHash(idparts[2]);
		
	}
	
	public static boolean isIdType(String id) {
		String[] parts = id.split("\\^");
		return (parts[3].equals(AUTHORITY) && parts[1].equals("PI"));
	}
	
	public String toString() {
		return StringUtils.join(idparts, '^');
	}

}
