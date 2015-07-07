/*jslint node: true */
'use strict';

/*
var HealthCheckModule = require('../utils/healthcheck/health');
describe('HealthCheck', function() {
    it('tests that a single healthy system returns true', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('subsystem', simplePositiveHealthCheck);
        expect(healthcheck.isHealthy()).toBe(true);
    });

    it('tests that a single unhealthy systems does not return true', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('subsystem', simpleNegativeHealthCheck);
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests health check with multiple healthy checks', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('major-subsystem');
        healthcheck.register([simplePositiveHealthCheck, simplePositiveHealthCheck]);
        expect(healthcheck.isHealthy()).toBe(true);
    });

    it('tests health check with multiple health checks with one negative', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('major-subsystem');
        healthcheck.register([simplePositiveHealthCheck, simpleNegativeHealthCheck]);
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a series of healthy system checks all return true', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));
        expect(healthcheck.isHealthy()).toBe(true);
    });

    it('tests that a series of healthy systems checks with the FIRST one unhealthy returns false', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simpleNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a series of healthy systems checks with the LAST one unhealthy returns false', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simpleNegativeHealthCheck));
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a series of healthy systems checks with the MIDDLE one unhealthy returns false', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simpleNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a series of healthy systems checks multiple unhealthy returns false', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simpleNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simpleNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a single healthy advanced system returns true', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('checkAdvancedSingleHealthy', advancedPositiveHealthCheck);
        expect(healthcheck.isHealthy()).toBe(true);
    });

    it('tests that a single unhealthy advanced system returns false', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('subsystem', advancedNegativeHealthCheck);
        expect(healthcheck.isHealthy()).toBe(false);
    });

    it('tests that a healthy system with healthy subsystems returns true', function() {
        var childHealthCheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simplePositiveHealthCheck));
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));

        var parentHealthCheck = HealthCheckModule.createCompositeHealthCheck('major-subsystem');
        parentHealthCheck.register(childHealthCheck);

        expect(parentHealthCheck.isHealthy()).toBe(true);
    });

    it('tests that a healthy system with multiple healthy and unhealthy subsystems returns false', function() {
        var childHealthCheck = HealthCheckModule.createCompositeHealthCheck('subsystem');
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', simpleNegativeHealthCheck));
        childHealthCheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', simplePositiveHealthCheck));

        var parentHealthCheck = HealthCheckModule.createCompositeHealthCheck('major-subsystem');
        parentHealthCheck.register(childHealthCheck);

        expect(parentHealthCheck.isHealthy()).toBe(false);
    });

    it('check that execute a true criteria is handled by execute', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('system', simplePositiveHealthCheck);
        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(true);
    });

    it('check that execute a false criteria is handled by execute', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('system', simpleNegativeHealthCheck);
        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(false);
    });

    it('check that execute a object criteria is handled by execute', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('system', advancedPositiveHealthCheck);
        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(true);
    });

    it('check that execute a object criteria is handled by execute', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('system', advancedNegativeHealthCheck);
        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(false);
    });

    it('test that a composite result contains hierachy', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('system');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', advancedPositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', advancedPositiveHealthCheck));


        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(true);
        expect(result.subChecks.length).toBe(3);
        expect(result.subChecks[0].name).toBe('subsystem1');
        expect(result.subChecks[0].isHealthy).toBe(true);
        expect(result.subChecks[1].name).toBe('subsystem2');
        expect(result.subChecks[1].isHealthy).toBe(true);
        expect(result.subChecks[2].name).toBe('subsystem3');
        expect(result.subChecks[2].isHealthy).toBe(true);
    });

    it('test that a composite result contains hierachy', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('system');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simplePositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', advancedNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', advancedPositiveHealthCheck));


        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(false);
        expect(result.subChecks.length).toBe(3);
        expect(result.subChecks[0].name).toBe('subsystem1');
        expect(result.subChecks[0].isHealthy).toBe(true);
        expect(result.subChecks[1].name).toBe('subsystem2');
        expect(result.subChecks[1].message).toBe('failed to connect to subsystem');
        expect(result.subChecks[1].isHealthy).toBe(false);
        expect(result.subChecks[2].name).toBe('subsystem3');
        expect(result.subChecks[2].isHealthy).toBe(true);
    });

    it('test that a composite result contains hierachy', function() {
        var healthcheck = HealthCheckModule.createCompositeHealthCheck('system');
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem1', simpleNegativeHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem2', advancedPositiveHealthCheck));
        healthcheck.register(HealthCheckModule.createSimpleHealthCheck('subsystem3', advancedPositiveHealthCheck));


        var result = healthcheck.execute();
        expect(result.name).toBe('system');
        expect(result.isHealthy).toBe(false);
        expect(result.subChecks.length).toBe(3);
        expect(result.subChecks[0].name).toBe('subsystem1');
        expect(result.subChecks[0].isHealthy).toBe(false);
        expect(result.subChecks[1].name).toBe('subsystem2');
        expect(result.subChecks[1].isHealthy).toBe(true);
        expect(result.subChecks[2].name).toBe('subsystem3');
        expect(result.subChecks[2].isHealthy).toBe(true);
    });
});

describe('simpleHealthCheck', function() {
    it('undefined result results in undefined result', function() {
        var healthcheck = HealthCheckModule.createSimpleHealthCheck('subsystem', simpleUndefinedHealthCheck);
        expect(healthcheck.isHealthy()).toBe(undefined);
    });
});

function simplePositiveHealthCheck() {
    return true;
}

function simpleNegativeHealthCheck() {
    return false;
}

function simpleUndefinedHealthCheck() {
    return undefined;
}

function advancedPositiveHealthCheck() {
    return {
        isHealthy: true
    };
}

function advancedNegativeHealthCheck() {
    return {
        isHealthy: false,
        message: 'failed to connect to subsystem',
        error: new Error()
    };
}
*/
