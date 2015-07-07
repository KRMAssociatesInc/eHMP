package gov.va.hmp.access;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * A set of policies, other policy sets, a policy-combining algorithm and (optionally) a set of obligations.  May be a
 * component of another policy set
 */
public class PolicySet<S, A, R> implements IPolicySet<S, A, R> {
    protected static Logger LOGGER = LoggerFactory.getLogger(PolicySet.class);

    private ITarget target;
    private IPolicyCombiningAlgorithm policyCombiningAlgorithm;
    private List<IAdjudicator<S,A,R>> adjudicators;
    private Set<IPolicy<S,A,R>> policies = new HashSet<>();
    private Set<IPolicySet<S,A,R>> policySets = new HashSet<>();
    //private List obligations
    private String description;

    public PolicySet(ITarget target, IPolicyCombiningAlgorithm policyCombiningAlgorithm) {
        this(target, policyCombiningAlgorithm, new ArrayList<IAdjudicator<S,A,R>>());
    }

    public PolicySet(ITarget target, IPolicyCombiningAlgorithm policyCombiningAlgorithm, List<IAdjudicator<S,A,R>> adjudicators) {
        this.target = target;
        this.policyCombiningAlgorithm = policyCombiningAlgorithm;
        this.adjudicators = adjudicators;
        for (IAdjudicator adjudicator : this.adjudicators) {
            if (adjudicator instanceof IPolicy) {
                policies.add((IPolicy) adjudicator);
            }
            if (adjudicator instanceof IPolicySet) {
                policySets.add((IPolicySet) adjudicator);
            }
        }
    }

    public ITarget getTarget() {
        return target;
    }

    @Override
    public IPolicyCombiningAlgorithm getPolicyCombiningAlgorithm() {
        return policyCombiningAlgorithm;
    }

    @Override
    public Set<IPolicy<S,A,R>> getPolicies() {
        return Collections.unmodifiableSet(policies);
    }

    @Override
    public Set<IPolicySet<S,A,R>> getPolicySets() {
        return Collections.unmodifiableSet(policySets);
    }

    @Override
    public List<IAdjudicator<S, A, R>> getAdjudicators() {
        return Collections.unmodifiableList(adjudicators);
    }

    @Override
    public int getRuleCount() {
        int ruleCount = 0;
        for (IPolicySet policySet : policySets) {
            ruleCount += policySet.getRuleCount();
        }
        for (IPolicy policy : policies) {
            ruleCount += policy.getRuleCount();
        }
        return ruleCount;
    }

    @Override
    public int getPolicyCount() {
        int policyCount = getPolicies().size();
        for (IPolicySet policySet : policySets) {
            policyCount += policySet.getPolicyCount();
        }
        return policyCount;
    }

    @Override
    public int getPolicySetCount() {
        return getPolicySets().size();
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
        if (MatchResult.Value.NO_MATCH.equals(matchResult.getValue())) {return new AuthorizationDecision(this, Decision.NOT_APPLICABLE); }
        else if (MatchResult.Value.INDETERMINATE.equals(matchResult.getValue())) {return new AuthorizationDecision(this, Decision.INDETERMINATE,matchResult.getStatus(), null);}

        return policyCombiningAlgorithm.evaluate(getAdjudicators(), request);
    }

    public void addPolicy(IPolicy<S,A,R> policy) {
        this.adjudicators.add(policy);
        this.policies.add(policy);
    }

    public void addPolicySet(IPolicySet<S,A,R> policySet) {
        this.adjudicators.add(policySet);
        this.policySets.add(policySet);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                "policySets=" + getPolicySetCount() +
                ", policies=" + getPolicyCount() +
                ", rules=" + getRuleCount() +
                ", target=" + getTarget() +
                '}';
    }
}
