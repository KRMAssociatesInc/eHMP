package gov.va.hmp.access;

import java.util.List;

/**
 * A set of rules, an identifier for the rule-combining algorithm and (optionally) a set of obligations.  May be a
 * component of a policy set.
 *
 * @see IRule
 */
public interface IPolicy<S,A,R> extends IAdjudicator<S,A,R> {

    IRuleCombiningAlgorithm getRuleCombiningAlgorithm();

    List<? extends IRule<S, A, R>> getRules();

    int getRuleCount();

    String getDescription();
}
