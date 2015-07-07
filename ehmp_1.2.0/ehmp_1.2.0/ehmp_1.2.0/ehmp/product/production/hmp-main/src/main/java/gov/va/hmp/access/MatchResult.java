package gov.va.hmp.access;

import java.io.PrintWriter;
import java.io.StringWriter;

public class MatchResult {

    public static enum Value {
        MATCH,
        NO_MATCH,
        INDETERMINATE
    }

    public static MatchResult valueOf(Value value) {
        return new MatchResult(value, value == Value.INDETERMINATE ? new Status(Status.Code.PROCESSING_ERROR, null, null) : Status.OK);
    }

    public static MatchResult valueOf(boolean b) {
        return new MatchResult(b ? Value.MATCH : Value.NO_MATCH, Status.OK);
    }

    public static MatchResult valueOf(Exception e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        if (e instanceof MissingAttributeException) {
            return new MatchResult(Value.INDETERMINATE, new Status(Status.Code.MISSING_ATTRIBUTE, e.getMessage(), sw.toString()));
        } else {
            return new MatchResult(Value.INDETERMINATE, new Status(Status.Code.PROCESSING_ERROR, e.getMessage(), sw.toString()));
        }
    }

    private final Value value;
    private final Status status;

    private MatchResult(Value value, Status status) {
        this.value = value;
        this.status = status;
    }

    public Value getValue() {
        return value;
    }

    public Status getStatus() {
        return status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MatchResult matchResult = (MatchResult) o;

        if (value != matchResult.value) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }

    @Override
    public String toString() {
        return getValue().toString();
    }
}
