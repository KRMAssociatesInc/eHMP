package gov.va.hmp.access;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Rule<S,A,R> implements IRule<S,A,R> {

    protected static Logger LOGGER = LoggerFactory.getLogger(Rule.class);

    private ITarget<S, A, R> target;
    private Effect effect;
    private ICondition<S, A, R> condition;
    private String description;
    private IPolicy<S, A, R> policy;

    public Rule(Effect effect) {
        this.effect = effect;
    }

    public Rule(ITarget<S, A, R> target, Effect effect) {
        this.target = target;
        this.effect = effect;
    }

    public Rule(ITarget<S, A, R> target, ICondition<S, A, R> condition, Effect effect) {
        this.target = target;
        this.condition = condition;
        this.effect = effect;
    }

    public ITarget<S, A, R> getTarget() {
        if (target == null) {
            return policy != null ? policy.getTarget() : null;
        } else {
            return target;
        }
    }

    public Effect getEffect() {
        return effect;
    }

    public ICondition<S, A, R> getCondition() {
        return condition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IPolicy<S, A, R> getPolicy() {
        return policy;
    }

    public void setPolicy(IPolicy<S, A, R> policy) {
        this.policy = policy;
    }

    @Override
    public AuthorizationDecision evaluate(DecisionRequest<S, A, R> request) {
        MatchResult matchResult = getTarget().evaluate(request);
        if (LOGGER.isTraceEnabled()) {
            LOGGER.trace(matchResult.getValue() + " from " + target + " for " + request);
        }
        if (MatchResult.Value.NO_MATCH.equals(matchResult.getValue())) {
            return new AuthorizationDecision(this, Decision.NOT_APPLICABLE);
        } else if (MatchResult.Value.INDETERMINATE.equals(matchResult.getValue())) {
            return new AuthorizationDecision(this, Decision.INDETERMINATE, matchResult.getStatus(), null);
        }

        if (condition != null) {
            try {
                ICondition.ConditionValue conditionValue = getCondition().evaluate(request);
                if (LOGGER.isTraceEnabled()) {
                    LOGGER.trace(conditionValue + " from " + getCondition() + " for " + request);
                }
                if (ICondition.ConditionValue.TRUE.equals(conditionValue)) {
                    return new AuthorizationDecision(this, Decision.valueOf(effect), Status.Code.OK, getDescription(), null);
                } else if (ICondition.ConditionValue.FALSE.equals(conditionValue)) {
                    return new AuthorizationDecision(this, Decision.NOT_APPLICABLE);
                } else if (ICondition.ConditionValue.INDETERMINATE.equals(conditionValue)) {
                    return new AuthorizationDecision(this, Decision.INDETERMINATE);
                }
            } catch (Exception e) {
                return AuthorizationDecision.valueOf(this, e);
            }
        }
        return new AuthorizationDecision(this, Decision.valueOf(effect), Status.Code.OK, createStatusMessage(request), null);
    }

    protected String createStatusMessage(DecisionRequest<S, A, R> request) {
        return getDescription();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                "effect=" + getEffect() +
                ", target=" + getTarget() +
                ", condition=" + getCondition() +
                "}";
    }
}
