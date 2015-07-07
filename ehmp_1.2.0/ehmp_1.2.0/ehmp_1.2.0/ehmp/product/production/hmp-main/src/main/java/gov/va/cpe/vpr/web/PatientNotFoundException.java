package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.NotFoundException;

public class PatientNotFoundException extends NotFoundException {

    private String pid;

    public PatientNotFoundException(String pid) {
        super("patient '" + pid + "' not found");
        this.pid = pid;
    }

    public String getPid() {
        return pid;
    }
}
