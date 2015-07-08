package gov.va.hmp.access;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * The request to render an authorization decision
 */
public class DecisionRequest<S, A, R> {
    private List<S> subjects;

    private A action;
    private R resource;

    private Map<String, Object> environment;

    public DecisionRequest(S subject, A action, R resource) {
        this(Collections.singletonList(subject), action, resource);
    }

    public DecisionRequest(List<S> subjects, A action, R resource) {
        this.subjects = subjects;
        this.action = action;
        this.resource = resource;
    }

    public List<S> getSubjects() {
        return subjects;
    }

    public S getSubject() {
        if (subjects.size() != 1) throw new UnsupportedOperationException("The number of subjects in this request is not 1, cannot use getSubject()");
        return subjects.get(0);
    }

    public A getAction() {
        return action;
    }

    public R getResource() {
        return resource;
    }
}
