'use strict';

var metricsResource = require('./metrics-resource');

describe('Metrics Resource', function() {
    it('tests that getResourceConfig() is setup correctly for getMetricSearch', function() {
        var resources = metricsResource.getResourceConfig();
        expect(resources.length).to.equal(18);

        expect(resources[0].name).to.equal('metricSearch');
        expect(resources[0].path).to.equal('/metrics');
        expect(resources[0].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for config', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[1].name).to.equal('getConfig');
        expect(resources[1].path).to.equal('/config');
        expect(resources[1].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].parameters).to.be.undefined();
        expect(resources[1].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for dashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[2].name).to.equal('getDashboard');
        expect(resources[2].path).to.equal('/dashboard/:dashboardId');
        expect(resources[2].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for user dashboards', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[3].name).to.equal('getUserDashboards');
        expect(resources[3].path).to.equal('/dashboards/:userIdParam');
        expect(resources[3].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[3].healthcheck).not.to.be.undefined();
        expect(resources[3].parameters).not.to.be.undefined();
        expect(resources[3].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for metricDefinitions', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[4].name).to.equal('metricDefinitions');
        expect(resources[4].path).to.equal('/definitions');
        expect(resources[4].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[4].healthcheck).not.to.be.undefined();
        expect(resources[4].parameters).to.be.undefined();
        expect(resources[4].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for createMetricDefinitions', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[5].name).to.equal('createMetricDefinitions');
        expect(resources[5].path).to.equal('/definitions');
        expect(resources[5].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[5].healthcheck).not.to.be.undefined();
        expect(resources[5].parameters).to.be.undefined();
        expect(resources[5].post).not.to.be.undefined();
    });
    it('tests that getResourceConfig() is setup correctly for deleteMetricDefinition', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[6].name).to.equal('deleteMetricDefinition');
        expect(resources[6].path).to.equal('/definitions/:definitionId');
        expect(resources[6].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[6].healthcheck).not.to.be.undefined();
        expect(resources[6].parameters).to.be.undefined();
        expect(resources[6].delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for metricGroups', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[7].name).to.equal('metricGroups');
        expect(resources[7].path).to.equal('/groups');
        expect(resources[7].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[7].healthcheck).not.to.be.undefined();
        expect(resources[7].parameters).to.be.undefined();
        expect(resources[7].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for createMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[8].name).to.equal('createMetricGroup');
        expect(resources[8].path).to.equal('/groups');
        expect(resources[8].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[8].healthcheck).not.to.be.undefined();
        expect(resources[8].parameters).to.be.undefined();
        expect(resources[8].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[9].name).to.equal('updateMetricGroup');
        expect(resources[9].path).to.equal('/groups');
        expect(resources[9].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[9].healthcheck).not.to.be.undefined();
        expect(resources[9].parameters).to.be.undefined();
        expect(resources[9].put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteMetricGroup', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[10].name).to.equal('deleteMetricGroup');
        expect(resources[10].path).to.equal('/groups/:metricGroupId');
        expect(resources[10].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[10].healthcheck).not.to.be.undefined();
        expect(resources[10].parameters).to.be.undefined();
        expect(resources[10].delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for roles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[11].name).to.equal('roles');
        expect(resources[11].path).to.equal('/roles');
        expect(resources[11].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[11].healthcheck).not.to.be.undefined();
        expect(resources[11].parameters).to.be.undefined();
        expect(resources[11].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[12].name).to.equal('updateRoles');
        expect(resources[12].path).to.equal('/roles');
        expect(resources[12].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[12].healthcheck).not.to.be.undefined();
        expect(resources[12].parameters).to.be.undefined();
        expect(resources[12].put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for userRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[13].name).to.equal('userRoles');
        expect(resources[13].path).to.equal('/userRoles');
        expect(resources[13].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[13].healthcheck).not.to.be.undefined();
        expect(resources[13].parameters).to.be.undefined();
        expect(resources[13].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateUserRoles', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[14].name).to.equal('userRoles');
        expect(resources[14].path).to.equal('/userRoles');
        expect(resources[14].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[14].healthcheck).not.to.be.undefined();
        expect(resources[14].parameters).to.be.undefined();
        expect(resources[14].put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for createDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[15].name).to.equal('createDashboard');
        expect(resources[15].path).to.equal('/dashboard');
        expect(resources[15].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[15].healthcheck).not.to.be.undefined();
        expect(resources[15].parameters).to.be.undefined();
        expect(resources[15].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[16].name).to.equal('deleteDashboard');
        expect(resources[16].path).to.equal('/dashboard/:dashboardId');
        expect(resources[16].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[16].healthcheck).not.to.be.undefined();
        expect(resources[16].parameters).to.be.undefined();
        expect(resources[16].delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for updateDashboard', function() {
        var resources = metricsResource.getResourceConfig();

        expect(resources[17].name).to.equal('updateDashboard');
        expect(resources[17].path).to.equal('/dashboard/:dashboardId');
        expect(resources[17].interceptors).to.eql({
            audit: true,
            authentication: true,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[17].healthcheck).not.to.be.undefined();
        expect(resources[17].parameters).to.be.undefined();
        expect(resources[17].put).not.to.be.undefined();
    });


});
