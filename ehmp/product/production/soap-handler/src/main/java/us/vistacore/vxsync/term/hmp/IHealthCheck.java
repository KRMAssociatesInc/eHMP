package us.vistacore.vxsync.term.hmp;

public interface IHealthCheck {
    String getHealthCheckName();
	boolean isAlive();
}
