package gov.va.hmp.access;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static gov.va.hmp.access.Decision.NOT_APPLICABLE;
import static gov.va.hmp.access.MatchResult.Value.NO_MATCH;

public class Policy<S,A,R> implements IPolicy<S,A,R> {

    protected static Logger LOGGER = LoggerFactory.getLogger(Policy.class);

    private ITarget target;
    private IRuleCombiningAlgorithm ruleCombiningAlgorithm;
//    private T ruleCombiningAlgorithm;
    private List<? extends IRule<S,A,R>> rules;
    //private List obligations
    private String description;

    public Policy(ITarget<S,A,R> target, IRuleCombiningAlgorithm<S,A,R> ruleCombiningAlgorithm) {
        this(target, ruleCombiningAlgorithm, new ArrayList<IRule<S,A,R>>());
    }

    public Policy(ITarget<S,A,R> target, IRuleCombiningAlgorithm<S,A,R> ruleCombiningAlgorithm, List<? extends IRule<S, A, R>> rules) {
        this.target = target;
        this.ruleCombiningAlgorithm = ruleCombiningAlgorithm;
        this.rules = rules;
        for(IRule rule: this.rules) {
            if (rule instanceof Rule) {
                ((Rule) rule).setPolicy(this);
            }
        }
    }

    public ITarget<S,A,R> getTarget() {
        return target;
    }

    @Override
    public IRuleCombiningAlgorithm getRuleCombiningAlgorithm() {
        return ruleCombiningAlgorithm;
    }

    @Override
    public List<? extends IRule<S, A, R>> getRules() {
        return Collections.unmodifiableList(rules);
    }

    @Override
    public int getRuleCount() {
        return getRules().size();
    }

    @Override
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public AuthorizationDecision evaluate(DecisionRequest<S, A, R> request) {
        MatchResult matchResult = target.evaluate(request);
        if (LOGGER.isTraceEnabled()) { LOGGER.trace(matchResult.getValue() + " from " + target + " for " + request); }
        if (NO_MATCH.equals(matchResult.getValue())) { return new AuthorizationDecision(this, NOT_APPLICABLE);}
        else if (MatchResult.Value.INDETERMINATE.equals(matchResult.getValue())) {return new AuthorizationDecision(this, Decision.INDETERMINATE, matchResult.getStatus(), null); }

        return ruleCombiningAlgorithm.evaluate(getRules(), request);
    }

//    public void addRule(Rule<S,A,R> rule) {
//       rule.setPolicy(this);
//       this.rules.add(rule);
//    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                ", rules=" + getRuleCount() +
                ", target=" + getTarget() +
                '}';
    }
}
