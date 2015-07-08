package gov.va.cpe.vpr;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class CodeConstants {
    // URN coding systems
    public static final String URN_VUID = "urn:vuid:";
    public static final String URN_VA_DRUG_CLASS = "urn:vadc:";
    public static final String URN_RXNORM = "urn:rxcui:";
    public static final String URN_SNOMED_CT = "urn:sct:";

    // SNOMED Statuses
    public static final String SCT_STATUS_ACTIVE = URN_SNOMED_CT + "55561003";
    public static final String SCT_STATUS_NOT_ACTIVE = URN_SNOMED_CT + "73425007";

    // Encounter: Categories
    public static final String ENCOUNTER_CATEGORY_FUTURE_APPOINTMENT = "AP";
    public static final String ENCOUNTER_CATEGORY_NO_SHOW_APPOINTMENT = "NS";
    public static final String ENCOUNTER_CATEGORY_PHONE_CONTACT = "TC";
    public static final String ENCOUNTER_CATEGORY_CHART_REVIEW = "CR";
    public static final String ENCOUNTER_CATEGORY_OUTPATIENT_VISIT = "OV";
    public static final String ENCOUNTER_CATEGORY_NURSING_HOME = "NH";
    public static final String ENCOUNTER_CATEGORY_DOMICILLARY = "DO";
    public static final String ENCOUNTER_CATEGORY_ADMISSION = "AD";
    public static final String ENCOUNTER_CATEGORY_OTHER = "O";
    public static final String ENCOUNTER_CATEGORY_UNKNOWN = "U";

    // Medication:  SNOMED Statuses
    public static final String SCT_MED_STATUS_ACTIVE = SCT_STATUS_ACTIVE;
    public static final String SCT_MED_STATUS_NOT_ACTIVE = SCT_STATUS_NOT_ACTIVE;
    public static final String SCT_MED_STATUS_HISTORY = URN_SNOMED_CT + "392521001";
    public static final String SCT_MED_STATUS_HOLD = URN_SNOMED_CT + "421139008";
    public static final Map<String, String> SCT_MED_STATUS_FROM_VISTA;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put("active", SCT_MED_STATUS_ACTIVE);
        aMap.put("not active", SCT_MED_STATUS_NOT_ACTIVE);
        aMap.put("historical", SCT_MED_STATUS_HISTORY);
        aMap.put("hold", SCT_MED_STATUS_HOLD);
        SCT_MED_STATUS_FROM_VISTA = Collections.unmodifiableMap(aMap);
    }

    public static final Map<String, String> SCT_MED_STATUS_TO_TEXT;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put(SCT_MED_STATUS_ACTIVE, "active");
        aMap.put(SCT_MED_STATUS_NOT_ACTIVE, "not active");
        aMap.put(SCT_MED_STATUS_HISTORY, "historical");
        aMap.put(SCT_MED_STATUS_HOLD, "hold");
        SCT_MED_STATUS_TO_TEXT = Collections.unmodifiableMap(aMap);
    }

    // Medication:  SNOMED Types
    public static final String SCT_MED_TYPE_OTC = URN_SNOMED_CT + "329505003";
    public static final String SCT_MED_TYPE_PRESCRIBED = URN_SNOMED_CT + "73639000";
    public static final String SCT_MED_TYPE_GENERAL = URN_SNOMED_CT + "105903003";  // used for inpatient meds for now (SNOMED - Types of Drugs)
    public static final Map<String, String> SCT_MED_TYPE_FROM_VISTA;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put("Prescription", SCT_MED_TYPE_PRESCRIBED);
        aMap.put("OTC", SCT_MED_TYPE_OTC);
        SCT_MED_TYPE_FROM_VISTA = Collections.unmodifiableMap(aMap);
    }

    // Medication:  SNOMED  Roles
    public static final String SCT_MED_ROLE_GENERAL = URN_SNOMED_CT + "410942007";   // drug or medicament
    public static final String SCT_MED_ROLE_BASE = URN_SNOMED_CT + "418297009";     // pharmaceutical base or inactive agent
    public static final String SCT_MED_ROLE_ADDITIVE = URN_SNOMED_CT + "418804003";  // pharmaceutical fluid or solution agent
    public static final Map<String, String> SCT_MED_ROLE_FROM_VISTA;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put("A", SCT_MED_ROLE_ADDITIVE);
        aMap.put("B", SCT_MED_ROLE_BASE);
        aMap.put("M", SCT_MED_ROLE_GENERAL);
        SCT_MED_ROLE_FROM_VISTA = Collections.unmodifiableMap(aMap);
    }

    // Medication:  HL7 Fill Status
    public static final String HL7_ACTSTATUS_COMPLETE = "completed";
    public static final String HL7_ACTSTATUS_ABORTED = "aborted";

    // Medication:  Misc Strings
    public static final String VA_MED_PHARMACY = "VA";
    public static final String VA_MED_TYPE_INFUSION = "V";

    // Observation: HL7 Interpretation Codes
    public static final Map<String, String> HL7_INTERPRET_FROM_CLIO;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put("Unknown", "");
        aMap.put("Normal", "N");
        aMap.put("Out of Bounds Low", "<");
        aMap.put("Out of Bounds High", ">");
        aMap.put("Low", "L");
        aMap.put("High", "H");
        HL7_INTERPRET_FROM_CLIO = Collections.unmodifiableMap(aMap);
    }

    public static final Map<String, String> HL7_STATUS_FROM_CLIO;

    static {
        Map<String, String> aMap = new HashMap<String, String>();
        aMap.put("Unverified", "active");
        aMap.put("Verified", "complete");
        aMap.put("Corrected", "complete");
        HL7_STATUS_FROM_CLIO = Collections.unmodifiableMap(aMap);
    }

    // Observation: Qualifier Type
    public static final String OBS_QUALIFIER_POSITION = "position";
    public static final String OBS_QUALIFIER_PRODUCT = "product";
    public static final String OBS_QUALIFIER_QUALITY = "quality";
    public static final String OBS_QUALIFIER_SPECIMEN = "specimen";

    // Order: Statuses
    public static final String ORDER_STATUS_ACTIVE = "actv";

    // Problem: SNOMED Statuses
    public static final String SCT_PROBLEM_STATUS_ACTIVE = SCT_STATUS_ACTIVE;
    public static final String SCT_PROBLEM_STATUS_NOT_ACTIVE = SCT_STATUS_NOT_ACTIVE;

    // ResultOrganizer: organizer types
    public static final String RESULT_ORGANIZER_TYPE_ACCESSION = "accession";
    public static final String RESULT_ORGANIZER_TYPE_PANEL = "panel";

    // Result: category types
    public static final String RESULT_CATEGORY_TYPE_CHEMISTRY = "CH";
    public static final String RESULT_CATEGORY_TYPE_MICROBIOLOGY = "MI";
}
