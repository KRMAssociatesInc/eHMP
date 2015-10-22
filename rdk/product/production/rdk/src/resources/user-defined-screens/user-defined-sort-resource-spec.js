'use strict';

var udas = require('./user-defined-sort-resource');

describe('User Defined Applet Tile Sort', function() {
    it('tests that getResourceConfig() is setup correctly for applet tile sort', function() {
        var resources = udas.getResourceConfig();

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
    });

    it('correctly creates tile sort ID from session', function() {
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

        var sortId = udas.createSortId(req);

        expect(sortId).to.equal('0D4S;98712378133_TestWorkspace1_sort');
    });

    it('correctly creates tile sort data when none exists for an applet', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        //'orderAfter':'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };
        var data = {};

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData.id).to.equal(sortId);
        expect(retData.applets).not.to.be.undefined();
        expect(retData.applets.length).to.equal(1);
        expect(retData.applets[0].instanceId).to.equal(input.instanceId);
        expect(retData.applets[0].keyField).to.equal(input.keyField);
        expect(retData.applets[0].orderSequence).not.to.be.undefined();
        expect(retData.applets[0].orderSequence.length).to.equal(1);
        expect(retData.applets[0].orderSequence[0]).to.equal(input.fieldValue);
    });

    it('correctly creates tile sort data when none exists for an applet(orderAfter item is given in input)', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        orderAfter:'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };
        var data = {};

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData.id).to.equal(sortId);
        expect(retData.applets).not.to.be.undefined();
        expect(retData.applets.length).to.equal(1);
        expect(retData.applets[0].instanceId).to.equal(input.instanceId);
        expect(retData.applets[0].keyField).to.equal(input.keyField);
        expect(retData.applets[0].orderSequence).not.to.be.undefined();
        expect(retData.applets[0].orderSequence.length).to.equal(1);
        expect(retData.applets[0].orderSequence[0]).to.equal(input.fieldValue);
    });

    it('correctly creates tile sort data when sorting already exists for an applet', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        fieldValue:'CHOCOLATE'
                    };

        var data = {
            id: '0D4S;98712378133_TestWorkspace1_sort',
            applets: [{
                instanceId: 'dd479613eb0a',
                keyField:'summary',
                orderSequence: ['PENICILLIN']
            }]
        };

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData.id).to.equal(sortId);
        expect(retData.applets).not.to.be.undefined();
        expect(retData.applets.length).to.equal(1);
        expect(retData.applets[0].instanceId).to.equal(input.instanceId);
        expect(retData.applets[0].keyField).to.equal(input.keyField);
        expect(retData.applets[0].orderSequence).not.to.be.undefined();
        expect(retData.applets[0].orderSequence.length).to.equal(2);
        expect(retData.applets[0].orderSequence[0]).to.equal(input.fieldValue);
    });

    it('correctly creates tile sort data when sorting already exists for an applet(orderAfter item is given in input)', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        orderAfter:'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };

        var data = {
            id: '0D4S;98712378133_TestWorkspace1_sort',
            applets: [{
                instanceId: 'dd479613eb0a',
                keyField:'summary',
                orderSequence: ['PENICILLIN']
            }]
        };

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData.id).to.equal(sortId);
        expect(retData.applets).not.to.be.undefined();
        expect(retData.applets.length).to.equal(1);
        expect(retData.applets[0].instanceId).to.equal(input.instanceId);
        expect(retData.applets[0].keyField).to.equal(input.keyField);
        expect(retData.applets[0].orderSequence).not.to.be.undefined();
        expect(retData.applets[0].orderSequence.length).to.equal(2);
        expect(retData.applets[0].orderSequence[1]).to.equal(input.fieldValue);
    });

    it('correctly validates input when empty object is given', function() {
        var input = {};

        var retData = udas._verifyInput(input);

        expect(retData.valid).to.be.falsy();
        expect(retData.errMsg).not.to.be.undefined();
        expect(retData.errMsg).to.match('instanceId');
        expect(retData.errMsg).to.match('keyField');
        expect(retData.errMsg).to.match('fieldValue');
    });

    it('correctly validates input when partial data is given', function() {
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary'
                    };

        var retData = udas._verifyInput(input);

        expect(retData.valid).to.be.falsy();
        expect(retData.errMsg).to.equal('fieldValue is required.\n');
    });

    it('correctly validates input when valid object is given', function() {
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        fieldValue:'CHOCOLATE'
                    };

        var retData = udas._verifyInput(input);

        expect(retData.valid).to.be.truthy();
        expect(retData.errMsg).to.equal('');
    });

});
