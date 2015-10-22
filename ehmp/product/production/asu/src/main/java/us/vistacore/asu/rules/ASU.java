package us.vistacore.asu.rules;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.vistacore.asu.dao.JdsDao;
import us.vistacore.asu.util.NullChecker;

import java.util.*;

/**
 * Created by kumblep on 4/19/15.
 */
@Component
public class ASU
{

    public static List<AsuRuleDef> asuRules;
    public static Map<String, DocumentDefinition> allDocDefsByUid;
    public static List<DocumentDefinition> docDefsWithChildren;
    private static final Logger log = LoggerFactory.getLogger(ASU.class);
    @Autowired
    private JdsDao dao;


    public synchronized void refresh() {
        asuRules = dao.findAll(AsuRuleDef.class);
        loadDocumentDefinitionHierarchy();
    }

/*
      This class checks if a matching rule can be found from the passed input

      @userClassUids - contains the class name of the current logged in GUI user along with all the parent
      @class names of the current logged in user
      @userRoleNames - contains the list of document role names
      @docDefUid - contains the unique id of a document
      @docStatus - contains the document status

      @return value - true - This means the user can view the document. If false the user cannot view the document.

      This is a sample rule from JDS. The passed input values must match a rule in the rule set in JDS for a user to be able
      to view the document.
{
        "stampTime": "20150522232603",
        "actionName": "VIEW",
        "actionUid": "urn:va:doc-action:9E7A:7",
        "description": "A clinical document with a status of Uncosigned may be viewed by individuals enrolled under the User Class, Clinical Service Chief.",
        "docDefName": "CLINICAL DOCUMENTS",
        "docDefUid": "urn:va:doc-def:9E7A:38",
        "isAnd": false,
        "localId": 100,
        "statusName": "UNCOSIGNED",
        "statusUid": "urn:va:doc-status:9E7A:6",
        "uid": "urn:va:asu-rule:9E7A:100",
        "userClassName": "CLINICAL SERVICE CHIEF",
        "userClassUid": "urn:va:asu-class:9E7A:554"
        "userRoleName": "EXPECTED COSIGNER",
        "userRoleUid": "urn:va:asu-role:9E7A:4"
      }


 */
    public boolean isRulePresent(ArrayList<String> userClassUids,ArrayList<String> userRoleNames,String docDefUid,String docStatus)
    {
        if(NullChecker.isNullish(asuRules))
            refresh();

        //A document can have one or more parent document
        ArrayList<String> parentDocDefUids=getParentDocList(docDefUid);
        parentDocDefUids.add(docDefUid);

        for(int i=0;i<asuRules.size();i++)
        {
            AsuRuleDef asuRule=(AsuRuleDef)asuRules.get(i);

            //check if action name = VIEW in the rule
            if(asuRule!=null && asuRule.getActionName()!=null && asuRule.getActionName().equals("VIEW"))
            {
                //check if the doc status of a rule matches the input docStatus
                if(asuRule.getStatusName()!=null && asuRule.getStatusName().equalsIgnoreCase(docStatus))
                {
                    for(String currDocDefUid:parentDocDefUids)
                    {
                        //check if the input docdefuid or any of its parent docdefuid matches the docdefuid in the rule
                        if(asuRule.getDocDefUid().equals(currDocDefUid))
                        {
                            //check if user class uid or any of the parent class uid for the logged in user matches the
                            //user class uid in the rule
                            boolean isMatchClassUid=isMatchClassUid(userClassUids,asuRule);
                            //check if any of the input role matches the role in the rule
                            boolean isMatchRoleName= isMatchRoleName(userRoleNames, asuRule);

                            //if isAnd flag in the rule is true both input class id and role name must match
                            // for the result to be true.
                            if(NullChecker.isNotNullish(asuRule.isAnd())
                                    && asuRule.isAnd().equals("true"))
                            {
                                if(isMatchClassUid && isMatchRoleName)
                                {
                                    logRulePresentSuccess(userClassUids,userRoleNames,asuRule.getUid(),docDefUid,docStatus);
                                    return true;
                                }
                            }
                            //if isAnd flag in the rule is false either input class id or role name must match
                            //for the result to be true.
                            if(NullChecker.isNotNullish(asuRule.isAnd())
                                    && asuRule.isAnd().equals("false"))
                            {
                                if(isMatchClassUid || isMatchRoleName)
                                {
                                    logRulePresentSuccess(userClassUids,userRoleNames,asuRule.getUid(),docDefUid,docStatus);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        logRulePresentFailure(userClassUids,userRoleNames,docDefUid,docStatus);
        return false;
    }

    private void logRulePresentSuccess(ArrayList<String> userClassUids,ArrayList<String> userRoleNames,
                                       String ruleUid,String docDefUid,String docStatus)
    {
        StringBuffer sb=new StringBuffer();
        sb.append("ASU.logRulePresentSuccess: Found match in rule - "
                +ruleUid+ " for document "+docDefUid+" "+docStatus+" \r\n ");
        logRoleNames(userRoleNames,sb);
        sb.append(" \r\n ");
        logUserClassUids(userClassUids,sb);
        log.info(sb.toString());
    }

    private void logRulePresentFailure(ArrayList<String> userClassUids,ArrayList<String> userRoleNames,
                                       String docDefUid,String docStatus)
    {
        StringBuffer sb=new StringBuffer();
        sb.append("ASU.logRulePresentFailure: No rule match found for document " + docDefUid + " " + docStatus + " \r\n ");
        logRoleNames(userRoleNames, sb);
        sb.append(" \r\n ");
        logUserClassUids(userClassUids, sb);
        log.info(sb.toString());
    }

    private void logRoleNames(ArrayList<String> roleNames,StringBuffer sb)
    {
        sb.append(" roleName: ");
        if(NullChecker.isNotNullish(roleNames))
        {
            for(String roleName:roleNames) {
                sb.append(" " + roleName);
            }
        }
    }

    private void logUserClassUids(ArrayList<String> userClassUids,StringBuffer sb)
    {
        sb.append(" userClassUid: ");

        if(NullChecker.isNotNullish(userClassUids))
        {
            for(String userClassUid:userClassUids) {
                sb.append(" " + userClassUid);
            }
        }
     }


    private boolean isMatchClassUid(ArrayList<String> userClassUids,AsuRuleDef asuRule)
    {
        if(NullChecker.isNullish(userClassUids))
            return false;

        for(String classUid:userClassUids)
        {
            if(NullChecker.isNotNullish(classUid)
                    && NullChecker.isNotNullish(asuRule.getUserClassUid())
                    && asuRule.getUserClassUid().equals(classUid))
            {
                 return true;
            }
        }
        return false;
    }

    private boolean isMatchRoleName(ArrayList<String> roleNames, AsuRuleDef asuRule)
    {
        if(NullChecker.isNullish(roleNames))
            return false;

        for(String roleName:roleNames) {
            if (isMatchRoleName(roleName, asuRule.getUserRoleName()))
            {
                return true;
            }
          }

        return false;
     }

    private boolean isMatchRoleName(String roleName1, String roleName2)
    {
        if (NullChecker.isNotNullish(roleName1) &&
                NullChecker.isNotNullish(roleName2) &&
                roleName1.trim().toUpperCase().equals(roleName2.trim().toUpperCase()))
        {
            return true;
        }
        return false;
    }


    private void loadDocumentDefinitionHierarchy() {
        allDocDefsByUid = new HashMap<String, DocumentDefinition>();

        docDefsWithChildren = new ArrayList<DocumentDefinition>();
        List<DocumentDefinition> all = dao.findAll(DocumentDefinition.class);

        for (DocumentDefinition docDef : all) {
            allDocDefsByUid.put(docDef.getUid(), docDef);

            if (docDef.getItems() != null && !docDef.getItems().isEmpty()) {
                docDefsWithChildren.add(docDef);
            }
        }

        for (DocumentDefinition docDef : docDefsWithChildren) {
            for (Map<String, Object> childItem : docDef.getItems()) {
                DocumentDefinition child = allDocDefsByUid.get(childItem.get("uid"));
                child.setData("parentUid", docDef.getUid());
            }
        }
    }

    private ArrayList<String> getParentDocList(String docUid)
    {
        ArrayList<String> parentDocList=new ArrayList<String>();

        String parentDocUid=getParentDoc(docUid);
        if(parentDocUid!=null)
            parentDocList.add(parentDocUid);

        while (parentDocUid!=null)
        {
            parentDocUid=getParentDoc(parentDocUid);
            if(parentDocUid!=null)
                parentDocList.add(parentDocUid);
        }

        return parentDocList;
    }

    private String getParentDoc(String docUid)
    {
        for (DocumentDefinition docDef: docDefsWithChildren)
        {
            if(docDef.getUid().equals(docUid))
            {
                return docDef.getParentUid();
            }
        }
        return null;
    }



}
