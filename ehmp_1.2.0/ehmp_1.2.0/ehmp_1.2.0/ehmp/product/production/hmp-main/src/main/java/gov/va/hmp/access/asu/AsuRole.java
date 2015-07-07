package gov.va.hmp.access.asu;

import org.springframework.util.Assert;

/**
 * Representation of entries
 * <p/>
 * TODO: rename this or combine it with actions?  \
 *
 * @see "VistA FileMan USR ROLE(8930.2)"
 */
public enum AsuRole {
    AUTHOR_DICTATOR("AUTHOR/DICTATOR", "Author (Dictator)", "AU"),
    ATTENDING_PHYSICIAN("ATTENDING PHYSICIAN", "Attending Physician", "ATT"),
    TRANSCRIBER("TRANSCRIBER", "Transcriber", "TR"),
    EXPECTED_COSIGNER("EXPECTED COSIGNER", "Expected Cosigner", "EC"),
    EXPECTED_SIGNER("EXPECTED SIGNER", "Expected Signer", "ES"),
    SURROGATE("SURROGATE", "Surrogate", "SUR"),
    ADDITIONAL_SIGNER("ADDITIONAL SIGNER", "Additional Signer", "X"),
    /**
     * The completer of a document is the person whose signature completes (authenticates) the document.  If the
     * document requires cosignature, the completer is the cosigner.  Otherwise the completer is the signer.
     */
    COMPLETER("COMPLETER", "Completer", "CP"),
    /**
     * This is the person that will interpret the clinical procedure.
     */
    INTERPRETER("INTERPRETER", "Interpreter", "IN");

    private String name;
    private String abbreviation;
    private String displayName;

    AsuRole(String name, String displayName, String abbreviation) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.displayName = displayName;
    }

    public String getName() {
        return name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return getDisplayName();
    }

    public static AsuRole forAbbreviation(String abbreviation) {
        Assert.hasText(abbreviation);
        for (AsuRole role : values()) {
            if (role.getAbbreviation().equalsIgnoreCase(abbreviation)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Abbreviation '" + abbreviation + "' does not correspond to a " + AsuRole.class + " value");
    }

    public static AsuRole forName(String name) {
        Assert.hasText(name);
        for (AsuRole role : values()) {
            if (role.getName().equalsIgnoreCase(name)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Name '" + name + "' does not correspond to a " + AsuRole.class + " value");
    }
}
