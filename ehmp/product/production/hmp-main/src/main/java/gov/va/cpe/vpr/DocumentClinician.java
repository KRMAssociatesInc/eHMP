package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

public class DocumentClinician extends AbstractPOMObject {

    public static enum Role {
        /**
         * @see "VistA FileMan TIU DOCUMENT,ENTERED BY(8925,1302)"
         */
        ENTERER("E"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,AUTHOR/DICTATOR(8925,1202)"
         */
        AUTHOR_DICTATOR("AU"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,EXPECTED SIGNER(8925,1204)"
         */
        EXPECTED_SIGNER("ES"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,EXPECTED COSIGNER(8925,1208)"
         */
        EXPECTED_COSIGNER("EC"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,SIGNED BY(8925,1502)"
         */
        SIGNER("S"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,COSIGNED BY(8925,1508)"
         */
        COSIGNER("C"),
        /**
         * @see "VistA FileMan TIU DOCUMENT,ATTENDING PHYSICIAN(8925,1209)"
         */
        ATTENDING_PHYSICIAN("ATT"),
        /**
         * @see "VistA FileMan TIU MULTIPLE SIGNATURE(8925.7)"
         */
        ADDITIONAL_SIGNER("X");

        private String abbreviation;

        private Role(String abbreviation) {
            this.abbreviation = abbreviation;
        }

        @JsonValue
        public String getAbbreviation() {
            return abbreviation;
        }

        @JsonCreator
        public static Role forAbbreviation(String abbreviation) {
            for (Role r : values()) {
                if (r.getAbbreviation().equalsIgnoreCase(abbreviation))
                    return r;
            }
            return null;
        }
    }

	@JsonCreator
	public DocumentClinician(Map<String, Object> vals) {
		super(vals);
	}

    public DocumentClinician() {
        super(null);
    }

    // TODO: is this cruft?
	private Clinician clinician;
	private Document document;
	private String name;
    private String displayName;
	private String localId;
	private Role role;
	private PointInTime signedDateTime;
	private String signature;

    // TODO: is this cruft?
	public Clinician getClinician() {
		return clinician;
	}

	public Document getDocument() {
		return document;
	}

    public String getLocalId() {
		return localId;
	}

	public Role getRole() {
		return role;
	}

	public PointInTime getSignedDateTime() {
		return signedDateTime;
	}

	public String getSignature() {
		return signature;
	}

	public String getName() {
		return name;
	}

    public String getDisplayName() {
        if (displayName == null) {
            displayName = VistaStringUtils.nameCase(getName());
        }
        return displayName;
    }
}
