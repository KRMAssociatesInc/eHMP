package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.DocumentDefinition;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.IRule;
import gov.va.hmp.access.Rule;
import gov.va.hmp.auth.HmpUserDetails;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;

/**
 * A {@link gov.va.hmp.access.IPolicyDecisionPoint} implementation that only worries about evaluating ASU rules.
 * <p/>
 * A grand unified PDP that enforces ASU rules and rules regarding other system entities (i.e. order entry, etc.) is
 * anticipated in the future.
 */
public class AsuPolicyDecisionPoint implements IPolicyDecisionPoint {

    private static Logger LOGGER = LoggerFactory.getLogger(AsuPolicyDecisionPoint.class);

    private IGenericPOMObjectDAO dao;

    private AsuBasePolicySet basePolicySet;

    private ReadWriteLock basePolicySetLock = new ReentrantReadWriteLock();

    @Autowired
    public void setDao(IGenericPOMObjectDAO dao) {
        this.dao = dao;
    }

    @Override
    public AuthorizationDecision evaluate(DecisionRequest request) {
        // no rules loaded means we should try to load them again
        if (basePolicySet.getRuleCount() == 0) {
           refresh();
        }
        // now do the evaluation
        final Lock readLock = basePolicySetLock.readLock();
        try {
            readLock.lock();
            AuthorizationDecision decision = basePolicySet.evaluate(request);
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("[ " + request.toString());
                logDecisionTrace(decision, 0);
            }
            return decision;
        } finally {
            readLock.unlock();
        }
    }

    private void logDecisionTrace(AuthorizationDecision decision, int level) {
        if (decision.getTrace() != null) {
            for (AuthorizationDecision d : decision.getTrace()) {
                logDecisionTrace(d, level + 1);
            }
        }

        char[] indent = new char[level];
        Arrays.fill(indent, '-');
        LOGGER.debug((level == 0 ? "]= " : " |" + String.valueOf(indent)) + decision.getDecision() + " - " + decision.getSource());
    }

    // this smells a bit to me - maybe refactor somehow
    public synchronized void refresh() {
        final Lock writeLock = basePolicySetLock.writeLock();
        try {
            writeLock.lock();
            Map<String, DocumentDefinition> documentDefinitionHierarchy = loadDocumentDefinitionHierarchy();
            if (LOGGER.isDebugEnabled()) {
                printDocumentDefinitionHiearchy(documentDefinitionHierarchy);
            }
            basePolicySet = new AsuBasePolicySet();
    
            // load rules and group by docDef, docStatus and action tuple
            Map<AsuTarget, List<AsuRuleDef>> rulesGroupedByTarget = new HashMap<>();
            List<AsuRuleDef> rules = dao.findAll(AsuRuleDef.class);
            for (AsuRuleDef rule : rules) {
                try {
                    AsuTarget target = AsuTarget.create(documentDefinitionHierarchy, rule);
                    List<AsuRuleDef> groupedRules = rulesGroupedByTarget.get(target);
                    if (groupedRules == null) {
                        groupedRules = new LinkedList<>();
                        rulesGroupedByTarget.put(target, groupedRules);
                    }
                    groupedRules.add(rule);
                } catch (Exception e) {
                    LOGGER.warn("Unable to process ASU rule '" + rule.getUid() + "': ", e);
                }
            }
            LOGGER.info("loaded " + rules.size() + " ASU rules into " + rulesGroupedByTarget.size() + " target groups");
    
            // initialize table
            Table<DocumentAction, DocumentStatus, Map<String, AsuPolicy>> policies = HashBasedTable.create(rulesGroupedByTarget.size(), DocumentStatus.values().length);
            for (DocumentAction action : DocumentAction.values()) {
                for (DocumentStatus status : DocumentStatus.values()) {
                    policies.put(action, status, new HashMap<String, AsuPolicy>());
                }
            }
    
            // create a policy corresponding to each rule group
            for (Map.Entry<AsuTarget, List<AsuRuleDef>> entry : rulesGroupedByTarget.entrySet()) {
                AsuPolicy policy = createAsuPolicy(documentDefinitionHierarchy, entry.getKey(), entry.getValue());
                policies.get(policy.getAction(), policy.getStatus()).put(policy.getDocumentDefinitionUid(), policy);
            }
    
            // TODO: get AsuBasePolicy to dump this info?
            if (LOGGER.isTraceEnabled()) {
                for (DocumentAction action : DocumentAction.values()) {
                    for (DocumentStatus status : DocumentStatus.values()) {
                        Collection<AsuPolicy> foops = policies.get(action, status).values();
                        if (!foops.isEmpty()) {
                            LOGGER.trace("  " + action + " " + status + ": " + foops.size() + " policies");
                        }
                        for (AsuPolicy foop : foops) {
                            LOGGER.trace("    " + foop);
                            for (IRule<HmpUserDetails, DocumentAction, Object> rule: foop.getRules()) {
                                LOGGER.trace("      " + rule.toString());
                            }
                        }
                    }
                }
            }
    
            // initialize policy sets that represent doc def hierarchy
            for (DocumentAction action : DocumentAction.values()) {
                for (DocumentStatus status : DocumentStatus.values()) {
                    Collection<AsuPolicy> foops = policies.get(action,status).values();
                    for (AsuPolicy policy : foops) {
                        List<AsuPolicy> policyHierarchy = new LinkedList<>();
                        policyHierarchy.add(policy);
    
                        DocumentDefinition parentDocDef = documentDefinitionHierarchy.get(policy.getDocumentDefinition().getParentUid());
                        while (parentDocDef != null) {
                            AsuPolicy parentPolicy = policies.get(action,status).get(parentDocDef.getUid());
                            if (parentPolicy != null) {
                                policyHierarchy.add(parentPolicy);
                            }
    
                            parentDocDef = documentDefinitionHierarchy.get(parentDocDef.getParentUid());
                        }
    
                        // TBD: check this target setting right here, might need to relax docDefUid requriement, I think?
                        AsuPolicySet policySet = AsuPolicySet.create(policy.getAction(), policy.getStatus(), policyHierarchy);
                        basePolicySet.addPolicySet(policySet);
                        LOGGER.trace(policySet.toString());
                    }
                }
            }
        LOGGER.trace("loaded base policy set: " + basePolicySet);
        } finally {
            writeLock.unlock();
        }
    }

    private AsuPolicy createAsuPolicy(Map<String, DocumentDefinition> documentDefinitionHierarchy, AsuTarget target, List<AsuRuleDef> ruleDefs) {
        List<Rule<HmpUserDetails, DocumentAction, Object>> policyRules = new ArrayList<>(ruleDefs.size());
        for (AsuRuleDef asuRuleDef : ruleDefs) {
            List<AsuRule> rules = AsuRule.create(documentDefinitionHierarchy, asuRuleDef);
            policyRules.addAll(rules);
        }

        return new AsuPolicy(documentDefinitionHierarchy, target.getAction(), target.getStatus(), target.getDocumentDefinition(), policyRules);
    }

    private Map<String, DocumentDefinition> loadDocumentDefinitionHierarchy() {
        Map<String, DocumentDefinition> docDefsByUid = new HashMap<>();

        List<DocumentDefinition> docDefsWithChildren = new ArrayList<>();
        List<DocumentDefinition> all = dao.findAll(DocumentDefinition.class);
        for (DocumentDefinition docDef : all) {
            docDefsByUid.put(docDef.getUid(), docDef);

            if (docDef.getItems() != null && !docDef.getItems().isEmpty()) {
                docDefsWithChildren.add(docDef);
            }
        }
        for (DocumentDefinition docDef : docDefsWithChildren) {
            for (Map<String, Object> childItem : docDef.getItems()) {
                DocumentDefinition child = docDefsByUid.get(childItem.get("uid"));
                child.setData("parentUid", docDef.getUid());
            }
        }
        return Collections.unmodifiableMap(docDefsByUid);
    }

    private void printDocumentDefinitionHiearchy(Map<String, DocumentDefinition> documentDefinitionHierarchy) {
        List<DocumentDefinition> classes = new ArrayList<>();
        for (DocumentDefinition docDef : documentDefinitionHierarchy.values()) {
            if (docDef.getTypeName().equalsIgnoreCase("CLASS")) {
                classes.add(docDef);
            }
        }
        for (DocumentDefinition docDef : classes) {
            LOGGER.trace(docDef.getDisplayName() + " (" + docDef.getUid() + ")");
            for (Map<String, Object> documentClassItem : docDef.getItems()) {
                DocumentDefinition documentClass = documentDefinitionHierarchy.get(documentClassItem.get("uid"));
                LOGGER.trace("+- " + documentClass.getDisplayName() + " (" + documentClass.getUid() + ")");
                if (documentClass.getItems() == null) continue;

                int titleCount = documentClass.getItems() != null ? documentClass.getItems().size() : -1;
                int i = 0;
                for (Map<String, Object> titleItem : documentClass.getItems()) {
                    DocumentDefinition title = documentDefinitionHierarchy.get(titleItem.get("uid"));

                    LOGGER.trace("|  " + ((i == titleCount - 1) ? "\\- " : "+- ") + title.getDisplayName() + " (" + title.getUid() + ")");
                    i++;
                }
            }
        }
    }

}
