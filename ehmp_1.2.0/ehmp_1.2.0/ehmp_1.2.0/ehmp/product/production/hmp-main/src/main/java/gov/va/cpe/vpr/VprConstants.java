package gov.va.cpe.vpr;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class VprConstants {
    public static final String RELATIONAL_DATASTORE_PROFLE = "vpr-datastore-relational";
    public static final String JSON_DATASTORE_PROFLE = "vpr-datastore-json";
    public static final String MONGO_DATASTORE_PROFLE = "vpr-datastore-mongo";
    public static final String SOLR_DATASTORE_PROFLE = "vpr-datastore-solr";

    public static final List PATIENT_RELATED_DOMAIN_CLASSES = Collections.unmodifiableList(Arrays.asList(
            Allergy.class,
            Document.class,
            Encounter.class,
            HealthFactor.class,
            Immunization.class,
            Medication.class,
            Observation.class,
            Order.class,
            Problem.class,
            Procedure.class,
            Result.class,
            ResultOrganizer.class,
            Task.class,
            VitalSign.class,
            VitalSignOrganizer.class,
            RoadTrip.class));
    
    public static final List NON_PATIENT_DOMAIN_CLASSES = Collections.unmodifiableList(Arrays.asList(
            PointOfCare.class));
}
