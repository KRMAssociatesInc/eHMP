package gov.va.cpe.vpr.termeng;

import com.codahale.metrics.health.HealthCheck;
import gov.va.cpe.vpr.web.IHealthCheck;
import org.springframework.beans.factory.annotation.Autowired;

public class TermEngHealthCheck extends HealthCheck {

    private TermEng termEng;

    @Autowired
    public void setTermEng(TermEng termEng) {
        this.termEng = termEng;
    }

    @Override
    protected Result check() throws Exception {
        for (ITermDataSource termDataSource : termEng.getDataSources()) {
            if (termDataSource instanceof IHealthCheck) {
                IHealthCheck healthCheck = (IHealthCheck) termDataSource;
                if (!healthCheck.isAlive()) {
                     return Result.unhealthy("Unable to connect to " + healthCheck.getHealthCheckName());
                 }
            }
        }
        return Result.healthy();
    }
}
