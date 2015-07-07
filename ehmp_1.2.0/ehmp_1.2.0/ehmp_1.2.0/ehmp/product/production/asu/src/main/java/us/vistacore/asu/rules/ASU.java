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


    public boolean isRulePresent(ArrayList<String> userClassUids,ArrayList<String> userRoleUids,String docDefUid,String docStatus)
    {
        if(NullChecker.isNullish(asuRules))
            refresh();

        ArrayList<String> parentDocDefUids=getParentDocList(docDefUid);
        parentDocDefUids.add(docDefUid);

        for(int i=0;i<asuRules.size();i++)
        {
            AsuRuleDef asuRule=(AsuRuleDef)asuRules.get(i);

            if(asuRule!=null && asuRule.getActionName()!=null && asuRule.getActionName().equals("VIEW"))
            {
                if(asuRule.getStatusName()!=null && asuRule.getStatusName().equalsIgnoreCase(docStatus))
                {
                    for(String currDocDefUid:parentDocDefUids)
                    {
                        if(asuRule.getDocDefUid().equals(currDocDefUid))
                        {
                            boolean isMatchClassUids=isMatchClassUid(userClassUids,asuRule);
                            boolean isMatchRoleUids=isMatchRoleUid(userRoleUids,asuRule);

                            if(asuRule.isAnd())
                            {
                                if(isMatchClassUids && isMatchRoleUids)
                                {
                                    log.info("ASU.isRulePresent: Found match in rule - "
                                            +asuRule.getUid()+ " for document "+docDefUid+" "+docStatus);
                                    return true;
                                }
                            }
                            else
                            {
                                if(isMatchClassUids || isMatchRoleUids)
                                {
                                    log.info("ASU.isRulePresent: Found match in rule - "
                                            +asuRule.getUid()+ " for document "+docDefUid+" "+docStatus);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        log.info("ASU.isRulePresent: No match found for document " + docDefUid + " " + docStatus);
        return false;
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

    private boolean isMatchRoleUid(ArrayList<String> roleUids,AsuRuleDef asuRule)
    {
        if(NullChecker.isNullish(roleUids))
            return false;

        for(String roleUid:roleUids) {
            if (NullChecker.isNotNullish(roleUid) &&
                    NullChecker.isNotNullish(asuRule.getUserRoleUid()) &&
                    asuRule.getUserRoleUid().equals(roleUid)) {
                return true;
            }
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
