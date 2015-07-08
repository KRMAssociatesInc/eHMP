/*jslint node: true */
'use strict';

var rdk = require('../rdk/rdk');

xdescribe('Single System HealthCheck', function() {
    it('tests that a single healthy system returns true', function() {
        var healthcheck = rdk.healthcheck.createSimpleHealthCheck('subsystem', simplePositiveHealthCheck);
        expect(healthcheck.isHealthy()).toBe(true);
    });

    it('tests that a single unhealthy systems does not return true', function() {
        var healthcheck = rdk.healthcheck.createSimpleHealthCheck('subsystem', simpleNegativeHealthCheck);
        expect(healthcheck.isHealthy()).toBe(false);
    });
});

function simplePositiveHealthCheck() {
    return true;
}

function simpleNegativeHealthCheck() {
    return false;
}
