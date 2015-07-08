package gov.va.vlerdas;

/**
 * Enum storing the possible domain values for a VLER DAS URL
 */
public enum VlerDasDomain {

    VITALS("vital");
    //TODO add other domains


    private String value;

    private VlerDasDomain(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
