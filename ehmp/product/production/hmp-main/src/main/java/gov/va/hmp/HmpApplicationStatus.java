package gov.va.hmp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.atomic.AtomicReference;

public class HmpApplicationStatus {

    private static Logger LOGGER = LoggerFactory.getLogger(HmpApplicationStatus.class);

    private AtomicReference<StartupPhase> startupPhase = new AtomicReference<>(StartupPhase.PRECONFIGURED);

    public StartupPhase getStartupPhase() {
        return startupPhase.get();
    }

    public void setStartupPhase(StartupPhase phase) {
        this.startupPhase.set(phase);
        LOGGER.info("HMP " + phase);
    }
}
