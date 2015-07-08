package gov.va.hmp.access;

import java.util.List;
import java.util.Set;

/**
 * A set of policies, other policy sets, a policy-combining algorithm and (optionally) a set of obligations.  May be a
 * component of another policy set
 */
public interface IPolicySet<S,A,R> extends IAdjudicator<S,A,R> {
    IPolicyCombiningAlgorithm<S,A,R> getPolicyCombiningAlgorithm();

    Set<IPolicy<S,A,R>> getPolicies();

    Set<IPolicySet<S,A,R>> getPolicySets();

    List<IAdjudicator<S,A,R>> getAdjudicators();

    int getRuleCount();

    int getPolicyCount();

    int getPolicySetCount();

    String getDescription();
}
