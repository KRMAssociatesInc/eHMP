package us.vistacore.asu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import us.vistacore.asu.rules.ASU;
import us.vistacore.asu.rules.AccessDocument;
import us.vistacore.asu.util.NullChecker;
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


    @RequestMapping(value = "${uri.accessDocument}",
            consumes = "application/json",method = RequestMethod.POST
            )
    public boolean accessDocument(@RequestBody AccessDocument accessDocument) throws Exception {

       validateRuleEvaluationParameters(accessDocument.getUserClassUids(),accessDocument.getDocDefUid()
                , accessDocument.getDocStatus());

        return asu.isRulePresent(accessDocument.getUserClassUids(), accessDocument.getRoleUid(),
                accessDocument.getDocDefUid(),accessDocument.getDocStatus());
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
