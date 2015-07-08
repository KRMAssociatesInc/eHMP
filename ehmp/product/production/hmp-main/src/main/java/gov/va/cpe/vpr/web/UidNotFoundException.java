package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.NotFoundException;

public class UidNotFoundException extends NotFoundException {
    private Class domainClass;
    private String uid;

    public UidNotFoundException(final Class domainClass, final String uid) {
        super(domainClass.getName() + " with uid '" + uid + "' not found".toString());
        this.domainClass = domainClass;
        this.uid = uid;
    }

    public Class getDomainClass() {
        return domainClass;
    }

    public String getUid() {
        return uid;
    }
}
