'use strict';

var udaf = require('./user-defined-filter-resource');

describe('User Defined Applet Filters', function() {
    it('tests that getResourceConfig() is setup correctly for applet filters', function() {
        var resources = udaf.getResourceConfig();

        expect(resources.length).to.equal(5);

        expect(resources[0].name).to.equal('');
        expect(resources[0].path).to.equal('');
        expect(resources[0].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();

        expect(resources[1].name).to.equal('');
        expect(resources[1].path).to.equal('');
        expect(resources[1].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].parameters).not.to.be.undefined();
        expect(resources[1].post).not.to.be.undefined();

        expect(resources[2].name).to.equal('');
        expect(resources[2].path).to.equal('');
        expect(resources[2].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].parameters).not.to.be.undefined();
        expect(resources[2].delete).not.to.be.undefined();

        expect(resources[3].name).to.equal('');
        expect(resources[3].path).to.equal('');
        expect(resources[3].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[3].healthcheck).not.to.be.undefined();
        expect(resources[3].parameters).not.to.be.undefined();
        expect(resources[3].put).not.to.be.undefined();

        expect(resources[4].name).to.equal('all');
        expect(resources[4].path).to.equal('/all');
        expect(resources[4].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[4].healthcheck).not.to.be.undefined();
        expect(resources[4].parameters).not.to.be.undefined();
        expect(resources[4].delete).not.to.be.undefined();
    });

    /*it('correctly creates filter ID from session', function() {
        var req = {
            session: {
                user: {
                    site: '0D4S',
                    duz: {
                        '0D4S': '98712378133'
                    }
                }
            },
            param: function(id) {
                if (id === 'id') {
                    return 'TestWorkspace1';
                }
                return null;
            }
        };

        var filterId = udaf.createFilterId(req);

        expect(filterId).to.equal('0D4S;98712378133_TestWorkspace1_filter');
    });

    it('correctly creates filter when none exists for an applet', function() {
        var filterId = '0D4S;98712378133_TestWorkspace1_filter';
        var instanceId = '987sdf9';
        var filterName = 'urine';
        var data = {};

        var retData = udaf._processDataForCreate(filterId, instanceId, filterName, data);

        expect(retData.id).to.equal(filterId);
        expect(retData.userdefinedfilters).not.to.be.undefined();
        expect(retData.userdefinedfilters.applets.length).to.equal(1);
        expect(retData.userdefinedfilters.applets[0].instanceId).to.equal(instanceId);
        expect(retData.userdefinedfilters.applets[0].filters.length).to.equal(1);
        expect(retData.userdefinedfilters.applets[0].filters[0]).to.equal(filterName);
    });

    it('correctly creates filter when another exists for an applet', function() {
        var filterId = '0D4S;98712378133_TestWorkspace1_filter';
        var instanceId = '987sdf9';
        var filterName = 'blood';
        var data = {
            id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine']
                }]
            }
        };

        var retData = udaf._processDataForCreate(filterId, instanceId, filterName, data);

        expect(retData.id).to.equal(filterId);
        expect(retData.userdefinedfilters).not.to.be.undefined();
        expect(retData.userdefinedfilters.applets.length).to.equal(1);
        expect(retData.userdefinedfilters.applets[0].instanceId).to.equal(instanceId);
        expect(retData.userdefinedfilters.applets[0].filters.length).to.equal(2);
        expect(retData.userdefinedfilters.applets[0].filters[1]).to.equal(filterName);
    });

    it('correctly removes a filter from an applet', function() {
        var appletIndex = 0;
        var filterName = 'urine';
        var data = {
            id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine', 'blood']
                }]
            }
        };

        var retData = udaf._removeDataFilter(filterName, appletIndex, data);

        expect(retData.userdefinedfilters.applets.length).to.equal(1);
        expect(retData.userdefinedfilters.applets[0].filters.length).to.equal(1);
        expect(retData.userdefinedfilters.applets[0].filters[0]).not.to.equal(filterName);
    });

    it('correctly removes an applet when all their filters are removed', function() {
        var appletIndex = 0;
        var filterName = 'urine';
        var data = {
            id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine']
                }]
            }
        };

        var retData = udaf._removeDataFilter(filterName, appletIndex, data);

        expect(retData.userdefinedfilters.applets.length).to.equal(0);
    });*/

});
