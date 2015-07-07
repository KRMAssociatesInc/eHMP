package us.vistacore.asu.rules;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kumblep on 4/23/15.
 */
public class AccessDocument
{
    //This contains one or more current class uid and parent class uids of the current class
    ArrayList userClassUids;
    ArrayList roleUid;
    String docDefUid;
    String docStatus;

    public ArrayList getRoleUid() {
        return roleUid;
    }

    public void setRoleUid(ArrayList roleUid) {
        this.roleUid = roleUid;
    }

    public String getDocDefUid() {
        return docDefUid;
    }

    public void setDocDefUid(String docDefUid) {
        this.docDefUid = docDefUid;
    }

    public String getDocStatus() {
        return docStatus;
    }

    public void setDocStatus(String docStatus) {
        this.docStatus = docStatus;
    }


    public ArrayList getUserClassUids() {
        return userClassUids;
    }

    public void setUserClassUids(ArrayList userClassUids) {
        this.userClassUids = userClassUids;
    }

}
