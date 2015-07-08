'use strict';

var metricsResource = require('../resources/metrics/metricsResource');

describe('Metrics Resource', function() {
    it('tests that getResourceConfig() is setup correctly for getMetricSearch', function() {
        var resources = metricsResource.getResourceConfig();
        expect(resources.length).toBe(17);

        expect(resources[0].name).toEqual('metricSearch');
        expect(resources[0].path).toEqual('/metrics');
        expect(resources[0].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for origins', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[1].name).toEqual('getOrigins');
        expect(resources[1].path).toEqual('/origins');
        expect(resources[1].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeUndefined();
        expect(resources[1].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for dashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[2].name).toEqual('getDashboard');
        expect(resources[2].path).toEqual('/dashboard/:dashboardId');
        expect(resources[2].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for user dashboards', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[3].name).toEqual('getUserDashboards');
        expect(resources[3].path).toEqual('/dashboards');
        expect(resources[3].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[3].healthcheck).toBeDefined();
        expect(resources[3].parameters).toBeDefined();
        expect(resources[3].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for metricDefinitions', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[4].name).toEqual('metricDefinitions');
        expect(resources[4].path).toEqual('/definitions');
        expect(resources[4].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[4].healthcheck).toBeDefined();
        expect(resources[4].parameters).toBeUndefined();
        expect(resources[4].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for createMetricDefinitions', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[5].name).toEqual('createMetricDefinitions');
        expect(resources[5].path).toEqual('/definitions');
        expect(resources[5].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[5].healthcheck).toBeDefined();
        expect(resources[5].parameters).toBeUndefined();
        expect(resources[5].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for metricGroups', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[6].name).toEqual('metricGroups');
        expect(resources[6].path).toEqual('/groups');
        expect(resources[6].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[6].healthcheck).toBeDefined();
        expect(resources[6].parameters).toBeUndefined();
        expect(resources[6].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for createMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[7].name).toEqual('createMetricGroup');
        expect(resources[7].path).toEqual('/group');
        expect(resources[7].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[7].healthcheck).toBeDefined();
        expect(resources[7].parameters).toBeUndefined();
        expect(resources[7].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[8].name).toEqual('updateMetricGroup');
        expect(resources[8].path).toEqual('/group');
        expect(resources[8].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[8].healthcheck).toBeDefined();
        expect(resources[8].parameters).toBeUndefined();
        expect(resources[8].put).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[9].name).toEqual('deleteMetricGroup');
        expect(resources[9].path).toEqual('/group/:metricGroupId');
        expect(resources[9].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[9].healthcheck).toBeDefined();
        expect(resources[9].parameters).toBeUndefined();
        expect(resources[9].delete).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for roles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[10].name).toEqual('roles');
        expect(resources[10].path).toEqual('/roles');
        expect(resources[10].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[10].healthcheck).toBeDefined();
        expect(resources[10].parameters).toBeUndefined();
        expect(resources[10].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for uodateRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[11].name).toEqual('updateRoles');
        expect(resources[11].path).toEqual('/roles');
        expect(resources[11].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[11].healthcheck).toBeDefined();
        expect(resources[11].parameters).toBeUndefined();
        expect(resources[11].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for userRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[12].name).toEqual('userRoles');
        expect(resources[12].path).toEqual('/userRoles');
        expect(resources[12].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[12].healthcheck).toBeDefined();
        expect(resources[12].parameters).toBeUndefined();
        expect(resources[12].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateUserRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[13].name).toEqual('userRoles');
        expect(resources[13].path).toEqual('/userRoles');
        expect(resources[13].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[13].healthcheck).toBeDefined();
        expect(resources[13].parameters).toBeUndefined();
        expect(resources[13].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for createDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[14].name).toEqual('createDashboard');
        expect(resources[14].path).toEqual('/dashboard');
        expect(resources[14].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[14].healthcheck).toBeDefined();
        expect(resources[14].parameters).toBeUndefined();
        expect(resources[14].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[15].name).toEqual('deleteDashboard');
        expect(resources[15].path).toEqual('/dashboard/:dashboardId');
        expect(resources[15].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[15].healthcheck).toBeDefined();
        expect(resources[15].parameters).toBeUndefined();
        expect(resources[15].delete).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[16].name).toEqual('updateDashboard');
        expect(resources[16].path).toEqual('/dashboard/:dashboardId');
        expect(resources[16].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[16].healthcheck).toBeDefined();
        expect(resources[16].parameters).toBeUndefined();
        expect(resources[16].put).toBeDefined();
    });


});
