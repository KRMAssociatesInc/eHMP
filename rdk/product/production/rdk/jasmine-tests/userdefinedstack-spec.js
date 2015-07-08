/*jslint node: true */
'use strict';

var sg = require('../resources/userdefinedscreens/userdefinedstackResource');

describe('User Defined Stacked Graph', function() {
    it('tests that getResourceConfig() is setup correctly for stacked graphs', function() {
        var resources = sg.getResourceConfig();

        expect(resources.length).toEqual(4);

        expect(resources[0].name).toEqual('');
        expect(resources[0].path).toEqual('');
        expect(resources[0].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].apiDocs).toBeDefined();
        expect(resources[0].get).toBeDefined();

        expect(resources[1].name).toEqual('');
        expect(resources[1].path).toEqual('');
        expect(resources[1].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].apiDocs).toBeDefined();
        expect(resources[1].post).toBeDefined();

        expect(resources[2].name).toEqual('');
        expect(resources[2].path).toEqual('');
        expect(resources[2].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].apiDocs).toBeDefined();
        expect(resources[2]['delete']).toBeDefined();

        expect(resources[3].name).toEqual('all');
        expect(resources[3].path).toEqual('/all');
        expect(resources[3].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[3].healthcheck).toBeDefined();
        expect(resources[3].delete).toBeDefined();
        expect(resources[3].apiDocs).toBeDefined();
    });

    it('correctly creates stacked graph ID from session', function() {
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

        var graphId = sg._generateStackedId(req);

        expect(graphId).toEqual('0D4S;98712378133_TestWorkspace1_stacked');
    });

    it('correctly creates stacked graph when none exists for an applet', function() {
        var graphId = '0D4S;98712378133_TestWorkspace1_stacked';
        var instanceId = 'instance-1';
        var graphType = 'vitals';
        var typeName = 'bloodpressure';
        var data = {};

        var retData = sg._processDataForCreate(graphId, instanceId, graphType, typeName, data);

        expect(retData._id).toEqual(graphId);
        expect(retData.userdefinedgraphs).toBeDefined();
        expect(retData.userdefinedgraphs.applets.length).toEqual(1);
        expect(retData.userdefinedgraphs.applets[0].instanceId).toEqual(instanceId);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).toEqual(1);
        expect(retData.userdefinedgraphs.applets[0].graphs[0]).toEqual({
            graphType: graphType,
            typeName: typeName
        });
    });

    it('correctly creates stacked graph when another exists for an applet', function() {
        var graphId = '0D4S;98712378133_TestWorkspace1_stacked';
        var instanceId = '987sdf9';
        var graphType = 'medications';
        var typeName = 'metformin';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_stacked',
            userdefinedgraphs: {
                applets: [{
                    instanceId: '987sdf9',
                    graphs: [{
                        graphType: 'medications',
                        typeName: 'beta blockers'
                    }]
                }]
            }
        };

        var retData = sg._processDataForCreate(graphId, instanceId, graphType, typeName, data);

        expect(retData._id).toEqual(graphId);
        expect(retData.userdefinedgraphs).toBeDefined();
        expect(retData.userdefinedgraphs.applets.length).toEqual(1);
        expect(retData.userdefinedgraphs.applets[0].instanceId).toEqual(instanceId);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).toEqual(2);
        expect(retData.userdefinedgraphs.applets[0].graphs[1]).toEqual({
            graphType: graphType,
            typeName: typeName
        });
    });

    it('correctly removes a stacked graph from an applet', function() {
        var appletIndex = 0;
        var graphType = 'medications';
        var typeName = 'metformin';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_stacked',
            userdefinedgraphs: {
                applets: [{
                    instanceId: '987sdf9',
                    graphs: [{
                        graphType: 'medications',
                        typeName: 'beta blockers'
                    }, {
                        graphType: 'medications',
                        typeName: 'metformin'
                    }]
                }]
            }
        };

        var retData = sg._removeStackedGraphData(graphType, typeName, appletIndex, data);

        expect(retData.userdefinedgraphs.applets.length).toEqual(1);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).toEqual(1);
        expect(retData.userdefinedgraphs.applets[0].graphs[0]).toNotEqual({
            graphType: graphType,
            typeName: typeName
        });
    });

    it('correctly removes an applet when all their stacked graphs are removed', function() {
        var appletIndex = 0;
        var graphType = 'medications';
        var typeName = 'metformin';
        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_stacked',
            userdefinedgraphs: {
                applets: [{
                    instanceId: '987sdf9',
                    graphs: [{
                        graphType: 'medications',
                        typeName: 'metformin'
                    }]
                }]
            }
        };

        var retData = sg._removeStackedGraphData(graphType, typeName, appletIndex, data);

        expect(retData.userdefinedgraphs.applets.length).toEqual(0);
    });

});
