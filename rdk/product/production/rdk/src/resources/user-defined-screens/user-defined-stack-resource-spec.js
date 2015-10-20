'use strict';

var sg = require('./user-defined-stack-resource');

describe('User Defined Stacked Graph', function() {
    it('tests that getResourceConfig() is setup correctly for stacked graphs', function() {
        var resources = sg.getResourceConfig();

        expect(resources.length).to.equal(5);

        expect(resources[0].name).to.equal('');
        expect(resources[0].path).to.equal('');
        expect(resources[0].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].apiDocs).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();

        expect(resources[1].name).to.equal('');
        expect(resources[1].path).to.equal('');
        expect(resources[1].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].apiDocs).not.to.be.undefined();
        expect(resources[1].post).not.to.be.undefined();

        expect(resources[2].name).to.equal('');
        expect(resources[2].path).to.equal('');
        expect(resources[2].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].apiDocs).not.to.be.undefined();
        expect(resources[2]['delete']).not.to.be.undefined();

        expect(resources[3].name).to.equal('all');
        expect(resources[3].path).to.equal('/all');
        expect(resources[3].interceptors).to.eql({
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        });
        expect(resources[3].healthcheck).not.to.be.undefined();
        expect(resources[3].delete).not.to.be.undefined();
        expect(resources[3].apiDocs).not.to.be.undefined();
    });

    /*it('correctly creates stacked graph ID from session', function() {
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

        expect(graphId).to.equal('0D4S;98712378133_TestWorkspace1_stacked');
    });

    it('correctly creates stacked graph when none exists for an applet', function() {
        var graphId = '0D4S;98712378133_TestWorkspace1_stacked';
        var instanceId = 'instance-1';
        var graphType = 'vitals';
        var typeName = 'bloodpressure';
        var data = {};

        var retData = sg._processDataForCreate(graphId, instanceId, graphType, typeName, data);

        expect(retData.id).to.equal(graphId);
        expect(retData.userdefinedgraphs).not.to.be.undefined();
        expect(retData.userdefinedgraphs.applets.length).to.equal(1);
        expect(retData.userdefinedgraphs.applets[0].instanceId).to.equal(instanceId);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).to.equal(1);
        expect(retData.userdefinedgraphs.applets[0].graphs[0]).to.eql({
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
            id: '0D4S;98712378133_TestWorkspace1_stacked',
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

        expect(retData.id).to.equal(graphId);
        expect(retData.userdefinedgraphs).not.to.be.undefined();
        expect(retData.userdefinedgraphs.applets.length).to.equal(1);
        expect(retData.userdefinedgraphs.applets[0].instanceId).to.equal(instanceId);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).to.equal(2);
        expect(retData.userdefinedgraphs.applets[0].graphs[1]).to.eql({
            graphType: graphType,
            typeName: typeName
        });
    });

    it('correctly removes a stacked graph from an applet', function() {
        var appletIndex = 0;
        var graphType = 'medications';
        var typeName = 'metformin';
        var data = {
            id: '0D4S;98712378133_TestWorkspace1_stacked',
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

        expect(retData.userdefinedgraphs.applets.length).to.equal(1);
        expect(retData.userdefinedgraphs.applets[0].graphs.length).to.equal(1);
        expect(retData.userdefinedgraphs.applets[0].graphs[0]).not.to.eql({
            graphType: graphType,
            typeName: typeName
        });
    });

    it('correctly removes an applet when all their stacked graphs are removed', function() {
        var appletIndex = 0;
        var graphType = 'medications';
        var typeName = 'metformin';
        var data = {
            id: '0D4S;98712378133_TestWorkspace1_stacked',
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

        expect(retData.userdefinedgraphs.applets.length).to.equal(0);
    });*/

});
