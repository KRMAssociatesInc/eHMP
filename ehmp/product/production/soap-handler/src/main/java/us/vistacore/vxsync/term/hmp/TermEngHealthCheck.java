package us.vistacore.vxsync.term.hmp;

import org.springframework.beans.factory.annotation.Autowired;
import com.codahale.metrics.health.HealthCheck;

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
