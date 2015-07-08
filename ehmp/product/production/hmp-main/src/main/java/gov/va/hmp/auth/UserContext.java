package gov.va.hmp.auth;

import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;

public interface UserContext extends HealthTimePrinterSetHolder {
    boolean isLoggedIn();
    HmpUserDetails getCurrentUser();
}
