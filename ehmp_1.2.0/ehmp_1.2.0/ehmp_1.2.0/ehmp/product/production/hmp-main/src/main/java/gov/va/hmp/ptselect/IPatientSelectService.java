package gov.va.hmp.ptselect;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 *
 *
 * TODO: should the actual "selection" operation end up here?
 * TODO: should the "patient checks" logic end up here?
 */
public interface IPatientSelectService {

    public static enum FilterType {
        WARD("Ward"),
        CLINIC("Clinic"),
        SPECIALTY("Specialty"),
        PROVIDER("Provider"),
        CPRS_DEFAULT("CPRS Default");

        private String name;

        private FilterType(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return name;
        }
    };

    Page<Map<String, Object>> searchWards(String query, Pageable pageRequest);
    Page<Map<String, Object>> searchClinics(String query, Pageable pageRequest);
    Page<Map<String, Object>> searchSpecialties(String query, Pageable pageRequest);
    Page<Map<String, Object>> searchProviders(String query, Pageable pageRequest);
    Page<Map<String, Object>> searchFiltersOfType(FilterType filterType, String query, Pageable pageRequest);

    Page<PatientSelect> searchPatients(String query, Pageable pageable);
    PatientSelectsAndMetadata searchPatientsInWard(String query, String wardUid, Pageable pageable);
    PatientSelectsAndMetadata searchPatientsInClinic(String query, String clinicUid, String relativeDateRangeExpression, Pageable pageable);
    PatientSelectsAndMetadata searchPatientsInSpecialty(String query, String specialtyId, Pageable pageable);
    PatientSelectsAndMetadata searchPatientsByProvider(String query, String providerId, Pageable pageable);
    PatientSelectsAndMetadata searchPatientsInCPRSDefaultList(String query, String userUid, Pageable pageable);
}
