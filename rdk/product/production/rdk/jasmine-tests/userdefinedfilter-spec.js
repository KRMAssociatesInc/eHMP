/*jslint node: true */
'use strict';

var udaf = require('../resources/userdefinedscreens/userdefinedfilterResource');

describe('User Defined Applet Filters', function() {
    it('tests that getResourceConfig() is setup correctly for applet filters', function() {
        var resources = udaf.getResourceConfig();

        expect(resources.length).toEqual(5);

        expect(resources[0].name).toEqual('');
        expect(resources[0].path).toEqual('');
        expect(resources[0].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();

        expect(resources[1].name).toEqual('');
        expect(resources[1].path).toEqual('');
        expect(resources[1].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeDefined();
        expect(resources[1].post).toBeDefined();

        expect(resources[2].name).toEqual('');
        expect(resources[2].path).toEqual('');
        expect(resources[2].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].parameters).toBeDefined();
        expect(resources[2].delete).toBeDefined();

        expect(resources[3].name).toEqual('');
        expect(resources[3].path).toEqual('');
        expect(resources[3].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[3].healthcheck).toBeDefined();
        expect(resources[3].parameters).toBeDefined();
        expect(resources[3].put).toBeDefined();

        expect(resources[4].name).toEqual('all');
        expect(resources[4].path).toEqual('/all');
        expect(resources[4].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[4].healthcheck).toBeDefined();
        expect(resources[4].parameters).toBeDefined();
        expect(resources[4].delete).toBeDefined();
    });

    it('correctly creates filter ID from session', function() {
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

        expect(filterId).toEqual('0D4S;98712378133_TestWorkspace1_filter');
    });

    it('correctly creates filter when none exists for an applet', function() {
        var filterId = '0D4S;98712378133_TestWorkspace1_filter';
        var instanceId = '987sdf9';
        var filterName = 'urine';
        var data = {};

        var retData = udaf._processDataForCreate(filterId, instanceId, filterName, data);

        expect(retData._id).toEqual(filterId);
        expect(retData.userdefinedfilters).toBeDefined();
        expect(retData.userdefinedfilters.applets.length).toEqual(1);
        expect(retData.userdefinedfilters.applets[0].instanceId).toEqual(instanceId);
        expect(retData.userdefinedfilters.applets[0].filters.length).toEqual(1);
        expect(retData.userdefinedfilters.applets[0].filters[0]).toEqual(filterName);
    });

    it('correctly creates filter when another exists for an applet', function() {
        var filterId = '0D4S;98712378133_TestWorkspace1_filter';
        var instanceId = '987sdf9';
        var filterName = 'blood';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine']
                }]
            }
        };

        var retData = udaf._processDataForCreate(filterId, instanceId, filterName, data);

        expect(retData._id).toEqual(filterId);
        expect(retData.userdefinedfilters).toBeDefined();
        expect(retData.userdefinedfilters.applets.length).toEqual(1);
        expect(retData.userdefinedfilters.applets[0].instanceId).toEqual(instanceId);
        expect(retData.userdefinedfilters.applets[0].filters.length).toEqual(2);
        expect(retData.userdefinedfilters.applets[0].filters[1]).toEqual(filterName);
    });

    it('correctly removes a filter from an applet', function() {
        var appletIndex = 0;
        var filterName = 'urine';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine', 'blood']
                }]
            }
        };

        var retData = udaf._removeDataFilter(filterName, appletIndex, data);

        expect(retData.userdefinedfilters.applets.length).toEqual(1);
        expect(retData.userdefinedfilters.applets[0].filters.length).toEqual(1);
        expect(retData.userdefinedfilters.applets[0].filters[0]).toNotEqual(filterName);
    });

    it('correctly removes an applet when all their filters are removed', function() {
        var appletIndex = 0;
        var filterName = 'urine';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_filter',
            userdefinedfilters: {
                applets: [{
                    instanceId: '987sdf9',
                    filters: ['urine']
                }]
            }
        };

        var retData = udaf._removeDataFilter(filterName, appletIndex, data);

        expect(retData.userdefinedfilters.applets.length).toEqual(0);
    });

});
