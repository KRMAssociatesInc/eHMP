package gov.va.hmp.access.asu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RefreshAsuPolicies implements Runnable {

    private AsuPolicyDecisionPoint pdp;

    @Autowired(required=false)
    public void setPolicyDecisionPoint(AsuPolicyDecisionPoint pdp) {
        this.pdp = pdp;
    }

    @Override
    public void run() {
    	if (this.pdp != null) this.pdp.refresh();
    }
}
