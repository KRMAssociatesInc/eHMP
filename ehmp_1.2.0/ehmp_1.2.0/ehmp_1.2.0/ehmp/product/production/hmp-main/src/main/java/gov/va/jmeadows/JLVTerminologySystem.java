package gov.va.jmeadows;

public enum JLVTerminologySystem {

    UMLS("UMLS", "2.16.840.1.113883.6.86"),
    CVX("CVX", "2.16.840.1.113883.12.292"),
    LOINC("LOINC", "2.16.840.1.113883.6.1"),
    //LABS code value is of type LOINC
    LABS("LABS", "2.16.840.1.113883.6.1"),
    //VITALS code value is of type LOINC
    VITALS("VITALS", "2.16.840.1.113883.6.1"),
    RXNORM("RXNORM", "2.16.840.1.113883.6.88"),
    SNOMEDCT("SNOMED", "2.16.840.1.113883.6.96");
    
    private static final String LOINC_URI = "http://loinc.org";
    private static final String SNOMEDCT_URI = "http://snomed.info/sct";

    private String oid;
    private String name;

    private JLVTerminologySystem(String name, String oid)
    {
        this.oid = oid;
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public String getOid() {
        return this.oid;
    }

    public String getUrn() {
    	// Handle cases where we want to use a URI rather than an OID.
    	//-------------------------------------------------------------
    	if ("2.16.840.1.113883.6.1".equals(oid)) {
    		return LOINC_URI;
    	}
    	if ("2.16.840.1.113883.6.96".equals(oid)) {
    		return SNOMEDCT_URI;
    	}
    	else {
    		return String.format("urn:oid:%s", oid);
    	}
    }

    public static JLVTerminologySystem getSystemByName(String name)
    {
        for(JLVTerminologySystem termSystem : JLVTerminologySystem.values())
        {
            if (termSystem.getName().equalsIgnoreCase(name)) return termSystem;
        }

        return null;
    }

    public static JLVTerminologySystem getSystemByOID(String oid)
    {
        for(JLVTerminologySystem termSystem : JLVTerminologySystem.values())
        {
            if (termSystem.getOid().equals(oid)) return termSystem;
        }

        return null;
    }

}
