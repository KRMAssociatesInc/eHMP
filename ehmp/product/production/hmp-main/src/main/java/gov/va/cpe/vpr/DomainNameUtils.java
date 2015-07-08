package gov.va.cpe.vpr;

import gov.va.hmp.ptselect.PatientSelect;

import java.util.*;

public class DomainNameUtils {

    private static final Map<Class, Set<String>> CLASS_TO_DOMAINS = new HashMap<>();

    static {
        CLASS_TO_DOMAINS.put(Allergy.class, new HashSet<String>(Arrays.asList("allergy")));
        CLASS_TO_DOMAINS.put(Document.class, new HashSet<String>(Arrays.asList("document")));
        CLASS_TO_DOMAINS.put(Encounter.class, new HashSet<String>(Arrays.asList("encounter")));
        CLASS_TO_DOMAINS.put(HealthFactor.class, new HashSet<String>(Arrays.asList("factor")));
        CLASS_TO_DOMAINS.put(Immunization.class, new HashSet<String>(Arrays.asList("immunization")));
        CLASS_TO_DOMAINS.put(Medication.class, new HashSet<String>(Arrays.asList("med")));
        CLASS_TO_DOMAINS.put(Observation.class, new HashSet<String>(Arrays.asList("observation")));
        CLASS_TO_DOMAINS.put(Order.class, new HashSet<String>(Arrays.asList("order")));
        CLASS_TO_DOMAINS.put(Problem.class, new HashSet<String>(Arrays.asList("problem")));
        CLASS_TO_DOMAINS.put(Procedure.class, new HashSet<String>(Arrays.asList("procedure", "consult")));
        CLASS_TO_DOMAINS.put(Result.class, new HashSet<String>(Arrays.asList("result")));
        CLASS_TO_DOMAINS.put(VitalSign.class, new HashSet<String>(Arrays.asList("vital")));
        CLASS_TO_DOMAINS.put(Task.class, new HashSet<String>(Arrays.asList("task")));
        CLASS_TO_DOMAINS.put(PatientSelect.class, new HashSet<String>(Arrays.asList("pt-select")));
    }
    
    public static Class getClassForDomain(String domain) {
        for (Map.Entry<Class, Set<String>> entry : CLASS_TO_DOMAINS.entrySet()) {
            if (entry.getValue().contains(domain)) return entry.getKey();
        }

        throw new IllegalArgumentException("Unknown domain '" + domain + "'");
    }

    public static Set<String> getDomainsForClass(Class domainClass) {
        if (!CLASS_TO_DOMAINS.containsKey(domainClass))
            throw new IllegalArgumentException("Unknown domain class '" + domainClass + "'");
        return CLASS_TO_DOMAINS.get(domainClass);
    }
}
