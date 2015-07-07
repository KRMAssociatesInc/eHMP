package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.List;
import java.util.Map;

public class PatientChecks extends AbstractPOMObject {
    private Deceased deceased;
    private Sensitive sensitive;
    private List<PatientRecordFlag> patientRecordFlags;
    private Similar similar;

    public PatientChecks() {
    }

    @JsonCreator
    public PatientChecks(Map<String, Object> vals) {
        super(vals);
    }

    public Sensitive getSensitive() {
        return sensitive;
    }

    public List<PatientRecordFlag> getPatientRecordFlags() {
        return patientRecordFlags;
    }

    public Similar getSimilar() {
        return similar;
    }

    public static class Deceased extends AbstractPOMObject {

        private String text;

        public Deceased() {
            super();
        }

        @JsonCreator
        public Deceased(Map<String, Object> vals) {
            super(vals);
        }

        public String getText() {
            return text;
        }
    }

    public static class Sensitive extends AbstractPOMObject {
        private boolean mayAccess;
        private boolean logAccess;
        private String text;

        public Sensitive() {
            super();
        }

        @JsonCreator
        public Sensitive(Map<String, Object> vals) {
            super(vals);
        }

        @JsonProperty("mayAccess")
        public boolean isMayAccess() {
            return mayAccess;
        }

        @JsonProperty("logAccess")
        public boolean isLogAccess() {
            return logAccess;
        }

        public String getText() {
            return text;
        }
    }

    public static class Similar extends AbstractPOMObject {

        private String text;

        public Similar() {
            super();
        }

        @JsonCreator
        public Similar(Map<String, Object> vals) {
            super(vals);
        }

        public String getText() {
            return text;
        }
    }
}
