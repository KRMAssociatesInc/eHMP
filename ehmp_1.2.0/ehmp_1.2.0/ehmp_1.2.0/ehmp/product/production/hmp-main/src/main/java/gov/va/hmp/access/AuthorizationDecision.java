package gov.va.hmp.access;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

/**
 * The result of evaluating applicable policy.
 * <p/>
 * A decision value of "Permit”, “Deny”, “Indeterminate” or “NotApplicable", and (optionally) a set of obligations
 */
public class AuthorizationDecision {

    public static AuthorizationDecision valueOf(Object source, Exception e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        if (e instanceof MissingAttributeException) {
            return new AuthorizationDecision(source, Decision.INDETERMINATE, new Status(Status.Code.MISSING_ATTRIBUTE, e.getMessage(), sw.toString()), null);
        } else {
            return new AuthorizationDecision(source, Decision.INDETERMINATE, new Status(Status.Code.PROCESSING_ERROR, e.getMessage(), sw.toString()), null);
        }
    }

    private final Object source;
    private final Decision decision;
    private final Status status;
    //    private List<Obligation> obligations;
    private List<AuthorizationDecision> trace;

    public AuthorizationDecision(Object source, Decision decision) {
       this(source, decision, Status.OK, null);
    }

    public AuthorizationDecision(Object source, Decision decision, Status.Code code, String message, String detail) {
        this(source, decision, new Status(code, message, detail), null);
    }

    public AuthorizationDecision(Object source, Decision decision, Status.Code code, String message, String detail, List<AuthorizationDecision> trace) {
        this(source, decision, new Status(code, message, detail), trace);
    }

    public AuthorizationDecision(Object source, Decision decision, Status status, List<AuthorizationDecision> trace) {
        this.source = source;
        this.decision = decision;
        this.status = status;
        this.trace = trace;
    }

    public Object getSource() {
        return source;
    }

    public Decision getDecision() {
        return decision;
    }

    public Status getStatus() {
        return status;
    }

    public List<AuthorizationDecision> getTrace() {
        return trace;
    }

    @Override
    public String toString() {
        return decision.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AuthorizationDecision that = (AuthorizationDecision) o;

        if (decision != that.decision) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return decision.hashCode();
    }

}
