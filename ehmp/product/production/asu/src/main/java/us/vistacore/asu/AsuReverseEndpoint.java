package us.vistacore.asu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import us.vistacore.asu.rules.ASU;
import us.vistacore.asu.rules.AccessDocument;
import us.vistacore.asu.util.NullChecker;

import javax.validation.constraints.Null;
import java.util.ArrayList;

@RestController
@RequestMapping(value = "${uri.rules}")

public class AsuReverseEndpoint {

    private static final Logger log = LoggerFactory.getLogger(AsuReverseEndpoint.class);

    @Autowired
    private ASU asu;

    @RequestMapping(value = "${uri.refresh}", method = RequestMethod.GET)
    public String refresh()
    {
        try
        {
            asu.refresh();
            return "ASU rules succesfully refreshed";
        }
        catch(Exception e)
        {
            log.error("AsuReverseEndpoint.refresh - Unable to refresh ASU rules "+e);
            return "ASU rules refresh failed";
        }
     }

    /*
    This end point checks if a logged in user in GUI can access the document or not

    @return value - true - User can access the document
                    false - user cannot access the document.
     */

    @RequestMapping(value = "${uri.accessDocument}",
            consumes = "application/json",method = RequestMethod.POST
            )
    public boolean accessDocument(@RequestBody AccessDocument accessDocument) throws Exception {

       validateRuleEvaluationParameters(accessDocument.getUserClassUids(),accessDocument.getDocDefUid()
                , accessDocument.getDocStatus());

        logAccessDocument(accessDocument);

        return asu.isRulePresent(accessDocument.getUserClassUids(), accessDocument.getRoleNames(),
                accessDocument.getDocDefUid(),accessDocument.getDocStatus());
    }

    private void logAccessDocument(AccessDocument accessDocument)
    {
        StringBuffer sb=new StringBuffer();
        sb.append("AsuReverseEndpoint.logAccessDocument: docdefUid " + accessDocument.getDocDefUid() + " :docStatus " + accessDocument.getDocStatus() + " \r\n ");
        ArrayList<String> roleNames=accessDocument.getRoleNames();
        ArrayList<String> userClassUids=accessDocument.getUserClassUids();
        sb.append(" ROLENAMES: ");
        if(NullChecker.isNotNullish(roleNames))
        {
            for(String roleName:roleNames) {
                sb.append(roleName+" ");
            }
        }
        sb.append(" \r\n USER CLASS UID: ");

        if(NullChecker.isNotNullish(userClassUids))
        {
            for(String userClassUid:userClassUids) {
                sb.append(userClassUid+" ");
            }
        }
        log.info(sb.toString());
    }


    private void validateRuleEvaluationParameters(ArrayList<String> userClassUids,String docDefUid,String docStatus)
            throws Exception {
        if(NullChecker.isNullish(userClassUids))
            throw new Exception("ASUEndPoint.validateRuleEvaluationParameters: ASU rules evaluation - classUid cannot be empty.");

        if(userClassUids.get(0).length()==0)
            throw new Exception("ASUEndPoint.validateRuleEvaluationParameters: ASU rules evaluation - classUid cannot be empty.");

        if(NullChecker.isNullish(docDefUid))
            throw new Exception("ASUEndPoint.validateRuleEvaluationParameters: ASU rules evaluation - docDefUid cannot be empty.");

        if(NullChecker.isNullish(docStatus))
            throw new Exception("ASUEndPoint.validateRuleEvaluationParameters: ASU rules evaluation - docStatus cannot be empty.");
    }
}
