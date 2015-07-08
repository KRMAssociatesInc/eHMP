package gov.va.cpe.vpr.web;

public interface IHealthCheck {
    String getHealthCheckName();
	boolean isAlive();
}
