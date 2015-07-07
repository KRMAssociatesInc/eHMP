package gov.va.cpe.idn;

import java.util.*;

/**
 * Mock patient identity Service for use with the jMeadows development service stack.
 */
public class MockPatientIdentityService implements IPatientIdentityService {

    //identifier list indexes
    private static final int EDIPI_IDX = 0;
    private static final int ICN_IDX = 1;
    private static final int SITE_DFN_IDX = 2;

    private static final List<String> EIGHT_INPATIENT = Arrays.asList("0000000001", "5000000217", "9E7A;100716");
    private static final List<String> EIGHT_OUTPATIENT = Arrays.asList("0000000002", "5000000116", "9E7A;100615");
    private static final List<String> EIGHT_PATIENT = Arrays.asList("0000000003", "10108", "9E7A;3");
    private static final List<String> ZZZRETIREDZERO_PATIENT = Arrays.asList("0000000004", null, "9E7A;4");
    private static final List<String> ZZRETIREDFIFTYSEVEN_PATIENT = Arrays.asList("0000000005", null, "9E7A;5");
    private static final List<String> ZZZRETIREDFIFTYTHREE_PATIENT = Arrays.asList("0000000006", null, "9E7A;6");
    private static final List<String> ZZZRETSIXTHIRTYFOUR_PATIENT = Arrays.asList("0000000007", null, "9E7A;7");
    private static final List<String> TEN_PATIENT = Arrays.asList("0000000008", "10110", "9E7A;8");
    private static final List<String> ZZZRETFOURTHIRTYTWO_PATIENT = Arrays.asList("0000000009", null, "9E7A;9");
    private static final List<String> BCMA_EIGHT = Arrays.asList("0000000010", null, "9E7A;100022");
    private static final List<String> ONEHUNDREDSIXTEEN_PATIENT = Arrays.asList("0000000011", "11016", "9E7A;227");
    private static final List<String> ZZZRETSIXTWENTYEIGHT_PATIENT = Arrays.asList("0000000012", null, "9E7A;230");
    private static final List<String> ZZZRETIREDFORTYEIGHT_PATIENT = Arrays.asList("0000000013", null, "9E7A;71");
    private static final List<String> GRAPHINGPATIENT_TWO = Arrays.asList("0000000014", "5000000339", "9E7A;100840");
    private static final List<String> ZZZRETIREDTWELVE_PATIENT = Arrays.asList("0000000015", null, "9E7A;421");

    private static final Map<String, List<String>> pidToIdentifiersMap = new HashMap<>();
    static {
        pidToIdentifiersMap.put("5000000217", EIGHT_INPATIENT);
        pidToIdentifiersMap.put("9E7A;100716", EIGHT_INPATIENT);
        pidToIdentifiersMap.put("5000000116", EIGHT_OUTPATIENT);
        pidToIdentifiersMap.put("9E7A;100615", EIGHT_OUTPATIENT);
        pidToIdentifiersMap.put("10108", EIGHT_PATIENT);
        pidToIdentifiersMap.put("9E7A;3", EIGHT_PATIENT);
        pidToIdentifiersMap.put("9E7A;4", ZZZRETIREDZERO_PATIENT);
        pidToIdentifiersMap.put("9E7A;5", ZZRETIREDFIFTYSEVEN_PATIENT);
        pidToIdentifiersMap.put("9E7A;6", ZZZRETIREDFIFTYTHREE_PATIENT);
        pidToIdentifiersMap.put("9E7A;7", ZZZRETSIXTHIRTYFOUR_PATIENT);
        pidToIdentifiersMap.put("10110", TEN_PATIENT);
        pidToIdentifiersMap.put("9E7A;8", TEN_PATIENT);
        pidToIdentifiersMap.put("9E7A;9", ZZZRETFOURTHIRTYTWO_PATIENT);
        pidToIdentifiersMap.put("9E7A;100022", BCMA_EIGHT);
        pidToIdentifiersMap.put("11016", ONEHUNDREDSIXTEEN_PATIENT);
        pidToIdentifiersMap.put("9E7A;227", ONEHUNDREDSIXTEEN_PATIENT);
        pidToIdentifiersMap.put("9E7A;230", ZZZRETSIXTWENTYEIGHT_PATIENT);
        pidToIdentifiersMap.put("9E7A;71", ZZZRETIREDFORTYEIGHT_PATIENT);
        pidToIdentifiersMap.put("5000000339", GRAPHINGPATIENT_TWO);
        pidToIdentifiersMap.put("9E7A;100840", GRAPHINGPATIENT_TWO);
        pidToIdentifiersMap.put("9E7A;421", ZZZRETIREDTWELVE_PATIENT);
    }

    /**
     * Retrieves all known patient identifiers.
     *
     * @param vistaId The vista site hash code.
     * @param pid    Patient Identifier (ICN, SITE;DFN)
     * @return PatientIds instance which contains all known patient identifiers.
     */
    @Override
    public PatientIds getPatientIdentifiers(String vistaId, String pid) {


        //List: EDIPI, ICN, VISTAID;DFN
        List<String> idsList = pidToIdentifiersMap.get(pid);

        if (idsList == null) return null;

        String edipi = idsList.get(EDIPI_IDX);
        String icn = idsList.get(ICN_IDX);
        String siteDfn = idsList.get(SITE_DFN_IDX);
        String dfn =  siteDfn.substring(siteDfn.indexOf(';')+1);
        String uid =  "urn:va:patient:"+vistaId+":"+ dfn +":"+ (icn != null ? icn : dfn);

        return new PatientIds.Builder()
                .pid(pid)
                .dfn(dfn)
                .edipi(edipi)
                .icn(icn)
                .uid(uid)
                .build();

    }
    
    public Set<String> getAllPatientIdentifiers() {
        return pidToIdentifiersMap.keySet();     
    }
}
